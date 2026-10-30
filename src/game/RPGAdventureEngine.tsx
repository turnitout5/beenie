import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ExpeditionMapModal } from '../components/ExpeditionMapModal';
import { getActiveObjective, MAP_LANDMARKS } from '../data/landmarksData';
import { useExpedition } from '../state/ExpeditionContext';
import { Direction, Position, RoomId, InteractableObject, LightSource } from './types';
import { ROOMS } from './maps';
import { SpriteRenderer } from './spriteRenderer';
import { EnvironmentRenderer } from './environmentRenderer';
import { soundEngine } from '../audio/soundEngine';
import { JournalModal } from '../components/JournalModal';
import { ExpeditionSettingsModal } from '../components/ExpeditionSettingsModal';
import { LocationId } from '../types/expedition';
import { 
  ROOM_OBJECT_DIALOGUES,
  PAGLU_CHASE_LINES,
  PAGLU_STOP_LINES,
  PAGLU_FAINT_LINES,
  POND_SHORE_DIALOGUES,
} from '../data/dialogueData';

interface RPGAdventureEngineProps {
  onTriggerInteraction: (interactable: InteractableObject) => void;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

const getRoomZoom = (vw: number, vh: number, targetRoom: { id: RoomId; width: number; height: number }, userZoom = 1.0): number => {
  const scaleX = vw / targetRoom.width;
  const scaleY = vh / targetRoom.height;
  const baseZoom = Math.max(scaleX, scaleY, targetRoom.id === 'overworld' ? 1.25 : 1.5);
  return baseZoom * userZoom;
};

export const RPGAdventureEngine: React.FC<RPGAdventureEngineProps> = ({
  onTriggerInteraction,
  isModalOpen = false,
  onCloseModal,
}) => {
  const { state, navigateTo, savePlayerPosition } = useExpedition();
  const { 
    starsRecovered, 
    secretGardenUnlocked, 
    dreamEstatesUnlocked,
    currentLocation, 
    bureauStamped, 
    courtVerdictReached, 
    namedConstellation, 
    inventory,
  } = state;

  const isDreamEstatesUnlocked = Boolean(
    dreamEstatesUnlocked ||
    state.candlesBlown ||
    state.recoveredStarIds.includes(6) ||
    starsRecovered >= 6
  );

  const getPromptLabel = useCallback((item: InteractableObject) => {
    if (item.id === 'door_garden' && !secretGardenUnlocked) {
      return 'Secret Rose Gate [Locked]';
    }
    if (item.id === 'path_to_estates' && !isDreamEstatesUnlocked) {
      return 'Grand Royal Arch to Dream Island [Locked]';
    }
    return item.promptLabel;
  }, [secretGardenUnlocked, isDreamEstatesUnlocked]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current Room & State Restoration
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>(() => {
    if (state.lastRoomId && (state.lastRoomId as RoomId) in ROOMS) {
      return state.lastRoomId as RoomId;
    }
    if (currentLocation && currentLocation !== 'boot' && currentLocation !== 'hub') {
      return (currentLocation as RoomId) in ROOMS ? (currentLocation as RoomId) : 'overworld';
    }
    return 'overworld';
  });
  const room = ROOMS[currentRoomId] || ROOMS['overworld'];

  // Camera State (Smooth Glide Tracking)
  const camPosRef = useRef<Position>({ x: 0, y: 0 });

  // Player & Companion State
  const initialSpawn = (state.playerCoordinates && state.lastRoomId === currentRoomId)
    ? state.playerCoordinates
    : room.defaultSpawn;
  const playerPosRef = useRef<Position>({ ...initialSpawn });
  const playerDirRef = useRef<Direction>(state.playerDirection || 'down');
  const isWalkingRef = useRef<boolean>(false);
  const walkFrameRef = useRef<number>(0);
  const lastSavedPosTimeRef = useRef<number>(0);

  // Companion (Paglu / Ahmad) Follower State
  const pagluPosRef = useRef<Position>({ x: initialSpawn.x, y: initialSpawn.y + 28 });
  const pagluDirRef = useRef<Direction>('up');
  const trailRef = useRef<Position[]>([]);
  const pagluEmoteRef = useRef<'heart' | 'exclamation' | 'question' | 'music' | 'blush' | 'sparkle' | 'sleep' | null>('heart');
  const pagluEmoteTimerRef = useRef<number>(120);
  const doorCooldownRef = useRef<number>(0);

  // Dynamic Bark & Fainting System for Paaaari (Beghum G)
  const pagluBarkRef = useRef<{ text: string; timer: number } | null>(null);
  const lastNearbyIdRef = useRef<string | null>(null);
  const wasMovingRef = useRef<boolean>(false);
  const moveDurationRef = useRef<number>(0);
  const nearPondTriggeredRef = useRef<boolean>(false);
  const atPondTriggeredRef = useRef<boolean>(false);
  // Pagluu Comic Faint State: 'none' -> 'fainted' -> 'screaming' -> 'sprinting_back'
  const pagluFaintStateRef = useRef<{
    stage: 'none' | 'fainted' | 'screaming' | 'sprinting_back';
    timer: number;
  }>({ stage: 'none', timer: 0 });

  // Controls State
  const keysPressed = useRef<Record<string, boolean>>({});
  const [isVirtualRunning, setIsVirtualRunning] = useState<boolean>(false);
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const activeInteractableRef = useRef<InteractableObject | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVirtualDpadVisible, setIsVirtualDpadVisible] = useState<boolean>(true);
  const [userZoom, setUserZoom] = useState<number>(1.0);
  const [customWaypoint, setCustomWaypoint] = useState<{ x: number; y: number; label: string } | null>(null);
  const [hudCoord, setHudCoord] = useState<{ x: number; y: number }>({ x: 800, y: 720 });

  // Active Objective & Waypoint Compass Calculation
  const currentObjective = useMemo(() => getActiveObjective(state), [state]);

  const targetPoint = useMemo(() => {
    if (customWaypoint) return customWaypoint;
    const landmark = MAP_LANDMARKS.find(l => l.id === currentObjective.targetLandmarkId);
    return landmark ? { x: landmark.x, y: landmark.y, label: landmark.name } : { x: 270, y: 465, label: 'Bureau' };
  }, [customWaypoint, currentObjective]);

  const { compassArrow, distMeters } = useMemo(() => {
    if (currentRoomId !== 'overworld') {
      return { compassArrow: '✦', distMeters: 0 };
    }
    const dx = targetPoint.x - hudCoord.x;
    const dy = targetPoint.y - hudCoord.y;
    const dist = Math.round(Math.hypot(dx, dy) / 10);

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    let arrow = '▲';
    if (angle >= -22.5 && angle < 22.5) arrow = '▶';
    else if (angle >= 22.5 && angle < 67.5) arrow = '◢';
    else if (angle >= 67.5 && angle < 112.5) arrow = '▼';
    else if (angle >= 112.5 && angle < 157.5) arrow = '◣';
    else if (angle >= 157.5 || angle < -157.5) arrow = '◀';
    else if (angle >= -157.5 && angle < -112.5) arrow = '◤';
    else if (angle >= -112.5 && angle < -67.5) arrow = '▲';
    else if (angle >= -67.5 && angle < -22.5) arrow = '◥';

    return { compassArrow: arrow, distMeters: dist };
  }, [currentRoomId, targetPoint, hudCoord]);

  // Mouse Pan, Free-Look & Dynamic Camera Zoom Controls
  const panOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const userZoomRef = useRef<number>(1.0);
  const [isPannedAway, setIsPannedAway] = useState<boolean>(false);

  // Target Move (Tap-to-move on mobile/desktop)
  const targetPosRef = useRef<Position | null>(null);



  // Full-Screen Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start room audio theme and background exploration track
  useEffect(() => {
    soundEngine.pauseSong();
    if (currentRoomId === 'overworld') {
      soundEngine.stopRoomTheme();
      soundEngine.startBolNaHalkeHalkeTuneLoop();
    } else {
      soundEngine.stopBolNaHalkeHalkeTuneLoop();
      soundEngine.setRoomTheme(currentRoomId);
    }
    return () => {
      soundEngine.stopRoomTheme();
      soundEngine.stopBolNaHalkeHalkeTuneLoop();
    };
  }, [currentRoomId]);

  // Room Transition Helper with Camera Snap
  const changeRoom = useCallback((newRoomId: RoomId, spawnPos?: Position, syncNav = true) => {
    soundEngine.playDoorOpen();
    setCurrentRoomId(newRoomId);
    const targetRoom = ROOMS[newRoomId] || ROOMS['overworld'];
    const newSpawn = spawnPos || targetRoom.defaultSpawn;

    doorCooldownRef.current = 45; // 0.75s grace period so player never gets trapped or auto-bounced
    playerPosRef.current = { ...newSpawn };

    // Infer facing direction based on entry point
    let entryDir: Direction = 'down';
    if (newSpawn.y <= 120) {
      entryDir = 'down';
    } else if (newSpawn.y >= targetRoom.height - 120) {
      entryDir = 'up';
    } else if (newSpawn.x <= 120) {
      entryDir = 'right';
    } else if (newSpawn.x >= targetRoom.width - 120) {
      entryDir = 'left';
    } else {
      entryDir = playerDirRef.current;
    }
    playerDirRef.current = entryDir;

    // Position Pagluu safely behind Beenish based on direction
    let pagluSpawnX = newSpawn.x;
    let pagluSpawnY = newSpawn.y;
    if (entryDir === 'down') pagluSpawnY -= 22;
    else if (entryDir === 'up') pagluSpawnY += 22;
    else if (entryDir === 'right') pagluSpawnX -= 22;
    else if (entryDir === 'left') pagluSpawnX += 22;
    pagluPosRef.current = { x: pagluSpawnX, y: pagluSpawnY };
    pagluDirRef.current = entryDir;

    trailRef.current = [];
    targetPosRef.current = null;
    activeInteractableRef.current = null;
    setActiveInteractable(null);
    pagluBarkRef.current = null;
    lastNearbyIdRef.current = null;

    // Snap camera smoothly to new room
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const zoom = getRoomZoom(vw, vh, targetRoom, userZoomRef.current);

    let initCamX = newSpawn.x + 12 - vw / (2 * zoom);
    let initCamY = newSpawn.y + 16 - vh / (2 * zoom);
    if (targetRoom.width * zoom <= vw) initCamX = -(vw / zoom - targetRoom.width) / 2;
    if (targetRoom.height * zoom <= vh) initCamY = -(vh / zoom - targetRoom.height) / 2;
    camPosRef.current = { x: initCamX, y: initCamY };

    // Trigger excited companion reaction
    pagluEmoteRef.current = 'sparkle';
    pagluEmoteTimerRef.current = 100;

    savePlayerPosition(newRoomId, newSpawn, entryDir);
    soundEngine.pauseSong();
    if (newRoomId === 'overworld') {
      soundEngine.stopRoomTheme();
      soundEngine.startBolNaHalkeHalkeTuneLoop();
    } else {
      soundEngine.stopBolNaHalkeHalkeTuneLoop();
      soundEngine.setRoomTheme(newRoomId);
    }

    if (syncNav) {
      navigateTo(newRoomId === 'overworld' ? 'hub' : (newRoomId as LocationId));
    }
  }, [navigateTo, savePlayerPosition]);

  // Sync room when navigation changes externally (e.g. from Journal Quick-Travel)
  useEffect(() => {
    if (!currentLocation || currentLocation === 'boot') return;
    const targetRoomId: RoomId = currentLocation === 'hub' ? 'overworld' : (currentLocation as RoomId);
    if (ROOMS[targetRoomId] && targetRoomId !== currentRoomId) {
      changeRoom(targetRoomId, undefined, false);
    }
  }, [currentLocation, currentRoomId, changeRoom]);

  // Action Trigger
  const handleAction = useCallback(() => {
    const interactable = activeInteractableRef.current;
    if (!interactable) return;

    if (interactable.type === 'door' && interactable.targetRoom) {
      if (interactable.id === 'door_garden' && !secretGardenUnlocked) {
        soundEngine.playClick();
        onTriggerInteraction(interactable);
        return;
      }
      if (interactable.id === 'path_to_estates' && !isDreamEstatesUnlocked) {
        soundEngine.playClick();
        onTriggerInteraction(interactable);
        return;
      }
      changeRoom(interactable.targetRoom, interactable.targetPos);
    } else {
      soundEngine.playClick();
      pagluEmoteRef.current = 'heart';
      pagluEmoteTimerRef.current = 120;
      onTriggerInteraction(interactable);
    }
  }, [changeRoom, onTriggerInteraction, secretGardenUnlocked, isDreamEstatesUnlocked]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isMapOpen) {
          setIsMapOpen(false);
          return;
        }
        if (isJournalOpen) {
          setIsJournalOpen(false);
          return;
        }
        if (isModalOpen && onCloseModal) {
          onCloseModal();
          return;
        }
      }

