import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { Direction, Position, RoomId, InteractableObject, LightSource } from './types';
import { ROOMS } from './maps';
import { SpriteRenderer } from './spriteRenderer';
import { EnvironmentRenderer } from './environmentRenderer';
import { soundEngine } from '../audio/soundEngine';
import { LocationId } from '../types/expedition';

interface RPGAdventureEngineProps {
  onTriggerInteraction: (interactable: InteractableObject) => void;
}

export const RPGAdventureEngine: React.FC<RPGAdventureEngineProps> = ({
  onTriggerInteraction,
}) => {
  const { state, navigateTo } = useExpedition();
  const { 
    starsRecovered, 
    secretGardenUnlocked, 
    currentLocation, 
    bureauStamped, 
    courtVerdictReached, 
    namedConstellation, 
    inventory 
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

  // Target Move (Tap-to-move on mobile/desktop)
  const targetPosRef = useRef<Position | null>(null);

  // Room Transition Helper
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

  // Sync room when navigation changes externally (e.g. from Journal Quick-Travel or Header)
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
      // Companion reacts happily to interactions
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

  // Game Loop
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

      // Canvas dimensions match room
      canvas.width = currentRoom.width;
      canvas.height = currentRoom.height;

      // Handle Movement Input & Sprint
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
        if (isRunning && frameCount % 120 === 0) {
          tedEmoteRef.current = 'blush';
          tedEmoteTimerRef.current = 60;
        }
      } else {
        // Idle companion emotes
        if (frameCount % 300 === 0 && !tedEmoteRef.current) {
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

      // Proximity Detection for Interactables
      let closest: InteractableObject | null = null;
      let minDistance = 44;

      for (const item of currentRoom.interactables) {
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

      // --- RENDERING ENVIRONMENT ---
      ctx.imageSmoothingEnabled = false;
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

  // Canvas Tap/Click-to-Move
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    targetPosRef.current = { x: clickX - 12, y: clickY - 16 };
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
      }}
    >
      {/* Room Title, Location Badge, & Mechanics HUD */}
      <div
        style={{
          width: '100%',
          maxWidth: `${room.width}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          padding: '8px 14px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          border: '2px solid var(--color-twilight-blue)',
          boxShadow: '0 4px 16px rgba(16, 19, 41, 0.8)',
        }}
      >
        <div className="font-mono" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-lantern-gold)', fontWeight: 700 }}>LOC:</span>
          <span style={{ color: 'var(--color-moon-cream)', fontWeight: 600 }}>{room.name.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sprint Toggle */}
          <button
            onClick={() => setIsVirtualRunning(prev => !prev)}
            className={`pixel-btn ${isVirtualRunning ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
            style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '28px' }}
            title="Toggle Running Speed (or hold Shift)"
          >
            {isVirtualRunning ? '⚡ SPRINTING' : '👟 WALK'}
          </button>

          {currentRoomId !== 'overworld' && (
            <button
              onClick={() => changeRoom('overworld')}
              className="pixel-btn pixel-btn-peach font-mono"
              style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '28px' }}
            >
              ← RETURN TO VALLEY
            </button>
          )}
        </div>
      </div>

      {/* Main 2D RPG Adventure Canvas Container */}
      <div
        style={{
          position: 'relative',
          boxShadow: 'var(--pixel-border-gold), 0 12px 40px rgba(16, 19, 41, 0.95)',
          borderRadius: '0',
          overflow: 'hidden',
          backgroundColor: 'var(--color-void-navy)',
          maxWidth: '100%',
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="pixelated"
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            cursor: 'crosshair',
          }}
        />

        {/* Floating Proximity Action Button on Mobile */}
        {activeInteractable && (
          <button
            onClick={handleAction}
            className="pixel-btn pixel-btn-primary font-display animate-glow"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              padding: '12px 26px',
              fontSize: '0.85rem',
              boxShadow: 'var(--pixel-border-gold)',
            }}
          >
            {activeInteractable.promptLabel}
          </button>
        )}
      </div>

      {/* Retro On-Screen Virtual Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: `${room.width}px`,
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '12px 16px',
          backgroundColor: 'rgba(27, 32, 66, 0.85)',
          border: '2px solid var(--color-twilight-blue)',
        }}
      >
        {/* On-Screen D-Pad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 44px)',
            gridTemplateRows: 'repeat(3, 44px)',
            gap: '4px',
          }}
        >
          <div />
          <button
            onMouseDown={() => handleVirtualDir('up', true)}
            onMouseUp={() => handleVirtualDir('up', false)}
            onTouchStart={() => handleVirtualDir('up', true)}
            onTouchEnd={() => handleVirtualDir('up', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▲
          </button>
          <div />
          <button
            onMouseDown={() => handleVirtualDir('left', true)}
            onMouseUp={() => handleVirtualDir('left', false)}
            onTouchStart={() => handleVirtualDir('left', true)}
            onTouchEnd={() => handleVirtualDir('left', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ◀
          </button>
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)' }} />
          <button
            onMouseDown={() => handleVirtualDir('right', true)}
            onMouseUp={() => handleVirtualDir('right', false)}
            onTouchStart={() => handleVirtualDir('right', true)}
            onTouchEnd={() => handleVirtualDir('right', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▶
          </button>
          <div />
          <button
            onMouseDown={() => handleVirtualDir('down', true)}
            onMouseUp={() => handleVirtualDir('down', false)}
            onTouchStart={() => handleVirtualDir('down', true)}
            onTouchEnd={() => handleVirtualDir('down', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▼
          </button>
          <div />
        </div>

        {/* Action Button & Mechanics Guide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', lineHeight: '1.7' }}>
            <div>Walk: <strong style={{ color: 'var(--color-moon-cream)' }}>WASD / Arrows / Click</strong></div>
            <div>Sprint: <strong style={{ color: 'var(--color-warm-peach)' }}>Hold Shift / Tap Sprint</strong></div>
            <div>Action: <strong style={{ color: 'var(--color-lantern-gold)' }}>[ E ] / Space / Enter</strong></div>
            <div>Companion: <strong style={{ color: 'var(--color-rose-glow)' }}>Walk near Ted to talk ♡</strong></div>
          </div>

          <button
            onClick={handleAction}
            className="pixel-btn pixel-btn-primary font-display"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '0',
              fontSize: '1.1rem',
              boxShadow: 'var(--pixel-border-gold)',
            }}
            title="Interact (E)"
          >
            [ E ]
          </button>
        </div>
      </div>
    </div>
  );
};
