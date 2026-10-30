import { Direction, Position } from './types';

export class SpriteRenderer {
  /**
   * Draws Beenish (Protagonist Explorer)
   */
  public static drawBeenish(
    ctx: CanvasRenderingContext2D,
    pos: Position,
    dir: Direction,
    isWalking: boolean,
    walkFrame: number
  ): void {
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    const step = isWalking && walkFrame % 2 === 1;

    ctx.save();

    // Dynamic footstep drop shadow with squash & stretch
    const shadowW = isWalking ? (step ? 11 : 9) : 10;
    const shadowH = isWalking ? (step ? 3.5 : 4.5) : 4;
    ctx.fillStyle = 'rgba(16, 19, 41, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 26, shadowW, shadowH, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair - Dark Navy / Indigo with Lavender highlight & Beenish's iconic White Streak
    ctx.fillStyle = '#101329';
    ctx.fillRect(x + 4, y + 2, 16, 8);
    ctx.fillStyle = '#1B2042';
    ctx.fillRect(x + 2, y + 4, 20, 10);
    ctx.fillStyle = '#9588BD'; // Soft lavender highlight
    ctx.fillRect(x + 7, y + 3, 6, 2);

    // Beenish's Signature White Hair Streak that Ahmad loves so much!
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 4, y + 3, 2, 8);
    ctx.fillStyle = '#E0E7FF';
    ctx.fillRect(x + 4, y + 11, 2, 4);