      // 'M' key toggles World Map & Guide
      if (e.key.toLowerCase() === 'm') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          soundEngine.playClick();
          setIsMapOpen(prev => !prev);
          return;
        }
      }

      // 'P' or 'O' key toggles Settings
      if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'o') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          soundEngine.playClick();
          setIsSettingsOpen(prev => !prev);
          return;
        }
      }

      // Suspend movement & action hotkeys when a modal/Journal/Map/Settings is open or an input field is focused
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (isModalOpen || isJournalOpen || isMapOpen || isSettingsOpen || activeTag === 'input' || activeTag === 'textarea') {
        keysPressed.current = {};
        return;
      }

      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 's', 'a', 'd', ' '].includes(key)) {
        e.preventDefault();
      }

      if (key === 'e' || key === ' ' || key === 'enter') {
        handleAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAction, isModalOpen, isJournalOpen, isMapOpen, isSettingsOpen, onCloseModal]);

  // 60fps Game & Camera Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const checkCollision = (x: number, y: number, activeRoom: typeof room): boolean => {
      const pWidth = 16;
      const pHeight = 12;
      const px = x + 4;
      const py = y + 16;

      for (const box of activeRoom.collisionBoxes) {
        if (
          px < box.x + box.width &&
          px + pWidth > box.x &&
          py < box.y + box.height &&
          py + pHeight > box.y
        ) {
          return true;
        }
      }
      return false;
    };

    const loop = () => {
      frameCount++;
      if (frameCount % 10 === 0) {
        setHudCoord({ x: Math.floor(playerPosRef.current.x), y: Math.floor(playerPosRef.current.y) });
      }
      const currentRoom = ROOMS[currentRoomId] || ROOMS['overworld'];

      const vw = canvas.width;
      const vh = canvas.height;

      // Dynamic Full-Screen Wide Zoom with user mouse wheel adjustment
      const zoom = getRoomZoom(vw, vh, currentRoom, userZoomRef.current);

      // Handle Movement Input & Sprint Speed
      let dx = 0;
      let dy = 0;
      const isRunning = keysPressed.current['shift'] || isVirtualRunning;
      const speed = isRunning ? 3.8 : 2.4;

      if (!isModalOpen && !isJournalOpen && !isMapOpen) {
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
          dy -= speed;
          playerDirRef.current = 'up';
        }
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
          dy += speed;
          playerDirRef.current = 'down';
        }
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
          dx -= speed;
          playerDirRef.current = 'left';
        }
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
          dx += speed;
          playerDirRef.current = 'right';
        }
      } else {
        targetPosRef.current = null;
      }

      // Tap-to-move handling
      if (targetPosRef.current && dx === 0 && dy === 0) {
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;
        const dist = Math.hypot(tx - playerPosRef.current.x, ty - playerPosRef.current.y);

        if (dist > 4) {
          const angle = Math.atan2(ty - playerPosRef.current.y, tx - playerPosRef.current.x);
          dx = Math.cos(angle) * speed;
          dy = Math.sin(angle) * speed;

          if (Math.abs(dx) > Math.abs(dy)) {
            playerDirRef.current = dx > 0 ? 'right' : 'left';
          } else {
            playerDirRef.current = dy > 0 ? 'down' : 'up';
          }
        } else {
          targetPosRef.current = null;
        }
      }

      const isMoving = dx !== 0 || dy !== 0;
      isWalkingRef.current = isMoving;

      if (isMoving) {
        // Player is actively moving, smoothly ease camera back to Beenish
        panOffsetRef.current.x *= 0.90;
        panOffsetRef.current.y *= 0.90;
        if (Math.hypot(panOffsetRef.current.x, panOffsetRef.current.y) < 1.5) {
          panOffsetRef.current = { x: 0, y: 0 };
          setIsPannedAway(false);
        }
      }

      // Footstep sound & movement physics
      if (isMoving) {
        const nowTime = performance.now();
        if (nowTime - lastSavedPosTimeRef.current > 300) {
          lastSavedPosTimeRef.current = nowTime;
          savePlayerPosition(currentRoomId, playerPosRef.current, playerDirRef.current);
        }
        const stepRate = isRunning ? 6 : 9;
        if (frameCount % stepRate === 0) {
          walkFrameRef.current++;
          const surface = currentRoom.theme === 'valley' ? 'grass' : currentRoom.id === 'museum' ? 'stone' : 'wood';
          soundEngine.playFootstep(surface);
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        // X collision check
        if (!checkCollision(nextX, playerPosRef.current.y, currentRoom)) {
          playerPosRef.current.x = Math.max(10, Math.min(currentRoom.width - 34, nextX));
        }
        // Y collision check
        if (!checkCollision(playerPosRef.current.x, nextY, currentRoom)) {
          playerPosRef.current.y = Math.max(10, Math.min(currentRoom.height - 34, nextY));
        }

        // --- DOOR AUTO-ENTER TRIGGER (ONE-WAY & ANTI-STUCK PROTECTED) ---
        if (doorCooldownRef.current > 0) {
          doorCooldownRef.current--;
        } else {
          const px = playerPosRef.current.x + 8;
          const py = playerPosRef.current.y + 16;
          const isActivelyMoving = (dx !== 0 || dy !== 0) || Boolean(targetPosRef.current);

          if (isActivelyMoving) {
            for (const item of currentRoom.interactables) {
              if (item.type === 'door' && item.targetRoom) {
                if (
                  px >= item.x - 6 &&
                  px <= item.x + item.width + 6 &&
                  py >= item.y - 6 &&
                  py <= item.y + item.height + 10
                ) {
                  // Directional movement verification: player must be moving towards the doorway
                  const doorCenterY = item.y + item.height / 2;
                  const doorCenterX = item.x + item.width / 2;
                  const movingTowardsDoor = (
                    (doorCenterY < py - 4 && (dy < 0 || playerDirRef.current === 'up')) ||
                    (doorCenterY > py + 4 && (dy > 0 || playerDirRef.current === 'down')) ||
                    (doorCenterX < px - 4 && (dx < 0 || playerDirRef.current === 'left')) ||
                    (doorCenterX > px + 4 && (dx > 0 || playerDirRef.current === 'right')) ||
                    Math.hypot(px - doorCenterX, py - doorCenterY) < 14
                  );

                  if (movingTowardsDoor) {
                    if (item.id === 'door_garden' && !secretGardenUnlocked) {
                      playerPosRef.current.y -= 14;
                      soundEngine.playClick();
                      onTriggerInteraction(item);
                      break;
                    }
                    if (item.id === 'path_to_estates' && !isDreamEstatesUnlocked) {
                      playerPosRef.current.y -= 14;
                      soundEngine.playClick();
                      onTriggerInteraction(item);
                      break;
                    }
                    changeRoom(item.targetRoom, item.targetPos);
                    return;
                  }
                }
              }
            }
          }
        }

        // --- PAGLUU FAINTING & FOLLOWING STATE MACHINE ---
        if (pagluFaintStateRef.current.stage === 'fainted') {
          pagluFaintStateRef.current.timer--;
          if (pagluFaintStateRef.current.timer <= 0) {
            // Stage 2: Springs up vibrating with shock scream!
            soundEngine.playEmote();
            pagluFaintStateRef.current = { stage: 'screaming', timer: 75 };
            pagluBarkRef.current = { text: PAGLU_FAINT_LINES.scream, timer: 75 };
            pagluEmoteRef.current = 'exclamation';
            pagluEmoteTimerRef.current = 75;
          }
        } else if (pagluFaintStateRef.current.stage === 'screaming') {
          pagluFaintStateRef.current.timer--;
          if (pagluFaintStateRef.current.timer <= 0) {
            // Stage 3: Jumps to his feet and sprints back towards her!
            pagluFaintStateRef.current = { stage: 'sprinting_back', timer: 180 };
            pagluBarkRef.current = { text: PAGLU_FAINT_LINES.catchUp, timer: 100 };
            pagluEmoteRef.current = 'heart';
            pagluEmoteTimerRef.current = 100;
          }
        } else if (pagluFaintStateRef.current.stage === 'sprinting_back') {
          // Pagluu sprints directly towards Paaaari at high speed!
          const dx = playerPosRef.current.x - pagluPosRef.current.x;
          const dy = playerPosRef.current.y - pagluPosRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 30) {
            const sprintSpeed = 3.6;
            pagluPosRef.current.x += (dx / dist) * sprintSpeed;
            pagluPosRef.current.y += (dy / dist) * sprintSpeed;
            pagluDirRef.current = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
          } else {
            // Reached Paaaari!
            pagluFaintStateRef.current = { stage: 'none', timer: 0 };
            trailRef.current = [];
          }

          pagluFaintStateRef.current.timer--;
          if (pagluFaintStateRef.current.timer <= 0) {
            pagluFaintStateRef.current = { stage: 'none', timer: 0 };
          }
        } else {
          // Normal following along trail when not fainted
          trailRef.current.push({ ...playerPosRef.current });
          const trailDelay = isRunning ? 16 : 22;
          if (trailRef.current.length > trailDelay) {
            const followPos = trailRef.current.shift();
            if (followPos) {
              pagluPosRef.current = { ...followPos };
              pagluDirRef.current = playerDirRef.current;
            }
          }
        }

        // Companion Emote when sprinting normally
        if (isRunning && frameCount % 140 === 0 && pagluFaintStateRef.current.stage === 'none') {
          pagluEmoteRef.current = 'blush';
          pagluEmoteTimerRef.current = 60;
        }

        // --- POND PROXIMITY DIALOGUES FOR PAAARI (TIGHTLY CONFINED TO SHORELINE) ---
        if (currentRoom.id === 'overworld') {
          const pondCenterX = 310;
          const pondCenterY = 835;
          const distToPond = Math.hypot(playerPosRef.current.x - pondCenterX, playerPosRef.current.y - pondCenterY);

          // Right at the water pebbles only (tight radius so it doesn't leak into other paths)
          if (distToPond < 55) {
            if (!atPondTriggeredRef.current) {
              pagluBarkRef.current = { text: POND_SHORE_DIALOGUES.atWater, timer: 180 };
              pagluEmoteRef.current = 'heart';
              pagluEmoteTimerRef.current = 100;
              atPondTriggeredRef.current = true;
              nearPondTriggeredRef.current = true;
            }
          } 
          // Stepping right near the shoreline
          else if (distToPond < 75) {
            if (!nearPondTriggeredRef.current) {
              pagluBarkRef.current = { text: POND_SHORE_DIALOGUES.nearWater, timer: 170 };
              pagluEmoteRef.current = 'exclamation';
              pagluEmoteTimerRef.current = 90;
              nearPondTriggeredRef.current = true;
            }
          } 
          // Reset cleanly when stepping away
          else if (distToPond > 95) {
            nearPondTriggeredRef.current = false;
            atPondTriggeredRef.current = false;
          }
        }

        // Chase & Stop Dialogues when Paglu runs after Paaaari
        if (isMoving) {
          moveDurationRef.current++;
          // When she runs/moves continuously for a bit, Paglu calls out after her (only if not showing a landmark dialogue)
          if (!lastNearbyIdRef.current && moveDurationRef.current > 50 && moveDurationRef.current % 160 === 0 && pagluFaintStateRef.current.stage === 'none') {
            const line = PAGLU_CHASE_LINES[Math.floor(Math.random() * PAGLU_CHASE_LINES.length)];
            pagluBarkRef.current = { text: line, timer: 140 };
          }
        } else {
          // When she stops moving after having run/walked:
          if (!lastNearbyIdRef.current && wasMovingRef.current && moveDurationRef.current > 20) {
            // 1 in 4 times (25%), Pagluu faints from her overwhelming beauty!
            const shouldFaint = Math.random() < 0.25;

            if (shouldFaint && pagluFaintStateRef.current.stage === 'none') {
              soundEngine.playEmote();
              pagluFaintStateRef.current = { stage: 'fainted', timer: 150 };
              pagluBarkRef.current = { text: PAGLU_FAINT_LINES.faint, timer: 150 };
              pagluEmoteRef.current = 'heart';
              pagluEmoteTimerRef.current = 150;
              trailRef.current = [];
            } else if (pagluFaintStateRef.current.stage === 'none') {
              const line = PAGLU_STOP_LINES[Math.floor(Math.random() * PAGLU_STOP_LINES.length)];
              pagluBarkRef.current = { text: line, timer: 150 };
              pagluEmoteRef.current = 'heart';
              pagluEmoteTimerRef.current = 90;
            }
          }
          moveDurationRef.current = 0;
        }

        wasMovingRef.current = isMoving;
      } else {
        // Idle companion emotes
        if (frameCount % 320 === 0 && !pagluEmoteRef.current && !pagluBarkRef.current) {
          const emotes: Array<'heart' | 'music' | 'sleep' | 'sparkle'> = ['heart', 'music', 'sleep', 'sparkle'];
          pagluEmoteRef.current = emotes[Math.floor(Math.random() * emotes.length)];
          pagluEmoteTimerRef.current = 100;
        }
        wasMovingRef.current = false;
        moveDurationRef.current = 0;
      }

      // Decrement bark timer
      if (pagluBarkRef.current) {
        pagluBarkRef.current.timer--;
        if (pagluBarkRef.current.timer <= 0) {
          pagluBarkRef.current = null;
        }
      }

      // Decrement emote timer
      if (pagluEmoteTimerRef.current > 0) {
        pagluEmoteTimerRef.current--;
        if (pagluEmoteTimerRef.current === 0) {
          pagluEmoteRef.current = null;
        }
      }

      // Proximity Detection for Interactables (Doors are auto-enter, so [ E ] is only for inspectable objects)
      let closest: InteractableObject | null = null;
      let minDistance = 42;

      const px = playerPosRef.current.x + 12;
      const py = playerPosRef.current.y + 16;

      for (const item of currentRoom.interactables) {
        if (item.type === 'door') continue; // Doors auto-trigger!

        // Compute distance from player center to the closest edge of the interactable box
        const nearestX = Math.max(item.x, Math.min(px, item.x + item.width));
        const nearestY = Math.max(item.y, Math.min(py, item.y + item.height));
        const dist = Math.hypot(px - nearestX, py - nearestY);

        if (dist < minDistance) {
          closest = item;
          minDistance = dist;
        }
      }

      // Automatic companion proximity prompt removed so it never pops up constantly

      if (activeInteractableRef.current?.id !== closest?.id) {
        setActiveInteractable(closest);
      }
      activeInteractableRef.current = closest;

      // --- ROOM-SCOPED DYNAMIC DIALOGUE REACTION FOR PAGLUU ---
      // Scoped strictly to current room so no wrong dialogues ever trigger at the wrong place!
      const currentRoomDialogues = ROOM_OBJECT_DIALOGUES[currentRoom.id] || {};

      let nearItem: InteractableObject | null = null;
      let minObjDist = 30; // Reduced from 65 to 30 for strictly adjacent activation only!

      for (const item of currentRoom.interactables) {
        const nearestX = Math.max(item.x, Math.min(px, item.x + item.width));
        const nearestY = Math.max(item.y, Math.min(py, item.y + item.height));
        const dist = Math.hypot(px - nearestX, py - nearestY);
        if (dist < minObjDist) {
          nearItem = item;
          minObjDist = dist;
        }
      }

      // Exact ID lookup in current room's dialogue map
      let detectedKey: string | null = null;
      if (nearItem && nearItem.id in currentRoomDialogues) {
        detectedKey = nearItem.id;
      }

      // Confined shoreline check for overworld pond
      if (currentRoom.id === 'overworld' && !detectedKey) {
        const distPond = Math.hypot(px - 310, py - 835);
        if (distPond < 48 && minObjDist > 25 && 'pond' in currentRoomDialogues) {
          detectedKey = 'pond';
        }
      }

      if (detectedKey) {
        if (lastNearbyIdRef.current !== detectedKey) {
          lastNearbyIdRef.current = detectedKey;
          const barkText = currentRoomDialogues[detectedKey];
          if (barkText) {
            pagluBarkRef.current = { text: barkText, timer: 240 };
            pagluEmoteRef.current = 'heart';
            pagluEmoteTimerRef.current = 110;

            // Turn Paglu to face toward the landmark
            if (nearItem) {
              const dxToObj = (nearItem.x + nearItem.width / 2) - pagluPosRef.current.x;
              const dyToObj = (nearItem.y + nearItem.height / 2) - pagluPosRef.current.y;
              if (Math.abs(dxToObj) > Math.abs(dyToObj)) {
                pagluDirRef.current = dxToObj > 0 ? 'right' : 'left';
              } else {
                pagluDirRef.current = dyToObj > 0 ? 'down' : 'up';
              }
            }
          }
        }
      } else {
        // Reset when she steps away (beyond 45px) so he can re-trigger when approaching again
        if (minObjDist > 45) {
          lastNearbyIdRef.current = null;
        }
      }

      // --- CAMERA TARGET CALCULATION & SMOOTH GLIDE (WITH MOUSE PAN OFFSET) ---
      let targetCamX = playerPosRef.current.x + 12 - vw / (2 * zoom) + panOffsetRef.current.x;
      let targetCamY = playerPosRef.current.y + 16 - vh / (2 * zoom) + panOffsetRef.current.y;

      // If room fits on screen, center it! Otherwise clamp with leeway for inspecting surroundings
      const roomW = currentRoom.width;
      const roomH = currentRoom.height;
      if (roomW * zoom <= vw) {
        targetCamX = -(vw / zoom - roomW) / 2 + panOffsetRef.current.x;
      } else {
        targetCamX = Math.max(-120, Math.min(roomW - vw / zoom + 120, targetCamX));
      }

      if (roomH * zoom <= vh) {
        targetCamY = -(vh / zoom - roomH) / 2 + panOffsetRef.current.y;
      } else {
        targetCamY = Math.max(-120, Math.min(roomH - vh / zoom + 120, targetCamY));
      }

      camPosRef.current.x += (targetCamX - camPosRef.current.x) * 0.14;
      camPosRef.current.y += (targetCamY - camPosRef.current.y) * 0.14;

      // --- RENDERING TO FULL SCREEN CANVAS ---
      ctx.imageSmoothingEnabled = false;

      // Clear full background to deep cosmic void navy
      ctx.fillStyle = '#101329';
      ctx.fillRect(0, 0, vw, vh);

      // Transform world with camera glide & zoom
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(-Math.floor(camPosRef.current.x), -Math.floor(camPosRef.current.y));

      let lights: LightSource[] = [];

      if (currentRoom.id === 'overworld') {
        lights = EnvironmentRenderer.renderOverworld(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount,
          starsRecovered,
          secretGardenUnlocked,
          isDreamEstatesUnlocked
        );
      } else if (currentRoom.id === 'bureau') {
        lights = EnvironmentRenderer.renderBureauInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount,
          bureauStamped
        );
      } else if (currentRoom.id === 'museum') {
        lights = EnvironmentRenderer.renderMuseumInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount,
          inventory.includes('brass_key')
        );
      } else if (currentRoom.id === 'court') {
        lights = EnvironmentRenderer.renderCourtroomInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount,
          courtVerdictReached
        );
      } else if (currentRoom.id === 'archive') {
        lights = EnvironmentRenderer.renderArchiveInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'observatory') {
        lights = EnvironmentRenderer.renderObservatoryInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount,
          namedConstellation
        );
      } else if (currentRoom.id === 'garden') {
        lights = EnvironmentRenderer.renderGardenInterior(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'dream_estates') {
        lights = EnvironmentRenderer.renderDreamEstates(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'castle_realm') {
        lights = EnvironmentRenderer.renderCastleRealm(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'mafia_realm') {
        lights = EnvironmentRenderer.renderMafiaRealm(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'islamabad_realm') {
        lights = EnvironmentRenderer.renderIslamabadRealm(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'bakery_realm') {
        lights = EnvironmentRenderer.renderBakeryRealm(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      } else if (currentRoom.id === 'haveli_realm') {
        lights = EnvironmentRenderer.renderHaveliRealm(
          ctx,
          currentRoom.width,
          currentRoom.height,
          frameCount
        );
      }

      // Render Golden Inquiry Sparkles on Interactables
      for (const item of currentRoom.interactables) {
        if (item.type !== 'door') {
          SpriteRenderer.drawSparkle(ctx, item.x + item.width / 2, item.y + item.height / 2, frameCount);
        }
      }

      // Render Footstep Dust Puffs when walking
      if (isMoving && frameCount % 6 === 0) {
        SpriteRenderer.drawDustPuff(ctx, playerPosRef.current.x, playerPosRef.current.y, frameCount);
      }

      // --- Y-SORTED CHARACTER PASS (Pagluu & Beenish sorted by vertical foot Y) ---
      const drawPagluChar = () => {
        SpriteRenderer.drawTed(
          ctx,
          pagluPosRef.current,
          pagluDirRef.current,
          isMoving || pagluFaintStateRef.current.stage === 'sprinting_back',
          walkFrameRef.current,
          pagluFaintStateRef.current.stage,
          frameCount
        );
      };
      const drawBeenishChar = () => {
        SpriteRenderer.drawBeenish(
          ctx,
          playerPosRef.current,
          playerDirRef.current,
          isMoving,
          walkFrameRef.current
        );
      };

      if (pagluPosRef.current.y <= playerPosRef.current.y) {
        drawPagluChar();
        drawBeenishChar();
      } else {
        drawBeenishChar();
        drawPagluChar();
      }

      // --- FOREGROUND OCCLUSION PASS (Overhead Archways, Pergolas & Tree Canopies) ---
      EnvironmentRenderer.renderForeground(
        ctx,
        currentRoom.id,
        currentRoom.width,
        currentRoom.height,
        frameCount,
        playerPosRef.current,
        pagluPosRef.current
      );

      // --- DYNAMIC NIGHT LIGHTING PASS ---
      EnvironmentRenderer.renderLightingPass(
        ctx,
        currentRoom.width,
        currentRoom.height,
        lights,
        playerPosRef.current,
        currentRoom.theme
      );

      // --- UN-DARKENED DIEGETIC UI PASS (Speech Bubbles, Emotes & [ Enter ] Prompts) ---
      // ABSOLUTE ZERO OVERLAP - MAGNETIC REPULSION BUBBLE SYSTEM:
      // Bubbles act like like-pole magnets repelling to opposite sides, never meeting while tied to their person.
      if (!isModalOpen && !isJournalOpen) {
        const pagluX = Math.floor(pagluPosRef.current.x + 12);
        const pagluY = Math.floor(pagluPosRef.current.y);
        const playerX = Math.floor(playerPosRef.current.x + 12);
        const playerY = Math.floor(playerPosRef.current.y);

        const bark = pagluBarkRef.current;
        const emote = !bark ? pagluEmoteRef.current : null;
        const interactable = activeInteractableRef.current;

        if (bark && interactable) {
          // Both Paglu Speech AND Action Prompt active: repel to opposite sides like magnets!
          const speechMeas = SpriteRenderer.measureSpeechBubble(ctx, bark.text);
          const promptMeas = SpriteRenderer.measurePromptBubble(ctx, getPromptLabel(interactable));

          const { bubbleA: pagluLayout, bubbleB: playerLayout } = SpriteRenderer.resolveMagneticBubbles(
            { width: speechMeas.width, height: speechMeas.height, anchorX: pagluX, anchorY: pagluY },
            { width: promptMeas.width, height: promptMeas.height, anchorX: playerX, anchorY: playerY },
            { width: currentRoom.width, height: currentRoom.height }
          );

          SpriteRenderer.drawSpeechBubble(ctx, pagluX, pagluY, bark.text, {
            customX: pagluLayout.x,
            customY: pagluLayout.y,
            targetX: pagluLayout.targetX,
            targetY: pagluLayout.targetY,
          });

          SpriteRenderer.drawPromptBubble(ctx, playerX, playerY, getPromptLabel(interactable), {
            customX: playerLayout.x,
            customY: playerLayout.y,
            targetX: playerLayout.targetX,
            targetY: playerLayout.targetY,
          });
        } else if (emote && interactable) {
          // Both Paglu Emote AND Action Prompt active: repel to opposite sides like magnets!
          const promptMeas = SpriteRenderer.measurePromptBubble(ctx, getPromptLabel(interactable));

          const { bubbleA: emoteLayout, bubbleB: playerLayout } = SpriteRenderer.resolveMagneticBubbles(
            { width: 24, height: 20, anchorX: pagluX, anchorY: pagluY },
            { width: promptMeas.width, height: promptMeas.height, anchorX: playerX, anchorY: playerY },
            { width: currentRoom.width, height: currentRoom.height }
          );

          SpriteRenderer.drawEmoteBubble(ctx, pagluX, pagluY, emote, frameCount, {
            customX: emoteLayout.x,
            customY: emoteLayout.y,
            targetX: emoteLayout.targetX,
            targetY: emoteLayout.targetY,
          });

          SpriteRenderer.drawPromptBubble(ctx, playerX, playerY, getPromptLabel(interactable), {
            customX: playerLayout.x,
            customY: playerLayout.y,
            targetX: playerLayout.targetX,
            targetY: playerLayout.targetY,
          });
        } else if (bark) {
          // Only Paglu speaking
          SpriteRenderer.drawSpeechBubble(ctx, pagluX, pagluY, bark.text);
        } else if (emote) {
          // Only Paglu emoting
          SpriteRenderer.drawEmoteBubble(ctx, pagluX, pagluY, emote, frameCount);
        } else if (interactable) {
          // Only Action Prompt
          SpriteRenderer.drawPromptBubble(ctx, playerX, playerY, getPromptLabel(interactable));
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    currentRoomId, 
    starsRecovered, 
    secretGardenUnlocked, 
    isDreamEstatesUnlocked, 
    bureauStamped, 
    courtVerdictReached, 
    namedConstellation, 
    inventory, 
    isVirtualRunning,
    isModalOpen,
    isJournalOpen,
    isMapOpen,
    changeRoom,
    onTriggerInteraction,
    getPromptLabel,
    savePlayerPosition
  ]);

  // Mouse Drag Panning & Screen-to-World Click/Tap-to-Move Projection
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons === 1 || e.buttons === 2) {
      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
      if (dist > 5) {
        isDraggingRef.current = true;
        const currentRoom = ROOMS[currentRoomId] || ROOMS['overworld'];
        const canvas = canvasRef.current;
        if (canvas) {
          const zoom = getRoomZoom(canvas.width, canvas.height, currentRoom, userZoomRef.current);
          panOffsetRef.current.x -= e.movementX / zoom;
          panOffsetRef.current.y -= e.movementY / zoom;
          setIsPannedAway(true);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    userZoomRef.current = Math.min(1.65, Math.max(0.85, userZoomRef.current - e.deltaY * 0.0008));
  };

  const handleDoubleClick = () => {
    panOffsetRef.current = { x: 0, y: 0 };
    userZoomRef.current = 1.0;
    setIsPannedAway(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const currentRoom = ROOMS[currentRoomId] || ROOMS['overworld'];
    const zoom = getRoomZoom(canvas.width, canvas.height, currentRoom, userZoomRef.current);

    const worldX = screenX / zoom + camPosRef.current.x;
    const worldY = screenY / zoom + camPosRef.current.y;

    targetPosRef.current = { x: worldX - 12, y: worldY - 16 };
  };

  // Virtual Controls
  const handleVirtualDir = (dir: Direction, isDown: boolean) => {
    const keyMap: Record<Direction, string> = {
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    };
    keysPressed.current[keyMap[dir]] = isDown;
  };

  // Top objective banner and compass removed per design cleanup
  // Compass computation removed with objective banner

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* FULL SCREEN EDGE-TO-EDGE CANVAS */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onClick={handleCanvasClick}
        className="pixelated"
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          cursor: isPannedAway ? 'grab' : 'crosshair',
        }}
      />

      {/* FLOATING TOP-LEFT LOCATION HUD */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 14, 
          left: 14, 
          zIndex: 100, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <div 
          style={{
            backgroundColor: 'rgba(27, 32, 66, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '2px solid var(--color-twilight-blue)',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(16, 19, 41, 0.9)',
          }}
        >
          <span style={{ color: 'var(--color-lantern-gold)', fontSize: '0.85rem' }}>✦</span>
          <span className="font-display" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', letterSpacing: '0.05em' }}>
            PAAAARI EXPEDITION
          </span>
          <span style={{ color: 'var(--color-twilight-blue)' }}>|</span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)', fontWeight: 600 }}>
            {room.name.toUpperCase()}
          </span>
        </div>

        {currentRoomId !== 'overworld' && (
          <button
            onClick={() => changeRoom('overworld')}
            className="pixel-btn pixel-btn-peach font-mono"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            title="Return to the Valley of the Stars"
          >
            ← VALLEY
          </button>
        )}
      </div>

      {/* SLEEK FLOATING ACTIVE OBJECTIVE & COMPASS BAR */}
      <div 
        onClick={() => {
          soundEngine.playClick();
          setIsMapOpen(true);
        }}
        style={{ 
          position: 'fixed', 
          top: 14, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 100, 
          cursor: 'pointer',
          pointerEvents: 'auto',
          maxWidth: 'min(90vw, 700px)',
        }}
        title="Click to Open World Map & Guide (or press M)"
      >
        <div
          className="font-mono"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #F59E0B',
            borderRadius: '6px',
            padding: '7px 18px',
            fontSize: '0.8rem',
            color: '#FFFFFF',
            letterSpacing: '0.03em',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), inset 0 0 12px rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#F59E0B', fontWeight: 900, fontSize: '0.9rem' }}>
            {compassArrow} {distMeters > 0 ? `${distMeters}m` : '✦'}
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ color: '#FEF08A', fontWeight: 700 }}>
            {targetPoint.label}
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span 
            style={{ 
              backgroundColor: '#F59E0B', 
              color: '#0F172A', 
              padding: '2px 7px', 
              borderRadius: '3px', 
              fontSize: '0.72rem', 
              fontWeight: 900 
            }}
          >
            🗺️ MAP [M]
          </span>
        </div>
      </div>

      {/* RECENTER CAMERA BUTTON (SHOWN WHEN PANNED AWAY WITH MOUSE) */}
      {isPannedAway && (
        <button
          onClick={() => {
            soundEngine.playClick();
            panOffsetRef.current = { x: 0, y: 0 };
            userZoomRef.current = 1.0;
            setIsPannedAway(false);
          }}
          className="pixel-btn pixel-btn-peach font-mono"
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '7px 18px',
            fontSize: '0.82rem',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 18px rgba(16, 19, 41, 0.85)',
          }}
          title="Recenter Camera on Beenish"
        >
          ⌖ Recenter on Paaaari
        </button>
      )}

      {/* FLOATING TOP-RIGHT STATUS & QUEST CONTROLS */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 14, 
          right: 14, 
          zIndex: 100, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        {/* Stars Counter Pill */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setIsJournalOpen(true);
          }}
          className="pixel-badge pixel-badge-gold font-mono"
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            boxShadow: 'var(--pixel-border-gold)',
            backgroundColor: 'rgba(27, 32, 66, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          title="Open Expedition Journal"
        >
          <span>✦ {starsRecovered} / 7 Stars</span>
        </div>

        {/* World Map Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsMapOpen(true);
          }}
          className="pixel-btn pixel-btn-peach font-display"
          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          title="Open World Map (M)"
        >
          MAP
        </button>

        {/* Journal Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsJournalOpen(true);
          }}
          className="pixel-btn pixel-btn-primary font-display"
          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          title="Open Expedition Journal (J)"
        >
          JOURNAL
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsSettingsOpen(true);
          }}
          className="pixel-btn pixel-btn-ghost font-mono"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title="Open Expedition Settings & Preferences"
        >
          SETTINGS
        </button>
      </div>

      {/* FLOATING BOTTOM-LEFT D-PAD & SPRINT (TOUCH / MOUSE) */}
      {isVirtualDpadVisible && (
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 18, 
          left: 18, 
          zIndex: 100, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        {/* Sprint Toggle */}
        <button
          onClick={() => setIsVirtualRunning(prev => !prev)}
          className={`pixel-btn ${isVirtualRunning ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
          style={{
            padding: '4px 10px',
            fontSize: '0.7rem',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(27, 32, 66, 0.85)',
            backdropFilter: 'blur(6px)',
          }}
          title="Toggle Sprint (or hold Shift)"
        >
          {isVirtualRunning ? 'RUN (SHIFT)' : 'WALK'}
        </button>

        {/* Minimal Glassmorphic D-Pad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 40px)',
            gridTemplateRows: 'repeat(3, 40px)',
            gap: 3,
            backgroundColor: 'rgba(27, 32, 66, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: 4,
            border: '1px solid var(--color-twilight-blue)',
            boxShadow: '0 4px 16px rgba(16, 19, 41, 0.7)',
          }}
        >
          <div />
          <button onMouseDown={() => handleVirtualDir('up', true)} onMouseUp={() => handleVirtualDir('up', false)} onTouchStart={() => handleVirtualDir('up', true)} onTouchEnd={() => handleVirtualDir('up', false)} className="pixel-btn" style={{ padding: 0 }}>▲</button>
          <div />
          <button onMouseDown={() => handleVirtualDir('left', true)} onMouseUp={() => handleVirtualDir('left', false)} onTouchStart={() => handleVirtualDir('left', true)} onTouchEnd={() => handleVirtualDir('left', false)} className="pixel-btn" style={{ padding: 0 }}>◀</button>
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)' }} />
          <button onMouseDown={() => handleVirtualDir('right', true)} onMouseUp={() => handleVirtualDir('right', false)} onTouchStart={() => handleVirtualDir('right', true)} onTouchEnd={() => handleVirtualDir('right', false)} className="pixel-btn" style={{ padding: 0 }}>▶</button>
          <div />
          <button onMouseDown={() => handleVirtualDir('down', true)} onMouseUp={() => handleVirtualDir('down', false)} onTouchStart={() => handleVirtualDir('down', true)} onTouchEnd={() => handleVirtualDir('down', false)} className="pixel-btn" style={{ padding: 0 }}>▼</button>
          <div />
        </div>
      </div>
      )}

      {/* FLOATING ACTION PROMPT - ONLY VISIBLE WHEN READY TO ACT */}
      {activeInteractable && !isModalOpen && !isJournalOpen && !isMapOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 100,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={handleAction}
            className="pixel-btn animate-glow font-display"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              height: 'auto',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              color: '#FFFFFF',
              backgroundColor: '#0F172A',
              border: '2px solid #F59E0B',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.6), inset 0 0 12px rgba(245, 158, 11, 0.25)',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
            title="Press Enter / Space / Click to Interact"
          >
            <span 
              style={{
                backgroundColor: '#F59E0B',
                color: '#0F172A',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 900,
                fontSize: '0.85rem',
              }}
            >
              ↵ Press Enter
            </span>
            <span style={{ color: '#FEF08A' }}>
              {(getPromptLabel(activeInteractable) || '').replace(/\[\s*E\s*\]/gi, '').trim()}
            </span>
          </button>
        </div>
      )}

      {/* IN-GAME EXPEDITION JOURNAL MODAL */}
      {isJournalOpen && <JournalModal onClose={() => setIsJournalOpen(false)} onOpenMap={() => setIsMapOpen(true)} />}

      {/* INTERACTIVE EXPEDITION WORLD MAP & GUIDE MODAL */}
      {isMapOpen && (
        <ExpeditionMapModal
          onClose={() => setIsMapOpen(false)}
          playerPos={playerPosRef.current}
          currentRoomId={currentRoomId}
          onFastTravel={(roomId, targetPos) => {
            changeRoom(roomId, targetPos);
          }}
          onSetWaypoint={(pos, label) => {
            setCustomWaypoint({ ...pos, label });
          }}
        />
      )}
      {/* EXPEDITION SETTINGS & PREFERENCES MODAL */}
      <ExpeditionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isVirtualDpadVisible={isVirtualDpadVisible}
        onToggleVirtualDpad={() => setIsVirtualDpadVisible(v => !v)}
        userZoom={userZoom}
        onSetUserZoom={(z) => {
          setUserZoom(z);
          userZoomRef.current = z;
        }}
      />
    </div>
  );
};
