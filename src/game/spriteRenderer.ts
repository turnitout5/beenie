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

    // Drop shadow
    ctx.fillStyle = 'rgba(16, 19, 41, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 26, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair - Dark Navy / Indigo with Lavender highlight
    ctx.fillStyle = '#101329';
    ctx.fillRect(x + 4, y + 2, 16, 8);
    ctx.fillStyle = '#1B2042';
    ctx.fillRect(x + 2, y + 4, 20, 10);
    ctx.fillStyle = '#9588BD'; // highlight
    ctx.fillRect(x + 6, y + 3, 6, 2);

    // Hair sides
    if (dir === 'down' || dir === 'left' || dir === 'right') {
      ctx.fillStyle = '#1B2042';
      ctx.fillRect(x + 2, y + 8, 4, 8);
      ctx.fillRect(x + 18, y + 8, 4, 8);
    }

    // Face - Warm Peach
    if (dir !== 'up') {
      ctx.fillStyle = '#F3B79C';
      ctx.fillRect(x + 6, y + 7, 12, 8);

      // Eyes
      ctx.fillStyle = '#101329';
      if (dir === 'down') {
        ctx.fillRect(x + 8, y + 10, 2, 3);
        ctx.fillRect(x + 14, y + 10, 2, 3);
        // Eye sparkles
        ctx.fillStyle = '#F6D78B';
        ctx.fillRect(x + 8, y + 10, 1, 1);
        ctx.fillRect(x + 14, y + 10, 1, 1);
      } else if (dir === 'left') {
        ctx.fillRect(x + 7, y + 10, 2, 3);
      } else if (dir === 'right') {
        ctx.fillRect(x + 15, y + 10, 2, 3);
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
   * Draws Ted (Boyfriend Companion Follower)
   */
  public static drawTed(
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

      // Friendly smile
      ctx.fillStyle = '#E98FAF';
      ctx.fillRect(x + 10, y + 13, 4, 1);
    }

    // Hoodie - Twilight Blue
    ctx.fillStyle = '#30385F';
    ctx.fillRect(x + 5, y + 15, 14, 8);
    ctx.fillStyle = '#666FA0';
    ctx.fillRect(x + 8, y + 15, 8, 8);

    // Pants - Void Navy
    ctx.fillStyle = '#101329';
    const leftLegOffset = step ? -2 : 0;
    const rightLegOffset = step ? 2 : 0;

    ctx.fillRect(x + 6, y + 23 + leftLegOffset, 4, 5);
    ctx.fillRect(x + 14, y + 23 + rightLegOffset, 4, 5);

    // Shoes - Moon Cream
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 5, y + 26 + leftLegOffset, 5, 2);
    ctx.fillRect(x + 14, y + 26 + rightLegOffset, 5, 2);

    ctx.restore();
  }

  /**
   * Draws interactive Action Bubble "[ E ] Prompt"
   */
  public static drawPromptBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string
  ): void {
    ctx.save();
    ctx.font = '10px "IBM Plex Mono", monospace';
    const textWidth = ctx.measureText(label).width;
    const bubbleWidth = textWidth + 16;
    const bubbleHeight = 20;
    const bx = Math.floor(x - bubbleWidth / 2);
    const by = Math.floor(y - 36);

    // Stepped pixel background
    ctx.fillStyle = '#101329';
    ctx.fillRect(bx, by, bubbleWidth, bubbleHeight);
    ctx.strokeStyle = '#F6D78B';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bubbleWidth, bubbleHeight);

    // Text
    ctx.fillStyle = '#F6D78B';
    ctx.textAlign = 'center';
    ctx.fillText(label, bx + bubbleWidth / 2, by + 14);

    // Pointer
    ctx.fillStyle = '#F6D78B';
    ctx.beginPath();
    ctx.moveTo(x - 4, by + bubbleHeight);
    ctx.lineTo(x + 4, by + bubbleHeight);
    ctx.lineTo(x, by + bubbleHeight + 4);
    ctx.fill();

    ctx.restore();
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
