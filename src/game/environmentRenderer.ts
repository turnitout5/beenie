/**
 * High-Fidelity Procedural Pixel-Art Environment Renderer
 * Renders rich textures, materials, architectural exteriors, and detailed interiors
 * for the Valley of the Stars and all 6 locations.
 */

import { LightSource } from './types';

export class EnvironmentRenderer {
  /**
   * Helper: Draw repeated dithered texture or noise
   */
  private static seededRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * 1. OVERWORLD (THE VALLEY OF THE STARS)
   */
  public static renderOverworld(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number,
    starsRecovered: number,
    secretGardenUnlocked: boolean
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- BASE GRASS MATERIAL ---
    // Deep midnight indigo base - extends generously so widescreen displays have zero black gaps!
    ctx.fillStyle = '#161A36';
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Subtle dithered grass texture patches across wide area
    ctx.fillStyle = '#1B2042';
    for (let x = -400; x < width + 400; x += 16) {
      for (let y = -400; y < height + 400; y += 16) {
        if ((x + y) % 32 === 0) {
          ctx.fillRect(x + 2, y + 4, 3, 2);
          ctx.fillRect(x + 8, y + 10, 2, 3);
        }
      }
    }

    // Tufts of grass blades
    ctx.fillStyle = '#262D55';
    for (let i = 0; i < 90; i++) {
      const gx = Math.floor(this.seededRandom(i * 17) * (width - 40)) + 20;
      const gy = Math.floor(this.seededRandom(i * 31) * (height - 40)) + 20;
      // Skip over main road intersections
      if ((gx > 340 && gx < 440) || (gy > 140 && gy < 220)) continue;
      ctx.fillRect(gx, gy, 1, 4);
      ctx.fillRect(gx + 1, gy + 1, 1, 3);
      ctx.fillRect(gx - 1, gy + 2, 1, 2);
    }

    // --- COBBLESTONE ROAD MATERIAL ---
    const drawStoneRoad = (rx: number, ry: number, rw: number, rh: number, isVert: boolean) => {
      // Base gravel underlay
      ctx.fillStyle = '#242A4A';
      ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);

      // Cobblestone surface
      ctx.fillStyle = '#30385F';
      ctx.fillRect(rx, ry, rw, rh);

      // Edge curb lines
      ctx.fillStyle = '#48527F';
      if (isVert) {
        ctx.fillRect(rx, ry, 2, rh);
        ctx.fillRect(rx + rw - 2, ry, 2, rh);
      } else {
        ctx.fillRect(rx, ry, rw, 2);
        ctx.fillRect(rx, ry + rh - 2, rw, 2);
      }

      // Individual stone paver bevels
      const stoneW = 14;
      const stoneH = 10;
      for (let sx = rx + 4; sx < rx + rw - 8; sx += stoneW + 2) {
        for (let sy = ry + 4; sy < ry + rh - 6; sy += stoneH + 2) {
          const stagger = ((Math.floor(sy / 12) % 2) * stoneW) / 2;
          const px = sx + stagger;
          if (px > rx + rw - stoneW - 2) continue;

          // Stone base
          ctx.fillStyle = '#38426E';
          ctx.fillRect(px, sy, stoneW, stoneH);
          // Highlight edge (top-left)
          ctx.fillStyle = '#4F5C93';
          ctx.fillRect(px, sy, stoneW, 1);
          ctx.fillRect(px, sy, 1, stoneH);
          // Shadow crevice (bottom-right)
          ctx.fillStyle = '#222845';
          ctx.fillRect(px, sy + stoneH - 1, stoneW, 1);
          ctx.fillRect(px + stoneW - 1, sy, 1, stoneH);
        }
      }
    };

    // Main North-South Avenue leading from Hilltop to Valley Bottom
    drawStoneRoad(360, 40, 64, 540, true);
    // Main East-West Promenade connecting Bureau, Museum, and Court
    drawStoneRoad(110, 150, 560, 52, false);
    // Secondary Path leading to Southeast Archive & Secret Garden
    drawStoneRoad(360, 410, 310, 48, false);
    drawStoneRoad(630, 410, 48, 140, true);

    // --- REFLECTIVE WATER POND (SOUTH-WEST) ---
    const pondX = 80;
    const pondY = 360;
    const pondW = 160;
    const pondH = 120;