    // Hair sides
    if (dir === 'down' || dir === 'left' || dir === 'right') {
      ctx.fillStyle = '#1B2042';
      ctx.fillRect(x + 2, y + 8, 4, 8);
      ctx.fillRect(x + 18, y + 8, 4, 8);
      // Left side white streak continuation
      if (dir === 'down' || dir === 'left') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3, y + 8, 2, 6);
      }
    }

    // Face - Warm Peach
    if (dir !== 'up') {
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(x + 6, y + 7, 12, 8);

      // Eyes with dual-pixel sparkling glints
      ctx.fillStyle = '#101329';
      if (dir === 'down') {
        ctx.fillRect(x + 8, y + 10, 2, 3);
        ctx.fillRect(x + 14, y + 10, 2, 3);
        // Bright eye sparkle glints
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 10, 1, 1);
        ctx.fillRect(x + 14, y + 10, 1, 1);
        ctx.fillStyle = '#F6D78B';
        ctx.fillRect(x + 9, y + 11, 1, 1);
        ctx.fillRect(x + 15, y + 11, 1, 1);
      } else if (dir === 'left') {
        ctx.fillRect(x + 7, y + 10, 2, 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 7, y + 10, 1, 1);
      } else if (dir === 'right') {
        ctx.fillRect(x + 15, y + 10, 2, 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 15, y + 10, 1, 1);
      }

      // Cheeks (blush)
      ctx.fillStyle = '#E98FAF';
      ctx.fillRect(x + 6, y + 12, 2, 1);
      ctx.fillRect(x + 16, y + 12, 2, 1);
    }

    // Scarf / Collar - Moon Cream
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 6, y + 14, 12, 3);

    // Explorer Jacket - Dusty Lavender & Lilac
    ctx.fillStyle = '#9588BD';
    ctx.fillRect(x + 5, y + 16, 14, 7);
    ctx.fillStyle = '#C3A9E8';
    ctx.fillRect(x + 8, y + 16, 8, 7);

    // Belt - Warm Peach
    ctx.fillStyle = '#F3B79C';
    ctx.fillRect(x + 6, y + 21, 12, 2);

    // Legs / Boots
    ctx.fillStyle = '#1B2042';
    const leftLegOffset = step ? -2 : 0;
    const rightLegOffset = step ? 2 : 0;

    // Left boot
    ctx.fillRect(x + 6, y + 23 + leftLegOffset, 4, 5);
    ctx.fillStyle = '#30385F';
    ctx.fillRect(x + 6, y + 26 + leftLegOffset, 4, 2);

    // Right boot
    ctx.fillStyle = '#1B2042';
    ctx.fillRect(x + 14, y + 23 + rightLegOffset, 4, 5);
    ctx.fillStyle = '#30385F';
    ctx.fillRect(x + 14, y + 26 + rightLegOffset, 4, 2);

    ctx.restore();
  }

  /**
   * Draws Pagluu / Ahmad (Companion Follower)
   * Supports normal idle/walking, as well as comic fainting, shock scream, and sprint recovery!
   */
  public static drawTed(
    ctx: CanvasRenderingContext2D,
    pos: Position,
    dir: Direction,
    isWalking: boolean,
    walkFrame: number,
    faintStage: 'none' | 'fainted' | 'screaming' | 'sprinting_back' = 'none',
    frame: number = 0
  ): void {
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);

    ctx.save();

    // 1. FAINTED STATE (Completely flat on the ground from Paaaari's overwhelming beauty)
    if (faintStage === 'fainted') {
      // Wide shadow on the ground
      ctx.fillStyle = 'rgba(16, 19, 41, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x + 12, y + 26, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair on ground
      ctx.fillStyle = '#101329';
      ctx.fillRect(x - 5, y + 20, 8, 7);
      ctx.fillStyle = '#1B2042';
      ctx.fillRect(x - 4, y + 21, 7, 5);

      // Face flat on back
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(x + 2, y + 20, 9, 7);

      // Cartoon 'X' eyes (Knocked out!)
      ctx.fillStyle = '#101329';
      // Left eye X
      ctx.fillRect(x + 3, y + 21, 1, 1);
      ctx.fillRect(x + 5, y + 21, 1, 1);
      ctx.fillRect(x + 4, y + 22, 1, 1);
      ctx.fillRect(x + 3, y + 23, 1, 1);
      ctx.fillRect(x + 5, y + 23, 1, 1);
      // Right eye X
      ctx.fillRect(x + 7, y + 21, 1, 1);
      ctx.fillRect(x + 9, y + 21, 1, 1);
      ctx.fillRect(x + 8, y + 22, 1, 1);
      ctx.fillRect(x + 7, y + 23, 1, 1);
      ctx.fillRect(x + 9, y + 23, 1, 1);

      // Heavy blush on cheeks
      ctx.fillStyle = '#E98FAF';
      ctx.fillRect(x + 2, y + 24, 2, 1);
      ctx.fillRect(x + 8, y + 24, 2, 1);

      // Dazed open mouth
      ctx.fillStyle = '#9588BD';
      ctx.fillRect(x + 5, y + 25, 3, 1);

      // Hoodie lying flat
      ctx.fillStyle = '#30385F';
      ctx.fillRect(x + 10, y + 21, 11, 6);
      ctx.fillStyle = '#666FA0';
      ctx.fillRect(x + 12, y + 22, 6, 4);

      // Pants legs sprawled horizontally
      ctx.fillStyle = '#101329';
      ctx.fillRect(x + 20, y + 22, 8, 3);
      ctx.fillRect(x + 20, y + 25, 7, 3);

      // Shoes
      ctx.fillStyle = '#F4EBDD';
      ctx.fillRect(x + 27, y + 22, 4, 2);
      ctx.fillRect(x + 26, y + 25, 4, 2);

      // Orbiting dizzy stars and little hearts above his head
      const orbitAng = frame * 0.1;
      for (let i = 0; i < 3; i++) {
        const starAng = orbitAng + (i * Math.PI * 2) / 3;
        const sx = x + 4 + Math.cos(starAng) * 12;
        const sy = y + 13 + Math.sin(starAng) * 5;
        ctx.fillStyle = i === 1 ? '#E98FAF' : '#F6D78B';
        ctx.font = '8px monospace';
        ctx.fillText(i === 1 ? '♡' : '✦', sx, sy);
      }

      ctx.restore();
      return;
    }

    // 2. SCREAMING STATE (Springs up vibrating with AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA)
    if (faintStage === 'screaming') {
      const shakeX = Math.round(Math.sin(frame * 0.9) * 2);
      const shakeY = Math.round(Math.cos(frame * 0.9) * 1.5);
      const sx = x + shakeX;
      const sy = y + shakeY;

      // Shadow
      ctx.fillStyle = 'rgba(16, 19, 41, 0.4)';
      ctx.beginPath();
      ctx.ellipse(sx + 12, sy + 26, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair standing straight up in shock
      ctx.fillStyle = '#101329';
      ctx.fillRect(sx + 4, sy + 1, 16, 6);
      ctx.fillRect(sx + 6, sy - 2, 4, 3);
      ctx.fillRect(sx + 14, sy - 2, 4, 3);

      // Face
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(sx + 6, sy + 7, 12, 8);

      // Big shocked eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(sx + 7, sy + 8, 3, 3);
      ctx.fillRect(sx + 14, sy + 8, 3, 3);
      ctx.fillStyle = '#101329';
      ctx.fillRect(sx + 8, sy + 9, 1, 1);
      ctx.fillRect(sx + 15, sy + 9, 1, 1);

      // Screaming wide open mouth
      ctx.fillStyle = '#101329';
      ctx.fillRect(sx + 9, sy + 12, 6, 4);
      ctx.fillStyle = '#E98FAF';
      ctx.fillRect(sx + 10, sy + 14, 4, 2);

      // Arms raised high in the air
      ctx.fillStyle = '#30385F';
      ctx.fillRect(sx + 2, sy + 8, 3, 8);
      ctx.fillRect(sx + 19, sy + 8, 3, 8);
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(sx + 2, sy + 5, 3, 3);
      ctx.fillRect(sx + 19, sy + 5, 3, 3);

      // Hoodie
      ctx.fillStyle = '#30385F';
      ctx.fillRect(sx + 5, sy + 15, 14, 8);
      ctx.fillStyle = '#666FA0';
      ctx.fillRect(sx + 8, sy + 15, 8, 8);

      // Legs shaking
      ctx.fillStyle = '#101329';
      ctx.fillRect(sx + 6, sy + 23, 4, 5);
      ctx.fillRect(sx + 14, sy + 23, 4, 5);

      // Shoes
      ctx.fillStyle = '#F4EBDD';
      ctx.fillRect(sx + 5, sy + 26, 5, 2);
      ctx.fillRect(sx + 14, sy + 26, 5, 2);

      // Shock sparks
      ctx.fillStyle = '#F6D78B';
      ctx.font = '8px monospace';
      ctx.fillText('!', sx - 3, sy + 6);
      ctx.fillText('!', sx + 23, sy + 6);

      ctx.restore();
      return;
    }

    // 3. NORMAL OR SPRINTING STATE
    const isSprinting = faintStage === 'sprinting_back';
    const effectiveStep = (isWalking || isSprinting) && (isSprinting ? frame % 4 < 2 : walkFrame % 2 === 1);

    // Drop shadow
    ctx.fillStyle = 'rgba(16, 19, 41, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 26, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair - Dark Indigo clusters
    ctx.fillStyle = '#101329';
    ctx.fillRect(x + 5, y + 2, 14, 6);
    ctx.fillStyle = '#1B2042';
    ctx.fillRect(x + 4, y + 4, 16, 6);

    // Face - Warm Peach
    if (dir !== 'up') {
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(x + 6, y + 7, 12, 8);

      // Eyes
      ctx.fillStyle = '#101329';
      if (dir === 'down') {
        ctx.fillRect(x + 8, y + 10, 2, 2);
        ctx.fillRect(x + 14, y + 10, 2, 2);
      } else if (dir === 'left') {
        ctx.fillRect(x + 7, y + 10, 2, 2);
      } else if (dir === 'right') {
        ctx.fillRect(x + 15, y + 10, 2, 2);
      }

      // Friendly smile / determined blush
      ctx.fillStyle = '#E98FAF';
      ctx.fillRect(x + 10, y + 13, 4, 1);
      if (isSprinting) {
        ctx.fillRect(x + 6, y + 12, 2, 1);
        ctx.fillRect(x + 16, y + 12, 2, 1);
      }
    }

    // Hoodie - Twilight Blue
    ctx.fillStyle = '#30385F';
    ctx.fillRect(x + 5, y + 15, 14, 8);
    ctx.fillStyle = '#666FA0';
    ctx.fillRect(x + 8, y + 15, 8, 8);

    // Pants - Void Navy
    ctx.fillStyle = '#101329';
    const leftLegOffset = effectiveStep ? -2 : 0;
    const rightLegOffset = effectiveStep ? 2 : 0;

    ctx.fillRect(x + 6, y + 23 + leftLegOffset, 4, 5);
    ctx.fillRect(x + 14, y + 23 + rightLegOffset, 4, 5);

    // Shoes - Moon Cream
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 5, y + 26 + leftLegOffset, 5, 2);
    ctx.fillRect(x + 14, y + 26 + rightLegOffset, 5, 2);

    // Sprinting dust particles & trailing hearts
    if (isSprinting) {
      ctx.fillStyle = '#E98FAF';
      ctx.font = '7px monospace';
      ctx.fillText('♡', x - 4, y + 16);
      ctx.fillStyle = 'rgba(244, 235, 221, 0.6)';
      ctx.fillRect(x - 2, y + 26, 2, 2);
    }

    ctx.restore();
  }

  /**
   * Pre-measures the size of an Action Prompt Bubble without rendering
   */
  public static measurePromptBubble(
    ctx: CanvasRenderingContext2D,
    label: string
  ): { width: number; height: number; cleanLabel: string } {
    ctx.save();
    ctx.font = 'bold 9px "IBM Plex Mono", monospace';
    const cleanLabel = (label || '').replace(/\[\s*E\s*\]/gi, '').trim();
    const actionText = `[ Enter ↵ ] ${cleanLabel}`;
    const textWidth = ctx.measureText(actionText).width;
    ctx.restore();
    return {
      width: textWidth + 20,
      height: 22,
      cleanLabel,
    };
  }

  /**
   * Pre-measures Paglu\'s dynamic speech bubble without rendering
   */
  public static measureSpeechBubble(
    ctx: CanvasRenderingContext2D,
    text: string
  ): { width: number; height: number; lines: string[]; isScream: boolean; isFaint: boolean } {
    const isScream = text.startsWith('AAAA');
    const isFaint = text.includes('bayhosh') || text.includes('hussssnn');

    ctx.save();
    ctx.font = isScream ? 'bold 10px "IBM Plex Mono", monospace' : 'bold 9px "IBM Plex Mono", monospace';

    // Word wrap into max 220px wide lines
    const maxLineW = 220;
    const rawWords = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const w of rawWords) {
      const test = currentLine ? `${currentLine} ${w}` : w;
      if (ctx.measureText(test).width > maxLineW && currentLine) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);

    let maxW = 0;
    for (const l of lines) {
      const w = ctx.measureText(l).width;
      if (w > maxW) maxW = w;
    }
    ctx.restore();

    const bubbleWidth = Math.max(48, maxW + 18);
    const lineHeight = 12;
    const bubbleHeight = 10 + lines.length * lineHeight;

    return { width: bubbleWidth, height: bubbleHeight, lines, isScream, isFaint };
  }

  /**
   * Resolves two colliding diegetic bubbles like repelling magnets to opposite sides,
   * guaranteeing they never meet while keeping each bubble tied to its respective person.
   */
  public static resolveMagneticBubbles(
    bubbleA: { width: number; height: number; anchorX: number; anchorY: number },
    bubbleB: { width: number; height: number; anchorX: number; anchorY: number },
    bounds: { width: number; height: number; margin?: number }
  ): {
    bubbleA: { x: number; y: number; width: number; height: number; targetX: number; targetY: number };
    bubbleB: { x: number; y: number; width: number; height: number; targetX: number; targetY: number };
  } {
    const cxA = bubbleA.anchorX;
    const cyA = bubbleA.anchorY - bubbleA.height / 2 - 14;
    const cxB = bubbleB.anchorX;
    const cyB = bubbleB.anchorY - bubbleB.height / 2 - 14;

    let dx = cxA - cxB;
    let dy = cyA - cyB;
    if (dx === 0 && dy === 0) {
      dx = -1;
      dy = 0;
    }

    const gap = 16;
    const reqX = (bubbleA.width + bubbleB.width) / 2 + gap;
    const reqY = (bubbleA.height + bubbleB.height) / 2 + gap;

    const sepX = Math.abs(dx);
    const sepY = Math.abs(dy);

    const overlapX = reqX - sepX;
    const overlapY = reqY - sepY;

    const roomMargin = bounds.margin || 8;
    const minX = roomMargin;
    const maxX = bounds.width - roomMargin;

    if (overlapX > 0 && overlapY > 0) {
      const roomAvailableW = maxX - minX;
      const totalBubbleW = bubbleA.width + bubbleB.width + gap;
      const canSplitH = (roomAvailableW >= totalBubbleW);
      const preferVertical = (Math.abs(dy) > Math.abs(dx) * 1.5) || !canSplitH;

      let newAx = cxA - bubbleA.width / 2;
      let newAy = cyA - bubbleA.height / 2;
      let newBx = cxB - bubbleB.width / 2;
      let newBy = cyB - bubbleB.height / 2;

      if (preferVertical) {
        const repelSignY = dy <= 0 ? -1 : 1;
        const pushY = (overlapY / 2) * repelSignY;
        newAy += pushY;
        newBy -= pushY;

        const minY = roomMargin;
        const maxY = bounds.height - roomMargin;
        if (newAy < minY) {
          const delta = minY - newAy;
          newAy = minY;
          newBy = Math.min(maxY - bubbleB.height, newBy + delta);
        }
        if (newBy + bubbleB.height > maxY) {
          const delta = (newBy + bubbleB.height) - maxY;
          newBy = maxY - bubbleB.height;
          newAy = Math.max(minY, newAy - delta);
        }
        if (newAy + bubbleA.height > maxY) {
          const delta = (newAy + bubbleA.height) - maxY;
          newAy = maxY - bubbleA.height;
          newBy = Math.max(minY, newBy - delta);
        }
        if (newBy < minY) {
          const delta = minY - newBy;
          newBy = minY;
          newAy = Math.min(maxY - bubbleA.height, newAy + delta);
        }

        newAx = Math.max(minX, Math.min(maxX - bubbleA.width, newAx));
        newBx = Math.max(minX, Math.min(maxX - bubbleB.width, newBx));
      } else {
        const repelSignX = dx <= 0 ? -1 : 1;
        const pushA = (overlapX / 2) * repelSignX;
        const pushB = -(overlapX / 2) * repelSignX;

        const newCxA = cxA + pushA;
        const newCxB = cxB + pushB;

        newAx = newCxA - bubbleA.width / 2;
        newBx = newCxB - bubbleB.width / 2;

        if (newAx < minX) {
          const delta = minX - newAx;
          newAx = minX;
          newBx = Math.min(maxX - bubbleB.width, newBx + delta);
        }
        if (newBx + bubbleB.width > maxX) {
          const delta = (newBx + bubbleB.width) - maxX;
          newBx = maxX - bubbleB.width;
          newAx = Math.max(minX, newAx - delta);
        }
        if (newAx + bubbleA.width > maxX) {
          const delta = (newAx + bubbleA.width) - maxX;
          newAx = maxX - bubbleA.width;
          newBx = Math.max(minX, newBx - delta);
        }
        if (newBx < minX) {
          const delta = minX - newBx;
          newBx = minX;
          newAx = Math.min(maxX - bubbleA.width, newAx + delta);
        }

        const currentSepX = (newAx <= newBx)
          ? newBx - (newAx + bubbleA.width)
          : newAx - (newBx + bubbleB.width);

        if (currentSepX < gap) {
          const repelSignY = dy <= 0 ? -1 : 1;
          const vPushA = (overlapY / 2) * repelSignY;
          const vPushB = -(overlapY / 2) * repelSignY;
          newAy += vPushA;
          newBy += vPushB;
          newAy = Math.max(roomMargin, Math.min(bounds.height - roomMargin - bubbleA.height, newAy));
          newBy = Math.max(roomMargin, Math.min(bounds.height - roomMargin - bubbleB.height, newBy));
        }
      }

      return {
        bubbleA: { x: Math.floor(newAx), y: Math.floor(newAy), width: bubbleA.width, height: bubbleA.height, targetX: bubbleA.anchorX, targetY: bubbleA.anchorY },
        bubbleB: { x: Math.floor(newBx), y: Math.floor(newBy), width: bubbleB.width, height: bubbleB.height, targetX: bubbleB.anchorX, targetY: bubbleB.anchorY },
      };
    } else {
      const newAx = Math.max(minX, Math.min(maxX - bubbleA.width, cxA - bubbleA.width / 2));
      const newAy = Math.max(roomMargin, Math.min(bounds.height - roomMargin - bubbleA.height, cyA - bubbleA.height / 2));
      const newBx = Math.max(minX, Math.min(maxX - bubbleB.width, cxB - bubbleB.width / 2));
      const newBy = Math.max(roomMargin, Math.min(bounds.height - roomMargin - bubbleB.height, cyB - bubbleB.height / 2));
      return {
        bubbleA: { x: Math.floor(newAx), y: Math.floor(newAy), width: bubbleA.width, height: bubbleA.height, targetX: bubbleA.anchorX, targetY: bubbleA.anchorY },
        bubbleB: { x: Math.floor(newBx), y: Math.floor(newBy), width: bubbleB.width, height: bubbleB.height, targetX: bubbleB.anchorX, targetY: bubbleB.anchorY },
      };
    }
  }

  /**
   * Draws interactive Action Bubble "[ Enter ↵ ] Prompt"
   * With dynamic magnetic pointer tail leaning towards the person!
   */
  public static drawPromptBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    options?: {
      customX?: number;
      customY?: number;
      targetX?: number;
      targetY?: number;
      pointerDirection?: 'down' | 'up';
    }
  ): { x: number; y: number; width: number; height: number } {
    ctx.save();
    ctx.font = 'bold 9px "IBM Plex Mono", monospace';
    const cleanLabel = (label || '').replace(/\[\s*E\s*\]/gi, '').trim();
    const actionText = `[ Enter ↵ ] ${cleanLabel}`;
    const textWidth = ctx.measureText(actionText).width;
    const bubbleWidth = textWidth + 20;
    const bubbleHeight = 22;

    const tx = options?.targetX !== undefined ? options.targetX : x;
    const ty = options?.targetY !== undefined ? options.targetY : y;

    const bx = options?.customX !== undefined 
      ? Math.floor(options.customX) 
      : Math.floor(x - bubbleWidth / 2);
    const by = options?.customY !== undefined 
      ? Math.floor(options.customY) 
      : Math.floor(y - 38);

    const pointerDir = options?.pointerDirection || (by + bubbleHeight <= ty ? 'down' : 'up');

    // Dark drop shadow for maximum separation from background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Solid deep dark midnight background
    ctx.fillStyle = '#090D1A';
    ctx.fillRect(bx, by, bubbleWidth, bubbleHeight);

    // Glowing Gold Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bubbleWidth, bubbleHeight);

    // Reset shadow for crisp text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Key badge "[ Enter ↵ ]" in gold
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'left';
    ctx.fillText('[ Enter ↵ ]', bx + 8, by + 15);

    // Action label in pure white
    const badgeW = ctx.measureText('[ Enter ↵ ] ').width;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(cleanLabel, bx + 8 + badgeW, by + 15);

    // Pointer arrow tied to target person (leans towards person when repelled by magnet)
    const attachX = Math.max(bx + 10, Math.min(bx + bubbleWidth - 10, tx));
    const tipOffset = Math.max(-12, Math.min(12, (tx - attachX) * 0.45));
    const tipX = attachX + tipOffset;

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    if (pointerDir === 'up') {
      ctx.moveTo(attachX - 5, by);
      ctx.lineTo(attachX + 5, by);
      ctx.lineTo(tipX, by - 7);
    } else {
      ctx.moveTo(attachX - 5, by + bubbleHeight);
      ctx.lineTo(attachX + 5, by + bubbleHeight);
      ctx.lineTo(tipX, by + bubbleHeight + 7);
    }
    ctx.fill();

    ctx.restore();

    return { x: bx, y: by, width: bubbleWidth, height: bubbleHeight };
  }

  /**
   * Draws Paglu\'s dynamic speech bubble above his head
   * With dynamic magnetic pointer tail leaning towards Paglu!
   */
  public static drawSpeechBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    options?: {
      customX?: number;
      customY?: number;
      targetX?: number;
      targetY?: number;
    }
  ): { x: number; y: number; width: number; height: number } {
    const { width: bubbleWidth, height: bubbleHeight, lines, isScream, isFaint } = this.measureSpeechBubble(ctx, text);

    const tx = options?.targetX !== undefined ? options.targetX : x;
    const ty = options?.targetY !== undefined ? options.targetY : y;

    const bx = options?.customX !== undefined 
      ? Math.floor(options.customX) 
      : Math.floor(x - bubbleWidth / 2);
    const by = options?.customY !== undefined 
      ? Math.floor(options.customY) 
      : Math.floor(y - (bubbleHeight + 14));

    const pointerDir = (by + bubbleHeight <= ty) ? 'down' : 'up';

    ctx.save();

    // Drop shadow
    ctx.fillStyle = 'rgba(16, 19, 41, 0.75)';
    ctx.fillRect(bx + 2, by + 2, bubbleWidth, bubbleHeight);

    // Stepped pixel background
    ctx.fillStyle = isScream ? '#301828' : isFaint ? '#2A182E' : '#1B2042';
    ctx.fillRect(bx, by, bubbleWidth, bubbleHeight);
    ctx.strokeStyle = isScream ? '#F6D78B' : isFaint ? '#E98FAF' : '#F3B79C';
    ctx.lineWidth = isScream ? 2 : 1.5;
    ctx.strokeRect(bx, by, bubbleWidth, bubbleHeight);

    // Multi-line Text
    ctx.font = isScream ? 'bold 10px "IBM Plex Mono", monospace' : 'bold 9px "IBM Plex Mono", monospace';
    ctx.fillStyle = isScream ? '#F6D78B' : isFaint ? '#FFD4E2' : '#F4EBDD';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lineHeight = 12;
    lines.forEach((line, idx) => {
      ctx.fillText(line, bx + bubbleWidth / 2, by + 6 + idx * lineHeight + lineHeight / 2);
    });

    // Pointer tail tied to speaker (leans towards speaker when repelled by magnet)
    const attachX = Math.max(bx + 12, Math.min(bx + bubbleWidth - 12, tx));
    const tipOffset = Math.max(-14, Math.min(14, (tx - attachX) * 0.45));
    const tipX = attachX + tipOffset;

    ctx.fillStyle = isScream ? '#F6D78B' : isFaint ? '#E98FAF' : '#F3B79C';
    ctx.beginPath();
    if (pointerDir === 'up') {
      ctx.moveTo(attachX - 5, by);
      ctx.lineTo(attachX + 5, by);
      ctx.lineTo(tipX, by - 7);
    } else {
      ctx.moveTo(attachX - 5, by + bubbleHeight);
      ctx.lineTo(attachX + 5, by + bubbleHeight);
      ctx.lineTo(tipX, by + bubbleHeight + 7);
    }
    ctx.fill();

    ctx.restore();

    return { x: bx, y: by, width: bubbleWidth, height: bubbleHeight };
  }

  /**
   * Draws a glowing memory crystal for the Archive
   */
  public static drawCrystal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isClassified: boolean,
    bobOffset: number
  ): void {
    const cy = y + bobOffset;
    ctx.save();

    // Outer glow
    ctx.fillStyle = isClassified ? 'rgba(246, 215, 139, 0.25)' : 'rgba(195, 169, 232, 0.25)';
    ctx.beginPath();
    ctx.arc(x + 12, cy + 12, 16, 0, Math.PI * 2);
    ctx.fill();

    // Diamond polygon
    ctx.fillStyle = isClassified ? '#F6D78B' : '#C3A9E8';
    ctx.beginPath();
    ctx.moveTo(x + 12, cy);
    ctx.lineTo(x + 22, cy + 12);
    ctx.lineTo(x + 12, cy + 24);
    ctx.lineTo(x + 2, cy + 12);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#F4EBDD';
    ctx.beginPath();
    ctx.moveTo(x + 12, cy + 3);
    ctx.lineTo(x + 16, cy + 10);
    ctx.lineTo(x + 12, cy + 14);
    ctx.lineTo(x + 8, cy + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a pixel emote balloon over a character's head
   */
  public static drawEmoteBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    emote: 'heart' | 'exclamation' | 'question' | 'music' | 'blush' | 'sparkle' | 'sleep',
    frame: number,
    options?: {
      customX?: number;
      customY?: number;
      targetX?: number;
      targetY?: number;
    }
  ): { x: number; y: number; width: number; height: number } {
    const bob = Math.sin(frame * 0.12) * 2;
    const tx = options?.targetX !== undefined ? options.targetX : x;
    const ty = options?.targetY !== undefined ? options.targetY : y;
    const bx = options?.customX !== undefined ? Math.floor(options.customX) : Math.floor(x - 12);
    const by = options?.customY !== undefined ? Math.floor(options.customY) : Math.floor(y - 32 + bob);

    const pointerDir = (by + 18 <= ty) ? 'down' : 'up';

    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(16, 19, 41, 0.5)';
    ctx.fillRect(bx + 1, by + 1, 24, 20);

    // Balloon Body
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(bx, by, 22, 18);
    ctx.strokeStyle = '#101329';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, 22, 18);

    // Pointer tail tied to person (leans towards targetX)
    const attachX = Math.max(bx + 6, Math.min(bx + 16, tx));
    const tipOffset = Math.max(-6, Math.min(6, (tx - attachX) * 0.45));
    const tipX = attachX + tipOffset;

    ctx.fillStyle = '#F4EBDD';
    ctx.beginPath();
    if (pointerDir === 'up') {
      ctx.moveTo(attachX - 3, by);
      ctx.lineTo(attachX + 3, by);
      ctx.lineTo(tipX, by - 5);
    } else {
      ctx.moveTo(attachX - 3, by + 18);
      ctx.lineTo(attachX + 3, by + 18);
      ctx.lineTo(tipX, by + 23);
    }
    ctx.fill();

    // Emote Icon
    if (emote === 'heart') {
      ctx.fillStyle = '#E98FAF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♡', bx + 11, by + 14);
    } else if (emote === 'exclamation') {
      ctx.fillStyle = '#B13434';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', bx + 11, by + 14);
    } else if (emote === 'question') {
      ctx.fillStyle = '#30385F';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', bx + 11, by + 14);
    } else if (emote === 'music') {
      ctx.fillStyle = '#9588BD';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♪', bx + 11, by + 14);
    } else if (emote === 'blush') {
      ctx.fillStyle = '#F3B79C';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('///', bx + 11, by + 13);
    } else if (emote === 'sleep') {
      ctx.fillStyle = '#666FA0';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('zzz', bx + 11, by + 13);
    } else {
      ctx.fillStyle = '#F6D78B';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', bx + 11, by + 14);
    }

    ctx.restore();

    return { x: bx, y: by, width: 22, height: 18 };
  }

  /**
   * Draws a footstep dust puff particle
   */
  public static drawDustPuff(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    const age = frame % 6;
    if (age > 4) return;
    ctx.save();
    ctx.fillStyle = `rgba(244, 235, 221, ${0.4 - age * 0.08})`;
    ctx.beginPath();
    ctx.arc(x + 12 - (age * 1.5), y + 26, 2 + age, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Draws golden inquiry sparkle on interactables
   */
  public static drawSparkle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    const pulse = Math.sin(frame * 0.1) * 0.5 + 0.5;
    if (pulse < 0.2) return;

    ctx.save();
    ctx.fillStyle = `rgba(246, 215, 139, ${pulse})`;
    ctx.fillRect(x, y - 2, 2, 6);
    ctx.fillRect(x - 2, y, 6, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, 2, 2);
    ctx.restore();
  }

  /**
   * Draws Wildflowers (with blooming scale)
   */
  public static drawFlowerCluster(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isBloomed: boolean
  ): void {
    ctx.save();
    // Stem
    ctx.fillStyle = '#718C83';
    ctx.fillRect(x + 4, y + 4, 2, 6);

    // Petals
    ctx.fillStyle = isBloomed ? '#F3B79C' : '#30385F';
    ctx.fillRect(x + 2, y + 2, 6, 4);
    ctx.fillStyle = isBloomed ? '#E98FAF' : '#1B2042';
    ctx.fillRect(x + 3, y + 1, 4, 6);
    // Center core
    ctx.fillStyle = isBloomed ? '#F6D78B' : '#30385F';
    ctx.fillRect(x + 4, y + 3, 2, 2);
    ctx.restore();
  }
}
