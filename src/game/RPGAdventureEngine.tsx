import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { Direction, Position, RoomId, InteractableObject, LightSource } from './types';
import { ROOMS } from './maps';
import { SpriteRenderer } from './spriteRenderer';
import { EnvironmentRenderer } from './environmentRenderer';
import { soundEngine } from '../audio/soundEngine';
import { JournalModal } from '../components/JournalModal';
import { LocationId } from '../types/expedition';

interface RPGAdventureEngineProps {
  onTriggerInteraction: (interactable: InteractableObject) => void;
}

export const RPGAdventureEngine: React.FC<RPGAdventureEngineProps> = ({
  onTriggerInteraction,
}) => {
  const { state, navigateTo, toggleMute } = useExpedition();
  const { 
    starsRecovered, 
    secretGardenUnlocked, 
    currentLocation, 
    bureauStamped, 
    courtVerdictReached, 
    namedConstellation, 
    inventory,
    isMuted,
  } = state;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current Room
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>(() => {
    if (currentLocation && currentLocation !== 'boot' && currentLocation !== 'hub') {
      return (currentLocation as RoomId) in ROOMS ? (currentLocation as RoomId) : 'overworld';
    }
    return 'overworld';
  });
  const room = ROOMS[currentRoomId] || ROOMS['overworld'];

  // Camera State (Smooth Glide Tracking)
  const camPosRef = useRef<Position>({ x: 0, y: 0 });

  // Player State
  const playerPosRef = useRef<Position>({ ...room.defaultSpawn });
  const playerDirRef = useRef<Direction>('down');
  const isWalkingRef = useRef<boolean>(false);
  const walkFrameRef = useRef<number>(0);

  // Companion (Ted) Follower State
  const tedPosRef = useRef<Position>({ x: room.defaultSpawn.x, y: room.defaultSpawn.y + 28 });
  const tedDirRef = useRef<Direction>('up');
  const trailRef = useRef<Position[]>([]);
  const tedEmoteRef = useRef<'heart' | 'exclamation' | 'question' | 'music' | 'blush' | 'sparkle' | 'sleep' | null>('heart');
  const tedEmoteTimerRef = useRef<number>(120);

  // Controls State
  const keysPressed = useRef<Record<string, boolean>>({});
  const [isVirtualRunning, setIsVirtualRunning] = useState<boolean>(false);
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const activeInteractableRef = useRef<InteractableObject | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);

  // Target Move (Tap-to-move on mobile/desktop)
  const targetPosRef = useRef<Position | null>(null);

  // Browser Fullscreen Handler
  const toggleBrowserFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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

  // Room Transition Helper with Camera Snap
  const changeRoom = useCallback((newRoomId: RoomId, spawnPos?: Position, syncNav = true) => {
    soundEngine.playDoorOpen();
    setCurrentRoomId(newRoomId);
    const targetRoom = ROOMS[newRoomId] || ROOMS['overworld'];
    const newSpawn = spawnPos || targetRoom.defaultSpawn;

    playerPosRef.current = { ...newSpawn };
    tedPosRef.current = { x: newSpawn.x, y: newSpawn.y + 24 };
    trailRef.current = [];
    targetPosRef.current = null;
    activeInteractableRef.current = null;
    setActiveInteractable(null);

    // Snap camera smoothly to new room
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = vw / targetRoom.width;
    const scaleY = vh / targetRoom.height;
    const zoom = Math.max(scaleX, scaleY, newRoomId === 'overworld' ? 1.35 : 1.55);

    let initCamX = newSpawn.x + 12 - vw / (2 * zoom);
    let initCamY = newSpawn.y + 16 - vh / (2 * zoom);
    if (targetRoom.width * zoom <= vw) initCamX = -(vw / zoom - targetRoom.width) / 2;
    if (targetRoom.height * zoom <= vh) initCamY = -(vh / zoom - targetRoom.height) / 2;
    camPosRef.current = { x: initCamX, y: initCamY };

    // Trigger excited companion reaction
    tedEmoteRef.current = 'sparkle';
    tedEmoteTimerRef.current = 100;

    if (newRoomId === 'garden') {
      soundEngine.startGardenMelody();
    } else {
      soundEngine.stopGardenMelody();
    }

    if (syncNav) {
      navigateTo(newRoomId === 'overworld' ? 'hub' : (newRoomId as LocationId));
    }
  }, [navigateTo]);

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
      changeRoom(interactable.targetRoom, interactable.targetPos);
    } else {
      soundEngine.playClick();
      tedEmoteRef.current = 'heart';
      tedEmoteTimerRef.current = 120;
      onTriggerInteraction(interactable);
    }
  }, [changeRoom, onTriggerInteraction, secretGardenUnlocked]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [handleAction]);

  // 60fps Game & Camera Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const checkCollision = (x: number, y: number): boolean => {
      const pWidth = 16;
      const pHeight = 12;
      const px = x + 4;
      const py = y + 16;

      for (const box of room.collisionBoxes) {
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
      const currentRoom = ROOMS[currentRoomId] || ROOMS['overworld'];

      const vw = canvas.width;
      const vh = canvas.height;

      // Dynamic Full-Screen Wide Zoom (Guarantees zero black borders on any widescreen display!)
      const scaleX = vw / currentRoom.width;
      const scaleY = vh / currentRoom.height;
      const zoom = Math.max(scaleX, scaleY, currentRoom.id === 'overworld' ? 1.35 : 1.55);

      // Handle Movement Input & Sprint Speed
      let dx = 0;
      let dy = 0;
      const isRunning = keysPressed.current['shift'] || isVirtualRunning;
      const speed = isRunning ? 3.8 : 2.4;

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

      // Footstep sound & movement physics
      if (isMoving) {
        const stepRate = isRunning ? 6 : 9;
        if (frameCount % stepRate === 0) {
          walkFrameRef.current++;
          const surface = currentRoom.theme === 'valley' ? 'grass' : currentRoom.id === 'museum' ? 'stone' : 'wood';
          soundEngine.playFootstep(surface);
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        // X collision check
        if (!checkCollision(nextX, playerPosRef.current.y)) {
          playerPosRef.current.x = Math.max(10, Math.min(currentRoom.width - 34, nextX));
        }
        // Y collision check
        if (!checkCollision(playerPosRef.current.x, nextY)) {
          playerPosRef.current.y = Math.max(10, Math.min(currentRoom.height - 34, nextY));
        }

        // --- DOOR AUTO-ENTER TRIGGER ---
        // Walking directly into any doorway immediately enters the room seamlessly!
        const px = playerPosRef.current.x + 8;
        const py = playerPosRef.current.y + 16;
        for (const item of currentRoom.interactables) {
          if (item.type === 'door' && item.targetRoom) {
            if (
              px >= item.x - 8 &&
              px <= item.x + item.width + 8 &&
              py >= item.y - 8 &&
              py <= item.y + item.height + 12
            ) {
              if (item.id === 'door_garden' && !secretGardenUnlocked) {
                playerPosRef.current.y += 14;
                soundEngine.playClick();
                onTriggerInteraction(item);
                break;
              }
              changeRoom(item.targetRoom, item.targetPos);
              return;
            }
          }
        }

        // Companion Ted Follower Trail Queue
        trailRef.current.push({ ...playerPosRef.current });
        const trailDelay = isRunning ? 16 : 22;
        if (trailRef.current.length > trailDelay) {
          const followPos = trailRef.current.shift();
          if (followPos) {
            tedPosRef.current = { ...followPos };
            tedDirRef.current = playerDirRef.current;
          }
        }

        // Companion Emote when sprinting
        if (isRunning && frameCount % 140 === 0) {
          tedEmoteRef.current = 'blush';
          tedEmoteTimerRef.current = 60;
        }
      } else {
        // Idle companion emotes
        if (frameCount % 320 === 0 && !tedEmoteRef.current) {
          const emotes: Array<'heart' | 'music' | 'sleep' | 'sparkle'> = ['heart', 'music', 'sleep', 'sparkle'];
          tedEmoteRef.current = emotes[Math.floor(Math.random() * emotes.length)];
          tedEmoteTimerRef.current = 100;
        }
      }

      // Decrement emote timer
      if (tedEmoteTimerRef.current > 0) {
        tedEmoteTimerRef.current--;
        if (tedEmoteTimerRef.current === 0) {
          tedEmoteRef.current = null;
        }
      }

      // Proximity Detection for Interactables (Doors are auto-enter, so [ E ] is only for inspectable objects)
      let closest: InteractableObject | null = null;
      let minDistance = 44;

      for (const item of currentRoom.interactables) {
        if (item.type === 'door') continue; // Doors auto-trigger!

        const dist = Math.hypot(
          playerPosRef.current.x + 12 - (item.x + item.width / 2),
          playerPosRef.current.y + 16 - (item.y + item.height / 2)
        );
        if (dist < minDistance) {
          closest = item;
          minDistance = dist;
        }
      }

      // Also detect proximity to Ted to talk to him anywhere!
      const distToTed = Math.hypot(
        playerPosRef.current.x - tedPosRef.current.x,
        playerPosRef.current.y - tedPosRef.current.y
      );
      if (!closest && distToTed < 36 && !isMoving) {
        closest = {
          id: 'npc_ted',
          type: 'npc_ted',
          promptLabel: '[ E ] Talk to Ted ♡',
          x: tedPosRef.current.x,
          y: tedPosRef.current.y,
          width: 24,
          height: 28,
        };
      }

      activeInteractableRef.current = closest;
      setActiveInteractable(closest);

      // --- CAMERA TARGET CALCULATION & SMOOTH GLIDE ---
      let targetCamX = playerPosRef.current.x + 12 - vw / (2 * zoom);
      let targetCamY = playerPosRef.current.y + 16 - vh / (2 * zoom);

      // If room fits on screen, center it! Otherwise clamp within room bounds
      if (currentRoom.width * zoom <= vw) {
        targetCamX = -(vw / zoom - currentRoom.width) / 2;
      } else {
        targetCamX = Math.max(0, Math.min(currentRoom.width - vw / zoom, targetCamX));
      }

      if (currentRoom.height * zoom <= vh) {
        targetCamY = -(vh / zoom - currentRoom.height) / 2;
      } else {
        targetCamY = Math.max(0, Math.min(currentRoom.height - vh / zoom, targetCamY));
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
          secretGardenUnlocked
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

      // Draw Companion (Ted)
      SpriteRenderer.drawTed(
        ctx,
        tedPosRef.current,
        tedDirRef.current,
        isMoving,
        walkFrameRef.current
      );

      // Draw Ted's Emote Balloon if active
      if (tedEmoteRef.current) {
        SpriteRenderer.drawEmoteBubble(
          ctx,
          tedPosRef.current.x + 12,
          tedPosRef.current.y,
          tedEmoteRef.current,
          frameCount
        );
      }

      // Draw Beenish Protagonist
      SpriteRenderer.drawBeenish(
        ctx,
        playerPosRef.current,
        playerDirRef.current,
        isMoving,
        walkFrameRef.current
      );

      // Draw Proximity Action Prompt [ E ]
      if (activeInteractable) {
        SpriteRenderer.drawPromptBubble(
          ctx,
          playerPosRef.current.x + 12,
          playerPosRef.current.y,
          activeInteractable.promptLabel
        );
      }

      // --- DYNAMIC NIGHT LIGHTING PASS ---
      EnvironmentRenderer.renderLightingPass(
        ctx,
        currentRoom.width,
        currentRoom.height,
        lights,
        playerPosRef.current,
        currentRoom.theme
      );

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    currentRoomId, 
    starsRecovered, 
    secretGardenUnlocked, 
    bureauStamped, 
    courtVerdictReached, 
    namedConstellation, 
    inventory, 
    isVirtualRunning
  ]);

  // Screen-to-World Click/Tap-to-Move Projection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const currentRoom = ROOMS[currentRoomId] || ROOMS['overworld'];
    const scaleX = canvas.width / currentRoom.width;
    const scaleY = canvas.height / currentRoom.height;
    const zoom = Math.max(scaleX, scaleY, currentRoom.id === 'overworld' ? 1.35 : 1.55);

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

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* FULL SCREEN EDGE-TO-EDGE CANVAS */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="pixelated"
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          cursor: 'crosshair',
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
            BEENIE EXPEDITION
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
          <span style={{ animation: 'starTwinkle 2s infinite' }}>⭐</span>
          <span>STARS: {starsRecovered} / 7</span>
        </div>

        {/* Journal Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsJournalOpen(true);
          }}
          className="pixel-btn pixel-btn-primary font-display"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          title="Open Expedition Journal"
        >
          📖 JOURNAL
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="pixel-btn pixel-btn-ghost"
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* Browser Fullscreen Toggle */}
        <button
          onClick={toggleBrowserFullscreen}
          className="pixel-btn pixel-btn-ghost font-mono"
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
          title="Toggle Browser Fullscreen (F11)"
        >
          ⛶
        </button>
      </div>

      {/* FLOATING BOTTOM-LEFT D-PAD & SPRINT (TOUCH / MOUSE) */}
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
          {isVirtualRunning ? '⚡ SPRINTING (SHIFT)' : '👟 WALK'}
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

      {/* FLOATING BOTTOM-RIGHT ACTION BUTTON */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 100,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleAction}
          className={`pixel-btn ${activeInteractable ? 'pixel-btn-primary animate-glow' : 'pixel-btn-ghost'} font-display`}
          style={{
            width: '66px',
            height: '66px',
            fontSize: '1.1rem',
            borderRadius: 0,
            boxShadow: activeInteractable ? 'var(--pixel-border-gold), 0 0 20px var(--color-lantern-gold)' : undefined,
            backgroundColor: activeInteractable ? 'var(--color-lantern-gold)' : 'rgba(27, 32, 66, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
          title="Interact (E / Space / Enter)"
        >
          [ E ]
        </button>
      </div>

      {/* IN-GAME EXPEDITION JOURNAL MODAL */}
      {isJournalOpen && <JournalModal onClose={() => setIsJournalOpen(false)} />}
    </div>
  );
};