    // Sandy/mossy shoreline
    ctx.fillStyle = '#242C48';
    ctx.beginPath();
    ctx.ellipse(pondX + pondW / 2, pondY + pondH / 2, pondW / 2 + 8, pondH / 2 + 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep water body
    ctx.fillStyle = '#14203B';
    ctx.beginPath();
    ctx.ellipse(pondX + pondW / 2, pondY + pondH / 2, pondW / 2, pondH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated water caustics & sine wave ripples
    ctx.fillStyle = 'rgba(77, 119, 168, 0.4)';
    for (let r = 0; r < 4; r++) {
      const rippleY = pondY + 25 + r * 22 + Math.sin(frame * 0.05 + r) * 3;
      const rippleW = 40 + Math.sin(frame * 0.08 + r * 2) * 12;
      ctx.fillRect(pondX + 35 + r * 15, Math.floor(rippleY), rippleW, 2);
    }

    // Water Lily Pads & Pink Lotus Flowers
    const lilyPads = [
      { x: pondX + 35, y: pondY + 45 },
      { x: pondX + 110, y: pondY + 75 },
      { x: pondX + 75, y: pondY + 85 },
    ];
    lilyPads.forEach((pad, idx) => {
      ctx.fillStyle = '#264B44';
      ctx.beginPath();
      ctx.ellipse(pad.x, pad.y, 8, 5, 0, 0, Math.PI * 1.8);
      ctx.fill();
      // Lotus flower on pad 0 and 1
      if (idx !== 2) {
        ctx.fillStyle = '#E98FAF';
        ctx.fillRect(pad.x - 2, pad.y - 3, 4, 3);
        ctx.fillStyle = '#F4EBDD';
        ctx.fillRect(pad.x - 1, pad.y - 4, 2, 2);
      }
    });

    // Small wooden fishing dock pier
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(pondX + pondW - 24, pondY + 30, 28, 14);
    ctx.fillStyle = '#7C4F38';
    ctx.fillRect(pondX + pondW - 24, pondY + 32, 28, 3);
    ctx.fillRect(pondX + pondW - 24, pondY + 38, 28, 3);
    // Mooring post
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(pondX + pondW - 2, pondY + 26, 4, 18);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(pondX + pondW - 2, pondY + 26, 4, 2);

    // --- DECORATIVE TREES & NATURE ---
    this.drawDetailedTree(ctx, 40, 240, 'oak', frame);
    this.drawDetailedTree(ctx, 240, 460, 'willow', frame);
    this.drawDetailedTree(ctx, 500, 480, 'oak', frame);
    this.drawDetailedTree(ctx, 720, 220, 'pine', frame);
    this.drawDetailedTree(ctx, 40, 510, 'oak', frame);

    // --- ARCHITECTURAL EXTERIORS (BUILDINGS) ---

    // 1. BUREAU OF UNREASONABLE BOYFRIENDS (NORTH-WEST)
    // Cozily lit detective agency with timber framing, chimney with smoke, and bay window
    this.drawBureauBuilding(ctx, 60, 60, frame);
    lights.push({ x: 145, y: 135, radius: 45, intensity: 0.85, color: '#F6D78B' }); // Door lantern
    lights.push({ x: 95, y: 110, radius: 55, intensity: 0.9, color: '#F3B79C' }); // Bay window

    // 2. THE MUSEUM OF BEENISH (NORTH-CENTER)
    // Grand classical museum with marble columns, pediment frieze, red carpet stairs
    this.drawMuseumBuilding(ctx, 305, 38, frame);
    lights.push({ x: 335, y: 105, radius: 40, intensity: 0.8, color: '#F4EBDD' });
    lights.push({ x: 445, y: 105, radius: 40, intensity: 0.8, color: '#F4EBDD' });
    lights.push({ x: 390, y: 120, radius: 60, intensity: 0.95, color: '#C3A9E8' }); // Museum grand door

    // 3. COURT OF ABSOLUTELY NO FLAWS (NORTH-EAST)
    // Neo-classical court with scales of justice and imposing stone architecture
    this.drawCourtBuilding(ctx, 540, 60, frame);
    lights.push({ x: 620, y: 135, radius: 50, intensity: 0.9, color: '#F6D78B' });

    // 4. ARCHIVE OF THINGS THAT HAPPENED (EAST)
    // Ancient stone tower library with Gothic stained glass and ivy
    this.drawArchiveBuilding(ctx, 615, 300, frame);
    lights.push({ x: 680, y: 375, radius: 55, intensity: 0.85, color: '#C3A9E8' });

    // 5. SECRET GARDEN IVY GATE (SOUTH-EAST)
    this.drawGardenGate(ctx, 610, 480, frame, secretGardenUnlocked);
    if (secretGardenUnlocked) {
      lights.push({ x: 665, y: 520, radius: 75, intensity: 1.0, color: '#E98FAF' });
    }

    // 6. HILLTOP OBSERVATORY TRAIL & CREST (TOP-CENTER)
    this.drawObservatoryMountainTrail(ctx, 350, 0, frame);
    lights.push({ x: 392, y: 35, radius: 55, intensity: 0.9, color: '#F6D78B' });

    // --- STREET LAMPS ALONG THE AVENUES ---
    const lampPositions = [
      { x: 342, y: 180 },
      { x: 438, y: 180 },
      { x: 342, y: 340 },
      { x: 438, y: 340 },
      { x: 342, y: 480 },
      { x: 580, y: 440 },
    ];
    lampPositions.forEach((pos, idx) => {
      this.drawVictorianLampPost(ctx, pos.x, pos.y, frame + idx * 10);
      lights.push({ x: pos.x + 4, y: pos.y - 14, radius: 48, intensity: 0.88, color: '#F6D78B' });
    });

    // --- BLOOMING FLOWERS & FIREFLIES ---
    const flowerCount = starsRecovered >= 5 ? 18 : starsRecovered >= 2 ? 10 : 5;
    for (let i = 0; i < flowerCount; i++) {
      const fx = 140 + (i * 37) % 520;
      const fy = 210 + ((i * 47) % 260);
      if ((fx > 350 && fx < 430) || (fy > 150 && fy < 210)) continue;
      this.drawLuminescentFlower(ctx, fx, fy, frame + i * 15);
      if (starsRecovered >= 3) {
        lights.push({ x: fx + 4, y: fy + 4, radius: 18, intensity: 0.5, color: '#E98FAF' });
      }
    }

    // Floating Fireflies in the night air
    for (let f = 0; f < 8; f++) {
      const flyX = 100 + (Math.sin(frame * 0.02 + f * 1.5) * 80) + f * 70;
      const flyY = 220 + (Math.cos(frame * 0.03 + f * 2.1) * 60) + (f % 3) * 80;
      const glow = Math.sin(frame * 0.1 + f) * 0.5 + 0.5;
      if (glow > 0.2) {
        ctx.fillStyle = `rgba(246, 215, 139, ${glow})`;
        ctx.fillRect(Math.floor(flyX), Math.floor(flyY), 2, 2);
        lights.push({ x: Math.floor(flyX), y: Math.floor(flyY), radius: 14 * glow, intensity: 0.4 * glow, color: '#F6D78B' });
      }
    }

    return lights;
  }

  /**
   * 2. BUREAU INTERIOR (DETECTIVE OFFICE)
   */
  public static renderBureauInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number,
    bureauStamped: boolean
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- HERRINGBONE HARDWOOD FLOORING ---
    ctx.fillStyle = '#221612';
    ctx.fillRect(0, 0, width, height);

    const plankW = 24;
    const plankH = 8;
    for (let y = 50; y < height - 20; y += plankH) {
      for (let x = 20; x < width - 20; x += plankW) {
        const isOffset = (Math.floor(y / plankH) % 2) * (plankW / 2);
        const px = x + isOffset;
        if (px >= width - 20) continue;
        ctx.fillStyle = (x + y) % 16 === 0 ? '#38221B' : '#2F1D17';
        ctx.fillRect(px, y, plankW - 1, plankH - 1);
        ctx.fillStyle = '#1D120E';
        ctx.fillRect(px, y + plankH - 1, plankW, 1);
      }
    }

    // Wall (Wood Wainscoting & Navy Paint)
    ctx.fillStyle = '#101329';
    ctx.fillRect(0, 0, width, 55);
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(0, 48, width, 8);
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(0, 52, width, 2);

    // Persian Wool Rug
    ctx.fillStyle = '#4A1D23';
    ctx.fillRect(160, 130, 180, 110);
    ctx.strokeStyle = '#F6D78B';
    ctx.lineWidth = 2;
    ctx.strokeRect(164, 134, 172, 102);
    // Fringe
    ctx.fillStyle = '#F4EBDD';
    for (let fx = 160; fx < 340; fx += 4) {
      ctx.fillRect(fx, 128, 2, 2);
      ctx.fillRect(fx, 240, 2, 2);
    }

    // Executive Mahogany Desk
    const dx = 185;
    const dy = 145;
    const dw = 130;
    const dh = 50;
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(dx + 2, dy + 2, dw - 4, 12); // Desk top bevel
    ctx.fillStyle = '#26140D';
    ctx.fillRect(dx + 6, dy + 18, 32, 28); // Drawer left
    ctx.fillRect(dx + dw - 38, dy + 18, 32, 28); // Drawer right
    // Brass Drawer Handles
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(dx + 18, dy + 26, 8, 2);
    ctx.fillRect(dx + 18, dy + 36, 8, 2);
    ctx.fillRect(dx + dw - 26, dy + 26, 8, 2);
    ctx.fillRect(dx + dw - 26, dy + 36, 8, 2);

    // Green Banker's Desk Lamp
    ctx.fillStyle = '#2C5530'; // Emerald glass shade
    ctx.fillRect(dx + 12, dy - 2, 16, 6);
    ctx.fillStyle = '#F6D78B'; // Brass stand
    ctx.fillRect(dx + 19, dy + 4, 2, 8);
    ctx.fillRect(dx + 16, dy + 11, 8, 2);
    lights.push({ x: dx + 20, y: dy + 2, radius: 65, intensity: 0.95, color: '#F6D78B' });

    // Scattered Case Documents & Red Sealing Wax
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(dx + 48, dy + 16, 16, 12);
    ctx.fillRect(dx + 68, dy + 18, 14, 14);
    ctx.fillStyle = '#B13434';
    ctx.fillRect(dx + 54, dy + 22, 4, 4); // Red wax seal

    // Official Stamp if stamped
    if (bureauStamped) {
      ctx.fillStyle = '#B13434';
      ctx.fillRect(dx + 66, dy + 24, 18, 6);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '5px monospace';
      ctx.fillText('LOVED', dx + 68, dy + 29);
      lights.push({ x: dx + 75, y: dy + 25, radius: 30, intensity: 0.6, color: '#E98FAF' });
    }

    // Coffee Mug with animated steam
    ctx.fillStyle = '#C3A9E8';
    ctx.fillRect(dx + 105, dy + 18, 6, 8);
    const steamY = (frame * 0.08) % 8;
    ctx.fillStyle = 'rgba(244, 235, 221, 0.4)';
    ctx.fillRect(dx + 107, dy + 14 - Math.floor(steamY), 2, 3);

    // Wall of Filing Cabinets (West Wall)
    ctx.fillStyle = '#2A2E3D';
    ctx.fillRect(50, 60, 80, 65);
    ctx.strokeStyle = '#484F6E';
    ctx.strokeRect(50, 60, 80, 65);
    for (let row = 0; row < 3; row++) {
      ctx.fillStyle = '#373D50';
      ctx.fillRect(54, 64 + row * 19, 72, 16);
      ctx.fillStyle = '#F6D78B';
      ctx.fillRect(84, 71 + row * 19, 12, 3); // Brass label frame
    }

    // Pendulum Wall Clock (North Wall)
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(235, 10, 24, 34);
    ctx.fillStyle = '#F4EBDD';
    ctx.beginPath();
    ctx.arc(247, 22, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#101329';
    ctx.fillRect(246, 18, 2, 4); // Clock hand
    // Swinging brass pendulum
    const pendAngle = Math.sin(frame * 0.08) * 4;
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(Math.floor(246 + pendAngle), 34, 2, 8);
    ctx.fillRect(Math.floor(245 + pendAngle), 41, 4, 3);

    // Framed Certificate on Wall
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(100, 16, 28, 20);
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(102, 18, 24, 16);
    ctx.fillStyle = '#B13434';
    ctx.fillRect(112, 28, 4, 4); // Official rosette

    // Exit Rug
    ctx.fillStyle = '#30385F';
    ctx.fillRect(225, height - 32, 50, 12);
    ctx.fillStyle = '#F4EBDD';
    ctx.font = '8px monospace';
    ctx.fillText('EXIT ↓', 234, height - 24);

    return lights;
  }

  /**
   * 3. MUSEUM INTERIOR (GRAND GALLERY)
   */
  public static renderMuseumInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number,
    hasBrassKey: boolean
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- POLISHED CHECKERBOARD MARBLE FLOOR ---
    const tileSize = 20;
    for (let y = 45; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const isWhite = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
        ctx.fillStyle = isWhite ? '#353A52' : '#202438';
        ctx.fillRect(x, y, tileSize, tileSize);
        // Specular sheen
        if (isWhite && (x + y) % 40 === 0) {
          ctx.fillStyle = 'rgba(244, 235, 221, 0.08)';
          ctx.fillRect(x + 2, y + 2, tileSize - 4, 2);
        }
      }
    }

    // Plush Crimson Center Carpet Runner
    ctx.fillStyle = '#5A1A22';
    ctx.fillRect(260, 45, 80, height - 45);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(260, 45, 2, height - 45); // Gold border
    ctx.fillRect(338, 45, 2, height - 45);

    // Wall (Museum Violet with Damask Molding)
    ctx.fillStyle = '#14162B';
    ctx.fillRect(0, 0, width, 52);
    ctx.fillStyle = '#30385F';
    ctx.fillRect(0, 48, width, 4);

    // Gilded Frame 1 (Portrait 1: Laughter)
    this.drawGildedFrame(ctx, 95, 42, 60, 44, 'PORTRAIT 1', '#C3A9E8');
    lights.push({ x: 125, y: 64, radius: 55, intensity: 0.9, color: '#C3A9E8' });

    // Gilded Frame 2 (Portrait 2: Elegant Gaze)
    this.drawGildedFrame(ctx, 215, 42, 60, 44, 'PORTRAIT 2', '#F3B79C');
    lights.push({ x: 245, y: 64, radius: 55, intensity: 0.9, color: '#F3B79C' });
    // Hidden key golden sparkle cue if not yet collected!
    if (!hasBrassKey) {
      const sparkleA = Math.sin(frame * 0.1) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(246, 215, 139, ${sparkleA})`;
      ctx.fillRect(270, 78, 4, 4);
    }

    // Pedestal 1: Position Holder Artifact
    this.drawMuseumPedestal(ctx, 350, 140, '🏆', '#F6D78B', frame);
    lights.push({ x: 380, y: 155, radius: 60, intensity: 0.95, color: '#F6D78B' });

    // Pedestal 2: Unexplainable Phenomenon
    this.drawMuseumPedestal(ctx, 470, 140, '✨', '#E98FAF', frame);
    lights.push({ x: 500, y: 155, radius: 60, intensity: 0.95, color: '#E98FAF' });

    // Velvet Stanchion Ropes
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(340, 175, 4, 18);
    ctx.fillRect(420, 175, 4, 18);
    ctx.fillStyle = '#B13434'; // Velvet rope
    ctx.fillRect(342, 180, 80, 3);

    // Ceiling Spotlight Cones (subtle translucent light beams)
    ctx.fillStyle = 'rgba(246, 215, 139, 0.06)';
    ctx.beginPath();
    ctx.moveTo(125, 0);
    ctx.lineTo(90, 95);
    ctx.lineTo(160, 95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(245, 0);
    ctx.lineTo(210, 95);
    ctx.lineTo(280, 95);
    ctx.closePath();
    ctx.fill();

    return lights;
  }

  /**
   * 4. COURTROOM INTERIOR
   */
  public static renderCourtroomInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _frame: number,
    verdictReached: boolean
  ): LightSource[] {
    const lights: LightSource[] = [];

    // Dark Walnut Wood Floor
    ctx.fillStyle = '#1E140E';
    ctx.fillRect(0, 0, width, height);

    // Back Wall - Mahogany Paneling
    ctx.fillStyle = '#30180F';
    ctx.fillRect(0, 0, width, 70);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(0, 68, width, 2); // Brass rail

    // Balance Scales of Justice Bronze Relief on Wall
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(270, 15, 4, 30); // Central pillar
    ctx.fillRect(250, 20, 44, 3); // Crossbeam
    // Left & Right pans
    ctx.fillRect(250, 23, 1, 12);
    ctx.fillRect(244, 35, 14, 3);
    ctx.fillRect(293, 23, 1, 12);
    ctx.fillRect(287, 35, 14, 3);

    // Elevated Judge's Dais
    ctx.fillStyle = '#3E2014';
    ctx.fillRect(180, 75, 180, 55);
    ctx.fillStyle = '#5A321E';
    ctx.fillRect(182, 77, 176, 12);
    // Sounding block and gavel
    ctx.fillStyle = '#26140D';
    ctx.fillRect(240, 83, 16, 6);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(244, 80, 8, 4);

    // Prosecution & Defense Tables
    const drawTable = (tx: number, ty: number, label: string) => {
      ctx.fillStyle = '#3E2014';
      ctx.fillRect(tx, ty, 110, 42);
      ctx.fillStyle = '#2A4736'; // Green leather desk mat
      ctx.fillRect(tx + 8, ty + 6, 94, 28);
      ctx.fillStyle = '#F4EBDD';
      ctx.fillRect(tx + 20, ty + 12, 14, 10); // Legal documents
      ctx.fillStyle = '#F6D78B';
      ctx.font = '8px monospace';
      ctx.fillText(label, tx + 16, ty + 38);
    };

    drawTable(75, 220, 'PROSECUTION');
    drawTable(345, 220, 'DEFENSE');

    // Brass Witness Stand Railing
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(240, 210, 60, 4);
    ctx.fillRect(240, 210, 4, 28);
    ctx.fillRect(296, 210, 4, 28);

    // Verdict Banner on Wall if reached
    if (verdictReached) {
      ctx.fillStyle = '#B13434';
      ctx.fillRect(170, 5, 200, 14);
      ctx.fillStyle = '#F4EBDD';
      ctx.font = '9px monospace';
      ctx.fillText('★ VERDICT: ACQUITTED OF ALL FLAWS ★', 178, 15);
      lights.push({ x: 270, y: 15, radius: 70, intensity: 1.0, color: '#E98FAF' });
    }

    lights.push({ x: 270, y: 90, radius: 75, intensity: 0.95, color: '#F6D78B' }); // Judge light
    lights.push({ x: 130, y: 235, radius: 50, intensity: 0.8, color: '#F4EBDD' });
    lights.push({ x: 400, y: 235, radius: 50, intensity: 0.8, color: '#F4EBDD' });

    return lights;
  }

  /**
   * 5. ARCHIVE INTERIOR (MYSTICAL VAULT)
   */
  public static renderArchiveInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // Dark Flagstone Masonry Floor
    ctx.fillStyle = '#1A1C2C';
    ctx.fillRect(0, 0, width, height);

    // Stone flagstone grid
    ctx.strokeStyle = '#282C44';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 45);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 45; y < height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Towering 12-foot Antique Bookshelves
    const drawBookshelf = (bx: number, by: number, bw: number, bh: number) => {
      ctx.fillStyle = '#352119';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#4D3025';
      ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);
      // Shelves with books
      for (let s = by + 8; s < by + bh - 6; s += 12) {
        ctx.fillStyle = '#221510';
        ctx.fillRect(bx + 4, s, bw - 8, 2);
        // Colored book spines
        const bookColors = ['#B13434', '#3E5D43', '#30385F', '#9588BD', '#F6D78B'];
        let curX = bx + 6;
        let cIdx = 0;
        while (curX < bx + bw - 10) {
          ctx.fillStyle = bookColors[cIdx % bookColors.length];
          ctx.fillRect(curX, s - 9, 3, 9);
          curX += 4;
          cIdx++;
        }
      }
    };

    drawBookshelf(35, 55, 140, 52);
    drawBookshelf(205, 55, 140, 52);
    drawBookshelf(375, 55, 140, 52);

    // Central Reading Study Table
    ctx.fillStyle = '#4D3025';
    ctx.fillRect(215, 230, 120, 40);
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(235, 238, 24, 16); // Open ancient manuscript
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(295, 236, 6, 12); // Brass oil lantern
    lights.push({ x: 298, y: 240, radius: 55, intensity: 0.9, color: '#F6D78B' });

    // Floating Magical Memory Crystals
    const crystalProps = [
      { x: 110, y: 165, color: '#9588BD', label: '01. CHAT' },
      { x: 270, y: 155, color: '#E98FAF', label: '02. LAUGH' },
      { x: 430, y: 165, color: '#F6D78B', label: '03. DOSSIER' },
    ];

    crystalProps.forEach((c, idx) => {
      const hoverY = c.y + Math.sin(frame * 0.08 + idx * 2) * 5;
      // Shadow beneath
      ctx.fillStyle = 'rgba(16, 19, 41, 0.4)';
      ctx.beginPath();
      ctx.ellipse(c.x + 8, c.y + 24, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Diamond Crystal
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.moveTo(c.x + 8, hoverY);
      ctx.lineTo(c.x + 16, hoverY + 12);
      ctx.lineTo(c.x + 8, hoverY + 24);
      ctx.lineTo(c.x, hoverY + 12);
      ctx.closePath();
      ctx.fill();

      // Internal sparkle highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(c.x + 6, hoverY + 8, 3, 3);

      lights.push({ x: c.x + 8, y: hoverY + 12, radius: 48, intensity: 0.85, color: c.color });
    });

    return lights;
  }

  /**
   * 6. OBSERVATORY INTERIOR (HILLTOP CELESTIAL ROTUNDA)
   */
  public static renderObservatoryInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number,
    namedConstellation: string | null
  ): LightSource[] {
    const lights: LightSource[] = [];

    // Circular Stone Dome Floor
    ctx.fillStyle = '#16192E';
    ctx.fillRect(0, 0, width, height);

    // Inlaid Brass Celestial Astrolabe Ring
    ctx.strokeStyle = '#3E466E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 10, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#F6D78B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 10, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Open Celestial Skylight at Top Wall
    ctx.fillStyle = '#0D0E1C';
    ctx.fillRect(150, 0, 200, 48);
    // Real-time twinkling stars inside the skylight
    for (let s = 0; s < 16; s++) {
      const sx = 160 + (s * 23) % 180;
      const sy = 8 + (s * 17) % 36;
      const twinkle = Math.sin(frame * 0.1 + s) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(246, 215, 139, ${twinkle})`;
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Giant Antique Brass Telescope on Cast-Iron Tripod
    const tx = 175;
    const ty = 115;
    // Tripod legs
    ctx.fillStyle = '#262938';
    ctx.fillRect(tx + 6, ty + 24, 4, 28);
    ctx.fillRect(tx + 28, ty + 24, 4, 28);
    ctx.fillRect(tx + 18, ty + 20, 4, 32);
    // Brass Telescope Barrel pointing up-right at skylight
    ctx.save();
    ctx.translate(tx + 20, ty + 15);
    ctx.rotate(-0.4);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(-8, -6, 44, 12);
    ctx.fillStyle = '#F4EBDD'; // Lens ring
    ctx.fillRect(34, -8, 4, 16);
    ctx.fillStyle = '#3E2417'; // Brass gear wheel
    ctx.fillRect(8, -10, 8, 20);
    ctx.restore();
    lights.push({ x: tx + 36, y: ty + 4, radius: 60, intensity: 0.95, color: '#F6D78B' });

    // Constellation Altar Table
    const ax = 275;
    const ay = 120;
    ctx.fillStyle = '#2E3554';
    ctx.fillRect(ax, ay, 46, 42);
    ctx.fillStyle = '#3E466E';
    ctx.fillRect(ax + 2, ay + 2, 42, 10);
    // Glowing Starlit Globe
    ctx.fillStyle = '#C3A9E8';
    ctx.beginPath();
    ctx.arc(ax + 23, ay - 2, 9, 0, Math.PI * 2);
    ctx.fill();
    lights.push({ x: ax + 23, y: ay - 2, radius: 55, intensity: 0.95, color: '#C3A9E8' });

    // Constellation Banner on Wall if named
    if (namedConstellation) {
      ctx.fillStyle = '#F6D78B';
      ctx.font = '9px monospace';
      ctx.fillText(`★ CONSTELLATION: "${namedConstellation.toUpperCase()}" ★`, 150, 62);
    }

    return lights;
  }

  /**
   * 7. SECRET GARDEN INTERIOR (THE SANCTUARY)
   */
  public static renderGardenInterior(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // Mystical deep indigo/emerald meadow grass
    ctx.fillStyle = '#14222E';
    ctx.fillRect(0, 0, width, height);

    // Glowing flower carpets
    for (let x = 20; x < width - 20; x += 30) {
      for (let y = 50; y < height - 30; y += 35) {
        if ((x + y) % 70 === 0) {
          ctx.fillStyle = '#284E46';
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Moonlit Reflecting Pond (West)
    const pw = 140;
    const ph = 90;
    const px = 75;
    const py = 175;
    ctx.fillStyle = '#0F2633';
    ctx.beginPath();
    ctx.ellipse(px + pw / 2, py + ph / 2, pw / 2, ph / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated water shimmer
    ctx.fillStyle = 'rgba(233, 143, 175, 0.25)';
    const wave = Math.sin(frame * 0.05) * 8;
    ctx.fillRect(px + 30 + wave, py + 35, 40, 2);
    ctx.fillRect(px + 50 - wave, py + 55, 30, 2);

    // Ancient Giant Weeping Willow Tree (North-East)
    this.drawDetailedTree(ctx, 360, 45, 'willow', frame);
    lights.push({ x: 410, y: 110, radius: 85, intensity: 0.95, color: '#E98FAF' });

    // Handcrafted Wooden Park Bench beneath the willow tree
    const bx = 365;
    const by = 140;
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(bx, by, 60, 10); // Bench back
    ctx.fillRect(bx, by + 12, 60, 12); // Bench seat
    // Cast iron ornate legs
    ctx.fillStyle = '#1D120E';
    ctx.fillRect(bx + 4, by + 12, 4, 18);
    ctx.fillRect(bx + 52, by + 12, 4, 18);
    // Carved Heart with Initials "T + B" on bench back!
    ctx.fillStyle = '#F6D78B';
    ctx.font = '7px monospace';
    ctx.fillText('♡ T+B ♡', bx + 16, by + 8);
    lights.push({ x: bx + 30, y: by + 10, radius: 65, intensity: 0.9, color: '#F6D78B' });

    // Luminescent Blossoms everywhere
    for (let f = 0; f < 14; f++) {
      const flx = 50 + (f * 43) % 450;
      const fly = 80 + (f * 51) % 320;
      if (flx > 70 && flx < 220 && fly > 160 && fly < 270) continue; // pond avoidance
      this.drawLuminescentFlower(ctx, flx, fly, frame + f * 12);
      lights.push({ x: flx + 4, y: fly + 4, radius: 24, intensity: 0.65, color: '#E98FAF' });
    }

    // Bioluminescent floating spores / fireflies
    for (let s = 0; s < 10; s++) {
      const spX = 60 + Math.sin(frame * 0.02 + s * 1.8) * 120 + s * 45;
      const spY = 100 + Math.cos(frame * 0.03 + s * 2.3) * 80 + (s % 4) * 60;
      const sporePulse = Math.sin(frame * 0.08 + s) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(233, 143, 175, ${sporePulse})`;
      ctx.fillRect(Math.floor(spX), Math.floor(spY), 2, 2);
      lights.push({ x: Math.floor(spX), y: Math.floor(spY), radius: 18 * sporePulse, intensity: 0.5 * sporePulse, color: '#E98FAF' });
    }

    return lights;
  }

  /**
   * 8. DYNAMIC NIGHT LIGHTING PASS (2D SHADOW MASK)
   */
  public static renderLightingPass(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    lights: LightSource[],
    playerPos: { x: number; y: number },
    roomTheme: string
  ): void {
    // We create a temporary darkness canvas and cut out light radial gradients
    ctx.save();

    // Dark ambient overlay (higher in mystery rooms and night valley)
    const darknessAlpha = roomTheme === 'valley' ? 0.48 : roomTheme === 'garden' ? 0.38 : 0.32;
    ctx.fillStyle = `rgba(16, 19, 41, ${darknessAlpha})`;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Player Explorer Lantern light (Always moves with Beenish!)
    lights.push({
      x: Math.floor(playerPos.x + 12),
      y: Math.floor(playerPos.y + 16),
      radius: 68,
      intensity: 0.85,
      color: '#F6D78B',
    });

    // Draw glowing light halos
    ctx.globalCompositeOperation = 'lighter';

    lights.forEach(light => {
      const grad = ctx.createRadialGradient(
        light.x,
        light.y,
        0,
        light.x,
        light.y,
        light.radius
      );
      const c = light.color || '#F6D78B';
      grad.addColorStop(0, `${c}44`);
      grad.addColorStop(0.5, `${c}18`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // ==========================================
  // DETAILED COMPONENT RENDERERS
  // ==========================================

  private static drawBureauBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Stone base foundation
    ctx.fillStyle = '#262D48';
    ctx.fillRect(x, y + 45, 140, 30);
    // Dark timber wall
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 4, y + 10, 132, 45);
    ctx.fillStyle = '#5A3828';
    // Timber frame uprights
    ctx.fillRect(x + 4, y + 10, 6, 45);
    ctx.fillRect(x + 44, y + 10, 6, 45);
    ctx.fillRect(x + 90, y + 10, 6, 45);
    ctx.fillRect(x + 130, y + 10, 6, 45);

    // Terracotta / Slate roof with 3D overhang
    ctx.fillStyle = '#B13434';
    ctx.fillRect(x - 4, y - 6, 148, 18);
    ctx.fillStyle = '#8E2828';
    ctx.fillRect(x - 6, y + 8, 152, 4);

    // Chimney with rising smoke puffs
    ctx.fillStyle = '#5A2626';
    ctx.fillRect(x + 110, y - 24, 16, 22);
    ctx.fillStyle = '#3E1818';
    ctx.fillRect(x + 108, y - 26, 20, 4);
    // Animated smoke puffs
    for (let s = 0; s < 3; s++) {
      const smY = y - 32 - s * 10 - ((frame * 0.1) % 12);
      const smX = x + 116 + Math.sin(frame * 0.08 + s) * 4;
      ctx.fillStyle = `rgba(244, 235, 221, ${0.4 - s * 0.12})`;
      ctx.beginPath();
      ctx.arc(smX, smY, 4 + s * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warm Bay Window
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 18, y + 20, 22, 22);
    ctx.fillStyle = '#F3B79C';
    ctx.fillRect(x + 22, y + 22, 14, 18);
    // Window mullions
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 28, y + 20, 2, 22);
    ctx.fillRect(x + 18, y + 30, 22, 2);

    // Heavy Oak Entrance Door
    ctx.fillStyle = '#26140D';
    ctx.fillRect(x + 60, y + 36, 28, 38);
    ctx.fillStyle = '#3E2014';
    ctx.fillRect(x + 62, y + 38, 24, 34);
    // Brass doorknob
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 80, y + 54, 3, 3);

    // Hanging Wooden Tavern Sign
    ctx.fillStyle = '#30385F';
    ctx.fillRect(x + 94, y + 16, 2, 8);
    ctx.fillRect(x + 120, y + 16, 2, 8);
    ctx.fillStyle = '#F3B79C';
    ctx.fillRect(x + 92, y + 22, 32, 14);
    ctx.fillStyle = '#101329';
    ctx.font = '6px monospace';
    ctx.fillText('BUREAU', x + 96, y + 31);
  }

  private static drawMuseumBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number): void {
    // Marble foundation & steps
    ctx.fillStyle = '#484F6E';
    ctx.fillRect(x, y + 68, 170, 16);
    ctx.fillStyle = '#626A8F';
    ctx.fillRect(x + 10, y + 74, 150, 4);
    ctx.fillRect(x + 20, y + 78, 130, 4);

    // Red Carpet down the steps
    ctx.fillStyle = '#B13434';
    ctx.fillRect(x + 72, y + 52, 26, 30);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 72, y + 52, 2, 30);
    ctx.fillRect(x + 96, y + 52, 2, 30);

    // Museum Wall
    ctx.fillStyle = '#202438';
    ctx.fillRect(x + 10, y + 14, 150, 58);

    // 4 Classical Greek Marble Pillars (Columns)
    const colX = [x + 16, x + 52, x + 102, x + 138];
    colX.forEach(cx => {
      ctx.fillStyle = '#C3A9E8';
      ctx.fillRect(cx - 2, y + 14, 14, 56);
      ctx.fillStyle = '#F4EBDD';
      ctx.fillRect(cx, y + 16, 10, 52); // Column highlight
      ctx.fillStyle = '#9588BD';
      ctx.fillRect(cx - 4, y + 14, 18, 4); // Capital
      ctx.fillRect(cx - 4, y + 66, 18, 4); // Base
    });

    // Grand Classical Triangular Pediment
    ctx.fillStyle = '#353A52';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 14);
    ctx.lineTo(x + 85, y - 16);
    ctx.lineTo(x + 174, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#484F6E';
    ctx.fillRect(x - 8, y + 12, 186, 5);

    // Gold Star Medallion in Pediment Frieze
    ctx.fillStyle = '#F6D78B';
    ctx.beginPath();
    ctx.arc(x + 85, y + 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Arched Double Mahogany Entry Door
    ctx.fillStyle = '#1A100B';
    ctx.fillRect(x + 72, y + 36, 26, 34);
    ctx.fillStyle = '#3E2014';
    ctx.fillRect(x + 74, y + 38, 10, 30);
    ctx.fillRect(x + 86, y + 38, 10, 30);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 82, y + 52, 2, 5);
    ctx.fillRect(x + 86, y + 52, 2, 5);
  }

  private static drawCourtBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number): void {
    // Classical Courthouse Wall
    ctx.fillStyle = '#262A40';
    ctx.fillRect(x, y + 10, 140, 68);

    // Marble Triangular Pediment
    ctx.fillStyle = '#3E4466';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 10);
    ctx.lineTo(x + 70, y - 14);
    ctx.lineTo(x + 144, y + 10);
    ctx.closePath();
    ctx.fill();

    // Golden Scale of Justice Emblem on Facade
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 68, y - 4, 4, 12);
    ctx.fillRect(x + 58, y - 2, 24, 2);
    ctx.fillRect(x + 58, y, 1, 6);
    ctx.fillRect(x + 81, y, 1, 6);

    // Stately Pillars
    ctx.fillStyle = '#626A8F';
    ctx.fillRect(x + 10, y + 12, 12, 60);
    ctx.fillRect(x + 118, y + 12, 12, 60);
    ctx.fillStyle = '#8994C4';
    ctx.fillRect(x + 12, y + 14, 8, 56);
    ctx.fillRect(x + 120, y + 14, 8, 56);

    // Double Bronze Doors
    ctx.fillStyle = '#1A1C2C';
    ctx.fillRect(x + 52, y + 38, 36, 38);
    ctx.fillStyle = '#353A52';
    ctx.fillRect(x + 54, y + 40, 15, 34);
    ctx.fillRect(x + 71, y + 40, 15, 34);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + 67, y + 56, 2, 4);
    ctx.fillRect(x + 71, y + 56, 2, 4);
  }

  private static drawArchiveBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number): void {
    // Ancient Weathered Stone Tower Library
    ctx.fillStyle = '#24283D';
    ctx.fillRect(x, y + 10, 120, 75);
    // Stone brick courses
    ctx.fillStyle = '#353A52';
    for (let r = 0; r < 6; r++) {
      ctx.fillRect(x + 6 + (r % 2) * 12, y + 18 + r * 10, 18, 5);
      ctx.fillRect(x + 70 + (r % 2) * 14, y + 18 + r * 10, 22, 5);
    }

    // Climbing Ivy Vines
    ctx.fillStyle = '#264B44';
    ctx.fillRect(x + 2, y + 30, 8, 45);
    ctx.fillRect(x + 8, y + 45, 6, 25);
    ctx.fillStyle = '#3D7268';
    ctx.fillRect(x + 4, y + 35, 3, 3);
    ctx.fillRect(x + 6, y + 55, 3, 3);

    // Gothic Arched Stained Glass Window with Candlelight Glow
    ctx.fillStyle = '#F6D78B';
    ctx.beginPath();
    ctx.arc(x + 60, y + 30, 14, Math.PI, 0);
    ctx.lineTo(x + 74, y + 52);
    ctx.lineTo(x + 46, y + 52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#9588BD'; // Stained glass tracery
    ctx.fillRect(x + 59, y + 18, 2, 34);
    ctx.fillRect(x + 46, y + 34, 28, 2);

    // Arched Wood Entrance
    ctx.fillStyle = '#101329';
    ctx.fillRect(x + 48, y + 58, 24, 27);
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 50, y + 60, 20, 24);
  }

  private static drawGardenGate(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    _frame: number,
    isUnlocked: boolean
  ): void {
    // Stone Pillars
    ctx.fillStyle = '#282C44';
    ctx.fillRect(x, y, 18, 65);
    ctx.fillRect(x + 92, y, 18, 65);
    ctx.fillStyle = '#3E466E';
    ctx.fillRect(x - 2, y - 4, 22, 8);
    ctx.fillRect(x + 90, y - 4, 22, 8);

    // Heavy Wrought-Iron Arch
    ctx.strokeStyle = '#202438';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x + 55, y + 15, 45, Math.PI, 0);
    ctx.stroke();

    // Climbing Rose Brambles wrapping around arch
    ctx.fillStyle = '#264B44';
    ctx.fillRect(x + 6, y + 10, 8, 50);
    ctx.fillRect(x + 96, y + 10, 8, 50);
    ctx.fillStyle = '#E98FAF';
    ctx.fillRect(x + 8, y + 20, 5, 5);
    ctx.fillRect(x + 98, y + 30, 5, 5);

    if (isUnlocked) {
      // Gate swung wide open! Rose blossoms & golden light spilling out
      ctx.fillStyle = 'rgba(233, 143, 175, 0.2)';
      ctx.fillRect(x + 18, y + 15, 74, 50);
      ctx.fillStyle = '#E98FAF';
      ctx.font = '7px monospace';
      ctx.fillText('OPEN 🌹', x + 38, y + 45);
    } else {
      // Locked iron gate with heavy chains
      ctx.fillStyle = '#1A1C2C';
      ctx.fillRect(x + 18, y + 15, 74, 50);
      ctx.strokeStyle = '#353A52';
      ctx.lineWidth = 2;
      for (let bar = x + 24; bar < x + 90; bar += 8) {
        ctx.beginPath();
        ctx.moveTo(bar, y + 15);
        ctx.lineTo(bar, y + 65);
        ctx.stroke();
      }
      // Big Golden Padlock
      ctx.fillStyle = '#F6D78B';
      ctx.fillRect(x + 50, y + 38, 10, 8);
      ctx.strokeStyle = '#F4EBDD';
      ctx.strokeRect(x + 52, y + 34, 6, 6);
    }
  }

  private static drawObservatoryMountainTrail(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    _frame: number
  ): void {
    // Winding stone stairs ascending mountain cliff
    ctx.fillStyle = '#282C44';
    ctx.fillRect(x - 20, y, 120, 48);

    for (let st = 0; st < 5; st++) {
      ctx.fillStyle = '#3E466E';
      ctx.fillRect(x + 10, y + 8 + st * 7, 44, 4);
      ctx.fillStyle = '#5A6598';
      ctx.fillRect(x + 10, y + 8 + st * 7, 44, 1);
    }

    // Mountain Cliff Rocks
    ctx.fillStyle = '#1E2235';
    ctx.beginPath();
    ctx.moveTo(x - 30, y);
    ctx.lineTo(x - 10, y + 45);
    ctx.lineTo(x - 45, y + 45);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 75, y);
    ctx.lineTo(x + 95, y + 45);
    ctx.lineTo(x + 60, y + 45);
    ctx.closePath();
    ctx.fill();

    // Observatory Signpost at base of trail
    ctx.fillStyle = '#F6D78B';
    ctx.font = '7px monospace';
    ctx.fillText('↑ OBSERVATORY', x + 5, y + 44);
  }

  private static drawVictorianLampPost(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Cast-iron pole
    ctx.fillStyle = '#1D2133';
    ctx.fillRect(x, y - 12, 3, 24);
    ctx.fillRect(x - 2, y + 10, 7, 3); // Base flange
    // Crossbar
    ctx.fillRect(x - 3, y - 6, 9, 2);

    // Glass Lantern Housing
    ctx.fillStyle = '#2B314C';
    ctx.fillRect(x - 3, y - 18, 9, 7);
    ctx.fillStyle = '#F6D78B';
    // Flickering Flame inside
    const flicker = Math.sin(frame * 0.15) * 1;
    ctx.fillRect(x - 1, y - 16 + Math.floor(flicker), 5, 4);
    // Roof cap
    ctx.fillStyle = '#1D2133';
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 22);
    ctx.lineTo(x + 6, y - 18);
    ctx.lineTo(x - 4, y - 18);
    ctx.closePath();
    ctx.fill();
  }

  private static drawDetailedTree(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: 'oak' | 'pine' | 'willow',
    frame: number
  ): void {
    const sway = Math.sin(frame * 0.04 + x * 0.01) * 3;

    if (type === 'oak') {
      // Trunk
      ctx.fillStyle = '#3E2417';
      ctx.fillRect(x + 16, y + 30, 10, 24);
      ctx.fillStyle = '#26140D';
      ctx.fillRect(x + 14, y + 48, 14, 6); // Roots

      // Volumetric Canopy
      ctx.fillStyle = '#172E2B';
      ctx.beginPath();
      ctx.ellipse(x + 21 + sway, y + 20, 24, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#264B44';
      ctx.beginPath();
      ctx.ellipse(x + 18 + sway, y + 16, 20, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3D7268';
      ctx.beginPath();
      ctx.ellipse(x + 14 + sway, y + 12, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'willow') {
      // Gnarled Willow Trunk
      ctx.fillStyle = '#2A1B14';
      ctx.fillRect(x + 22, y + 28, 14, 28);

      // Cascading weeping branches
      ctx.fillStyle = '#1B3833';
      ctx.beginPath();
      ctx.ellipse(x + 29 + sway, y + 18, 30, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Drooping tendrils swaying
      ctx.fillStyle = '#2D5850';
      for (let t = 0; t < 6; t++) {
        const tx = x + 8 + t * 9;
        const ty = y + 26;
        ctx.fillRect(Math.floor(tx + sway * 1.5), ty, 3, 20 + (t % 3) * 6);
      }
    } else {
      // Pine Tree
      ctx.fillStyle = '#3E2417';
      ctx.fillRect(x + 18, y + 42, 6, 14);

      // Tiered Needles
      ctx.fillStyle = '#172E2B';
      for (let tier = 0; tier < 3; tier++) {
        const tw = 28 - tier * 6;
        const ty = y + 36 - tier * 12;
        ctx.beginPath();
        ctx.moveTo(x + 21 + sway * (tier + 1) * 0.4, ty - 14);
        ctx.lineTo(x + 21 + tw, ty);
        ctx.lineTo(x + 21 - tw, ty);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  private static drawLuminescentFlower(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7;
    // Stem
    ctx.fillStyle = '#264B44';
    ctx.fillRect(x + 2, y + 4, 2, 6);
    // Petals
    ctx.fillStyle = `rgba(233, 143, 175, ${pulse})`;
    ctx.fillRect(x, y + 2, 2, 2);
    ctx.fillRect(x + 4, y + 2, 2, 2);
    ctx.fillRect(x + 2, y, 2, 2);
    ctx.fillRect(x + 2, y + 4, 2, 2);
    // Center glow
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 2, y + 2, 2, 2);
  }

  private static drawGildedFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    portraitTone: string
  ): void {
    // Gilded Frame
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#C7A24B';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    // Velvet Mat
    ctx.fillStyle = '#1D1322';
    ctx.fillRect(x + 6, y + 6, w - 12, h - 12);
    // Portrait Silhouette
    ctx.fillStyle = portraitTone;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 - 2, 9, 0, Math.PI * 2);
    ctx.fill();
    // Shoulder silhouette
    ctx.fillRect(x + w / 2 - 10, y + h / 2 + 6, 20, 6);

    // Brass Plaque below
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(x + w / 2 - 18, y + h + 2, 36, 6);
    ctx.fillStyle = '#101329';
    ctx.font = '5px monospace';
    ctx.fillText(label, x + w / 2 - 15, y + h + 7);
  }

  private static drawMuseumPedestal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    icon: string,
    glowColor: string,
    frame: number
  ): void {
    // Marble Block
    ctx.fillStyle = '#484F6E';
    ctx.fillRect(x, y + 16, 50, 28);
    ctx.fillStyle = '#626A8F';
    ctx.fillRect(x + 2, y + 18, 46, 6);
    // Glass Vitrine Dome
    ctx.strokeStyle = 'rgba(244, 235, 221, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 6, y - 10, 38, 26);

    // Floating Artifact Inside with sine hover
    const hover = Math.sin(frame * 0.08) * 3;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon, x + 25, y + 6 + hover);
    ctx.textAlign = 'start';

    // Brass Plaque
    ctx.fillStyle = glowColor;
    ctx.fillRect(x + 10, y + 28, 30, 8);
  }
}
