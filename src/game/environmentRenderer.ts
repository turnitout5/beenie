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

    // --- 1. NORTHERN ALPINE MOUNTAIN RIDGELINE & ENCHANTED PINE ENCLOSURE ---
    // Deep starry dusk sky gradient behind the valley mountains (y: -220..70)
    const northSky = ctx.createLinearGradient(0, -220, 0, 70);
    northSky.addColorStop(0, '#060B18');
    northSky.addColorStop(0.5, '#0E172F');
    northSky.addColorStop(0.85, '#182746');
    northSky.addColorStop(1, '#1D3B35');
    ctx.fillStyle = northSky;
    ctx.fillRect(-600, -220, width + 1200, 290);

    // Alpine Twinkling Stars in North Horizon
    ctx.fillStyle = '#FFFFFF';
    for (let s = 0; s < 32; s++) {
      const sx = ((s * 47) % (width + 400)) - 200;
      const sy = -190 + ((s * 23) % 130);
      const starGlow = Math.sin(frame * 0.08 + s * 1.7) * 0.4 + 0.6;
      if (starGlow > 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${starGlow * 0.8})`;
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // Distant Majestic Karakoram & Margalla Mountain Peaks (Layer 1)
    ctx.fillStyle = '#111A31';
    ctx.beginPath();
    ctx.moveTo(-100, 50);
    ctx.lineTo(40, -90);
    ctx.lineTo(180, -20);
    ctx.lineTo(320, -110);
    ctx.lineTo(460, -35);
    ctx.lineTo(600, -115);
    ctx.lineTo(760, -15);
    ctx.lineTo(920, -110);
    ctx.lineTo(1080, -30);
    ctx.lineTo(1240, -115);
    ctx.lineTo(1400, -20);
    ctx.lineTo(1560, -90);
    ctx.lineTo(1720, 50);
    ctx.lineTo(-100, 50);
    ctx.fill();

    // Snow-dusted glacial crests on distant peaks
    ctx.fillStyle = 'rgba(241, 245, 249, 0.42)';
    const snowPeaks = [40, 320, 600, 920, 1240, 1560];
    snowPeaks.forEach(pk => {
      ctx.beginPath();
      ctx.moveTo(pk, -110);
      ctx.lineTo(pk - 20, -80);
      ctx.lineTo(pk + 20, -80);
      ctx.fill();
    });

    // Floating mountain valley mist
    ctx.fillStyle = 'rgba(165, 180, 252, 0.12)';
    ctx.fillRect(-200, -45, width + 400, 24);
    ctx.fillRect(-150, -25, width + 300, 18);

    // Closer Forest Ridge & Layered Pine Canopy Silhouette (Layer 2)
    ctx.fillStyle = '#0D211C';
    ctx.beginPath();
    ctx.moveTo(-100, 60);
    ctx.lineTo(80, -25);
    ctx.lineTo(240, 10);
    ctx.lineTo(420, -30);
    ctx.lineTo(560, 5);
    ctx.lineTo(740, -25);
    ctx.lineTo(920, 10);
    ctx.lineTo(1100, -30);
    ctx.lineTo(1280, 5);
    ctx.lineTo(1460, -25);
    ctx.lineTo(1700, 60);
    ctx.lineTo(-100, 60);
    ctx.fill();

    // Dense Alpine Pine Tree Silhouettes along the North Valley Perimeter
    for (let px = -60; px < width + 80; px += 26) {
      const pBaseY = 32 + Math.sin(px * 0.04) * 12;
      // Skip doorway clearings for the 3 northern estates (Islamabad, Observatory, Castle)
      if ((px > 80 && px < 180) || (px > 730 && px < 870) || (px > 1360 && px < 1490)) continue;
      // Dark pine trunk
      ctx.fillStyle = '#091512';
      ctx.fillRect(px + 4, pBaseY - 22, 4, 22);
      // Layered pine needles
      ctx.fillStyle = '#14352D';
      ctx.beginPath();
      ctx.moveTo(px + 6, pBaseY - 48);
      ctx.lineTo(px - 10, pBaseY - 20);
      ctx.lineTo(px + 22, pBaseY - 20);
      ctx.fill();
      ctx.fillStyle = '#194239';
      ctx.beginPath();
      ctx.moveTo(px + 6, pBaseY - 38);
      ctx.lineTo(px - 8, pBaseY - 14);
      ctx.lineTo(px + 20, pBaseY - 14);
      ctx.fill();
    }

    // --- BASE GRASS MATERIAL ---
    // Warm fairytale dusk meadow - lush teal-emerald and warm jade base (vibrant, not gloomy!)
    ctx.fillStyle = '#1D3B35';
    ctx.fillRect(-600, 25, width + 1200, height + 600);

    // Subtle dithered clover and moss texture patches across wide area
    ctx.fillStyle = '#264D43';
    for (let x = -400; x < width + 400; x += 16) {
      for (let y = 20; y < height + 400; y += 16) {
        if ((x + y) % 32 === 0) {
          ctx.fillRect(x + 2, y + 4, 3, 2);
          ctx.fillRect(x + 8, y + 10, 2, 3);
        }
      }
    }

    // Tufts of emerald grass blades with warm golden-green tips
    ctx.fillStyle = '#396D5B';
    for (let i = 0; i < 180; i++) {
      const gx = Math.floor(this.seededRandom(i * 17) * (width - 40)) + 20;
      const gy = Math.floor(this.seededRandom(i * 31) * (height - 80)) + 60;
      // Skip over main road intersections (Vertical: 745..855, Horizontal: 545..645)
      if ((gx > 745 && gx < 855) || (gy > 545 && gy < 645)) continue;
      ctx.fillRect(gx, gy, 1, 4);
      ctx.fillRect(gx + 1, gy + 1, 1, 3);
      ctx.fillRect(gx - 1, gy + 2, 1, 2);
    }

    // --- COBBLESTONE ROAD MATERIAL WITH ORGANIC DITHERED GRAVEL BORDERS ---
    const drawStoneRoad = (rx: number, ry: number, rw: number, rh: number, isVert: boolean) => {
      // 1. Organic dithered earth/gravel border fringe
      ctx.fillStyle = '#28322B';
      if (isVert) {
        for (let dy = ry - 4; dy < ry + rh + 4; dy += 6) {
          if ((dy + rx) % 12 === 0) {
            ctx.fillRect(rx - 4, dy, 3, 3);
            ctx.fillRect(rx + rw + 1, dy, 3, 3);
          }
        }
      } else {
        for (let dx = rx - 4; dx < rx + rw + 4; dx += 6) {
          if ((dx + ry) % 12 === 0) {
            ctx.fillRect(dx, ry - 4, 3, 3);
            ctx.fillRect(dx, ry + rh + 1, 3, 3);
          }
        }
      }

      // Base gravel underlay (warm twilight slate)
      ctx.fillStyle = '#343B59';
      ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);

      // Cobblestone surface
      ctx.fillStyle = '#444D73';
      ctx.fillRect(rx, ry, rw, rh);

      // Edge curb lines
      ctx.fillStyle = '#6572A3';
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
          ctx.fillStyle = '#4D5882';
          ctx.fillRect(px, sy, stoneW, stoneH);
          // Highlight edge (top-left) - warm reflective tone
          ctx.fillStyle = '#7482B5';
          ctx.fillRect(px, sy, stoneW, 1);
          ctx.fillRect(px, sy, 1, stoneH);
          // Shadow crevice (bottom-right)
          ctx.fillStyle = '#2A304D';
          ctx.fillRect(px, sy + stoneH - 1, stoneW, 1);
          ctx.fillRect(px + stoneW - 1, sy, 1, stoneH);
        }
      }

      // Creeping wild clover encroaching organically onto stone borders
      ctx.fillStyle = '#396D5B';
      if (isVert) {
        for (let cy = ry + 8; cy < ry + rh - 8; cy += 22) {
          ctx.fillRect(rx, cy, 3, 2);
          ctx.fillRect(rx + rw - 3, cy + 8, 3, 2);
        }
      } else {
        for (let cx = rx + 8; cx < rx + rw - 8; cx += 22) {
          ctx.fillRect(cx, ry, 2, 3);
          ctx.fillRect(cx + 8, ry + rh - 3, 2, 3);
        }
      }
    };

    // 1. Main North-South Grand Avenue (extended through the entire 1200px valley height)
    drawStoneRoad(760, 40, 80, 1120, true);
    // 2. Main East-West Royal Promenade (extended through the entire 1600px valley width)
    drawStoneRoad(0, 560, 1600, 70, false);
    // 3. Central Grand Plaza Stone Courtyard (spacious 280x240 marble courtyard for the Birthday Hearth)
    drawStoneRoad(660, 520, 280, 240, false);
    // 4. Western Bureau Approach Road
    drawStoneRoad(250, 460, 60, 100, true);
    // 5. Eastern Court Approach Road
    drawStoneRoad(1280, 460, 60, 100, true);
    // 6. South-East Archive & Secret Garden Road
    drawStoneRoad(1280, 630, 60, 410, true);
    // 7. North-East Mountain Trail leading to Queen Beenish's Castle
    drawStoneRoad(1380, 10, 70, 140, true);
    // 8. North-West Pine Trail leading to Islamabad 5-Marla Villa
    drawStoneRoad(100, 10, 65, 140, true);

    // --- THEMED SURFACE OVERLAYS FOR THE 5 HIGHWAYS ---
    // 1. West Mafia Stealth Highway (x: 0..120, y: 560..630): Carbon asphalt with yellow dashes
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 560, 120, 70);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 562, 120, 66);
    ctx.fillStyle = '#F59E0B';
    for (let dx = 8; dx < 115; dx += 20) {
      ctx.fillRect(dx, 593, 12, 4); // Road dashed markings
    }

    // 2. East Bakery Pastry Lane (x: 1480..1600, y: 560..630): Pastel pink pavers
    ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
    ctx.fillRect(1480, 560, 120, 70);
    ctx.fillStyle = '#F472B6';
    for (let px = 1490; px < 1590; px += 20) {
      ctx.fillRect(px, 566, 4, 3);
      ctx.fillRect(px + 8, 620, 4, 3);
    }

    // 3. North-West Islamabad Pine Trail (x: 100..165, y: 10..150): Green pine-moss trail
    ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
    ctx.fillRect(100, 10, 65, 140);

    // 4. North-East Mountain Pass (x: 1380..1450, y: 10..150): Slate mountain rock
    ctx.fillStyle = 'rgba(147, 51, 234, 0.15)';
    ctx.fillRect(1380, 10, 70, 140);

    // 5. South Gaon Haveli Trail (x: 760..840, y: 1120..1200): Earthen dirt road
    ctx.fillStyle = '#543F2B';
    ctx.fillRect(760, 1120, 80, 80);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(762, 1122, 76, 78);
    ctx.fillStyle = '#92400E';
    for (let dy = 1126; dy < 1195; dy += 14) {
      ctx.fillRect(775, dy, 5, 9); // Wheel ruts
      ctx.fillRect(815, dy, 5, 9);
    }

    // --- REFLECTIVE WATER POND (SOUTH-WEST) WITH MULTI-DEPTH SHADING ---
    const pondX = 190;
    const pondY = 760;
    const pondW = 240;
    const pondH = 150;

    // Outer shoreline: Organic sand, moss, and river pebbles
    ctx.fillStyle = '#24343B';
    ctx.beginPath();
    ctx.ellipse(pondX + pondW / 2, pondY + pondH / 2, pondW / 2 + 12, pondH / 2 + 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334842';
    ctx.beginPath();
    ctx.ellipse(pondX + pondW / 2, pondY + pondH / 2, pondW / 2 + 7, pondH / 2 + 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smooth river pebble details around shoreline
    const pondPebbles = [
      { x: pondX + 18, y: pondY + 50, w: 5, h: 4 },
      { x: pondX + 32, y: pondY + 115, w: 6, h: 4 },
      { x: pondX + 195, y: pondY + 135, w: 5, h: 4 },
      { x: pondX + 215, y: pondY + 45, w: 6, h: 5 },
      { x: pondX + 110, y: pondY + 140, w: 7, h: 4 },
    ];
    ctx.fillStyle = '#4B5563';
    pondPebbles.forEach(p => {
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#6B7280';
      ctx.fillRect(p.x, p.y, p.w - 1, 1);
      ctx.fillStyle = '#4B5563';
    });

    // Water multi-depth gradient
    const pondGrad = ctx.createRadialGradient(
      pondX + pondW / 2, pondY + pondH / 2 - 15, 18,
      pondX + pondW / 2, pondY + pondH / 2, pondW / 2
    );
    pondGrad.addColorStop(0, '#1E496E');
    pondGrad.addColorStop(0.55, '#132E48');
    pondGrad.addColorStop(1, '#0C1E30');
    ctx.fillStyle = pondGrad;
    ctx.beginPath();
    ctx.ellipse(pondX + pondW / 2, pondY + pondH / 2, pondW / 2, pondH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated water ripples
    ctx.fillStyle = 'rgba(100, 195, 230, 0.45)';
    for (let r = 0; r < 5; r++) {
      const rippleY = pondY + 30 + r * 24 + Math.sin(frame * 0.05 + r) * 3;
      const rippleW = 55 + Math.sin(frame * 0.08 + r * 2) * 15;
      ctx.fillRect(pondX + 45 + r * 22, Math.floor(rippleY), rippleW, 2);
    }

    // Water Lily Pads & Pink Lotus Flowers
    const lilyPads = [
      { x: pondX + 45, y: pondY + 55 },
      { x: pondX + 160, y: pondY + 95 },
      { x: pondX + 105, y: pondY + 110 },
    ];
    lilyPads.forEach((pad, idx) => {
      ctx.fillStyle = '#264B44';
      ctx.beginPath();
      ctx.ellipse(pad.x, pad.y, 10, 6, 0, 0, Math.PI * 1.8);
      ctx.fill();
      ctx.fillStyle = '#396D5B';
      ctx.fillRect(pad.x - 5, pad.y - 1, 10, 1);
      if (idx !== 2) {
        ctx.fillStyle = '#F472B6';
        ctx.fillRect(pad.x - 3, pad.y - 5, 5, 4);
        ctx.fillStyle = '#FDF2F8';
        ctx.fillRect(pad.x - 2, pad.y - 6, 3, 2);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(pad.x - 1, pad.y - 5, 2, 2);
      }
    });

    // Small wooden fishing dock pier
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(pondX + pondW - 32, pondY + 35, 34, 18);
    ctx.fillStyle = '#7C4F38';
    ctx.fillRect(pondX + pondW - 32, pondY + 37, 34, 4);
    ctx.fillRect(pondX + pondW - 32, pondY + 45, 34, 4);
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(pondX + pondW - 4, pondY + 30, 5, 24);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(pondX + pondW - 4, pondY + 30, 5, 3);

    // Romantic Lakeside Bench & Weeping Willow Retreat (Placed on northern grassy bank at y=742)
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(380, 742, 36, 14);
    ctx.fillStyle = '#7C4F38';
    ctx.fillRect(380, 744, 36, 3);
    ctx.fillStyle = '#A78BFA';
    ctx.fillRect(388, 742, 20, 2); // Violet silk cushion

    // --- AMBIENT OCCLUSION GROUND CONTACT SHADOWS ---
    ctx.fillStyle = 'rgba(12, 18, 32, 0.45)';
    // 1. Bureau building contact shadow
    ctx.beginPath();
    ctx.ellipse(285, 475, 85, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // 2. Museum building contact shadow
    ctx.beginPath();
    ctx.ellipse(800, 305, 110, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // 3. Court building contact shadow
    ctx.beginPath();
    ctx.ellipse(1315, 475, 85, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // 4. Archive tower contact shadow
    ctx.beginPath();
    ctx.ellipse(1320, 840, 80, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // 5. Secret Garden Ivy Gate contact shadow
    ctx.beginPath();
    ctx.ellipse(1320, 1065, 70, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // 6. Central Birthday Table contact shadow
    ctx.beginPath();
    ctx.ellipse(800, 655, 45, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ambient drop shadows beneath decorative trees (centered at trunk base x+21, y+50)
    const treeShadows = [
      { x: 181, y: 310, rx: 24, ry: 8 },
      { x: 461, y: 390, rx: 28, ry: 9 },
      { x: 1161, y: 390, rx: 28, ry: 9 },
      { x: 1501, y: 310, rx: 24, ry: 8 },
      { x: 461, y: 930, rx: 28, ry: 9 },
      { x: 1161, y: 930, rx: 28, ry: 9 },
      { x: 1501, y: 970, rx: 24, ry: 8 },
      { x: 258, y: 772, rx: 30, ry: 10 },
    ];
    treeShadows.forEach(ts => {
      ctx.beginPath();
      ctx.ellipse(ts.x, ts.y, ts.rx, ts.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- DECORATIVE TREES & NATURE (SPACED GENEROUSLY) ---
    this.drawDetailedTree(ctx, 160, 260, 'pine', frame);
    this.drawDetailedTree(ctx, 440, 340, 'oak', frame);
    this.drawDetailedTree(ctx, 1140, 340, 'oak', frame);
    this.drawDetailedTree(ctx, 1480, 260, 'pine', frame);
    this.drawDetailedTree(ctx, 440, 880, 'oak', frame);
    this.drawDetailedTree(ctx, 1140, 880, 'oak', frame);
    this.drawDetailedTree(ctx, 1480, 920, 'pine', frame);
    this.drawDetailedTree(ctx, 230, 720, 'willow', frame);

    // --- ARCHITECTURAL EXTERIORS (BUILDINGS & SCENIC PASSES) ---

    // 1. BUREAU OF UNREASONABLE BOYFRIENDS (WEST PRECINCT)
    this.drawBureauBuilding(ctx, 200, 390, frame);
    lights.push({ x: 285, y: 465, radius: 55, intensity: 0.9, color: '#F6D78B' });
    lights.push({ x: 235, y: 440, radius: 60, intensity: 0.9, color: '#F3B79C' });

    // 2. THE MUSEUM OF BEENISH (NORTH-CENTER TERRACE)
    this.drawMuseumBuilding(ctx, 690, 210);
    lights.push({ x: 720, y: 280, radius: 45, intensity: 0.85, color: '#F4EBDD' });
    lights.push({ x: 860, y: 280, radius: 45, intensity: 0.85, color: '#F4EBDD' });
    lights.push({ x: 790, y: 295, radius: 65, intensity: 0.95, color: '#C3A9E8' });

    // 3. COURT OF ABSOLUTELY NO FLAWS (EAST PRECINCT)
    this.drawCourtBuilding(ctx, 1230, 390);
    lights.push({ x: 1310, y: 465, radius: 55, intensity: 0.9, color: '#F6D78B' });

    // 4. ARCHIVE OF THINGS THAT HAPPENED (SOUTHEAST GLADE)
    this.drawArchiveBuilding(ctx, 1240, 750);
    lights.push({ x: 1315, y: 825, radius: 60, intensity: 0.85, color: '#C3A9E8' });

    // 5. SECRET GARDEN IVY GATE (SOUTHEAST BOUNDARY)
    this.drawGardenGate(ctx, 1260, 1040, frame, secretGardenUnlocked);
    if (secretGardenUnlocked) {
      lights.push({ x: 1320, y: 1060, radius: 80, intensity: 1.0, color: '#E98FAF' });
    }

    // 6. HILLTOP OBSERVATORY (NORTH MOUNTAIN CREST)
    this.drawObservatoryMountainTrail(ctx, 750, 0);
    lights.push({ x: 790, y: 35, radius: 60, intensity: 0.9, color: '#F6D78B' });

    // 7. THE 5 PROMINENT DREAM ESTATE PATHWAY PORTALS
    // North-East: Mountain Pass to Queen Beenish's Castle
    this.drawCastlePortal(ctx, 1390, 0, frame);
    lights.push({ x: 1420, y: 20, radius: 60, intensity: 0.95, color: '#F59E0B' });

    // West: Stealth Highway to Dark Brutalist Mafia Home & Batmobile
    this.drawMafiaPortal(ctx, 4, 545, frame);
    lights.push({ x: 32, y: 580, radius: 75, intensity: 1.0, color: '#38BDF8' });

    // North-West: Pine Trail to Islamabad 5-Marla Villa
    this.drawIslamabadPortal(ctx, 100, 0, frame);
    lights.push({ x: 130, y: 22, radius: 55, intensity: 0.9, color: '#F6D78B' });

    // East: Pastry Lane to Sweet Dreams Bakery
    this.drawBakeryPortal(ctx, 1540, 550, frame);
    lights.push({ x: 1560, y: 580, radius: 60, intensity: 0.95, color: '#F472B6' });

    // South: Desi Gaon Trail to 12-Marla Haveli & Tubewell
    this.drawHaveliPortal(ctx, 760, 1140, frame);
    lights.push({ x: 800, y: 1160, radius: 60, intensity: 0.95, color: '#F59E0B' });

    // 8. CENTRAL PLAZA ELEMENTS (GENEROUS BREATHING SPACE)
    // Central Crossroads: Grand 5-Way World Directional Guidepost
    this.drawWorldSignpost(ctx, 730, 715, frame);
    lights.push({ x: 745, y: 725, radius: 45, intensity: 0.85, color: '#F6D78B' });

    // Central Birthday Feast Table (For Beenish)
    this.drawBirthdayTable(ctx, 768, 620, frame);
    lights.push({ x: 800, y: 640, radius: 85, intensity: 0.95, color: '#F6D78B' });
    lights.push({ x: 800, y: 650, radius: 50, intensity: 0.7, color: '#E98FAF' });

    // Arrival Birthday Pavilion & Welcome Hearth
    this.drawArrivalPavilion(ctx, 740, 680, frame);
    lights.push({ x: 750, y: 690, radius: 50, intensity: 0.9, color: '#F6D78B' });
    lights.push({ x: 850, y: 690, radius: 50, intensity: 0.9, color: '#F6D78B' });
    lights.push({ x: 800, y: 705, radius: 70, intensity: 0.95, color: '#FCE7F3' });

    // --- STREET LAMPS ALONG THE GRAND AVENUES (WIDE BREATHING SPACING) ---
    const lampPositions = [
      { x: 730, y: 340 },
      { x: 870, y: 340 },
      { x: 730, y: 500 },
      { x: 870, y: 500 },
      { x: 730, y: 780 },
      { x: 870, y: 780 },
      { x: 730, y: 980 },
      { x: 870, y: 980 },
      { x: 480, y: 540 },
      { x: 1120, y: 540 },
      { x: 230, y: 440 },
      { x: 1340, y: 440 },
    ];
    lampPositions.forEach((pos, idx) => {
      this.drawVictorianLampPost(ctx, pos.x, pos.y, frame + idx * 10);
      lights.push({ x: pos.x + 4, y: pos.y - 14, radius: 48, intensity: 0.88, color: '#F6D78B' });
    });

    // --- RESTORED LANDMARK DIORAMAS & STICKY NOTES ---
    // Private Jet Tarmac & Red Carpet Vision (NW-Center Clearing)
    this.drawPrivateJet(ctx, 470, 190, frame);
    lights.push({ x: 530, y: 225, radius: 60, intensity: 0.85, color: '#F6D78B' });

    // Championship Sports Arena: Cricket & Badminton (NE-Center Clearing)
    this.drawSportsArena(ctx, 960, 195, frame);
    lights.push({ x: 1012, y: 230, radius: 60, intensity: 0.85, color: '#FEF08A' });

    // Dream Estates Master Boulevard Gateway (SW-Center Avenue)
    this.drawDreamEstatesPortal(ctx, 490, 1020, frame);
    lights.push({ x: 517, y: 1040, radius: 55, intensity: 0.88, color: '#C084FC' });

    // 5 Handwritten Sticky Notes from Ahmad scattered across the expedition
    this.drawStickyNote(ctx, 743, 700, 'NOTE #1', frame);
    this.drawStickyNote(ctx, 248, 748, 'NOTE #2', frame);
    this.drawStickyNote(ctx, 348, 455, 'NOTE #3', frame);
    this.drawStickyNote(ctx, 665, 280, 'NOTE #4', frame);
    this.drawStickyNote(ctx, 1205, 455, 'NOTE #5', frame);

    // --- BLOOMING FLOWERS & FIREFLIES (ACROSS FULL 1600x1200 OVERWORLD) ---
    const flowerCount = starsRecovered >= 5 ? 32 : starsRecovered >= 2 ? 20 : 12;
    for (let i = 0; i < flowerCount; i++) {
      const fx = 120 + (i * 137) % (width - 240);
      const fy = 140 + ((i * 193) % (height - 260));
      if ((fx > 730 && fx < 870) || (fy > 535 && fy < 655)) continue;
      if (fx > 180 && fx < 450 && fy > 745 && fy < 925) continue; // Skip pond water
      this.drawLuminescentFlower(ctx, fx, fy, frame + i * 15);
      if (starsRecovered >= 3) {
        lights.push({ x: fx + 4, y: fy + 4, radius: 18, intensity: 0.5, color: '#E98FAF' });
      }
    }

    // Floating Fireflies in the night air across the entire meadow
    for (let f = 0; f < 18; f++) {
      const baseX = 120 + (f * 173) % (width - 240);
      const baseY = 140 + (f * 211) % (height - 260);
      const flyX = baseX + Math.sin(frame * 0.02 + f * 1.5) * 45;
      const flyY = baseY + Math.cos(frame * 0.03 + f * 2.1) * 35;
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

    // Secure Mahogany Side Cabinet & Locked Drawer #07 (East Wall: x=370, y=70, w=80, h=45)
    ctx.fillStyle = '#26140D';
    ctx.fillRect(370, 70, 80, 45);
    ctx.strokeStyle = '#7C4F38';
    ctx.strokeRect(370, 70, 80, 45);
    // Top shelf books & ledger
    ctx.fillStyle = '#1E140E';
    ctx.fillRect(374, 74, 72, 16);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(378, 77, 6, 12);
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(386, 76, 7, 13);
    ctx.fillStyle = '#065F46';
    ctx.fillRect(395, 78, 6, 11);
    // Bottom Locked Drawer #07 with Gleaming Brass Keyhole Plate
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(374, 94, 72, 17);
    ctx.strokeStyle = '#F6D78B';
    ctx.strokeRect(374, 94, 72, 17);
    ctx.fillStyle = '#F6D78B';
    ctx.fillRect(404, 99, 12, 6); // Brass keyhole escutcheon
    ctx.fillStyle = '#101329';
    ctx.fillRect(409, 101, 2, 3); // Keyhole slot
    ctx.fillStyle = '#F4EBDD';
    ctx.font = '6px monospace';
    ctx.fillText('DRAWER #07', 388, 67);
    lights.push({ x: 410, y: 102, radius: 38, intensity: 0.75, color: '#F6D78B' });

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

    // Gilded Frame 2 (Portrait 2: Elegant Gaze & The Private Jet Vision)
    this.drawGildedFrame(ctx, 215, 42, 60, 44, 'PORTRAIT 2', '#F3B79C');
    // Mini-scene inside Portrait 2: Sleek White/Grey Jet, 4 Silver Steps, and Beenish in White Dress
    ctx.fillStyle = '#1E293B'; // Night tarmac sky inside frame
    ctx.fillRect(220, 47, 50, 26);
    ctx.fillStyle = '#F8FAFC'; // White/Grey Jet Fuselage
    ctx.fillRect(222, 52, 26, 7);
    ctx.fillStyle = '#94A3B8'; // Grey underbelly & tail
    ctx.fillRect(222, 58, 24, 2);
    ctx.fillRect(222, 48, 6, 5);
    // 4 distinct silver airstair steps descending
    ctx.fillStyle = '#CBD5E1';
    for (let st = 0; st < 4; st++) {
      ctx.fillRect(244 + st * 3, 58 + st * 3, 4, 2);
    }
    // Red carpet at base of steps
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(254, 69, 14, 3);
    // Mini Beenish in radiant White Dress on the red carpet
    ctx.fillStyle = '#1E1B4B';
    ctx.fillRect(259, 60, 3, 3); // Hair
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(258, 63, 5, 6); // White dress
    lights.push({ x: 245, y: 64, radius: 55, intensity: 0.9, color: '#F3B79C' });
    // Hidden key golden sparkle cue if not yet collected!
    if (!hasBrassKey) {
      const sparkleA = Math.sin(frame * 0.1) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(246, 215, 139, ${sparkleA})`;
      ctx.fillRect(270, 78, 4, 4);
    }

    // Pedestal 1: Position Holder Artifact
    this.drawMuseumPedestal(ctx, 350, 140, '#F6D78B', frame);
    lights.push({ x: 380, y: 155, radius: 60, intensity: 0.95, color: '#F6D78B' });

    // Pedestal 2: Unexplainable Phenomenon
    this.drawMuseumPedestal(ctx, 470, 140, '#E98FAF', frame);
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
    // Secret Handwritten Note peeking from behind the Judge's Bench (for judge_secret_note)
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(265, 74, 14, 10);
    ctx.fillStyle = '#F43F5E'; // Tiny wax seal heart on note
    ctx.fillRect(270, 78, 4, 3);

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
      { x: 430, y: 165, color: '#F6D78B', label: '03. VOW' },
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

    // Left & Right Celestial Star-Chart Tables (matching collision boxes at 60,120 and 360,120)
    const drawStarChartTable = (sx: number, sy: number, title: string) => {
      ctx.fillStyle = '#2A1B14';
      ctx.fillRect(sx, sy, 80, 40);
      ctx.strokeStyle = '#F6D78B';
      ctx.strokeRect(sx + 2, sy + 2, 76, 36);
      // Unrolled parchment star map
      ctx.fillStyle = '#1E2542';
      ctx.fillRect(sx + 10, sy + 7, 42, 26);
      ctx.fillStyle = '#F6D78B';
      ctx.fillRect(sx + 18, sy + 14, 2, 2);
      ctx.fillRect(sx + 30, sy + 11, 2, 2);
      ctx.fillRect(sx + 38, sy + 22, 2, 2);
      // Brass astrolabe / compass
      ctx.beginPath();
      ctx.arc(sx + 64, sy + 20, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#F4EBDD';
      ctx.font = '5px monospace';
      ctx.fillText(title, sx + 12, sy + 36);
    };
    drawStarChartTable(60, 120, 'OCT 30 CHARTS');
    drawStarChartTable(360, 120, 'ORBIT LOGS');

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
    // Carved Heart with Initials "A + B" on bench back!
    ctx.fillStyle = '#F6D78B';
    ctx.font = '7px monospace';
    ctx.fillText('♡ A+B ♡', bx + 16, by + 8);
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

    // Warm, gentle evening dusk overlay (vibrant and clear, never gloomy)
    const darknessAlpha = roomTheme === 'valley' ? 0.12 : roomTheme === 'garden' ? 0.08 : 0.15;
    ctx.fillStyle = `rgba(38, 25, 48, ${darknessAlpha})`;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Player Explorer Lantern light (Warm golden circle moving with Beenish)
    lights.push({
      x: Math.floor(playerPos.x + 12),
      y: Math.floor(playerPos.y + 16),
      radius: 96,
      intensity: 0.95,
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

    // Subtle cinematic edge vignette framing the valley
    ctx.globalCompositeOperation = 'source-over';
    const vignette = ctx.createRadialGradient(
      playerPos.x + 12,
      playerPos.y + 16,
      180,
      playerPos.x + 12,
      playerPos.y + 16,
      520
    );
    vignette.addColorStop(0, 'rgba(6, 10, 24, 0)');
    vignette.addColorStop(0.7, 'rgba(6, 10, 24, 0.16)');
    vignette.addColorStop(1, 'rgba(6, 10, 24, 0.40)');
    ctx.fillStyle = vignette;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

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

  private static drawMuseumBuilding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
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

  private static drawCourtBuilding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
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

  private static drawArchiveBuilding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
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
      ctx.fillText('★ OPEN ★', x + 36, y + 45);
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
    y: number
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

    // Floating Gem / Key silhouette with sine hover
    const hover = Math.sin(frame * 0.08) * 3;
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(x + 25, y + 4 + hover, 5, 0, Math.PI * 2);
    ctx.fill();

    // Brass Plaque
    ctx.fillStyle = glowColor;
    ctx.fillRect(x + 10, y + 28, 30, 8);
  }

  private static drawBirthdayTable(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Dark timber celebration table
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x - 4, y + 20, 64, 18);
    // Table legs
    ctx.fillStyle = '#26140D';
    ctx.fillRect(x, y + 36, 6, 12);
    ctx.fillRect(x + 50, y + 36, 6, 12);
    // Cream linen table runner
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 4, y + 20, 48, 18);
    ctx.fillStyle = '#E5D8C5';
    ctx.fillRect(x + 4, y + 36, 48, 2);

    // Steaming Bowl of White Pasta on the left
    ctx.fillStyle = '#D6C7B2'; // Ceramic bowl
    ctx.fillRect(x - 2, y + 24, 12, 7);
    ctx.fillStyle = '#FFF8E7'; // Creamy white pasta
    ctx.fillRect(x - 1, y + 23, 10, 3);
    // Steam curls
    const steamY = Math.sin(frame * 0.1) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x + 2, y + 19 + steamY, 1, 3);
    ctx.fillRect(x + 5, y + 17 - steamY, 1, 3);

    // Nutella Jar & Kinder Joy sweet pile on the right
    ctx.fillStyle = '#3E2417'; // Nutella jar body
    ctx.fillRect(x + 42, y + 23, 6, 8);
    ctx.fillStyle = '#FDFBF7'; // White lid
    ctx.fillRect(x + 41, y + 21, 8, 2);
    // Kinder Joy egg
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 49, y + 25, 5, 6);
    ctx.fillStyle = '#E98FAF';
    ctx.fillRect(x + 49, y + 28, 5, 3);

    // Frosted 2-tier strawberry birthday cake (Center)
    // Base tier
    ctx.fillStyle = '#E98FAF'; // Strawberry frosting
    ctx.fillRect(x + 14, y + 10, 24, 10);
    ctx.fillStyle = '#F4EBDD'; // Cream drip
    ctx.fillRect(x + 14, y + 10, 24, 2);
    ctx.fillRect(x + 16, y + 12, 3, 3);
    ctx.fillRect(x + 24, y + 12, 3, 3);
    ctx.fillRect(x + 32, y + 12, 3, 3);

    // Top tier
    ctx.fillStyle = '#FDFBF7'; // Vanilla cream
    ctx.fillRect(x + 18, y + 3, 16, 7);
    ctx.fillStyle = '#D83A56'; // Strawberry topping dots
    ctx.fillRect(x + 21, y + 2, 2, 2);
    ctx.fillRect(x + 25, y + 2, 2, 2);
    ctx.fillRect(x + 29, y + 2, 2, 2);

    // 3 Birthday Candles with gentle animated flickering flames
    const candlePositions = [x + 21, x + 25, x + 29];
    candlePositions.forEach((cx, idx) => {
      // Candle stick
      ctx.fillStyle = '#F6D78B';
      ctx.fillRect(cx, y - 3, 2, 6);
      // Flickering flame
      const flicker = Math.sin(frame * 0.2 + idx * 1.7) > 0;
      ctx.fillStyle = flicker ? '#FFA040' : '#FFD270';
      ctx.fillRect(cx - (flicker ? 0 : 1), y - 6, flicker ? 2 : 3, 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx, y - 5, 1, 1);
    });

    // Small rustic carved wooden sign beside the table
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 58, y + 14, 4, 26); // Stake
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(x + 48, y + 8, 24, 12); // Board
    ctx.fillStyle = '#F4EBDD';
    ctx.font = '6px monospace';
    ctx.fillText('OCT 31', x + 50, y + 16);
  }

  /**
   * 1. HIGH-OCTANE GARAGE: KAWASAKI NINJA H2R & DODGE CHALLENGER
   */
  public static drawHighOctaneGarage(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Checkered Racing Pit Apron
    ctx.fillStyle = '#181A22';
    ctx.fillRect(x, y + 15, 138, 56);
    // Curbing / Apron edge
    ctx.fillStyle = '#2B3145';
    ctx.fillRect(x, y + 15, 138, 2);
    ctx.fillRect(x, y + 71, 138, 2);

    // Subtle checkered pit line
    for (let cx = x + 4; cx < x + 134; cx += 12) {
      ctx.fillStyle = ((cx / 12) % 2 === 0) ? '#475569' : '#1E293B';
      ctx.fillRect(cx, y + 17, 6, 3);
      ctx.fillRect(cx + 6, y + 20, 6, 3);
    }

    // Garage Truss & Neon Sign
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 10, y + 2, 4, 16);
    ctx.fillRect(x + 124, y + 2, 4, 16);
    ctx.fillRect(x + 10, y + 2, 118, 3);
    // Neon Plaque: 11/10 BADDIE SPEED GARAGE
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 24, y - 1, 90, 9);
    ctx.strokeStyle = '#4ADE80';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 24, y - 1, 90, 9);
    ctx.fillStyle = '#4ADE80';
    ctx.font = '6px monospace';
    ctx.fillText('11/10 BADDIE SPEED GARAGE', x + 26, y + 6);

    // --- KAWASAKI NINJA H2R (LEFT) ---
    const kx = x + 12;
    const ky = y + 26;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(kx - 2, ky + 25, 48, 5);

    // Rear Wheel
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(kx, ky + 14, 12, 12);
    ctx.fillStyle = '#4ADE80'; // Lime rim tape
    ctx.fillRect(kx + 2, ky + 16, 8, 8);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(kx + 4, ky + 18, 4, 4);

    // Front Wheel
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(kx + 32, ky + 14, 12, 12);
    ctx.fillStyle = '#4ADE80'; // Lime rim tape
    ctx.fillRect(kx + 34, ky + 16, 8, 8);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(kx + 36, ky + 18, 4, 4);

    // Green Trellis Frame
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(kx + 14, ky + 12, 16, 3);
    ctx.fillRect(kx + 18, ky + 15, 12, 2);

    // Carbon Bodywork & Fuel Tank
    ctx.fillStyle = '#1E293B'; // Dark metallic carbon
    ctx.fillRect(kx + 14, ky + 8, 14, 7);
    ctx.fillStyle = '#4ADE80'; // Signature lime accent
    ctx.fillRect(kx + 16, ky + 7, 10, 2);

    // Sharp Aerodynamic Front Fairing & Cowl
    ctx.fillStyle = '#111827';
    ctx.fillRect(kx + 26, ky + 6, 12, 9);
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(kx + 28, ky + 9, 8, 3);

    // H2R Aerodynamic Carbon Front Winglets
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(kx + 36, ky + 8, 5, 2);
    ctx.fillRect(kx + 34, ky + 11, 4, 1);

    // Windscreen & Clip-on Handlebars
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(kx + 28, ky + 3, 5, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(kx + 25, ky + 4, 4, 2);

    // Upswept Titanium Exhaust Pipe with heat bluing
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(kx + 8, ky + 18, 14, 3);
    ctx.fillStyle = '#60A5FA'; // Blued titanium
    ctx.fillRect(kx + 10, ky + 18, 3, 3);

    // Pulsing Green LED Headlight
    const ledGlow = Math.sin(frame * 0.12) > 0 ? '#86EFAC' : '#22C55E';
    ctx.fillStyle = ledGlow;
    ctx.fillRect(kx + 38, ky + 9, 2, 2);

    // Small Plaque: Ninja H2R
    ctx.fillStyle = '#4ADE80';
    ctx.font = '5px monospace';
    ctx.fillText('NINJA H2R', kx + 8, ky + 34);

    // --- DODGE CHALLENGER (RIGHT) ---
    const cx = x + 66;
    const cy = y + 23;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(cx - 2, cy + 26, 68, 6);

    // Muscle Car Body (Pitch Black)
    ctx.fillStyle = '#0B0C10';
    ctx.fillRect(cx, cy + 12, 64, 15);
    // Lower front chin splitter
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(cx + 52, cy + 24, 12, 3);

    // Muscle Hood & Twin Hood Scoops
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx + 38, cy + 10, 24, 3);
    ctx.fillStyle = '#374151'; // Scoops
    ctx.fillRect(cx + 42, cy + 9, 4, 2);
    ctx.fillRect(cx + 48, cy + 9, 4, 2);

    // Coupe Roof & Dark Tinted Windows
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(cx + 12, cy + 3, 30, 9);
    ctx.fillStyle = '#0F172A'; // Tinted glass
    ctx.fillRect(cx + 14, cy + 5, 12, 6); // Rear window
    ctx.fillRect(cx + 28, cy + 5, 12, 6); // Front side window
    // Window chrome reflection
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(cx + 16, cy + 5, 22, 1);

    // Front Grille & Quad Headlights
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx + 62, cy + 13, 2, 8);
    ctx.fillStyle = '#FBBF24'; // Dual amber halo headlights
    ctx.fillRect(cx + 62, cy + 14, 2, 2);
    ctx.fillRect(cx + 62, cy + 18, 2, 2);

    // Rear Taillight Bar (Challenger signature)
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(cx - 1, cy + 13, 2, 8);

    // Wheels: Silver 5-spoke alloys with red Brembo calipers
    // Rear wheel
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx + 8, cy + 18, 12, 11);
    ctx.fillStyle = '#EF4444'; // Brake caliper
    ctx.fillRect(cx + 10, cy + 20, 2, 4);
    ctx.fillStyle = '#CBD5E1'; // Alloy rim
    ctx.fillRect(cx + 11, cy + 20, 6, 6);
    // Front wheel
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx + 46, cy + 18, 12, 11);
    ctx.fillStyle = '#EF4444'; // Brake caliper
    ctx.fillRect(cx + 48, cy + 20, 2, 4);
    ctx.fillStyle = '#CBD5E1'; // Alloy rim
    ctx.fillRect(cx + 49, cy + 20, 6, 6);

    // Dual Chrome Exhaust Tips with animated rumble smoke
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(cx - 3, cy + 23, 3, 2);
    if (frame % 20 < 10) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(cx - 6, cy + 22, 2, 2);
      ctx.fillRect(cx - 9, cy + 21, 2, 2);
    }

    // License Plate: BEE-11
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(cx + 2, cy + 21, 8, 3);

    // Plaque: Dodge Challenger
    ctx.fillStyle = '#F6D78B';
    ctx.font = '5px monospace';
    ctx.fillText('DODGE CHALLENGER', cx + 4, cy + 34);
  }

  /**
   * 2. PRIVATE JET APRON: WHITE/GREY JET & THE RED CARPET VISION
   */
  public static drawPrivateJet(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Runway / Tarmac Surface
    ctx.fillStyle = '#2A2E3D';
    ctx.fillRect(x, y + 15, 128, 62);
    // Yellow Taxiway Centerline
    for (let tx = x + 4; tx < x + 120; tx += 14) {
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(tx, y + 70, 8, 2);
    }

    // --- SLEEK PRIVATE JET ---
    const jx = x + 10;
    const jy = y + 8;

    // Shadow under jet
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(jx + 10, jy + 32, 60, 6);

    // Left Swept Wing
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(jx + 15, jy + 18, 30, 6);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(jx + 18, jy + 24, 22, 4);
    // Green wingtip strobe light
    const strobe = (frame % 30 < 15);
    ctx.fillStyle = strobe ? '#22C55E' : '#14532D';
    ctx.fillRect(jx + 14, jy + 18, 2, 2);

    // Jet Turbine Engine (Mounted on fuselage side)
    ctx.fillStyle = '#64748B';
    ctx.fillRect(jx + 16, jy + 14, 16, 7);
    ctx.fillStyle = '#38BDF8'; // Blue intake glow
    ctx.fillRect(jx + 31, jy + 15, 2, 5);

    // Fuselage (Luxury Pearl White with Brushed Platinum Bottom)
    ctx.fillStyle = '#F8FAFC'; // Top white
    ctx.fillRect(jx + 18, jy + 10, 56, 12);
    ctx.fillStyle = '#94A3B8'; // Bottom platinum
    ctx.fillRect(jx + 22, jy + 22, 50, 4);

    // Streamlined Nose Cone
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(jx + 74, jy + 13, 8, 7);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(jx + 82, jy + 16, 3, 2);

    // Aviator Cockpit Windows
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(jx + 68, jy + 11, 7, 4);
    ctx.fillStyle = '#60A5FA';
    ctx.fillRect(jx + 70, jy + 11, 4, 1);

    // Swept Tail Fin with Royal Gold Crown Emblem
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(jx + 8, jy - 2, 14, 14);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(jx + 4, jy - 4, 8, 6);
    // Golden Crown Insignia on tail
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(jx + 8, jy + 2, 4, 3);
    // Red tail strobe light
    ctx.fillStyle = strobe ? '#EF4444' : '#7F1D1D';
    ctx.fillRect(jx + 4, jy - 5, 2, 2);

    // 4 Glowing Passenger Cabin Windows (Amber Warmth)
    for (let w = 0; w < 4; w++) {
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(jx + 32 + w * 9, jy + 13, 4, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(jx + 32 + w * 9, jy + 13, 4, 1);
    }

    // Landing Gear
    ctx.fillStyle = '#475569';
    ctx.fillRect(jx + 28, jy + 26, 3, 7);
    ctx.fillRect(jx + 26, jy + 32, 6, 3);
    ctx.fillRect(jx + 62, jy + 26, 3, 7);
    ctx.fillRect(jx + 60, jy + 32, 6, 3);

    // --- BOARDING AIRSTAIRS & RED CARPET ---
    const sx = jx + 48;
    const sy = jy + 20;

    // Silver Airstairs
    ctx.fillStyle = '#CBD5E1';
    for (let st = 0; st < 4; st++) {
      ctx.fillRect(sx + st * 5, sy + st * 4, 7, 3);
      // Handrail
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(sx + st * 5 + 5, sy + st * 4 - 3, 1, 3);
      ctx.fillStyle = '#CBD5E1';
    }

    // Red Carpet
    ctx.fillStyle = '#991B1B'; // Crimson velvet
    ctx.fillRect(sx + 20, sy + 14, 42, 12);
    // Gold Fringe Border
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(sx + 20, sy + 14, 42, 1);
    ctx.fillRect(sx + 20, sy + 25, 42, 1);

    // --- CHARACTERS: PAAARI & PAGLUU ---
    // 1. PAAARI in elegant white dress stepping down
    const px = sx + 25;
    const py = sy + 6;
    // Hair (Dark and silky)
    ctx.fillStyle = '#1E1B4B';
    ctx.fillRect(px + 2, py - 4, 6, 6);
    ctx.fillRect(px, py - 2, 3, 8); // Flowing back
    // Face
    ctx.fillStyle = '#FFEDD5';
    ctx.fillRect(px + 4, py - 2, 4, 4);
    // Rose hair clip
    ctx.fillStyle = '#FB7185';
    ctx.fillRect(px + 3, py - 4, 2, 2);
    // Elegant White Dress
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px + 2, py + 2, 6, 8);
    ctx.fillRect(px + 1, py + 7, 8, 6); // Flared skirt
    ctx.fillStyle = '#FCE7F3'; // Pink sash ribbon
    ctx.fillRect(px + 2, py + 5, 6, 2);
    // Shoes (Delicate heels)
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(px + 3, py + 13, 2, 2);
    ctx.fillRect(px + 6, py + 13, 2, 2);

    // 2. PAGLUU (AHMAD) standing on the tarmac with jaw dropped
    const ax = sx + 44;
    const ay = sy + 8;
    // Dark hair
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(ax + 2, ay - 4, 6, 4);
    // Face
    ctx.fillStyle = '#FED7AA';
    ctx.fillRect(ax + 2, ay, 6, 5);
    // Eyes wide open in awe
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ax + 2, ay + 1, 2, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(ax + 2, ay + 1, 1, 1);
    // Mouth wide open (Dropped jaw!)
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(ax + 2, ay + 3, 2, 2);
    // Blushing cheeks
    ctx.fillStyle = '#FB7185';
    ctx.fillRect(ax + 4, ay + 2, 2, 1);
    // Clothes: Smart navy jacket & dark jeans
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(ax + 1, ay + 5, 7, 7);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(ax + 2, ay + 12, 5, 5);

    // Emote / Sparkle above Pagluu
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(ax + 3, ay - 8, 2, 2);
    ctx.fillRect(ax + 2, ay - 9, 4, 1);

    // Brass Plaque
    ctx.fillStyle = '#F6D78B';
    ctx.font = '5px monospace';
    ctx.fillText('WHITE JET VISION', x + 34, y + 74);
  }

  /**
   * 3. THE 2 AM FEAST TABLE: WHITE PASTA, CHOCOLATES, NUTELLA & COCO CRUNCH
   */
  private static drawFeastTable(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Grand Celebration Feast Table
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x, y + 16, 84, 24);
    // Table legs
    ctx.fillStyle = '#26140D';
    ctx.fillRect(x + 4, y + 38, 6, 10);
    ctx.fillRect(x + 74, y + 38, 6, 10);
    // Cream linen tablecloth with rose trim
    ctx.fillStyle = '#F4EBDD';
    ctx.fillRect(x + 2, y + 16, 80, 20);
    ctx.fillStyle = '#E98FAF'; // Rose decorative fringe
    ctx.fillRect(x + 2, y + 34, 80, 2);

    // --- STEAMING BOWL OF WHITE PASTA (LEFT) ---
    const bx = x + 6;
    const by = y + 17;
    // Ceramic bowl
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx, by + 4, 20, 10);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(bx + 2, by + 12, 16, 2);
    // Creamy white pasta ribbons
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(bx + 2, by + 2, 16, 5);
    // Melted butter / cheese glow
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(bx + 6, by + 3, 8, 2);
    // Parsley flakes
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(bx + 5, by + 4, 1, 1);
    ctx.fillRect(bx + 11, by + 3, 1, 1);
    ctx.fillRect(bx + 14, by + 5, 1, 1);

    // Rising Animated Steam Curls
    const s1 = Math.sin(frame * 0.12) * 2;
    const s2 = Math.cos(frame * 0.14) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillRect(bx + 6 + s1, by - 3, 1, 4);
    ctx.fillRect(bx + 12 - s2, by - 5, 1, 5);
    ctx.fillRect(bx + 16 + s1, by - 2, 1, 3);

    // --- PYRAMIDS OF CHOCOLATE BARS (CENTER) ---
    const cx = x + 30;
    const cy = y + 17;
    // Dark chocolate (Dhayeeeer saari!)
    ctx.fillStyle = '#1C1008';
    ctx.fillRect(cx, cy + 6, 14, 6);
    ctx.fillStyle = '#F59E0B'; // Gold foil wrapper tip
    ctx.fillRect(cx, cy + 6, 4, 6);

    // Milk chocolate
    ctx.fillStyle = '#2563EB'; // Blue wrapper
    ctx.fillRect(cx + 8, cy + 2, 12, 5);
    ctx.fillStyle = '#451A03';
    ctx.fillRect(cx + 17, cy + 2, 3, 5);

    // Meethi chocolate
    ctx.fillStyle = '#E11D48'; // Ruby wrapper
    ctx.fillRect(cx + 4, cy - 2, 12, 4);

    // --- NUTELLA JARS & KINDER JOYS (RIGHT) ---
    const nx = x + 54;
    const ny = y + 17;
    // Nutella Jar #1
    ctx.fillStyle = '#451A03'; // Nutella jar body
    ctx.fillRect(nx, ny + 4, 8, 10);
    ctx.fillStyle = '#FFFFFF'; // White lid
    ctx.fillRect(nx - 1, ny + 2, 10, 2);
    // Silver spoon sticking out
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(nx + 3, ny - 3, 2, 6);
    ctx.fillRect(nx + 2, ny - 4, 4, 2);

    // Kinder Joy Egg
    ctx.fillStyle = '#FFFFFF'; // White half
    ctx.fillRect(nx + 11, ny + 6, 6, 8);
    ctx.fillStyle = '#FB923C'; // Orange half
    ctx.fillRect(nx + 11, ny + 10, 6, 4);

    // Coco Crunch Box
    ctx.fillStyle = '#DC2626'; // Bright red box
    ctx.fillRect(nx + 19, ny + 2, 8, 12);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(nx + 21, ny + 5, 4, 4);

    // Plaque on table
    ctx.fillStyle = '#F6D78B';
    ctx.font = '5px monospace';
    ctx.fillText('2 AM FEAST TABLE', x + 18, y + 44);
  }

  /**
   * 4. PAISAY VAULT: DHAYYERRRR SARYYYYYYYYYY PAISAY
   */
  public static drawPaisayVault(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Massive Ornate Golden Treasure Chest
    const vx = x + 4;
    const vy = y + 12;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(vx - 2, vy + 24, 48, 6);

    // Chest Body (Heavy Dark Mahogany & Gold Trim)
    ctx.fillStyle = '#3E1F0D';
    ctx.fillRect(vx, vy + 10, 42, 18);
    // Gold corner bands and rivets
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(vx, vy + 10, 4, 18);
    ctx.fillRect(vx + 38, vy + 10, 4, 18);
    ctx.fillRect(vx, vy + 24, 42, 4);
    // Center lock clasp
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(vx + 18, vy + 14, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(vx + 20, vy + 16, 2, 2);

    // Chest Lid propped open at angle
    ctx.fillStyle = '#5C2D12';
    ctx.fillRect(vx - 2, vy - 2, 46, 12);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(vx - 2, vy - 2, 4, 12);
    ctx.fillRect(vx + 40, vy - 2, 4, 12);
    ctx.fillRect(vx - 2, vy - 2, 46, 2);

    // --- OVERFLOWING WEALTH (GOLD COINS, RUPEE BUNDLES & GEMS) ---
    // Mountain of Gold Coins
    for (let c = 0; c < 16; c++) {
      const cx = vx + 4 + (c * 7) % 34;
      const cy = vy + 4 + (c * 5) % 8;
      ctx.fillStyle = (c % 2 === 0) ? '#FBBF24' : '#FDE047';
      ctx.fillRect(cx, cy, 4, 3);
      // Coins spilling over onto grass
      if (c > 11) {
        ctx.fillRect(cx, vy + 25 + (c % 3) * 2, 3, 2);
      }
    }

    // Bundles of 5,000 & 1,000 Rupee Notes (Crisp Emerald & Cobalt)
    ctx.fillStyle = '#059669'; // Emerald 5000 notes
    ctx.fillRect(vx + 6, vy + 2, 10, 5);
    ctx.fillStyle = '#FFFFFF'; // White currency band
    ctx.fillRect(vx + 10, vy + 2, 2, 5);

    ctx.fillStyle = '#2563EB'; // Cobalt 1000 notes
    ctx.fillRect(vx + 24, vy + 3, 10, 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(vx + 28, vy + 3, 2, 5);

    // Twinkling Gems & Diamonds
    const gems = [
      { gx: vx + 16, gy: vy + 4, col: '#38BDF8' }, // Sapphire
      { gx: vx + 22, gy: vy + 7, col: '#F43F5E' }, // Ruby
      { gx: vx + 32, gy: vy + 2, col: '#A855F7' }, // Amethyst
    ];
    gems.forEach((gem, idx) => {
      ctx.fillStyle = gem.col;
      ctx.fillRect(gem.gx, gem.gy, 3, 3);
      // Twinkle sparkle
      const sparkle = Math.sin(frame * 0.15 + idx * 2.1) > 0.4;
      if (sparkle) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gem.gx + 1, gem.gy - 1, 1, 1);
        ctx.fillRect(gem.gx - 1, gem.gy + 1, 1, 1);
      }
    });

    // Bold Banner: DHAYYERRRR SARYYYYYYYYYY PAISAY
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x - 6, y - 6, 68, 9);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, y - 6, 68, 9);
    ctx.fillStyle = '#FDE047';
    ctx.font = '5px monospace';
    ctx.fillText('DHAYYERRRR SARYYYYYYYYYY PAISAY', x - 4, y);
  }

  /**
   * 5. SPORTS ARENA: CRICKET PITCH & BADMINTON COURT
   */
  public static drawSportsArena(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Manicured Sports Turf
    ctx.fillStyle = '#166534';
    ctx.fillRect(x, y + 10, 104, 58);
    // White chalk boundary line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 2, y + 12, 100, 54);
    // Center divider
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 50, y + 12, 1, 54);

    // --- CRICKET HALF (LEFT) ---
    const cx = x + 10;
    const cy = y + 25;

    // Pitch crease line
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(cx, cy + 18, 28, 2);

    // 3 Wooden Cricket Stumps (Wickets)
    ctx.fillStyle = '#D97706';
    ctx.fillRect(cx + 8, cy + 6, 2, 14);
    ctx.fillRect(cx + 12, cy + 6, 2, 14);
    ctx.fillRect(cx + 16, cy + 6, 2, 14);
    // 2 Bails balanced on top
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(cx + 7, cy + 5, 12, 1);

    // Cricket Bat resting against stumps
    ctx.fillStyle = '#E5D8C5'; // Willow blade
    ctx.fillRect(cx + 20, cy + 7, 3, 14);
    ctx.fillStyle = '#7C3AED'; // Purple rubber handle grip
    ctx.fillRect(cx + 20, cy + 2, 3, 5);

    // Red Cricket Ball with white seam stitch
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx + 24, cy + 17, 4, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx + 25, cy + 18, 2, 1);

    // Label: Cricket
    ctx.fillStyle = '#FEF08A';
    ctx.font = '5px monospace';
    ctx.fillText('CRICKET', cx + 4, cy + 34);

    // --- BADMINTON HALF (RIGHT) ---
    const bx = x + 58;
    const by = y + 22;

    // Badminton Net across poles
    ctx.fillStyle = '#64748B'; // Left pole
    ctx.fillRect(bx, by, 2, 18);
    ctx.fillRect(bx + 34, by, 2, 18); // Right pole
    // White net mesh
    ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
    ctx.fillRect(bx + 2, by + 2, 32, 6);
    ctx.fillStyle = '#EF4444'; // Red tension tape
    ctx.fillRect(bx + 2, by + 2, 32, 1);

    // Crossed Badminton Rackets
    ctx.fillStyle = '#38BDF8'; // Racket 1: Sky blue
    ctx.fillRect(bx + 8, by + 12, 10, 8);
    ctx.fillStyle = '#166534';
    ctx.fillRect(bx + 10, by + 14, 6, 4); // Hollow string area
    ctx.fillStyle = '#94A3B8'; // Shaft
    ctx.fillRect(bx + 14, by + 19, 2, 7);

    ctx.fillStyle = '#C084FC'; // Racket 2: Lilac
    ctx.fillRect(bx + 18, by + 12, 10, 8);
    ctx.fillStyle = '#166534';
    ctx.fillRect(bx + 20, by + 14, 6, 4);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(bx + 20, by + 19, 2, 7);

    // White Feather Shuttlecock
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx + 30, by + 18, 3, 4);
    ctx.fillStyle = '#EF4444'; // Red cork tip
    ctx.fillRect(bx + 31, by + 21, 2, 2);

    // Label: Badminton
    ctx.fillStyle = '#C084FC';
    ctx.font = '5px monospace';
    ctx.fillText('BADMINTON', bx + 6, by + 34);

    // Championship Trophy in the center
    const tx = x + 46;
    const ty = y + 14;
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tx, ty + 2, 9, 6);
    ctx.fillRect(tx + 2, ty + 8, 5, 4);
    ctx.fillRect(tx + 1, ty + 12, 7, 2);
    // Gold sparkle
    if (Math.sin(frame * 0.1) > 0.3) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(tx + 4, ty + 1, 1, 1);
    }
  }

  /**
   * 1. Castle Mountain Pass Archway on North-East Overworld
   */
  public static drawCastlePortal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Stone Battlements Archway
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x, y, 90, 36);
    // Left & Right Stone Watch-pillars
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y, 16, 36);
    ctx.fillRect(x + 74, y, 16, 36);
    // Crenelated top
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 2, y, 94, 6);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 20, y - 2, 8, 4);
    ctx.fillRect(x + 40, y - 2, 8, 4);
    ctx.fillRect(x + 60, y - 2, 8, 4);

    // Royal Purple Banners hanging down pillars
    ctx.fillStyle = '#7C3AED';
    ctx.fillRect(x + 4, y + 8, 8, 22);
    ctx.fillRect(x + 78, y + 8, 8, 22);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 7, y + 16, 2, 2);
    ctx.fillRect(x + 81, y + 16, 2, 2);

    // Wall Sconce Torches with Animated Flames
    const f = Math.sin(frame * 0.3) * 2;
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 12, y + 12, 3, 8);
    ctx.fillRect(x + 74, y + 12, 3, 8);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 11, y + 8 + f, 5, 5);
    ctx.fillRect(x + 73, y + 8 + f, 5, 5);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(x + 12, y + 9 + f, 3, 3);
    ctx.fillRect(x + 74, y + 9 + f, 3, 3);

    // Stone Plaque & Direction Text
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 18, y + 8, 54, 16);
    ctx.fillStyle = '#C084FC';
    ctx.font = 'bold 5px monospace';
    ctx.fillText("QUEEN'S CASTLE", x + 20, y + 16);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('PASS ->', x + 34, y + 22);
  }

  /**
   * 2. Brutalist Mafia Highway Portal on West Overworld (High-Tech Obsidian Security Gate)
   */
  public static drawMafiaPortal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    const w = 52;
    const h = 72;

    // Outer Obsidian Fortress Pylons (Left & Right)
    ctx.fillStyle = '#090D16';
    ctx.fillRect(x, y, 14, h);
    ctx.fillRect(x + w - 14, y, 14, h);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 2, y + 2, 10, h - 4);
    ctx.fillRect(x + w - 12, y + 2, 10, h - 4);

    // Glowing Cyan Neon Vertical Light Strips on Pillars
    const neonPulse = Math.sin(frame * 0.08) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(56, 189, 248, ${neonPulse})`;
    ctx.fillRect(x + 5, y + 10, 3, h - 20);
    ctx.fillRect(x + w - 8, y + 10, 3, h - 20);

    // High-Tech Titanium Overhead Canopy Archway
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y, w, 16);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(x, y + 1, w, 3);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 4, y + 4, w - 8, 10);

    // Illuminated Neon Gate Header: 'MAFIA ESTATE'
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('MAFIA ESTATE', x + 4, y + 11);

    // Biometric Security Gate Opening with Holographic Scan
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(x + 14, y + 16, w - 28, h - 16);

    // Dual Animated Laser Sweepers
    const laserY = y + 18 + ((frame * 0.8) % (h - 26));
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(x + 14, Math.floor(laserY), w - 28, 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fillRect(x + 14, Math.floor(laserY) - 2, w - 28, 6);

    // Cyan Neon Directional Text
    const arrowGlow = Math.sin(frame * 0.12) > 0 ? '#38BDF8' : '#0284C7';
    ctx.fillStyle = arrowGlow;
    ctx.font = 'bold 6px monospace';
    ctx.fillText('<- BATMOBILE', x + 5, y + 42);

    // Yellow Highway Asphalt Landing Stripes leading into gate
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 16, y + h - 6, 8, 3);
    ctx.fillRect(x + 28, y + h - 6, 8, 3);
  }

  /**
   * 3. Islamabad Villa Pine Trail Portal on North-West Overworld
   */
  public static drawIslamabadPortal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Rustic Timber Pine Gate
    ctx.fillStyle = '#451A03';
    ctx.fillRect(x, y, 62, 32);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 2, y, 10, 32);
    ctx.fillRect(x + 50, y, 10, 32);
    ctx.fillRect(x, y + 2, 62, 8);

    // Hanging White Porch Lantern with gentle breathing glow
    const glow = Math.sin(frame * 0.1) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
    ctx.fillRect(x + 28, y + 10, 6, 8);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 27, y + 8, 8, 2);
    ctx.fillRect(x + 29, y + 18, 4, 2);

    // Pine Wood Sign
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(x + 14, y + 18, 34, 12);
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('ISLAMABAD', x + 16, y + 24);
    ctx.fillStyle = '#4ADE80';
    ctx.font = '4px monospace';
    ctx.fillText('5-MARLA ^', x + 18, y + 29);
  }

  /**
   * 4. Sweet Dreams Bakery Pastry Lane Portal on East Overworld
   */
  public static drawBakeryPortal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Parisian Awning Frame
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x, y, 35, 60);
    ctx.fillStyle = '#FCE7F3';
    ctx.fillRect(x + 4, y + 2, 31, 56);

    // Pink & White Striped Canopy Post
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(x + 2, y, 8, 60);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 4, y, 4, 60);

    // Hanging Golden Pretzel with sparkle
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 6, 0, Math.PI * 2);
    ctx.stroke();
    if (Math.sin(frame * 0.12) > 0.4) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 15, y + 15, 2, 2);
    }

    // Pastry Street Label
    ctx.fillStyle = '#BE185D';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('BAKERY', x + 8, y + 32);
    ctx.fillStyle = '#DB2777';
    ctx.font = '5px monospace';
    ctx.fillText('LANE ->', x + 8, y + 40);
  }

  /**
   * 5. Desi Gaon Haveli Trail on South Overworld
   */
  public static drawHaveliPortal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Rustic Wooden Village Posts
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x - 6, y, 10, 40);
    ctx.fillRect(x + 60, y, 10, 40);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(x - 8, y + 6, 80, 6);

    // Terracotta Matkas
    ctx.fillStyle = '#9A3412';
    ctx.beginPath();
    ctx.arc(x + 6, y + 28, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 58, y + 28, 5, 0, Math.PI * 2);
    ctx.fill();

    // Amber Hurricane Lantern with flickering flame
    const hf = Math.sin(frame * 0.25) * 1;
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 30, y + 12 + hf, 6, 8);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(x + 31, y + 13 + hf, 4, 6);

    // Gaon Haveli Sign
    ctx.fillStyle = '#3E1C0A';
    ctx.fillRect(x + 12, y + 22, 42, 14);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('GAON HAVELI', x + 14, y + 29);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '4px monospace';
    ctx.fillText('TUBEWELL v', x + 16, y + 34);
  }

  /**
   * Multi-directional World Signpost at Center Crossroads
   */
  public static drawWorldSignpost(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
    // Wooden central post
    ctx.fillStyle = '#451A03';
    ctx.fillRect(x + 14, y + 12, 4, 30);

    // Signboard 1: Top-Left (Islamabad 5-Marla Villa)
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(x, y + 4, 28, 8);
    ctx.fillStyle = '#FEF08A';
    ctx.font = '4px monospace';
    ctx.fillText('^ ISLAMABAD', x + 2, y + 10);

    // Signboard 2: Top-Right (Queen's Castle)
    ctx.fillStyle = '#7C3AED';
    ctx.fillRect(x + 16, y + 11, 26, 8);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '4px monospace';
    ctx.fillText("CASTLE >", x + 18, y + 17);

    // Signboard 3: Left (Brutalist Mafia Home)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x - 2, y + 18, 26, 8);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '4px monospace';
    ctx.fillText("< MAFIA", x, y + 24);

    // Signboard 4: Right (Sweet Dreams Bakery)
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x + 16, y + 24, 26, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '4px monospace';
    ctx.fillText("BAKERY >", x + 18, y + 30);

    // Signboard 5: Bottom (Gaon Haveli)
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 2, y + 30, 28, 8);
    ctx.fillStyle = '#FDE68A';
    ctx.font = '4px monospace';
    ctx.fillText("v HAVELI", x + 4, y + 36);

    // Brass top lantern with gentle pulsing beacon
    const bglow = Math.sin(frame * 0.1) * 0.2 + 0.8;
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 13, y, 6, 5);
    ctx.fillStyle = `rgba(254, 240, 138, ${bglow})`;
    ctx.fillRect(x + 14, y + 1, 4, 3);
  }

  /**
   * Dream Estates Portal Archway on North Avenue in Overworld
   */
  public static drawDreamEstatesPortal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Grand Marble Archway leading north into the Dream Estates
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x, y, 54, 38);

    // Stone Pillars
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 12, 38);
    ctx.fillRect(x + 42, y, 12, 38);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(x - 2, y, 16, 6);
    ctx.fillRect(x + 40, y, 16, 6);

    // Triumphal Archway Beam
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 4, y, 46, 12);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(x + 6, y + 2, 42, 2);

    // Gold Inscribed Archway Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = '6px monospace';
    ctx.fillText('DREAM ESTATES', x + 5, y + 9);

    // Gateway Opening with starlight shimmer
    const glow = Math.sin(frame * 0.08) * 0.15 + 0.25;
    ctx.fillStyle = `rgba(192, 132, 252, ${glow})`;
    ctx.fillRect(x + 12, y + 12, 30, 26);

    // Little guide stones
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 24, y + 24, 6, 2);
    ctx.fillRect(x + 26, y + 18, 2, 6);
  }

  /**
   * ARRIVAL PAVILION & HEARTH (SPAWN ANCHOR)
   * Polished teak timber deck platform, floral archway, fairy lights,
   * flower baskets, corner brass lanterns, and carved brass Welcome Archway Plaque.
   */
  public static drawArrivalPavilion(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // 1. Drop shadow beneath pavilion platform
    ctx.fillStyle = 'rgba(12, 18, 32, 0.48)';
    ctx.beginPath();
    ctx.ellipse(x + 55, y + 42, 60, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Polished Teak Timber Deck Platform (x..x+110, y..y+75)
    // Foundation stone riser
    ctx.fillStyle = '#262D48';
    ctx.fillRect(x - 2, y + 8, 114, 68);
    ctx.fillStyle = '#3E466E';
    ctx.fillRect(x - 4, y + 72, 118, 6); // Bottom stone step

    // Timber floorboards
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x, y + 10, 110, 64);

    // Individual planks with bevel highlights & woodgrain
    const plankH = 8;
    for (let py = y + 10; py < y + 74; py += plankH) {
      ctx.fillStyle = '#5A3828';
      ctx.fillRect(x + 2, py, 106, plankH - 1);
      // Top edge highlight
      ctx.fillStyle = '#7C4F38';
      ctx.fillRect(x + 2, py, 106, 1);
      // Subtle nail pegs
      ctx.fillStyle = '#26140D';
      ctx.fillRect(x + 8, py + 3, 2, 2);
      ctx.fillRect(x + 52, py + 3, 2, 2);
      ctx.fillRect(x + 100, py + 3, 2, 2);
    }

    // Polished deck edge border with brass corners
    ctx.fillStyle = '#7C4F38';
    ctx.fillRect(x, y + 10, 110, 2);
    ctx.fillRect(x, y + 72, 110, 2);
    ctx.fillRect(x, y + 10, 2, 64);
    ctx.fillRect(x + 108, y + 10, 2, 64);
    // Brass corner braces
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x, y + 10, 6, 6);
    ctx.fillRect(x + 104, y + 10, 6, 6);
    ctx.fillRect(x, y + 68, 6, 6);
    ctx.fillRect(x + 104, y + 68, 6, 6);

    // 3. Floral Archway / Pergola Overhead
    // Left & Right Carved Timber Pillars
    ctx.fillStyle = '#26140D';
    ctx.fillRect(x + 8, y - 28, 8, 48);
    ctx.fillRect(x + 94, y - 28, 8, 48);
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(x + 10, y - 28, 4, 48);
    ctx.fillRect(x + 96, y - 28, 4, 48);
    // Pillar bases
    ctx.fillStyle = '#7C4F38';
    ctx.fillRect(x + 6, y + 16, 12, 4);
    ctx.fillRect(x + 92, y + 16, 12, 4);

    // Pergola Crossbeam Arch
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 2, y - 32, 106, 8);
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(x + 4, y - 30, 102, 3);

    // Climbing Rose & Jasmine Vines wrapping around pillars and beam
    ctx.fillStyle = '#1D4537';
    ctx.fillRect(x + 6, y - 20, 10, 36);
    ctx.fillRect(x + 94, y - 20, 10, 36);
    ctx.fillRect(x + 12, y - 34, 86, 6);

    // Taaza Pink Roses & Jasmine blossoms on archway
    const flowerBlooms = [
      { bx: x + 9, by: y - 16, color: '#F472B6' },
      { bx: x + 11, by: y - 4, color: '#FB7185' },
      { bx: x + 10, by: y + 8, color: '#F472B6' },
      { bx: x + 97, by: y - 18, color: '#FB7185' },
      { bx: x + 96, by: y - 6, color: '#F472B6' },
      { bx: x + 98, by: y + 6, color: '#FB7185' },
      // Jasmine white flowers with golden centers
      { bx: x + 24, by: y - 35, color: '#FFFFFF' },
      { bx: x + 38, by: y - 36, color: '#FDF2F8' },
      { bx: x + 54, by: y - 35, color: '#FFFFFF' },
      { bx: x + 70, by: y - 36, color: '#FDF2F8' },
      { bx: x + 84, by: y - 35, color: '#FFFFFF' },
    ];
    flowerBlooms.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.bx, b.by, 4, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(b.bx + 1, b.by + 1, 2, 2);
    });

    // 4. Hanging Fairy Lights Garland
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 24);
    ctx.quadraticCurveTo(x + 55, y - 14, x + 94, y - 24);
    ctx.stroke();

    // Fairy light glowing bulbs
    for (let l = 0; l < 7; l++) {
      const t = (l + 0.5) / 7;
      const lx = (x + 16) * (1 - t) + (x + 94) * t;
      const ly = (y - 24) * (1 - t) * (1 - t) + (y - 14) * 2 * (1 - t) * t + (y - 24) * t * t;
      const bulbGlow = Math.sin(frame * 0.12 + l * 1.2) * 0.35 + 0.65;
      ctx.fillStyle = `rgba(254, 240, 138, ${bulbGlow})`;
      ctx.fillRect(Math.floor(lx - 1), Math.floor(ly), 3, 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(Math.floor(lx), Math.floor(ly + 1), 1, 1);
    }

    // 5. Hanging Corner Brass Lanterns
    const drawHangingLantern = (lx: number, ly: number) => {
      // Chain
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(lx + 2, ly - 6, 1, 6);
      // Brass lantern hood
      ctx.fillStyle = '#B45309';
      ctx.fillRect(lx, ly, 5, 2);
      // Glowing glass
      const f = Math.sin(frame * 0.18 + lx) * 1;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(lx, ly + 2, 5, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(lx + 1, ly + 3 + Math.floor(f * 0.5), 3, 3);
      // Base
      ctx.fillStyle = '#78350F';
      ctx.fillRect(lx, ly + 7, 5, 1);
    };
    drawHangingLantern(x + 4, y - 24);
    drawHangingLantern(x + 101, y - 24);

    // 6. Terracotta Flower Urns at Front Steps
    const drawUrn = (ux: number, uy: number) => {
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(ux, uy + 4, 10, 8);
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(ux - 1, uy + 2, 12, 3);
      ctx.fillRect(ux + 1, uy + 11, 8, 2);
      // Blooming roses inside urn
      ctx.fillStyle = '#15803D';
      ctx.fillRect(ux, uy - 4, 10, 7);
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(ux + 1, uy - 3, 3, 3);
      ctx.fillRect(ux + 6, uy - 2, 3, 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ux + 3, uy - 5, 3, 3);
    };
    drawUrn(x + 4, y + 62);
    drawUrn(x + 96, y + 62);

    // 7. Carved Brass Welcome Archway Plaque (Mounted at x + 36, y + 60)
    ctx.fillStyle = '#92400E';
    ctx.fillRect(x + 36, y + 60, 38, 12);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 37, y + 61, 36, 10);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(x + 38, y + 62, 34, 1); // Top highlight
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 38, y + 70, 34, 1); // Bottom bevel
    ctx.fillStyle = '#451A03';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('WELCOME ARCHWAY', x + 39, y + 67);
    ctx.font = '4px monospace';
    ctx.fillText('PAAARI EXPEDITION', x + 39, y + 70);

    // 8. Scattered Taaza Rose Petals on the Deck
    const petals = [
      { px: x + 24, py: y + 26, c: '#F472B6' },
      { px: x + 32, py: y + 40, c: '#FB7185' },
      { px: x + 48, py: y + 22, c: '#FFFFFF' },
      { px: x + 68, py: y + 34, c: '#F472B6' },
      { px: x + 82, py: y + 24, c: '#FFFFFF' },
      { px: x + 76, py: y + 50, c: '#FB7185' },
      { px: x + 28, py: y + 56, c: '#F472B6' },
    ];
    petals.forEach(p => {
      ctx.fillStyle = p.c;
      ctx.fillRect(p.px, p.py, 2, 2);
    });
  }

  /**
   * AHMAD'S INSPECTABLE HANDWRITTEN POST-IT STICKY NOTE
   * Canary yellow paper square with adhesive tape strip, slight tilt, dog-eared corner,
   * red doodle heart, and subtle floating glow/bounce. (ZERO EMOJIS)
   */
  public static drawStickyNote(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    _label: string,
    frame: number
  ): void {
    const floatY = Math.sin(frame * 0.08 + x) * 1.5;
    const ny = y + floatY;

    // Soft drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(x + 2, ny + 2, 18, 18);

    // Canary Yellow Paper Base (18x18 px)
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(x, ny, 18, 18);

    // Subtle Paper Highlight (Top & Left)
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(x, ny, 18, 1);
    ctx.fillRect(x, ny, 1, 18);

    // Dog-eared folded bottom-right corner
    ctx.fillStyle = '#CA8A04';
    ctx.beginPath();
    ctx.moveTo(x + 14, ny + 18);
    ctx.lineTo(x + 18, ny + 14);
    ctx.lineTo(x + 14, ny + 14);
    ctx.closePath();
    ctx.fill();

    // Semi-transparent Washi Tape strip at top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillRect(x + 4, ny - 2, 10, 3);

    // Doodled Red Pixel Heart (ZERO EMOJIS, drawn purely with canvas rectangles)
    ctx.fillStyle = '#EF4444';
    // Top two humps of the heart
    ctx.fillRect(x + 4, ny + 4, 3, 2);
    ctx.fillRect(x + 8, ny + 4, 3, 2);
    // Middle body
    ctx.fillRect(x + 4, ny + 6, 7, 2);
    // Lower taper
    ctx.fillRect(x + 5, ny + 8, 5, 2);
    // Tip
    ctx.fillRect(x + 6, ny + 10, 3, 1);
    ctx.fillRect(x + 7, ny + 11, 1, 1);

    // Little handwritten ink scribbles (ink blue)
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(x + 4, ny + 13, 10, 1);
    ctx.fillRect(x + 4, ny + 15, 7, 1);

    // Golden interactive sparkle glint (alternating every ~25 frames)
    if ((frame + x) % 50 < 25) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 13, ny + 3, 2, 2);
      ctx.fillRect(x + 14, ny + 2, 1, 4);
      ctx.fillRect(x + 12, ny + 3, 4, 1);
    }
  }

  // ==========================================
  // REALM RENDERER 1: QUEEN BEENISH'S CASTLE
  // ==========================================
  public static renderCastleRealm(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- 1. SKY & KARAKORAM ALPINE NIGHT ATMOSPHERE ---
    // Celestial Deep Starry Gradient: Cosmic Abyss -> Alpine Indigo -> Cold Mountain Dusk
    const skyGrad = ctx.createLinearGradient(0, -200, 0, 240);
    skyGrad.addColorStop(0, '#050714');
    skyGrad.addColorStop(0.5, '#0E132A');
    skyGrad.addColorStop(0.85, '#1A183D');
    skyGrad.addColorStop(1, '#2E234A');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Glowing Crescent Moon & Celestial Aura
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(680, 65, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0E132A';
    ctx.beginPath();
    ctx.arc(672, 60, 22, 0, Math.PI * 2);
    ctx.fill();
    lights.push({ x: 680, y: 65, radius: 95, intensity: 1.0, color: '#FEF08A' });

    // Twinkling Alpine Stars & Nebula Particles
    ctx.fillStyle = '#FFFFFF';
    for (let s = 0; s < 45; s++) {
      const sx = (s * 53) % width;
      const sy = (s * 29) % 170;
      const sGlow = Math.sin(frame * 0.1 + s * 1.6) * 0.4 + 0.6;
      if (sGlow > 0.35) {
        ctx.fillStyle = `rgba(255, 255, 255, ${sGlow})`;
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // Snow-Capped Karakoram Mountain Peaks in Background (Majestic Jagged Scale)
    ctx.fillStyle = '#18153B';
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(100, 30);
    ctx.lineTo(220, 150);
    ctx.lineTo(390, 15);
    ctx.lineTo(550, 130);
    ctx.lineTo(670, 25);
    ctx.lineTo(800, 190);
    ctx.lineTo(800, 600);
    ctx.lineTo(0, 600);
    ctx.fill();

    // Pure White Glacial Snowcaps on Peaks
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(100, 30);
    ctx.lineTo(80, 65);
    ctx.lineTo(120, 65);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(390, 15);
    ctx.lineTo(365, 55);
    ctx.lineTo(415, 55);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(670, 25);
    ctx.lineTo(650, 60);
    ctx.lineTo(690, 60);
    ctx.fill();

    // Alpine Pine Trees Framing Foothills
    this.drawDetailedTree(ctx, 25, 230, 'pine', frame);
    this.drawDetailedTree(ctx, 35, 380, 'pine', frame);
    this.drawDetailedTree(ctx, 745, 230, 'pine', frame);
    this.drawDetailedTree(ctx, 735, 380, 'pine', frame);

    // --- 2. THE MONUMENTAL IMPERIAL FORTRESS ---
    // Matches collision boxes:
    // Left Tower: x: 90..210 (width 120), y: 70..340
    // Right Tower: x: 590..710 (width 120), y: 70..340
    // Central Fortress Keep: x: 190..610 (width 420), y: 70..290

    // A. Main Central Fortress Stone Masonry Wall
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(190, 80, 420, 210);
    // Weathered Granite Ashlar Blocks
    ctx.fillStyle = '#334155';
    for (let sy = 84; sy < 285; sy += 14) {
      const rowOffset = ((sy - 80) / 14) % 2 === 0 ? 0 : 12;
      for (let sx = 194 + rowOffset; sx < 600; sx += 24) {
        ctx.fillRect(sx, sy, 22, 12);
      }
    }

    // B. Crenelated Parapet & Stone Machicolations across Central Wall
    ctx.fillStyle = '#475569';
    ctx.fillRect(185, 74, 430, 8);
    ctx.fillStyle = '#1E293B';
    for (let cx = 190; cx < 605; cx += 22) {
      ctx.fillRect(cx + 6, 70, 10, 6); // Battlements
    }

    // C. TWIN TOWERING FORTRESS BASTIONS (Left & Right)
    const drawBastionTower = (bx: number, isRight: boolean) => {
      // Bastion Ground Contact Shadow
      ctx.fillStyle = 'rgba(10, 15, 30, 0.5)';
      ctx.fillRect(bx - 4, 335, 128, 14);

      // Solid Granite Tower Core
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(bx, 60, 120, 280);
      // Stone Blocks
      ctx.fillStyle = '#334155';
      for (let ty = 65; ty < 335; ty += 14) {
        const toff = ((ty - 65) / 14) % 2 === 0 ? 0 : 10;
        for (let tx = bx + 4 + toff; tx < bx + 112; tx += 20) {
          ctx.fillRect(tx, ty, 18, 12);
        }
      }

      // Moonlit Directional Rim Highlight (catching the crescent moonlight from northeast)
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(bx + 118, 60, 2, 280);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(bx - 6, 52, 132, 2);

      // Corbelled Machicolation Overhang at Top
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx - 6, 52, 132, 10);
      ctx.fillStyle = '#1E293B';
      for (let mx = bx - 4; mx < bx + 120; mx += 18) {
        ctx.fillRect(mx + 4, 46, 10, 8); // Tower crenels
      }

      // Conical Slate Spires on Towers with Golden Star Finials
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.moveTo(bx - 4, 46);
      ctx.lineTo(bx + 60, 5);
      ctx.lineTo(bx + 124, 46);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1'; // Moonlit spire crest highlight
      ctx.fillRect(bx + 62, 5, 2, 41);
      ctx.fillStyle = '#F59E0B'; // Golden Star Crest Finial
      ctx.fillRect(bx + 58, 0, 4, 8);
      ctx.fillRect(bx + 56, 2, 8, 4);

      // Slender Narrow Arrow Slit Windows
      ctx.fillStyle = '#020617';
      ctx.fillRect(bx + 56, 95, 8, 28);
      ctx.fillRect(bx + 56, 155, 8, 28);
      ctx.fillRect(bx + 56, 215, 8, 28);
      ctx.fillStyle = '#FEF08A'; // Interior torch flicker inside arrow slit
      ctx.fillRect(bx + 58, 105, 4, 12);
      ctx.fillRect(bx + 58, 165, 4, 12);

      // Massive Royal Purple Velvet Banners Fluttering in Mountain Wind!
      const bannerX = isRight ? bx + 35 : bx + 50;
      ctx.fillStyle = '#6D28D9'; // Royal velvet purple
      ctx.fillRect(bannerX, 100, 32, 110);
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(bannerX + 2, 100, 28, 108);
      // Gold Embroidered Crest on Banner (Queen Beenish Star)
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(bannerX + 12, 135, 8, 8);
      ctx.fillRect(bannerX + 10, 137, 12, 4);
      // V-Cut Banner Tails with gold fringe
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(bannerX, 210);
      ctx.lineTo(bannerX + 16, 195);
      ctx.lineTo(bannerX + 32, 210);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(bannerX, 208, 32, 2);
    };
    drawBastionTower(90, false);
    drawBastionTower(590, true);

    // D. Central Gothic Pointed-Arch Stained Glass Windows (Royal Violet & Amber)
    const drawStainedGlass = (gx: number, gy: number) => {
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(gx + 20, gy + 15, 18, Math.PI, 0);
      ctx.lineTo(gx + 38, gy + 55);
      ctx.lineTo(gx + 2, gy + 55);
      ctx.fill();
      // Glowing Royal Stained Glass
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.arc(gx + 20, gy + 15, 14, Math.PI, 0);
      ctx.lineTo(gx + 34, gy + 52);
      ctx.lineTo(gx + 6, gy + 52);
      ctx.fill();
      // Stone Tracery Mullions
      ctx.fillStyle = '#334155';
      ctx.fillRect(gx + 18, gy + 2, 4, 52);
      ctx.fillRect(gx + 6, gy + 28, 28, 3);
    };
    drawStainedGlass(240, 120);
    drawStainedGlass(520, 120);
    lights.push({ x: 260, y: 145, radius: 65, intensity: 0.9, color: '#C084FC' });
    lights.push({ x: 540, y: 145, radius: 65, intensity: 0.9, color: '#C084FC' });

    // E. Central Royal Observation Balcony (Overlooking Karakoram Peaks)
    ctx.fillStyle = '#475569';
    ctx.fillRect(360, 150, 80, 24);
    ctx.fillStyle = '#334155';
    ctx.fillRect(362, 152, 76, 20);
    // Stone Balustrade Piers
    ctx.fillStyle = '#64748B';
    ctx.fillRect(356, 168, 88, 8);
    for (let px = 360; px < 436; px += 10) {
      ctx.fillRect(px, 158, 4, 12);
    }
    // High Throne Room Arched Entrance behind Balcony
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(400, 125, 24, Math.PI, 0);
    ctx.lineTo(424, 152);
    ctx.lineTo(376, 152);
    ctx.fill();
    ctx.fillStyle = '#F59E0B'; // Throne room golden chandelier glow
    ctx.beginPath();
    ctx.arc(400, 125, 20, Math.PI, 0);
    ctx.lineTo(420, 152);
    ctx.lineTo(380, 152);
    ctx.fill();
    lights.push({ x: 400, y: 135, radius: 85, intensity: 1.0, color: '#FEF08A' });

    // F. Grand Fortified Portcullis Gate (Main Entrance Archway)
    const gateX = 350;
    const gateY = 210;
    // Heavy Corbelled Stone Arch
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(gateX + 50, gateY + 20, 48, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(gateX + 50, gateY + 20, 40, Math.PI, 0);
    ctx.lineTo(gateX + 90, gateY + 80);
    ctx.lineTo(gateX + 10, gateY + 80);
    ctx.fill();

    // Solid Studded Oak Timber Doors
    ctx.fillStyle = '#3E1C0A';
    ctx.fillRect(gateX + 15, gateY + 20, 70, 60);
    // Heavy Spiked Iron Portcullis Grille
    ctx.fillStyle = '#1E293B';
    for (let ix = gateX + 18; ix < gateX + 85; ix += 10) {
      ctx.fillRect(ix, gateY + 6, 3, 74);
      // Spikes at bottom
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(ix, gateY + 76, 3, 4);
      ctx.fillStyle = '#1E293B';
    }
    for (let iy = gateY + 18; iy < gateY + 75; iy += 14) {
      ctx.fillRect(gateX + 15, iy, 70, 3);
    }

    // --- 3. MOUNTAIN COURTYARD, BRAZIERS, AND ROYAL RED CARPET ---
    // Mountain Courtyard Slate Pavement
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 280, width, height - 280);
    // Moss crevices & Flagstone Grid
    ctx.fillStyle = '#0D1E18';
    for (let x = 40; x < width - 40; x += 24) {
      for (let y = 290; y < height - 20; y += 18) {
        if ((x + y) % 36 === 0) {
          ctx.fillRect(x, y, 16, 12);
        }
      }
    }

    // Approach Road leading down to the exit
    ctx.fillStyle = '#334155';
    ctx.fillRect(340, 330, 120, 270);
    ctx.fillStyle = '#475569';
    ctx.fillRect(344, 330, 112, 270);

    // ROYAL RED CARPET LEADING UP INTO CASTLE GATE
    ctx.fillStyle = '#831843'; // Velvet wine red
    ctx.fillRect(380, 280, 40, 320);
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(383, 280, 34, 320);
    // Subtle velvet pile weave shading
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let cy = 290; cy < 600; cy += 12) {
      ctx.fillRect(383, cy, 34, 1);
    }
    ctx.fillStyle = '#F59E0B'; // Embroidered Gold Trim
    ctx.fillRect(380, 280, 3, 320);
    ctx.fillRect(417, 280, 3, 320);
    // Golden Fringe Tassels at carpet foot
    for (let fx = 380; fx <= 417; fx += 3) {
      ctx.fillRect(fx, 598, 2, 6);
    }

    // Heavy Iron Brazier Fire Cauldrons on Stone Pedestals
    const drawBrazier = (fx: number, fy: number) => {
      // Soft Ground Contact Drop Shadow
      ctx.fillStyle = 'rgba(10, 15, 30, 0.45)';
      ctx.beginPath();
      ctx.ellipse(fx + 11, fy + 28, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stone Pedestal
      ctx.fillStyle = '#334155';
      ctx.fillRect(fx, fy, 22, 28);
      ctx.fillStyle = '#475569';
      ctx.fillRect(fx - 2, fy, 26, 4);
      ctx.fillRect(fx - 2, fy + 24, 26, 4);
      // Cast-Iron Bowl
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(fx + 11, fy, 14, Math.PI, 0);
      ctx.fill();
      // Animated Blazing Fire Core
      const fH = 14 + Math.sin(frame * 0.3 + fx) * 4;
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 11, fy - fH);
      ctx.lineTo(fx + 22, fy);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(fx + 3, fy);
      ctx.lineTo(fx + 11, fy - fH * 0.7);
      ctx.lineTo(fx + 19, fy);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(fx + 9, fy - 6, 4, 6);
    };
    drawBrazier(315, 290);
    drawBrazier(465, 290);
    drawBrazier(190, 330);
    drawBrazier(590, 330);
    lights.push({ x: 326, y: 280, radius: 75, intensity: 1.0, color: '#F59E0B' });
    lights.push({ x: 476, y: 280, radius: 75, intensity: 1.0, color: '#F59E0B' });
    lights.push({ x: 201, y: 320, radius: 65, intensity: 0.95, color: '#F59E0B' });
    lights.push({ x: 601, y: 320, radius: 65, intensity: 0.95, color: '#F59E0B' });

    // Approach Road Victorian Streetlamps
    this.drawVictorianLampPost(ctx, 332, 470, frame);
    this.drawVictorianLampPost(ctx, 456, 470, frame);
    lights.push({ x: 336, y: 456, radius: 55, intensity: 0.9, color: '#F6D78B' });
    lights.push({ x: 460, y: 456, radius: 55, intensity: 0.9, color: '#F6D78B' });

    // Return Portal Plaque at bottom
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(348, 550, 104, 16);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('v RETURN TO DREAM ESTATES v', 352, 560);

    return lights;
  }

  // ============================================================
  // REALM RENDERER 2: THE BATCAVE // DARK BRUTALIST COMPOUND
  // ============================================================
  public static renderMafiaRealm(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- 1. SUBTERRANEAN BASALT ROCK & CONCRETE CAVERN BASE ---
    ctx.fillStyle = '#050811';
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Natural rough basalt rock cavern perimeter & ceiling stalactites
    ctx.fillStyle = '#0B1120';
    for (let rx = 0; rx < width; rx += 24) {
      const rockH = 28 + Math.sin(rx * 0.05) * 14;
      ctx.fillRect(rx, 0, 22, rockH);
      ctx.fillRect(rx, height - rockH, 22, rockH);
      // Pointed stalactites hanging from ceiling
      ctx.beginPath();
      ctx.moveTo(rx, rockH);
      ctx.lineTo(rx + 11, rockH + 12 + Math.sin(rx + frame * 0.02) * 4);
      ctx.lineTo(rx + 22, rockH);
      ctx.fill();
    }
    for (let ry = 0; ry < height; ry += 24) {
      const rockW = 38 + Math.cos(ry * 0.06) * 14;
      ctx.fillRect(0, ry, rockW, 22);
      if (ry < 300 || ry > 420) {
        ctx.fillRect(width - rockW, ry, rockW, 22);
      }
    }

    // Cascading Subterranean Rockface Waterfall in Crevice (x: 40..65, y: 0..300)
    ctx.fillStyle = '#0284C7';
    for (let wy = 0; wy < 280; wy += 8) {
      const flowOffset = (frame * 1.2 + wy) % 24;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fillRect(48 + Math.sin(wy * 0.1) * 3, wy + (flowOffset % 3), 4, 6);
    }
    // Water mist spray at base
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(50, 280, 16, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Industrial Steel Diamond-Plate Flooring
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(45, 160, width - 90, height - 200);
    ctx.fillStyle = '#1E293B';
    for (let fx = 45; fx < width - 45; fx += 16) {
      for (let fy = 160; fy < height - 40; fy += 12) {
        if ((fx + fy) % 24 === 0) {
          ctx.fillRect(fx, fy, 14, 10);
        }
      }
    }

    // Wet Steel Floor Reflections of Amber & Cyan Lights
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(240, 360, 140, 20);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.fillRect(540, 470, 120, 18);

    // Steel plate specular edge glints
    ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
    for (let gx = 55; gx < width - 55; gx += 32) {
      for (let gy = 180; gy < height - 60; gy += 36) {
        ctx.fillRect(gx, gy, 8, 1);
        ctx.fillRect(gx, gy, 1, 6);
      }
    }

    // Inset Neon Cyan Floor Status Lines
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(50, 180, width - 100, 2);
    ctx.fillRect(50, height - 60, width - 100, 2);
    ctx.fillRect(50, 180, 2, height - 240);

    // Industrial Floor Steam Grates with Animated Rising Vapor
    const drawSteamGrate = (gx: number, gy: number) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(gx, gy, 24, 12);
      ctx.fillStyle = '#334155';
      for (let i = 2; i < 22; i += 4) {
        ctx.fillRect(gx + i, gy, 2, 12);
      }
      // Rising steam
      const sY = (frame * 0.6 + gx) % 20;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(gx + 4, gy - sY, 16, 6);
    };
    drawSteamGrate(160, 480);
    drawSteamGrate(460, 480);

    // Massive Brutalist Concrete Cantilever Support Pillars & Steel I-Beams
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(100, 0, 30, height - 40);
    ctx.fillRect(670, 0, 30, height - 40);
    ctx.fillStyle = '#334155';
    ctx.fillRect(102, 0, 8, height - 40);
    ctx.fillRect(672, 0, 8, height - 40);
    // Overhead steel truss cross-beams
    ctx.fillStyle = '#475569';
    ctx.fillRect(100, 45, 600, 8);
    ctx.fillRect(100, 135, 600, 8);

    // Volumetric Industrial Halogen High-Bay Light Cones
    ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.beginPath();
    ctx.moveTo(310, 50);
    ctx.lineTo(210, 320);
    ctx.lineTo(410, 320);
    ctx.fill();

    // --- 2. THE BAT-COMPUTER MEGA COMMAND CENTER (NORTH WALL) ---
    // Outer Armor Housing (x: 120..660, y: 15..165)
    ctx.fillStyle = '#090D16';
    ctx.fillRect(130, 20, 530, 140);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(132, 22, 526, 136);

    // A. GIANT CENTRAL WIDESCREEN (x: 250..540, y: 26..145)
    ctx.fillStyle = '#030712';
    ctx.fillRect(250, 26, 290, 120);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(250, 26, 290, 120); // CRT scanline wash

    // Screen Header
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(252, 28, 286, 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('BAT-COMPUTER // 11/10 BADDIE STATUS & RADAR', 256, 38);

    // Target Profile: Beenish Tasaffar (11/10 Baddie)
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('TARGET: BEENISH TASAFFAR // 11/10 BADDIE', 258, 56);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '5px monospace';
    ctx.fillText('• CLASSIFICATION: POSITION HOLDER // TALENTED GENIUS', 258, 68);
    ctx.fillText('• AESTHETICS: 100/10 // ABSOLUTE PURE MALAIII', 258, 78);
    ctx.fillText('• WEAPONRY: HASEEN ZULFAYEN & DANGEROUS SMILE', 258, 88);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('• PAGLUU STATUS: PERMANENT JAW-DROP // 100% CAPTIVE', 258, 98);
    ctx.fillStyle = '#4ADE80';
    ctx.fillText('• VERDICT: HIGHEST SECURITY CLEARANCE & LOVE', 258, 108);

    // Animated Green Audio Frequency Spectrum Visualizer
    ctx.fillStyle = '#22C55E';
    for (let b = 0; b < 24; b++) {
      const barH = 4 + Math.abs(Math.sin(frame * 0.15 + b * 0.4)) * 14;
      ctx.fillRect(258 + b * 11, 138 - barH, 8, barH);
    }
    lights.push({ x: 395, y: 85, radius: 120, intensity: 1.0, color: '#38BDF8' });

    // B. LEFT TACTICAL NAVIGATION MONITOR (x: 136..244, y: 26..145)
    ctx.fillStyle = '#030712';
    ctx.fillRect(136, 26, 108, 120);
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('MAP: ISLAMABAD / SIALKOT', 140, 36);

    // Rotating Radar Sweep Circle
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(190, 85, 36, 0, Math.PI * 2);
    ctx.stroke();
    // Radar rotating beam
    const radarAng = frame * 0.06;
    ctx.strokeStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(190, 85);
    ctx.lineTo(190 + Math.cos(radarAng) * 36, 85 + Math.sin(radarAng) * 36);
    ctx.stroke();
    // Target Blip
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(180, 75, 4, 4);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(205, 95, 3, 3);
    lights.push({ x: 190, y: 85, radius: 65, intensity: 0.9, color: '#4ADE80' });

    // C. RIGHT VEHICULAR TELEMETRY MONITOR (x: 546..654, y: 26..145)
    ctx.fillStyle = '#030712';
    ctx.fillRect(546, 26, 108, 120);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('VEHICLE STATUS & SPEED', 550, 36);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '4px monospace';
    ctx.fillText('TUMBLER: JET TURBINE [READY]', 550, 48);
    ctx.fillText('BOOST PSI: 48.5 BAR', 550, 56);
    ctx.fillStyle = '#4ADE80';
    ctx.fillText('KAWASAKI NINJA H2R: SUPERCHARGED', 550, 68);
    ctx.fillText('CHALLENGER: V8 HELLCAT [IDLE]', 550, 76);

    // Dials & Tachometer Bars
    ctx.fillStyle = '#EF4444';
    const tachW = 20 + Math.sin(frame * 0.2) * 15;
    ctx.fillRect(550, 88, 60, 5);
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(550, 88, Math.floor(tachW + 20), 5);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '4px monospace';
    ctx.fillText('ENGINE RPM: 14,200', 550, 104);
    lights.push({ x: 600, y: 85, radius: 65, intensity: 0.9, color: '#F59E0B' });

    // Operator Desk Console Table (x: 260..530, y: 146..170)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(260, 146, 270, 22);
    ctx.fillStyle = '#334155';
    ctx.fillRect(262, 148, 266, 18);
    // Glowing Keyboards & Sliders
    ctx.fillStyle = '#38BDF8';
    for (let kx = 270; kx < 520; kx += 16) {
      ctx.fillRect(kx, 152, 10, 5);
      ctx.fillRect(kx + 2, 160, 6, 3);
    }

    // --- 3. CENTER HYDRAULIC TURNTABLE & THE BATMOBILE TUMBLER ---
    const tCenter = { x: 310, y: 310 };
    // Large Circular Turntable Platform (180px x 100px ellipse)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(tCenter.x, tCenter.y, 95, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Turntable Steel Plate
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(tCenter.x, tCenter.y, 88, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow / Black Hazard Chevrons on Perimeter
    ctx.fillStyle = '#F59E0B';
    for (let h = 0; h < 16; h++) {
      const ang = (h / 16) * Math.PI * 2;
      const hx = tCenter.x + Math.cos(ang) * 82;
      const hy = tCenter.y + Math.sin(ang) * 44;
      ctx.fillRect(hx - 3, hy - 2, 6, 4);
    }

    // Centered Tumbler on Turntable
    const tx = tCenter.x - 45;
    const ty = tCenter.y - 25;

    // Dual Massive Off-Road Monster Rear Wheels
    ctx.fillStyle = '#020617';
    ctx.fillRect(tx - 12, ty + 12, 22, 34);
    ctx.fillRect(tx - 8, ty + 16, 14, 26);
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx - 4, ty + 24, 6, 10); // Steel hub
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tx - 2, ty + 20, 3, 5);  // Gold caliper

    // Front Wheels
    ctx.fillStyle = '#020617';
    ctx.fillRect(tx + 68, ty + 20, 16, 24);
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx + 72, ty + 26, 8, 12);

    // Faceted Heavy Matte Carbon Body Chassis
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.moveTo(tx, ty + 20);
    ctx.lineTo(tx + 22, ty + 2);
    ctx.lineTo(tx + 60, ty + 2);
    ctx.lineTo(tx + 80, ty + 18);
    ctx.lineTo(tx + 86, ty + 34);
    ctx.lineTo(tx, ty + 34);
    ctx.fill();

    // Stealth Armor Surface Plates
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(tx + 16, ty + 8, 45, 18);
    ctx.fillStyle = '#334155';
    ctx.fillRect(tx + 20, ty + 12, 14, 4); // Hood vent
    ctx.fillRect(tx + 40, ty + 12, 14, 4);

    // Rear Aerodynamic Fins
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx + 8, ty - 2, 10, 6);
    ctx.fillRect(tx + 36, ty - 2, 10, 6);

    // Center Jet Turbine Afterburner Exhaust (Cyan Plasma Flame!)
    ctx.fillStyle = '#020617';
    ctx.fillRect(tx - 18, ty + 22, 10, 10);
    const pulseLen = 14 + Math.sin(frame * 0.3) * 8;
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(tx - 18 - pulseLen, ty + 24, pulseLen, 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(tx - 18 - pulseLen * 0.6, ty + 26, pulseLen * 0.6, 2);
    // Steel floor reflection of cyan plasma flame
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fillRect(tx - 28 - pulseLen, ty + 38, pulseLen + 14, 6);
    lights.push({ x: tx - 18, y: ty + 27, radius: 85, intensity: 1.0, color: '#38BDF8' });

    // Tumbler Plaque & Label
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('BATMOBILE // TUMBLER', tx + 8, ty + 46);

    // --- 4. LEFT HIGH-OCTANE VEHICLE BAY (NINJA H2R & DODGE CHALLENGER) ---
    const gBay = { x: 65, y: 215, w: 140, h: 100 };
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(gBay.x, gBay.y, gBay.w, gBay.h);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(gBay.x + 2, gBay.y + 2, gBay.w - 4, gBay.h - 4);
    // Yellow hazard perimeter
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(gBay.x, gBay.y, gBay.w, 3);

    // A. KAWASAKI NINJA H2R (x: 75, y: 228)
    const h2rX = gBay.x + 10;
    const h2rY = gBay.y + 15;
    // Wheels
    ctx.fillStyle = '#020617';
    ctx.fillRect(h2rX, h2rY + 12, 8, 16);
    ctx.fillRect(h2rX + 34, h2rY + 12, 8, 16);
    // Trellis Frame (Kawasaki Racing Green)
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(h2rX + 10, h2rY + 8, 22, 4);
    ctx.fillRect(h2rX + 16, h2rY + 4, 12, 10);
    // Carbon Gloss Fairings & Aerodynamic Wings
    ctx.fillStyle = '#090D16';
    ctx.fillRect(h2rX + 24, h2rY + 2, 14, 10);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(h2rX + 36, h2rY + 4, 2, 2); // Headlight
    // Supercharger Turbine
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(h2rX + 18, h2rY + 12, 6, 6);
    // Chrome Dual Exhaust
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(h2rX + 4, h2rY + 18, 10, 3);
    ctx.fillStyle = '#22C55E';
    ctx.font = '5px monospace';
    ctx.fillText('NINJA H2R', h2rX + 4, h2rY + 36);

    // B. DODGE CHALLENGER SRT HELLCAT (x: 135, y: 228)
    const chX = gBay.x + 70;
    const chY = gBay.y + 15;
    // Tires
    ctx.fillStyle = '#020617';
    ctx.fillRect(chX, chY + 14, 10, 16);
    ctx.fillRect(chX + 44, chY + 14, 10, 16);
    // Pitch-black Widebody Muscle Chassis
    ctx.fillStyle = '#020617';
    ctx.fillRect(chX + 4, chY + 4, 46, 20);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(chX + 8, chY + 2, 34, 10); // Cabin
    // Dual Round Projector Halo Headlights (Glowing White/Amber!)
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(chX + 48, chY + 8, 3, 3);
    ctx.fillRect(chX + 48, chY + 14, 3, 3);
    // Dual Hood Air Scoops
    ctx.fillStyle = '#334155';
    ctx.fillRect(chX + 32, chY + 6, 12, 2);
    ctx.fillRect(chX + 32, chY + 10, 12, 2);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('CHALLENGER', chX + 6, chY + 36);

    // Tool Chest & Diagnostic Trolley
    ctx.fillStyle = '#DC2626'; // Red Snap-on tool chest
    ctx.fillRect(gBay.x + 10, gBay.y + 60, 24, 28);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(gBay.x + 12, gBay.y + 66, 20, 2);
    ctx.fillRect(gBay.x + 12, gBay.y + 72, 20, 2);
    ctx.fillRect(gBay.x + 12, gBay.y + 78, 20, 2);

    // Signboard for High-Octane Bay
    ctx.fillStyle = '#020617';
    ctx.fillRect(gBay.x + 38, gBay.y + 66, 92, 18);
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('HIGH-OCTANE SPEED BAY', gBay.x + 42, gBay.y + 75);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '4px monospace';
    ctx.fillText('310 HP H2R + SRT HELLCAT', gBay.x + 42, gBay.y + 81);
    lights.push({ x: gBay.x + 70, y: gBay.y + 40, radius: 70, intensity: 0.9, color: '#22C55E' });

    // --- 5. EAST BATSUIT & TACTICAL ARMORY VAULT ---
    const aVault = { x: 580, y: 185, w: 170, h: 100 };
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(aVault.x, aVault.y, aVault.w, aVault.h);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(aVault.x + 2, aVault.y + 2, aVault.w - 4, aVault.h - 4);

    // 3 Cylindrical Glass Display Pods with Halogen Lighting
    const drawPod = (px: number, py: number, label: string, color: string) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(px, py, 32, 60);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(px + 2, py + 2, 28, 56);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, py, 32, 4); // Top cap
      ctx.fillRect(px, py + 56, 32, 4); // Bottom cap
      // Item silhouette
      ctx.fillStyle = color;
      ctx.fillRect(px + 10, py + 14, 12, 32);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '4px monospace';
      ctx.fillText(label, px + 2, py + 68);
    };
    drawPod(aVault.x + 12, aVault.y + 12, 'BATSUIT', '#475569');
    drawPod(aVault.x + 52, aVault.y + 12, '11/10 DRESS', '#FFFFFF');
    drawPod(aVault.x + 92, aVault.y + 12, 'WEAPONS', '#F59E0B');

    // Biometric Heavy Blast Door with Animated Red Laser
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(aVault.x + 132, aVault.y + 12, 30, 60);
    const laserPos = aVault.y + 16 + ((frame * 0.9) % 50);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(aVault.x + 132, Math.floor(laserPos), 30, 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.fillRect(aVault.x + 132, Math.floor(laserPos) - 2, 30, 6);
    lights.push({ x: aVault.x + 147, y: Math.floor(laserPos), radius: 60, intensity: 0.95, color: '#EF4444' });

    // Armory Vault Sign
    ctx.fillStyle = '#020617';
    ctx.fillRect(aVault.x + 12, aVault.y + 82, 148, 14);
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('TACTICAL ARMORY & BIOMETRIC VAULT', aVault.x + 16, aVault.y + 91);

    // --- 6. SOUTH-EAST SECRET PAISAY TREASURY VAULT ---
    const pVault = { x: 530, y: 395, w: 185, h: 105 };
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(pVault.x, pVault.y, pVault.w, pVault.h);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(pVault.x + 2, pVault.y + 2, pVault.w - 4, pVault.h - 4);

    // Heavy Circular Bank Vault Door (Swung Wide Open!)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(pVault.x + 35, pVault.y + 45, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(pVault.x + 35, pVault.y + 45, 24, 0, Math.PI * 2);
    ctx.fill();
    // Vault locking wheel spoke handle
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(pVault.x + 32, pVault.y + 25, 6, 40);
    ctx.fillRect(pVault.x + 15, pVault.y + 42, 40, 6);

    // Inside Vault: Piles of Gleaming Gold Bullion & Cash Pallets!
    ctx.fillStyle = '#F59E0B'; // Gold Bars
    for (let gx = pVault.x + 75; gx < pVault.x + 175; gx += 16) {
      for (let gy = pVault.y + 20; gy < pVault.y + 60; gy += 10) {
        ctx.fillRect(gx, gy, 14, 8);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(gx, gy, 14, 2);
        ctx.fillStyle = '#F59E0B';
      }
    }
    // Pallets of Cash Stacks
    ctx.fillStyle = '#22C55E';
    for (let cx = pVault.x + 75; cx < pVault.x + 175; cx += 18) {
      ctx.fillRect(cx, pVault.y + 62, 16, 8);
      ctx.fillStyle = '#86EFAC';
      ctx.fillRect(cx + 4, pVault.y + 64, 8, 4);
      ctx.fillStyle = '#22C55E';
    }

    // Glowing Neon Title: DHAYYERRRR SARYYYYYYYYYY PAISAY
    ctx.fillStyle = '#020617';
    ctx.fillRect(pVault.x + 10, pVault.y + 80, 165, 20);
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('DHAYYERRRR SARYYYYYYYYYY PAISAY', pVault.x + 14, pVault.y + 90);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('100 BILLION RUPEES // RESERVED FOR BEENISH', pVault.x + 14, pVault.y + 97);
    lights.push({ x: pVault.x + 120, y: pVault.y + 45, radius: 85, intensity: 1.0, color: '#F59E0B' });

    // --- 7. HIGHWAY TUNNEL EXIT TO VALLEY (RIGHT WALL) ---
    ctx.fillStyle = '#090D16';
    ctx.fillRect(730, 310, 70, 100);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(734, 314, 66, 92);
    // Road lane markings
    ctx.fillStyle = '#F59E0B';
    for (let rx = 740; rx < width; rx += 18) {
      ctx.fillRect(rx, 358, 10, 3);
    }
    // Modern industrial tunnel portal lights
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(730, 310, 4, 100);
    lights.push({ x: 745, y: 360, radius: 60, intensity: 0.95, color: '#38BDF8' });

    // Exit Tunnel Plaque
    ctx.fillStyle = '#020617';
    ctx.fillRect(660, 415, 130, 16);
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('> HIGHWAY TUNNEL TO DREAM ESTATES >', 664, 426);

    return lights;
  }


  // ==========================================
  // REALM RENDERER 3: ISLAMABAD 5-MARLA VILLA
  // ==========================================
  public static renderIslamabadRealm(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- 1. MARGALLA TWILIGHT & CELESTIAL BACKGROUND SKY ---
    // Deep atmospheric gradient: Midnight Navy -> Pine Twilight -> Soft Lilac Dusk Mist
    const skyGrad = ctx.createLinearGradient(0, -200, 0, 240);
    skyGrad.addColorStop(0, '#060D1A');
    skyGrad.addColorStop(0.45, '#0B211B');
    skyGrad.addColorStop(0.8, '#1A332C');
    skyGrad.addColorStop(1, '#2D3B47');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Alpine Twinkling Stars in Margalla Night Sky
    ctx.fillStyle = '#FFFFFF';
    for (let s = 0; s < 45; s++) {
      const sx = (s * 53) % width;
      const sy = (s * 31) % 170;
      const sAlpha = Math.sin(frame * 0.08 + s * 1.5) * 0.45 + 0.55;
      if (sAlpha > 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // Layer 1: Distant Murree & Himalayan Foothills in Deep Indigo Mist
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(0, 190);
    ctx.lineTo(80, 80);
    ctx.lineTo(210, 130);
    ctx.lineTo(360, 45);
    ctx.lineTo(510, 110);
    ctx.lineTo(650, 40);
    ctx.lineTo(800, 140);
    ctx.lineTo(800, 260);
    ctx.lineTo(0, 260);
    ctx.fill();

    // Snow-dusted distant crests
    ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
    ctx.beginPath();
    ctx.moveTo(360, 45);
    ctx.lineTo(348, 62);
    ctx.lineTo(372, 62);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(650, 40);
    ctx.lineTo(638, 58);
    ctx.lineTo(662, 58);
    ctx.fill();

    // Layer 2: Main Margalla Hills Ridgeline (Rich Pine Forest Canopy Contours)
    ctx.fillStyle = '#0D2821';
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.lineTo(90, 115);
    ctx.lineTo(180, 150);
    ctx.lineTo(300, 90);
    ctx.lineTo(440, 140);
    ctx.lineTo(580, 75);
    ctx.lineTo(710, 130);
    ctx.lineTo(800, 85);
    ctx.lineTo(800, 310);
    ctx.lineTo(0, 310);
    ctx.fill();

    // Jagged Pine Tree Ridge Silhouettes along Margalla Crest
    ctx.fillStyle = '#13352C';
    for (let rx = 0; rx < width; rx += 14) {
      const rBaseY = 130 + Math.sin(rx * 0.03) * 35;
      ctx.fillRect(rx, rBaseY - 8, 3, 10);
      ctx.fillRect(rx - 2, rBaseY - 4, 7, 6);
    }

    // Layer 3: Iconic Faisal Mosque Silhouette nestled at Margalla Foothills (x: 520..590, y: 65..115)
    // 4 Slender Illuminated White Minarets
    ctx.fillStyle = '#E2E8F0';
    const minaretsX = [522, 538, 572, 588];
    minaretsX.forEach((mx) => {
      ctx.fillRect(mx, 55, 3, 50);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(mx, 53, 3, 3); // Minaret beacon tip
      ctx.fillStyle = '#E2E8F0';
    });
    // Iconic Tent-Shaped Marble Main Prayer Hall
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(555, 68);
    ctx.lineTo(535, 105);
    ctx.lineTo(575, 105);
    ctx.fill();
    // Warm interior hall glow through triangular glass
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(550, 86, 10, 16);
    lights.push({ x: 555, y: 88, radius: 45, intensity: 0.8, color: '#FEF08A' });

    // Distant Scattered Islamabad Streetlights (Sectors F-6 / F-7 / Daman-e-Koh)
    for (let l = 0; l < 18; l++) {
      const lx = (l * 43 + 30) % width;
      const ly = 135 + (l * 17) % 55;
      const lColor = l % 3 === 0 ? '#FEF08A' : '#F8FAFC';
      ctx.fillStyle = lColor;
      ctx.fillRect(lx, ly, 2, 2);
    }

    // Animated Translucent Valley Mist Clouds Drifting Across Foothills
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let m = 0; m < 5; m++) {
      const mx = ((m * 190 + frame * 0.4) % (width + 300)) - 150;
      const my = 150 + (m * 22);
      ctx.beginPath();
      ctx.ellipse(mx, my, 120, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tall Stately Islamabad Chir Pine Trees Framing Left & Right Foothills
    this.drawDetailedTree(ctx, 35, 210, 'pine', frame);
    this.drawDetailedTree(ctx, 45, 360, 'pine', frame);
    this.drawDetailedTree(ctx, 725, 210, 'pine', frame);
    this.drawDetailedTree(ctx, 735, 360, 'pine', frame);

    // --- 2. GROUND PLANE: MANICURED EMERALD FRONT LAWN & FLOWERBEDS ---
    ctx.fillStyle = '#14532D'; // Deep rich emerald turf
    ctx.fillRect(0, 190, width, height - 190);
    // Alternating horizontal mowing stripes for ultra-realistic lawn texture
    ctx.fillStyle = '#166534';
    for (let ly = 190; ly < height; ly += 24) {
      ctx.fillRect(0, ly, width, 12);
    }

    // --- 3. ARCHITECTURAL MASTERPIECE: THE 5-MARLA CONTEMPORARY VILLA ---
    // Dimensions: x: 170..630 (width: 460), y: 95..315 (height: 220)
    const vx = 170;
    const vy = 95;
    const vw = 460;
    const vh = 220;

    // A. Main Travertine Stone Villa Base & Shadow
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(vx - 4, vy + vh - 6, vw + 8, 12); // Ground drop shadow
    ctx.fillStyle = '#F8FAFC'; // Pristine off-white travertine
    ctx.fillRect(vx, vy + 40, vw, vh - 40);

    // Subtle vertical ambient shading on travertine (eave highlight to grounded base)
    const travGrad = ctx.createLinearGradient(vx, vy + 40, vx, vy + vh);
    travGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    travGrad.addColorStop(0.7, 'rgba(241, 245, 249, 0)');
    travGrad.addColorStop(1, 'rgba(15, 23, 42, 0.14)');
    ctx.fillStyle = travGrad;
    ctx.fillRect(vx, vy + 40, vw, vh - 40);

    // Architectural Travertine Seam Grooves
    ctx.fillStyle = '#E2E8F0';
    for (let sy = vy + 60; sy < vy + vh; sy += 25) {
      ctx.fillRect(vx, sy, vw, 1);
    }

    // B. Warm Brazilian Teak Horizontal Timber Louvers (Upper Facade Accent)
    ctx.fillStyle = '#78350F';
    ctx.fillRect(vx + 160, vy + 42, 290, 68);
    ctx.fillStyle = '#92400E';
    for (let ty = vy + 44; ty < vy + 108; ty += 5) {
      ctx.fillRect(vx + 160, ty, 290, 2);
    }

    // C. Massive Charcoal Cantilevered Roof Slab
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(vx - 14, vy + 24, vw + 28, 18);
    ctx.fillStyle = '#334155';
    ctx.fillRect(vx - 14, vy + 24, vw + 28, 4); // Roof top fascia edge
    // Warm Recessed Linear LED Strip Lighting under Roof Eaves
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(vx - 10, vy + 40, vw + 20, 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
    ctx.fillRect(vx - 10, vy + 42, vw + 20, 8);

    // Roof Chimney with Animated Smoke
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(vx + 410, vy + 2, 16, 24);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(vx + 408, vy, 20, 4);
    const cSmokeY = (frame * 0.1) % 18;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(vx + 418, vy - 6 - cSmokeY, 5 + cSmokeY * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // D. Left Wing: Covered Carport / Portico (x: vx..vx+90, y: vy+100..vy+vh)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(vx + 10, vy + 110, 80, vh - 110);
    // Dark Charcoal Granite Paved Carport Floor
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(vx + 10, vy + vh - 40, 80, 40);
    // Solid Concrete Support Pillar
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(vx + 85, vy + 110, 10, vh - 110);
    // Brushed Stainless Steel Address Plaque
    ctx.fillStyle = '#020617';
    ctx.fillRect(vx + 18, vy + 125, 62, 16);
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('HOUSE 31 // F-7', vx + 22, vy + 135);

    // E. Double-Height Glazed Entrance Foyer (x: vx+175..vx+235)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(vx + 175, vy + 110, 60, vh - 110);
    // Solid Sheesham Wood Pivot Door
    ctx.fillStyle = '#451A03';
    ctx.fillRect(vx + 185, vy + 130, 40, vh - 130);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(vx + 187, vy + 132, 36, vh - 134);
    // Vertical Brushed Brass Bar Handle
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(vx + 218, vy + 160, 3, 24);
    // Porch Entrance Sconce Light
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(vx + 178, vy + 145, 4, 8);
    lights.push({ x: vx + 205, y: vy + 165, radius: 75, intensity: 1.0, color: '#F6D78B' });

    // F. Ground Floor Panoramic Living Lounge Bay Window (Baraaa Sofa for Beenie inside!)
    const gwX = vx + 245;
    const gwY = vy + 125;
    const gwW = 195;
    const gwH = vh - 125;
    // Dark Graphite Window Frame
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(gwX, gwY, gwW, gwH);
    // Warm Golden Interior Radiance
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(gwX + 4, gwY + 4, gwW - 8, gwH - 8);

    // Window Mullions (Floor-to-Ceiling Contemporary Grid)
    ctx.fillStyle = '#334155';
    ctx.fillRect(gwX + 65, gwY + 4, 3, gwH - 8);
    ctx.fillRect(gwX + 130, gwY + 4, 3, gwH - 8);

    // --- INSIDE THE LIVING LOUNGE: THE FAMOUS BARAAA SOFA FOR BEENIE ---
    // Massive Plush Cream Velvet L-Shaped Sectional Sofa!
    ctx.fillStyle = '#E5DDD0'; // Base shadow
    ctx.fillRect(gwX + 15, gwY + 42, 165, 38);
    ctx.fillStyle = '#FDFBF7'; // Cream velvet cushion tops
    ctx.fillRect(gwX + 18, gwY + 38, 160, 20);
    // Left Chaise Lounge Return
    ctx.fillRect(gwX + 18, gwY + 28, 42, 34);
    // Blush Pink Silk Throw Cushions for Beenie!
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(gwX + 22, gwY + 32, 12, 10);
    ctx.fillStyle = '#FB7185';
    ctx.fillRect(gwX + 75, gwY + 34, 14, 10);
    ctx.fillRect(gwX + 140, gwY + 34, 14, 10);
    // Knitted Lilac Throw Blanket draped over sofa corner
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(gwX + 158, gwY + 40, 16, 24);

    // Modern Dark Walnut Coffee Table with Cardamom Chai
    ctx.fillStyle = '#78350F';
    ctx.fillRect(gwX + 60, gwY + 62, 75, 14);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(gwX + 62, gwY + 60, 71, 4); // Table top
    // 2 Steaming Mugs of Elaichi Chai
    ctx.fillStyle = '#F8FAFC'; // White ceramic mugs
    ctx.fillRect(gwX + 80, gwY + 54, 8, 8);
    ctx.fillRect(gwX + 105, gwY + 54, 8, 8);
    ctx.fillStyle = '#B45309'; // Chai tea color
    ctx.fillRect(gwX + 81, gwY + 55, 6, 3);
    ctx.fillRect(gwX + 106, gwY + 55, 6, 3);
    // Animated steam wisps rising from chai
    const chaiSteam = (frame * 0.12) % 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(gwX + 83, gwY + 50 - chaiSteam, 2, 4);
    ctx.fillRect(gwX + 108, gwY + 50 - chaiSteam, 2, 4);

    // Framed Couple Silhouette Artwork on Living Room Back Wall
    ctx.fillStyle = '#78350F';
    ctx.fillRect(gwX + 85, gwY + 12, 30, 20);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(gwX + 87, gwY + 14, 26, 16);
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(gwX + 96, gwY + 18, 8, 8); // Heart/couple icon
    lights.push({ x: gwX + 100, y: gwY + 50, radius: 95, intensity: 1.0, color: '#FEF08A' });

    // Specular Glass Sheen Streaks across the Living Lounge Bay Window
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gwX + 20, gwY + 6);
    ctx.lineTo(gwX + 65, gwY + gwH - 6);
    ctx.moveTo(gwX + 80, gwY + 6);
    ctx.lineTo(gwX + 130, gwY + gwH - 6);
    ctx.moveTo(gwX + 145, gwY + 6);
    ctx.lineTo(gwX + 185, gwY + gwH - 6);
    ctx.stroke();

    // Floor Light Bloom: Warm golden radiance bleeding softly onto the travertine patio
    const patioBloom = ctx.createLinearGradient(gwX, gwY + gwH, gwX, gwY + gwH + 26);
    patioBloom.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
    patioBloom.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = patioBloom;
    ctx.fillRect(gwX - 10, gwY + gwH, gwW + 20, 26);

    // G. SECOND FLOOR: THE 3 KIDS' BEDROOMS & ARCHITECTURAL BALCONIES (y: vy+42..vy+115)
    // 1. Room 1 (Left - x: vx+15..vx+150): Boy 1 - Samurai Jack (Blue Theme)
    const r1X = vx + 15;
    const r1Y = vy + 45;
    const r1W = 130;
    const r1H = 65;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(r1X, r1Y, r1W, r1H);
    // Cool Ocean Samurai Blue Interior Glow
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(r1X + 4, r1Y + 4, r1W - 8, r1H - 8);
    // Japanese Shoji Sliding Screen Lines
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(r1X + 45, r1Y + 4, 2, r1H - 8);
    ctx.fillRect(r1X + 85, r1Y + 4, 2, r1H - 8);
    // Glass Balcony with Displayed Samurai Jack Katana
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(r1X, r1Y + r1H - 12, r1W, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(r1X, r1Y + r1H - 12, r1W, 2); // Glass top rail
    // The Samurai Jack Katana on Wooden Display Stand!
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(r1X + 45, r1Y + r1H - 8, 40, 2); // Stand
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(r1X + 40, r1Y + r1H - 10, 48, 2); // Steel blade
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(r1X + 84, r1Y + r1H - 11, 8, 4); // Red wrapped hilt
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(r1X + 82, r1Y + r1H - 12, 3, 6); // Tsuba guard
    lights.push({ x: r1X + 65, y: r1Y + 30, radius: 55, intensity: 0.85, color: '#38BDF8' });

    // 2. Room 2 (Center - x: vx+160..vx+295): Boy 2 - Starry (Light Purple Theme)
    const r2X = vx + 160;
    const r2Y = vy + 45;
    const r2W = 130;
    const r2H = 65;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(r2X, r2Y, r2W, r2H);
    // Starry Lavender Galaxy Glow
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(r2X + 4, r2Y + 4, r2W - 8, r2H - 8);
    // Glowing Constellation Star Map on Room Wall
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(r2X + 35, r2Y + 16, 2, 2);
    ctx.fillRect(r2X + 55, r2Y + 12, 2, 2);
    ctx.fillRect(r2X + 75, r2Y + 20, 2, 2);
    ctx.fillRect(r2X + 95, r2Y + 14, 2, 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.fillRect(r2X + 37, r2Y + 16, 18, 1);
    ctx.fillRect(r2X + 57, r2Y + 14, 18, 1);
    // Balcony Railing with Woven Warm Fairy Lights
    ctx.fillStyle = '#6B21A8';
    ctx.fillRect(r2X, r2Y + r2H - 12, r2W, 12);
    for (let fx = r2X + 8; fx < r2X + r2W - 8; fx += 14) {
      ctx.fillStyle = (fx + frame) % 20 < 10 ? '#FEF08A' : '#FDE047';
      ctx.fillRect(fx, r2Y + r2H - 8, 3, 3);
    }
    // Brass Astronomical Telescope Pointed at Margalla Night Sky
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(r2X + 105, r2Y + r2H - 20, 14, 4); // Brass tube
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(r2X + 110, r2Y + r2H - 16, 4, 10); // Tripod
    lights.push({ x: r2X + 65, y: r2Y + 30, radius: 55, intensity: 0.85, color: '#C084FC' });

    // 3. Room 3 (Right - x: vx+305..vx+445): Baby Girl - Princess & GIANT 6-FOOT TEDDY BEAR (Baby Pink Theme)
    const r3X = vx + 305;
    const r3Y = vy + 45;
    const r3W = 140;
    const r3H = 65;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(r3X, r3Y, r3W, r3H);
    // Enchanted Rose Baby Pink Interior Glow
    ctx.fillStyle = '#FB7185';
    ctx.fillRect(r3X + 4, r3Y + 4, r3W - 8, r3H - 8);
    // Delicate Sheer White Canopy Drapery
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(r3X + 20, r3Y + 8, 20, 36);
    ctx.fillRect(r3X + 95, r3Y + 8, 20, 36);
    // Balcony with THE GIANT 6-FOOT TEDDY BEAR!
    ctx.fillStyle = '#9D174D';
    ctx.fillRect(r3X, r3Y + r3H - 12, r3W, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(r3X, r3Y + r3H - 12, r3W, 2);

    // THE GIANT 6-FOOT TEDDY BEAR SITTING RIGHT ON BALCONY!
    const bx = r3X + 60;
    const by = r3Y + r3H - 34;
    // Chubby Teddy Bear Body
    ctx.fillStyle = '#78350F'; // Soft brown plush fur
    ctx.fillRect(bx + 2, by + 10, 22, 18);
    // Round Head & Cute Ears
    ctx.fillRect(bx + 4, by, 18, 14);
    ctx.fillRect(bx + 2, by - 3, 6, 6); // Left ear
    ctx.fillRect(bx + 18, by - 3, 6, 6); // Right ear
    // Muzzle & Beaded Eyes
    ctx.fillStyle = '#FDE68A';
    ctx.fillRect(bx + 8, by + 6, 10, 6);
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 12, by + 7, 2, 2); // Nose
    ctx.fillRect(bx + 7, by + 3, 2, 2); // Left eye
    ctx.fillRect(bx + 17, by + 3, 2, 2); // Right eye
    // Big Chubby Teddy Paws
    ctx.fillStyle = '#78350F';
    ctx.fillRect(bx - 3, by + 12, 6, 8); // Left arm
    ctx.fillRect(bx + 23, by + 12, 6, 8); // Right arm
    ctx.fillRect(bx + 2, by + 24, 8, 8);  // Left foot paw
    ctx.fillRect(bx + 16, by + 24, 8, 8); // Right foot paw
    // Princess Pink Silk Bow Tie on Teddy Bear!
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(bx + 9, by + 12, 8, 4);
    ctx.fillRect(bx + 11, by + 11, 4, 6);
    lights.push({ x: r3X + 70, y: r3Y + 30, radius: 65, intensity: 1.0, color: '#FB7185' });

    // --- 4. MANICURED FRONT YARD, BOUGAINVILLEA, AND PAVED APPROACH ROAD ---
    // Vibrant Hot Pink Bougainvillea Creeping up Villa Walls
    const drawBougainvillea = (gx: number, gy: number, gh: number) => {
      ctx.fillStyle = '#14532D';
      ctx.fillRect(gx, gy, 12, gh);
      ctx.fillStyle = '#EC4899';
      for (let f = 0; f < 18; f++) {
        const fx = gx - 4 + (f * 7) % 20;
        const fy = gy + (f * 9) % gh;
        ctx.fillRect(fx, fy, 4, 4);
        ctx.fillStyle = '#F472B6';
        ctx.fillRect(fx + 1, fy + 1, 2, 2);
        ctx.fillStyle = '#EC4899';
      }
    };
    drawBougainvillea(vx - 2, vy + 90, vh - 90);
    drawBougainvillea(vx + vw - 12, vy + 90, vh - 90);

    // Front Garden Flowerbeds (Fragrant White Chambeli & Jasmine)
    const drawJasmineBed = (fx: number, fy: number, fw: number) => {
      ctx.fillStyle = '#14532D';
      ctx.fillRect(fx, fy, fw, 12);
      ctx.fillStyle = '#FFFFFF';
      for (let j = 0; j < fw; j += 10) {
        ctx.fillRect(fx + j + 2, fy + 3, 3, 3);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(fx + j + 3, fy + 4, 1, 1);
        ctx.fillStyle = '#FFFFFF';
      }
    };
    drawJasmineBed(vx + 15, vy + vh + 10, 140);
    drawJasmineBed(vx + 270, vy + vh + 10, 160);

    // Sector F-7 Marble & Brass Lawn Plaque at (230, 420) (for islamabad_lawn_sign)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(248, 434, 8, 14); // Post
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(230, 418, 44, 20); // White marble plaque
    ctx.strokeStyle = '#F59E0B';
    ctx.strokeRect(230, 418, 44, 20);
    ctx.fillStyle = '#064E3B';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('SECTOR F-7', 235, 426);
    ctx.fillStyle = '#B45309';
    ctx.font = '4px monospace';
    ctx.fillText('5-MARLA HAVEN', 233, 433);

    // Modern Low Concrete Boundary Wall with LED Wall-Washers
    ctx.fillStyle = '#334155';
    ctx.fillRect(vx + 10, vy + vh + 26, vw - 20, 12);
    ctx.fillStyle = '#475569';
    ctx.fillRect(vx + 10, vy + vh + 26, vw - 20, 2); // Cap
    // Linear LED Wall-Grazer Glow
    ctx.fillStyle = '#FEF08A';
    for (let wx = vx + 30; wx < vx + vw - 30; wx += 50) {
      ctx.fillRect(wx, vy + vh + 36, 12, 2);
    }

    // Wide Central Cobblestone Approach Walkway leading south (x: 340..460)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(340, vy + vh + 20, 120, height - (vy + vh + 20));
    ctx.fillStyle = '#334155';
    ctx.fillRect(344, vy + vh + 20, 112, height - (vy + vh + 20));
    // Individual paver detail
    for (let by = vy + vh + 24; by < height; by += 14) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(346, by, 108, 1);
    }

    // Approach Road Victorian Streetlamps
    this.drawVictorianLampPost(ctx, 332, 470, frame);
    this.drawVictorianLampPost(ctx, 456, 470, frame);
    lights.push({ x: 336, y: 456, radius: 60, intensity: 0.95, color: '#F6D78B' });
    lights.push({ x: 460, y: 456, radius: 60, intensity: 0.95, color: '#F6D78B' });

    // Exit Plaque at bottom
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(348, 550, 104, 16);
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('v RETURN TO DREAM ESTATES v', 352, 560);

    return lights;
  }

  // ==========================================
  // REALM RENDERER 4: SWEET DREAMS PATISSERIE
  // ==========================================
  public static renderBakeryRealm(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- 1. PARISIAN TWILIGHT & HISTORIC SKYLINE ---
    const skyGrad = ctx.createLinearGradient(0, -200, 0, 220);
    skyGrad.addColorStop(0, '#1E1624');
    skyGrad.addColorStop(0.5, '#3B1D45');
    skyGrad.addColorStop(0.85, '#5B2956');
    skyGrad.addColorStop(1, '#7C3A68');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Distant Parisian Zinc Mansard Rooflines & Chimneys
    ctx.fillStyle = '#26182E';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.lineTo(100, 120);
    ctx.lineTo(140, 140);
    ctx.lineTo(240, 100);
    ctx.lineTo(310, 130);
    ctx.lineTo(460, 90);
    ctx.lineTo(570, 140);
    ctx.lineTo(690, 95);
    ctx.lineTo(800, 150);
    ctx.lineTo(800, 260);
    ctx.lineTo(0, 260);
    ctx.fill();

    // Silhouetted Parisian Dormer Windows & Classical Chimney Pots
    ctx.fillStyle = '#1A1020';
    const dormers = [120, 220, 480, 670];
    dormers.forEach((dx) => {
      ctx.fillRect(dx, 80, 18, 22);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(dx + 4, 86, 10, 12); // Candlelit attic window
      ctx.fillStyle = '#1A1020';
    });

    // --- 2. THE GRAND HAUSSMANNIAN PATISSERIE BUILDING ---
    // Spanning x: 170..680 (width: 510), y: 45..310 (height: 265)
    const bx = 170;
    const by = 45;
    const bw = 510;
    const bh = 265;

    // A. Classical Cut-Limestone Facade
    ctx.fillStyle = '#E2D9CC'; // French limestone
    ctx.fillRect(bx, by + 40, bw, bh - 40);
    ctx.fillStyle = '#D6CCBE';
    for (let ly = by + 55; ly < by + bh; ly += 20) {
      ctx.fillRect(bx, ly, bw, 1);
    }

    // B. Ornate Slate Mansard Roof & Decorative Stone Cornice
    ctx.fillStyle = '#334155'; // Slate Mansard
    ctx.beginPath();
    ctx.moveTo(bx - 12, by + 40);
    ctx.lineTo(bx + 35, by);
    ctx.lineTo(bx + bw - 35, by);
    ctx.lineTo(bx + bw + 12, by + 40);
    ctx.fill();

    // Decorative Molded Stone Cornice with Dentils
    ctx.fillStyle = '#F1ECE1';
    ctx.fillRect(bx - 14, by + 38, bw + 28, 8);
    ctx.fillStyle = '#C8BEAF';
    for (let dx = bx - 10; dx < bx + bw + 10; dx += 10) {
      ctx.fillRect(dx, by + 42, 5, 4);
    }

    // Brick Chimneys with Animated Sweet Vanilla Pastry Smoke
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(bx + 40, by - 16, 18, 24);
    ctx.fillRect(bx + bw - 60, by - 16, 18, 24);
    const smokePuff1 = (frame * 0.12) % 18;
    const smokePuff2 = ((frame + 40) * 0.12) % 18;
    ctx.fillStyle = 'rgba(255, 241, 242, 0.45)';
    ctx.beginPath();
    ctx.arc(bx + 49, by - 20 - smokePuff1, 5 + smokePuff1 * 0.4, 0, Math.PI * 2);
    ctx.arc(bx + bw - 51, by - 20 - smokePuff2, 5 + smokePuff2 * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // C. Upper Floor French Windows with Wrought-Iron Juliet Balconies & Ivy
    const drawFrenchWindow = (wx: number, wy: number) => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(wx, wy, 45, 60);
      // Warm interior lamp glow with lace curtains
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(wx + 3, wy + 3, 39, 54);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(wx + 3, wy + 3, 10, 54); // Lace curtain
      ctx.fillRect(wx + 32, wy + 3, 10, 54);
      // Intricate Black Wrought-Iron Juliet Balcony
      ctx.fillStyle = '#020617';
      ctx.fillRect(wx - 4, wy + 40, 53, 22);
      ctx.fillStyle = '#475569';
      for (let ix = wx - 2; ix < wx + 48; ix += 6) {
        ctx.fillRect(ix, wy + 42, 2, 18);
      }
      // Trailing Ivy Vines
      ctx.fillStyle = '#15803D';
      ctx.fillRect(wx - 2, wy + 58, 12, 8);
      ctx.fillRect(wx + 38, wy + 58, 12, 8);
    };
    drawFrenchWindow(bx + 35, by + 55);
    drawFrenchWindow(bx + 160, by + 55);
    drawFrenchWindow(bx + 305, by + 55);
    drawFrenchWindow(bx + 430, by + 55);

    // D. Ground Floor Patisserie Storefront (Rich Rosewood & Gilded Gold Lettering)
    const sfY = by + 125;
    const sfH = bh - 125;
    ctx.fillStyle = '#4C0519'; // Deep rich rosewood
    ctx.fillRect(bx, sfY, bw, sfH);
    ctx.fillStyle = '#831843';
    ctx.fillRect(bx + 4, sfY + 4, bw - 8, sfH - 8);

    // Gilded Signboard Header
    ctx.fillStyle = '#1F030B';
    ctx.fillRect(bx + 30, sfY + 8, bw - 60, 22);
    ctx.fillStyle = '#F59E0B'; // Gold leaf trim
    ctx.fillRect(bx + 30, sfY + 8, bw - 60, 2);
    ctx.fillRect(bx + 30, sfY + 28, bw - 60, 2);
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('SWEET DREAMS PATISSERIE // BOULANGERIE DE BEENISH', bx + 48, sfY + 22);

    // E. Striped Scalloped Awning in Baby Pink & Cream White
    const awnY = sfY + 34;
    for (let ax = bx + 20; ax < bx + bw - 20; ax += 16) {
      const isPink = (Math.floor((ax - bx) / 16) % 2) === 0;
      ctx.fillStyle = isPink ? '#F472B6' : '#FFFFFF';
      ctx.fillRect(ax, awnY, 16, 22);
      // Scalloped bottom edge
      ctx.beginPath();
      ctx.arc(ax + 8, awnY + 22, 8, 0, Math.PI);
      ctx.fill();
    }

    // F. Massive Curved Bay Display Windows (Tiered Pastries & Cakes!)
    const drawPastryBay = (wx: number, wy: number, ww: number) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(wx, wy, ww, 85);
      // Buttery Warm Golden Illumination
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(wx + 4, wy + 4, ww - 8, 77);

      // 3 Tiered Polished Mahogany Display Shelves
      ctx.fillStyle = '#78350F';
      ctx.fillRect(wx + 8, wy + 26, ww - 16, 3);
      ctx.fillRect(wx + 8, wy + 52, ww - 16, 3);
      ctx.fillRect(wx + 8, wy + 74, ww - 16, 3);

      // Top Shelf: Tiered Strawberry Birthday Cake & Heart Macaron Tower!
      ctx.fillStyle = '#FB7185';
      ctx.fillRect(wx + 25, wy + 12, 28, 14);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(wx + 28, wy + 8, 22, 6); // Tier 2
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(wx + 36, wy + 4, 6, 4);  // Fresh Strawberry on top!
      // Heart Macaron Tower
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(wx + ww - 45, wy + 10, 16, 16);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(wx + ww - 42, wy + 14, 10, 4);

      // Middle Shelf: Flaky Golden Chocolate Croissants & Fresh French Baguettes
      ctx.fillStyle = '#B45309';
      for (let c = 0; c < 4; c++) {
        ctx.fillRect(wx + 16 + c * 24, wy + 42, 16, 9);
        ctx.fillStyle = '#78350F'; // Chocolate seam
        ctx.fillRect(wx + 19 + c * 24, wy + 45, 10, 3);
        ctx.fillStyle = '#B45309';
      }
      // Wicker Basket with Baguettes
      ctx.fillStyle = '#D97706';
      ctx.fillRect(wx + ww - 32, wy + 34, 18, 18);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(wx + ww - 30, wy + 24, 4, 20);
      ctx.fillRect(wx + ww - 24, wy + 22, 4, 22);

      // Bottom Shelf: Glossy Fruit Tarts & Chocolate Truffle Pyramids
      for (let t = 0; t < 5; t++) {
        const tx = wx + 14 + t * 22;
        ctx.fillStyle = '#D97706';
        ctx.fillRect(tx, wy + 66, 14, 7);
        ctx.fillStyle = t % 2 === 0 ? '#EF4444' : '#38BDF8'; // Berries
        ctx.fillRect(tx + 2, wy + 64, 10, 3);
      }

      // Specular Glass Sheen across the Curved Pastry Bay Window
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx + 18, wy + 8);
      ctx.lineTo(wx + 55, wy + 74);
      ctx.moveTo(wx + ww - 50, wy + 8);
      ctx.lineTo(wx + ww - 18, wy + 62);
      ctx.stroke();
    };
    drawPastryBay(bx + 25, sfY + 62, 210);

    // G. Cozy Bakery Entrance Door with Heart Glass Window
    const drX = bx + 250;
    const drY = sfY + 62;
    ctx.fillStyle = '#701A75';
    ctx.fillRect(drX, drY, 55, 88);
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(drX + 4, drY + 4, 47, 80);
    // Heart-shaped Frosted Glass Window
    ctx.fillStyle = '#FDF2F8';
    ctx.beginPath();
    ctx.arc(drX + 22, drY + 28, 8, 0, Math.PI * 2);
    ctx.arc(drX + 34, drY + 28, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F59E0B'; // Brass door kickplate & knob
    ctx.fillRect(drX + 4, drY + 74, 47, 8);
    ctx.fillRect(drX + 44, drY + 48, 4, 4);

    // Chalkboard Easel on Pavement
    ctx.fillStyle = '#78350F';
    ctx.fillRect(drX + 65, drY + 35, 26, 45);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(drX + 67, drY + 37, 22, 38);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '3px monospace';
    ctx.fillText('HOT FRESH', drX + 69, drY + 46);
    ctx.fillText('CROISSANTS', drX + 69, drY + 54);
    ctx.fillText('FOR BUBU', drX + 69, drY + 62);

    // Right Display Bay (Macarons & Gourmet Cupcakes)
    drawPastryBay(bx + 315, sfY + 62, 175);
    lights.push({ x: bx + 130, y: sfY + 105, radius: 90, intensity: 1.0, color: '#FEF08A' });
    lights.push({ x: bx + 400, y: sfY + 105, radius: 90, intensity: 1.0, color: '#FEF08A' });

    // Hanging Ornamental Gilded Pretzel & Cupcake Sign
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(bx + bw - 20, sfY + 48, 18, 4); // Bracket
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(bx + bw - 11, sfY + 64, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(bx + bw - 11, sfY + 64, 7, 0, Math.PI * 2);
    ctx.fill();

    // --- 3. WET RAIN-SLICKED COBBLESTONES & OUTDOOR 2 AM FEAST TERRACE ---
    // Rain-Slicked Parisian Cobblestone Street
    ctx.fillStyle = '#261C2C';
    ctx.fillRect(0, sfY + sfH, width, height - (sfY + sfH));
    ctx.fillStyle = '#382B40';
    for (let cx = 0; cx < width; cx += 16) {
      for (let cy = sfY + sfH; cy < height; cy += 12) {
        if ((cx + cy) % 24 === 0) {
          ctx.fillRect(cx, cy, 14, 10);
        }
      }
    }

    // Wet Cobblestone Specular Glints reflecting warm amber bakery windows
    ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
    for (let cx = 12; cx < width - 12; cx += 24) {
      for (let cy = sfY + sfH + 4; cy < height - 8; cy += 16) {
        ctx.fillRect(cx, cy, 4, 1);
      }
    }

    // Wet Puddle Reflections of Warm Bakery Glow
    ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
    ctx.beginPath();
    ctx.ellipse(320, 395, 65, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(560, 415, 80, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ambient Occlusion Contact Drop Shadows beneath outdoor dining furniture
    ctx.fillStyle = 'rgba(15, 8, 20, 0.45)';
    ctx.beginPath();
    ctx.ellipse(242, 410, 46, 12, 0, 0, Math.PI * 2); // 2 AM Feast table shadow
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(498, 406, 26, 8, 0, 0, Math.PI * 2);  // Bistro 1 shadow
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(628, 406, 26, 8, 0, 0, Math.PI * 2);  // Bistro 2 shadow
    ctx.fill();

    // The Outdoor 2 AM Feast Terrace under a Wooden Pergola (x: 180..320, y: 360..450)
    // Wooden Pergola Posts & Overhead Trellis
    ctx.fillStyle = '#451A03';
    ctx.fillRect(185, 345, 6, 95);
    ctx.fillRect(295, 345, 6, 95);
    ctx.fillRect(180, 342, 125, 6);
    // Overhead String Fairy Lights across Pergola
    for (let fx = 188; fx < 300; fx += 14) {
      const fGlow = (fx + frame * 0.5) % 18 < 9;
      ctx.fillStyle = fGlow ? '#FEF08A' : '#FDE047';
      ctx.fillRect(fx, 348, 3, 4);
    }

    // THE 2 AM FEAST TABLE (White Pasta, Chocolates, Nutella & Kinder Joys!)
    this.drawFeastTable(ctx, 195, 370, frame);
    lights.push({ x: 242, y: 395, radius: 75, intensity: 1.0, color: '#F6D78B' });

    // Round Parisian Bistro Tables & Chairs
    const drawBistroSet = (cx: number, cy: number) => {
      // Cast-iron bistro chair left & right
      ctx.fillStyle = '#020617';
      ctx.fillRect(cx - 14, cy + 4, 3, 16);
      ctx.fillRect(cx - 16, cy + 4, 6, 3);
      ctx.fillRect(cx + 26, cy + 4, 3, 16);
      ctx.fillRect(cx + 24, cy + 4, 6, 3);
      // Table pedestal
      ctx.fillRect(cx + 6, cy + 6, 3, 14);
      ctx.fillRect(cx + 2, cy + 18, 11, 2);
      // Round Marble Table Top
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.ellipse(cx + 8, cy + 6, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cappuccino with Latte Art
      ctx.fillStyle = '#78350F';
      ctx.fillRect(cx + 4, cy + 2, 5, 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx + 5, cy + 3, 3, 2);
      // Macaron Plate
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(cx + 11, cy + 3, 4, 3);
    };
    drawBistroSet(490, 390);
    drawBistroSet(620, 390);

    // Drifting Pink Cherry Blossom / Rose Petals
    ctx.fillStyle = '#F472B6';
    for (let p = 0; p < 22; p++) {
      const px = (p * 47 + frame * 0.9) % width;
      const py = 160 + ((p * 31 + Math.sin(frame * 0.04 + p) * 24) % (height - 200));
      ctx.fillRect(Math.floor(px), Math.floor(py), 3, 2);
    }

    // Left Street Exit Road
    ctx.fillStyle = '#1E1624';
    ctx.fillRect(0, 310, 140, 100);
    ctx.fillStyle = '#2D2036';
    ctx.fillRect(0, 314, 136, 92);

    // Victorian Streetlamps
    this.drawVictorianLampPost(ctx, 120, 340, frame);
    this.drawVictorianLampPost(ctx, 690, 340, frame);
    lights.push({ x: 124, y: 326, radius: 60, intensity: 0.95, color: '#FDE047' });
    lights.push({ x: 694, y: 326, radius: 60, intensity: 0.95, color: '#FDE047' });

    // Exit Plaque
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(10, 385, 110, 15);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('< RETURN TO DREAM ESTATES <', 12, 395);

    return lights;
  }

  // ==========================================
  // REALM RENDERER 5: 12-MARLA GAON HAVELI
  // ==========================================
  public static renderHaveliRealm(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- 1. DRAMATIC GOLDEN-HOUR PUNJAB SUNSET SKY ---
    // Burning Crimson -> Fiery Orange -> Golden Amber -> Dusty Twilight Purple
    const sunsetGrad = ctx.createLinearGradient(0, -200, 0, 240);
    sunsetGrad.addColorStop(0, '#3B0764'); // Deep purple twilight
    sunsetGrad.addColorStop(0.35, '#7E22CE');
    sunsetGrad.addColorStop(0.65, '#EA580C'); // Fiery orange
    sunsetGrad.addColorStop(0.88, '#F59E0B'); // Golden amber
    sunsetGrad.addColorStop(1, '#FEF08A');    // Blazing horizon
    ctx.fillStyle = sunsetGrad;
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Giant Glowing Setting Sun Dipping below Horizon (x: 180, y: 110)
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(180, 110, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(180, 110, 36, 0, Math.PI * 2);
    ctx.fill();
    lights.push({ x: 180, y: 110, radius: 120, intensity: 1.0, color: '#FEF08A' });

    // Glowing Sunset Cloud Bands in Orange, Gold, and Rose
    ctx.fillStyle = 'rgba(251, 146, 60, 0.28)';
    ctx.fillRect(30, 60, 240, 9);
    ctx.fillRect(320, 85, 300, 8);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.fillRect(110, 63, 110, 4);
    ctx.fillRect(410, 88, 140, 4);

    // Silhouetted Flock of Migratory Birds in Graceful V-Formation
    ctx.fillStyle = '#451A03';
    const birds = [
      { x: 380, y: 55 },
      { x: 395, y: 62 },
      { x: 410, y: 69 },
      { x: 425, y: 76 },
      { x: 395, y: 48 },
      { x: 410, y: 41 },
      { x: 425, y: 34 },
    ];
    birds.forEach((b) => {
      const bx = (b.x + frame * 0.5) % (width + 100);
      ctx.beginPath();
      ctx.moveTo(bx - 4, b.y);
      ctx.lineTo(bx, b.y - 3);
      ctx.lineTo(bx + 4, b.y);
      ctx.lineTo(bx, b.y - 1);
      ctx.fill();
    });

    // Distant Agrarian Panorama: Endless Swaying Golden Wheat Fields (Gandum) & Sugarcane (Kamad)
    ctx.fillStyle = '#92400E';
    ctx.fillRect(0, 150, width, 50);
    // Swaying Golden Wheat Tufts along Horizon
    ctx.fillStyle = '#F59E0B';
    for (let wx = 0; wx < width; wx += 8) {
      const wH = 12 + Math.sin(wx * 0.08 + frame * 0.05) * 4;
      ctx.fillRect(wx, 155 - wH, 3, wH);
    }
    // Silhouetted Eucalyptus & Date Palm Trees along Irrigation Canal
    const drawCanalPalm = (px: number, py: number) => {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(px, py - 40, 4, 40);
      // Palm fronds
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2;
        ctx.fillRect(px + Math.cos(ang) * 12, py - 40 + Math.sin(ang) * 8, 4, 3);
      }
    };
    drawCanalPalm(80, 160);
    drawCanalPalm(710, 160);

    // --- 2. THE 12-MARLA RED CLAY BRICK GAON HAVELI ---
    // Structure: x: 190..610 (width: 420), y: 150..340 (height: 190)
    const hx = 190;
    const hy = 150;
    const hw = 420;
    const hh = 190;

    // Ambient drop shadow beneath Haveli foundation
    ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
    ctx.fillRect(hx - 6, hy + hh - 4, hw + 12, 14);

    // A. Weathered Lahori Red Clay Brick Wall Base
    ctx.fillStyle = '#7C2D12';
    ctx.fillRect(hx, hy + 20, hw, hh - 20);
    // Detailed Brick Courses with Mortar Lines
    ctx.fillStyle = '#9A3412';
    for (let by = hy + 24; by < hy + hh; by += 10) {
      const rowOffset = ((by - hy) / 10) % 2 === 0 ? 0 : 8;
      for (let bx = hx + 4 + rowOffset; bx < hx + hw - 10; bx += 18) {
        ctx.fillRect(bx, by, 16, 8);
      }
    }
    // Aged White Lime-Plaster Patches
    ctx.fillStyle = 'rgba(241, 245, 249, 0.25)';
    ctx.fillRect(hx + 30, hy + 60, 45, 35);
    ctx.fillRect(hx + 320, hy + 90, 60, 40);

    // B. Mughal Carved Arched Upper Cornice with Terracotta Finials
    ctx.fillStyle = '#B45309';
    ctx.fillRect(hx - 8, hy + 14, hw + 16, 8);
    ctx.fillStyle = '#92400E';
    for (let cx = hx; cx < hx + hw; cx += 22) {
      ctx.beginPath();
      ctx.arc(cx + 10, hy + 14, 8, Math.PI, 0);
      ctx.fill();
    }
    // Terracotta Chhatri Cupolas on Roof Corners
    const drawChhatri = (chx: number) => {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(chx, hy - 14, 26, 6);
      ctx.fillRect(chx + 2, hy - 24, 22, 10);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(chx + 11, hy - 30, 4, 6); // Golden finial tip
    };
    drawChhatri(hx + 15);
    drawChhatri(hx + hw - 40);

    // C. Traditional Carved Sheesham Wood Jharoka Balconies (Upper Floor)
    const drawJharoka = (jx: number, jy: number) => {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(jx, jy, 65, 48);
      // Carved Corbelled Stone Base Brackets
      ctx.fillStyle = '#78350F';
      ctx.fillRect(jx + 8, jy + 48, 12, 10);
      ctx.fillRect(jx + 45, jy + 48, 12, 10);
      // Warm Oil Lantern Interior Glow
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(jx + 6, jy + 6, 53, 36);
      // Mughal Carved Arch Window Opening
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(jx + 32, jy + 18, 16, Math.PI, 0);
      ctx.lineTo(jx + 48, jy + 38);
      ctx.lineTo(jx + 16, jy + 38);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(jx + 32, jy + 18, 12, Math.PI, 0);
      ctx.lineTo(jx + 44, jy + 36);
      ctx.lineTo(jx + 20, jy + 36);
      ctx.fill();
      // Wooden Jali Lattice Screen
      ctx.fillStyle = '#78350F';
      ctx.fillRect(jx + 16, jy + 26, 32, 2);
      ctx.fillRect(jx + 16, jy + 32, 32, 2);
      ctx.fillRect(jx + 26, jy + 18, 2, 18);
      ctx.fillRect(jx + 38, jy + 18, 2, 18);
    };
    drawJharoka(hx + 50, hy + 38);
    drawJharoka(hx + hw - 115, hy + 38);
    lights.push({ x: hx + 82, y: hy + 60, radius: 50, intensity: 0.9, color: '#F59E0B' });
    lights.push({ x: hx + hw - 82, y: hy + 60, radius: 50, intensity: 0.9, color: '#F59E0B' });

    // D. Massive Carved Sheesham Haveli Darwaza (Main Studded Teak Entrance)
    const doorX = hx + hw / 2 - 40;
    const doorY = hy + 85;
    // Arched Brick Lintel
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(doorX + 40, doorY + 20, 44, Math.PI, 0);
    ctx.fill();
    // Solid Sheesham Gate Leafs
    ctx.fillStyle = '#3E1C0A';
    ctx.beginPath();
    ctx.arc(doorX + 40, doorY + 20, 38, Math.PI, 0);
    ctx.lineTo(doorX + 78, doorY + hh - 85);
    ctx.lineTo(doorX + 2, doorY + hh - 85);
    ctx.fill();
    // Heavy Black Iron Straps & Brass Studs
    ctx.fillStyle = '#020617';
    ctx.fillRect(doorX + 4, doorY + 45, 72, 4);
    ctx.fillRect(doorX + 4, doorY + 75, 72, 4);
    // Brass Studs (Kunday & Studs)
    ctx.fillStyle = '#F59E0B';
    for (let sx = doorX + 12; sx < doorX + 70; sx += 14) {
      ctx.fillRect(sx, doorY + 45, 4, 4);
      ctx.fillRect(sx, doorY + 75, 4, 4);
    }
    // Heavy Brass Ring Door-Knockers
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(doorX + 26, doorY + 58, 6, 0, Math.PI * 2);
    ctx.arc(doorX + 54, doorY + 58, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Festive Hanging Marigold Garlands (Gainday ke Phool) over Main Gate
    for (let mx = doorX; mx < doorX + 80; mx += 8) {
      const isOrange = (mx % 16) === 0;
      ctx.fillStyle = isOrange ? '#EA580C' : '#FBBF24';
      ctx.fillRect(mx, doorY + 22 + Math.sin((mx - doorX) * 0.08) * 8, 5, 5);
    }

    // --- 3. EXPANSIVE COURTYARD (VEHRRA) & AUTHENTIC RURAL PROPS ---
    // Courtyard Packed-Earth Ground (Lepaee wala Kacha Vehrra)
    ctx.fillStyle = '#452A18';
    ctx.fillRect(0, hy + hh, width, height - (hy + hh));
    ctx.fillStyle = '#5A3822';
    for (let ex = 0; ex < width; ex += 20) {
      for (let ey = hy + hh; ey < height; ey += 16) {
        if ((ex + ey) % 36 === 0) {
          ctx.fillRect(ex, ey, 8, 4);
        }
      }
    }

    // Giant Ancient Shady Neem Tree (Neem ka Darakht) on Courtyard Left
    // Sprawling massive canopy filtering golden sunlight
    this.drawDetailedTree(ctx, 110, 310, 'oak', frame);
    this.drawDetailedTree(ctx, 715, 310, 'oak', frame);

    // TWO AUTHENTIC WOVEN CHARPAIYAN (MANJIAN) with Phulkari / Khes & Bolsters
    const drawAuthenticCharpai = (cx: number, cy: number, khesColor: string, bolsterColor: string) => {
      // Soft Ground Contact Drop Shadow
      ctx.fillStyle = 'rgba(25, 12, 6, 0.4)';
      ctx.beginPath();
      ctx.ellipse(cx + 33, cy + 32, 38, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4 Turned Walnut Legs (Paavay)
      ctx.fillStyle = '#451A03';
      ctx.fillRect(cx, cy, 5, 18);
      ctx.fillRect(cx + 62, cy, 5, 18);
      ctx.fillRect(cx, cy + 30, 5, 18);
      ctx.fillRect(cx + 62, cy + 30, 5, 18);
      // Heavy Timber Side Rails (Baazu)
      ctx.fillStyle = '#78350F';
      ctx.fillRect(cx, cy + 4, 67, 5);
      ctx.fillRect(cx, cy + 30, 67, 5);
      ctx.fillRect(cx, cy + 4, 5, 30);
      ctx.fillRect(cx + 62, cy + 4, 5, 30);
      // Woven Criss-Cross Jute Cord Webbing (Waan)
      ctx.fillStyle = '#D97706';
      ctx.fillRect(cx + 4, cy + 8, 59, 23);
      // Hand-Woven Phulkari / Khes Blanket draped over Charpai
      ctx.fillStyle = khesColor;
      ctx.fillRect(cx + 12, cy + 6, 42, 26);
      // Traditional Geometric Phulkari Embroidery Motifs
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(cx + 18, cy + 12, 6, 6);
      ctx.fillRect(cx + 34, cy + 18, 6, 6);
      ctx.fillRect(cx + 42, cy + 12, 6, 6);
      // Cylindrical Cotton Bolster (Gao Takkiya)
      ctx.fillStyle = bolsterColor;
      ctx.fillRect(cx + 44, cy + 8, 14, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx + 56, cy + 10, 2, 18); // Tasseled tie
    };
    drawAuthenticCharpai(215, 400, '#BE185D', '#38BDF8'); // Crimson/Pink Phulkari
    drawAuthenticCharpai(215, 465, '#047857', '#F59E0B'); // Emerald/Gold Khes

    // Low Wooden Stool (Peeri) with Chilled Punjabi Lassi Glasses & White Makkhan
    const peeriX = 295;
    const peeriY = 415;
    // Peeri ground drop shadow
    ctx.fillStyle = 'rgba(25, 12, 6, 0.4)';
    ctx.beginPath();
    ctx.ellipse(peeriX + 14, peeriY + 22, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350F';
    ctx.fillRect(peeriX, peeriY, 28, 20);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(peeriX + 2, peeriY + 2, 24, 16);
    // Two Heavy Brass Tumblers of Meethi Lassi
    ctx.fillStyle = '#F59E0B'; // Brass glass
    ctx.fillRect(peeriX + 5, peeriY + 4, 8, 12);
    ctx.fillRect(peeriX + 15, peeriY + 4, 8, 12);
    // Fresh Churned White Butter (Makkhan) floating on top!
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(peeriX + 6, peeriY + 5, 6, 4);
    ctx.fillRect(peeriX + 16, peeriY + 5, 6, 4);

    // Stacks of Wooden Crates Brimming with Golden Ripe Chaunsa & Sindhri Mangoes!
    const drawMangoCrate = (mx: number, my: number) => {
      // Crate drop shadow
      ctx.fillStyle = 'rgba(25, 12, 6, 0.4)';
      ctx.beginPath();
      ctx.ellipse(mx + 18, my + 22, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#78350F';
      ctx.fillRect(mx, my, 36, 20);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(mx + 2, my + 2, 32, 16);
      // Overflowing Ripe Golden Mangoes
      for (let m = 0; m < 6; m++) {
        ctx.fillStyle = m % 2 === 0 ? '#FBBF24' : '#F59E0B';
        ctx.beginPath();
        ctx.ellipse(mx + 6 + (m % 3) * 11, my + 6 + Math.floor(m / 3) * 7, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    drawMangoCrate(295, 465);
    drawMangoCrate(300, 488);

    // Earthen Water Vessel (Matka / Ghara) on Wooden Tripod
    ctx.fillStyle = '#9A3412';
    ctx.beginPath();
    ctx.arc(195, 395, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F59E0B'; // Brass dipper rim
    ctx.fillRect(191, 383, 8, 3);

    // --- 4. THE FULL-SCALE WORKING REALISTIC TUBEWELL (Water Pump & Swimming Hauzi) ---
    // Location: x: 550..710, y: 360..480
    const twX = 550;
    const twY = 360;

    // A. Concrete Foundation Plinth for Motor
    ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
    ctx.fillRect(twX - 3, twY + 28, 48, 8); // Plinth shadow
    ctx.fillStyle = '#475569';
    ctx.fillRect(twX, twY, 45, 30);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(twX + 2, twY + 2, 41, 26);

    // B. Industrial Green Cast-Iron Electric Motor
    ctx.fillStyle = '#14532D';
    ctx.fillRect(twX + 6, twY - 14, 28, 22);
    ctx.fillStyle = '#166534';
    ctx.fillRect(twX + 8, twY - 12, 24, 18);
    // Whirling Belt-Drive Flywheel (Animated Rotation)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(twX + 38, twY - 3, 10, 0, Math.PI * 2);
    ctx.fill();
    const wheelAng = frame * 0.35;
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(twX + 38, twY - 3);
    ctx.lineTo(twX + 38 + Math.cos(wheelAng) * 9, twY - 3 + Math.sin(wheelAng) * 9);
    ctx.stroke();

    // C. Heavy Cast-Iron Delivery Elbow Pipe (discharging horizontally into Hauzi)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(twX + 24, twY + 8, 35, 10);
    ctx.fillRect(twX + 54, twY + 4, 10, 18); // Flanged discharge spout

    // D. The Deep Concrete Swimming Trough (Hauzi)
    const hzX = twX + 50;
    const hzY = twY + 12;
    const hzW = 110;
    const hzH = 75;
    // Outer Thick Concrete Rim & Ground Contact Shadow
    ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
    ctx.fillRect(hzX - 4, hzY + hzH - 2, hzW + 8, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(hzX, hzY, hzW, hzH);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(hzX + 4, hzY + 4, hzW - 8, hzH - 8);

    // Deep Crystal-Clear Turquoise Swimming Water Body with Depth Shading
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(hzX + 6, hzY + 6, hzW - 12, hzH - 12);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(hzX + 6, hzY + 8, hzW - 12, hzH - 18);

    // Dynamic shimmering water caustics across the Hauzi bed
    ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
    for (let c = 0; c < 4; c++) {
      const cx = hzX + 12 + c * 24;
      const cy = hzY + 20 + Math.sin(frame * 0.1 + c) * 6;
      ctx.fillRect(cx, cy, 14, 2);
    }

    // E. CONTINUOUS MASSIVE TORRENT OF GUSHING TUBEWELL WATER!
    // Water jet violently shooting out of the pipe into the hauzi
    const jetLen = 28 + Math.sin(frame * 0.4) * 4;
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(twX + 64, twY + 8, jetLen, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(twX + 64, twY + 10, jetLen, 4);

    // Violent Water Impact Point: Frothing Churning White Foam!
    const impX = twX + 64 + jetLen;
    const impY = twY + 16;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(impX, impY, 14 + Math.sin(frame * 0.5) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Splashing Droplets Arcing into the Air!
    for (let d = 0; d < 8; d++) {
      const dropAng = (d * 0.45) - 1.2;
      const dropDist = 16 + ((frame * 1.5 + d * 9) % 22);
      const dx = impX + Math.cos(dropAng) * dropDist;
      const dy = impY + Math.sin(dropAng) * dropDist * 0.7;
      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(Math.floor(dx), Math.floor(dy), 3, 3);
    }

    // Expanding Concentric Ripple Rings spreading across Hauzi Water
    for (let r = 0; r < 4; r++) {
      const rRad = ((frame * 0.8 + r * 18) % 45) + 8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(impX, impY + 15, rRad, rRad * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Overflow Irrigation Channel (Khaal) flowing into fields
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(hzX + hzW - 4, hzY + 25, 35, 12);
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(hzX + hzW - 4, hzY + 28, 35, 4);

    lights.push({ x: impX, y: impY, radius: 75, intensity: 1.0, color: '#38BDF8' });

    // Traditional Hurricane Lanterns on Brick Posts
    const drawHurricaneLantern = (lx: number, ly: number) => {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(lx, ly, 4, 14);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(lx - 3, ly + 4, 10, 10);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(lx - 2, ly + 5, 8, 8);
    };
    drawHurricaneLantern(330, 520);
    drawHurricaneLantern(466, 520);
    drawHurricaneLantern(540, twY + 20);
    lights.push({ x: 332, y: 528, radius: 55, intensity: 0.95, color: '#F59E0B' });
    lights.push({ x: 468, y: 528, radius: 55, intensity: 0.95, color: '#F59E0B' });
    lights.push({ x: 542, y: twY + 28, radius: 55, intensity: 0.9, color: '#F59E0B' });

    // Bottom Approach Road leading out to Dream Estates Boulevard
    ctx.fillStyle = '#543F2B';
    ctx.fillRect(340, 480, 120, height - 480);
    ctx.fillStyle = '#6B4F35';
    ctx.fillRect(344, 480, 112, height - 480);
    for (let dy = 480; dy < height; dy += 14) {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(362, dy, 4, 8); // Wheel ruts
      ctx.fillRect(434, dy, 4, 8);
    }

    // Return Plaque at bottom
    ctx.fillStyle = '#3E1C0A';
    ctx.fillRect(348, 560, 104, 16);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.strokeRect(348, 560, 104, 16);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('v RETURN TO DREAM ESTATES v', 352, 570);

    return lights;
  }

  /**
   * Complete Realm Renderer: The 5 Dream Estates of Beenish & Ahmad
   */
  public static renderDreamEstates(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ): LightSource[] {
    const lights: LightSource[] = [];

    // --- BASE LUSH NIGHT MEADOW ---
    ctx.fillStyle = '#17332C';
    ctx.fillRect(-600, -600, width + 1200, height + 1200);

    // Dithered clover texture
    ctx.fillStyle = '#1E443A';
    for (let x = -200; x < width + 200; x += 20) {
      for (let y = -200; y < height + 200; y += 20) {
        if ((x + y) % 40 === 0) {
          ctx.fillRect(x + 2, y + 4, 3, 2);
          ctx.fillRect(x + 8, y + 12, 2, 3);
        }
      }
    }

    // --- GRAND COBBLESTONE BOULEVARD ---
    // North-South Avenue (x: 410..490)
    ctx.fillStyle = '#333D5E';
    ctx.fillRect(410, 0, 80, height);
    ctx.fillStyle = '#44517A';
    ctx.fillRect(414, 0, 72, height);
    // East-West Boulevard (y: 310..390)
    ctx.fillStyle = '#333D5E';
    ctx.fillRect(0, 310, width, 80);
    ctx.fillStyle = '#44517A';
    ctx.fillRect(0, 314, width, 72);

    // Curbs & Paver details
    ctx.fillStyle = '#6576A8';
    ctx.fillRect(410, 0, 2, height);
    ctx.fillRect(488, 0, 2, height);
    ctx.fillRect(0, 310, width, 2);
    ctx.fillRect(0, 388, width, 2);

    // Cobblestone paver grid
    ctx.fillStyle = '#4D5C8C';
    for (let bx = 416; bx < 482; bx += 14) {
      for (let by = 0; by < height; by += 10) {
        ctx.fillRect(bx, by, 12, 8);
      }
    }
    for (let bx = 0; bx < width; bx += 14) {
      for (let by = 316; by < 384; by += 10) {
        ctx.fillRect(bx, by, 12, 8);
      }
    }

    // --- GRAND ROYAL ARCH GATE TO VALLEY OF STARS (NORTH BOULEVARD) ---
    this.drawDreamEstatesValleyGate(ctx, 410, 0, frame);
    lights.push({ x: 400, y: 22, radius: 50, intensity: 0.95, color: '#F6D78B' });
    lights.push({ x: 500, y: 22, radius: 50, intensity: 0.95, color: '#F6D78B' });
    lights.push({ x: 450, y: 20, radius: 60, intensity: 0.9, color: '#38BDF8' });

    // --- CENTRAL PLAZA FOUNTAIN ---
    this.drawPlazaFountain(ctx, 420, 310, frame);
    lights.push({ x: 450, y: 345, radius: 65, intensity: 0.9, color: '#38BDF8' });

    // Plaza Street Lamps
    const estateLamps = [
      { x: 395, y: 295 },
      { x: 495, y: 295 },
      { x: 395, y: 395 },
      { x: 495, y: 395 },
      { x: 260, y: 150 },
      { x: 630, y: 150 },
    ];
    estateLamps.forEach((pos, idx) => {
      this.drawVictorianLampPost(ctx, pos.x, pos.y, frame + idx * 7);
      lights.push({ x: pos.x + 4, y: pos.y - 14, radius: 46, intensity: 0.85, color: '#F6D78B' });
    });

    // --- DECORATIVE CHERRY BLOSSOM & PINE TREES ---
    this.drawDetailedTree(ctx, 260, 60, 'oak', frame);
    this.drawDetailedTree(ctx, 550, 60, 'pine', frame);
    this.drawDetailedTree(ctx, 250, 420, 'willow', frame);
    this.drawDetailedTree(ctx, 620, 430, 'pine', frame);
    this.drawDetailedTree(ctx, 120, 600, 'oak', frame);
    this.drawDetailedTree(ctx, 760, 600, 'pine', frame);

    // --- BUILDING 1: ISLAMABAD 5-MARLA FAMILY HOUSE (TOP-LEFT) ---
    this.drawIslamabadHouse(ctx, 50, 55, frame);
    lights.push({ x: 145, y: 150, radius: 55, intensity: 0.9, color: '#F6D78B' }); // Porch lantern
    lights.push({ x: 95, y: 130, radius: 50, intensity: 0.85, color: '#F3B79C' }); // Living room window
    lights.push({ x: 80, y: 80, radius: 35, intensity: 0.75, color: '#38BDF8' }); // Boy 1 Samurai Jack blue
    lights.push({ x: 130, y: 80, radius: 35, intensity: 0.75, color: '#C084FC' }); // Boy 2 Lavender starry
    lights.push({ x: 180, y: 80, radius: 38, intensity: 0.85, color: '#FB7185' }); // Baby Girl Teddy pink

    // --- BUILDING 2: SECRET MAFIA SAFEHOUSE & BATMOBILE (TOP-RIGHT) ---
    this.drawMafiaSafehouse(ctx, 660, 55, frame);
    lights.push({ x: 740, y: 145, radius: 45, intensity: 0.9, color: '#EF4444' }); // Biometric laser
    lights.push({ x: 790, y: 155, radius: 50, intensity: 0.85, color: '#38BDF8' }); // Batmobile jet thruster
    lights.push({ x: 700, y: 100, radius: 45, intensity: 0.7, color: '#94A3B8' }); // Security glass

    // --- BUILDING 3: SWEET DREAMS BAKERY & PARLOUR (MIDDLE-LEFT) ---
    this.drawBakery(ctx, 50, 290, frame);
    lights.push({ x: 130, y: 360, radius: 60, intensity: 0.95, color: '#FDE047' }); // Bakery display bay
    lights.push({ x: 90, y: 330, radius: 45, intensity: 0.8, color: '#F472B6' }); // Awning lantern

    // --- BUILDING 4: QUEEN BEENISH'S MOUNTAIN CASTLE (MIDDLE-RIGHT) ---
    this.drawCastle(ctx, 660, 290, frame);
    lights.push({ x: 710, y: 390, radius: 50, intensity: 0.95, color: '#F59E0B' }); // Left torch
    lights.push({ x: 795, y: 390, radius: 50, intensity: 0.95, color: '#F59E0B' }); // Right torch
    lights.push({ x: 755, y: 330, radius: 55, intensity: 0.85, color: '#C084FC' }); // Royal throne window

    // --- BUILDING 5: 12-MARLA GAON HAVELI (BOTTOM-CENTER) ---
    this.drawGaonHaveli(ctx, 330, 490, frame);
    lights.push({ x: 450, y: 565, radius: 60, intensity: 0.9, color: '#F59E0B' }); // Haveli lantern
    lights.push({ x: 375, y: 570, radius: 45, intensity: 0.85, color: '#38BDF8' }); // Tubewell water glow

    // Fireflies hovering across the peaceful night air
    for (let f = 0; f < 10; f++) {
      const flyX = 120 + (Math.sin(frame * 0.02 + f * 1.4) * 110) + f * 65;
      const flyY = 160 + (Math.cos(frame * 0.03 + f * 1.9) * 80) + (f % 4) * 100;
      const glow = Math.sin(frame * 0.12 + f * 2) * 0.5 + 0.5;
      if (glow > 0.25) {
        ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
        ctx.fillRect(Math.floor(flyX), Math.floor(flyY), 2, 2);
        lights.push({ x: Math.floor(flyX), y: Math.floor(flyY), radius: 14 * glow, intensity: 0.4 * glow, color: '#FDE047' });
      }
    }

    return lights;
  }

  /**
   * Grand Royal Arch Gateway connecting Dream Estates to the Valley of the Stars
   */
  private static drawDreamEstatesValleyGate(
    ctx: CanvasRenderingContext2D,
    x: number, // 410
    y: number, // 0
    frame: number
  ): void {
    // Portal energy mist on threshold
    const portalPulse = Math.sin(frame * 0.08) * 0.15 + 0.35;
    const grad = ctx.createLinearGradient(x + 4, y, x + 76, y + 36);
    grad.addColorStop(0, `rgba(56, 189, 248, ${portalPulse * 0.5})`);
    grad.addColorStop(0.5, `rgba(129, 140, 248, ${portalPulse})`);
    grad.addColorStop(1, `rgba(244, 114, 182, ${portalPulse * 0.5})`);
    ctx.fillStyle = grad;
    ctx.fillRect(x + 6, y + 6, 68, 28);

    // Left Stone Pillar (x - 14 .. x + 6)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x - 14, y, 18, 44);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 12, y + 2, 14, 40);
    // Left Pillar Gold Trim & Cap
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x - 16, y + 40, 22, 4);
    ctx.fillRect(x - 16, y, 22, 5);
    ctx.fillRect(x - 14, y - 4, 18, 4);
    // Left Lantern
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 8, y + 16, 5, 8);

    // Right Stone Pillar (x + 74 .. x + 94)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 76, y, 18, 44);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 78, y + 2, 14, 40);
    // Right Pillar Gold Trim & Cap
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 74, y + 40, 22, 4);
    ctx.fillRect(x + 74, y, 22, 5);
    ctx.fillRect(x + 76, y - 4, 18, 4);
    // Right Lantern
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x + 83, y + 16, 5, 8);

    // Grand Wrought-Iron & Golden Overhead Arch
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 10);
    ctx.quadraticCurveTo(x + 40, y - 16, x + 84, y + 10);
    ctx.stroke();

    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 14);
    ctx.quadraticCurveTo(x + 40, y - 10, x + 80, y + 14);
    ctx.stroke();

    // Filigree scrolls inside arch
    for (let s = 14; s < 68; s += 12) {
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(x + s, y + 1, 2, 8);
    }

    // Royal Plaque in center of Arch
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 10, y + 12, 60, 16);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 12, 60, 16);

    // Plaque Text
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('^ VALLEY OF STARS ^', x + 40, y + 23);
    ctx.textAlign = 'left'; // Reset

    // Direction arrow & stars
    const starBlink = (Math.sin(frame * 0.15) > 0);
    ctx.fillStyle = starBlink ? '#67E8F9' : '#FDE047';
    ctx.fillRect(x + 14, y + 19, 2, 2);
    ctx.fillRect(x + 64, y + 19, 2, 2);
  }

  /**
   * Central Plaza Marble Fountain in Dream Estates
   */
  private static drawPlazaFountain(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Outer stone basin
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(x + 30, y + 25, 34, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner water pool
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.ellipse(x + 30, y + 25, 28, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water ripple rings
    ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
    const ripR = (frame * 0.4) % 18;
    ctx.beginPath();
    ctx.ellipse(x + 30, y + 25, 8 + ripR, 4 + ripR * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Central marble pillar & upper basin
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(x + 27, y + 10, 6, 16);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(x + 23, y + 8, 14, 4);

    // Splashing fountain water jet
    ctx.fillStyle = '#BAE6FD';
    const jetH = 8 + Math.sin(frame * 0.2) * 3;
    ctx.fillRect(x + 29, y + 8 - jetH, 2, jetH);
    ctx.fillRect(x + 27, y + 9 - jetH + 2, 1, 3);
    ctx.fillRect(x + 32, y + 9 - jetH + 2, 1, 3);
  }

  /**
   * 1. ISLAMABAD 5-MARLA FAMILY HOUSE
   * 2-Story modern villa with 3 separate kids' rooms & balconies, front lawn, and Islamabad pine view!
   */
  private static drawIslamabadHouse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Islamabad Margalla Hills Silhouette in background
    ctx.fillStyle = '#0F2620';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 30);
    ctx.lineTo(x + 60, y - 15);
    ctx.lineTo(x + 130, y);
    ctx.lineTo(x + 210, y - 25);
    ctx.lineTo(x + 230, y + 30);
    ctx.fill();

    // Front Lawn
    ctx.fillStyle = '#15803D';
    ctx.fillRect(x + 10, y + 95, 170, 25);
    // Flowerbeds
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(x + 16, y + 102, 35, 4);
    ctx.fillRect(x + 135, y + 102, 40, 4);

    // Main 2-Story Villa Structure
    ctx.fillStyle = '#F8FAFC'; // Stucco white
    ctx.fillRect(x + 20, y + 25, 150, 75);

    // Rich Wood Accent Wall Siding
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 95, y + 25, 75, 40);

    // Modern Angled Terracotta Tiled Roof
    ctx.fillStyle = '#9A3412';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 25);
    ctx.lineTo(x + 100, y + 5);
    ctx.lineTo(x + 180, y + 25);
    ctx.fill();
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(x + 10, y + 23, 170, 3); // Roof edge trim

    // Chimney with gentle steam
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(x + 150, y + 2, 10, 16);
    const smokeY = (frame * 0.08) % 12;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x + 152, y - 2 - smokeY, 4, 3);

    // --- GROUND FLOOR ---
    // Warm Front Porch with 2 white pillars
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(x + 115, y + 68, 4, 32); // Left pillar
    ctx.fillRect(x + 145, y + 68, 4, 32); // Right pillar
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(x + 112, y + 66, 40, 4); // Porch roof

    // Double Wooden Front Door
    ctx.fillStyle = '#451A03';
    ctx.fillRect(x + 122, y + 70, 20, 30);
    ctx.fillStyle = '#F59E0B'; // Brass doorknobs
    ctx.fillRect(x + 130, y + 84, 2, 2);
    ctx.fillRect(x + 132, y + 84, 2, 2);

    // Ground Floor Living Room Bay Window (Baraaa Sofa for Beenie inside!)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 30, y + 70, 55, 24);
    ctx.fillStyle = '#FEF08A'; // Warm glowing interior
    ctx.fillRect(x + 32, y + 72, 51, 20);
    // Silhouette of the Baraaa Sofa!
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 38, y + 82, 38, 8);
    ctx.fillStyle = '#F472B6'; // Pink pillow for Beenie
    ctx.fillRect(x + 40, y + 80, 8, 4);

    // --- SECOND FLOOR: THE 3 KIDS' BEDROOMS & BALCONIES ---
    // Room 1 (Left): Boy 1 - Samurai Jack (Blue Theme)
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(x + 30, y + 35, 30, 22);
    ctx.fillStyle = '#60A5FA';
    ctx.fillRect(x + 33, y + 38, 24, 16);
    // Samurai katana sword silhouette
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 40, y + 44, 10, 1);
    // Balcony 1 railing
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(x + 28, y + 54, 34, 4);

    // Room 2 (Center): Boy 2 - Starry (Light Purple Theme)
    ctx.fillStyle = '#581C87';
    ctx.fillRect(x + 75, y + 35, 30, 22);
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(x + 78, y + 38, 24, 16);
    // Starry silhouette
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(x + 88, y + 42, 2, 2);
    // Balcony 2 railing
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(x + 73, y + 54, 34, 4);

    // Room 3 (Right): Baby Girl - Princess & Giant Bear (Baby Pink Theme)
    ctx.fillStyle = '#831843';
    ctx.fillRect(x + 120, y + 35, 30, 22);
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(x + 123, y + 38, 24, 16);
    // BARA SA TEDDY BEAR silhouette!
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 132, y + 44, 8, 8); // Bear body
    ctx.fillRect(x + 134, y + 40, 4, 4); // Bear head
    ctx.fillRect(x + 132, y + 39, 2, 2); // Left ear
    ctx.fillRect(x + 138, y + 39, 2, 2); // Right ear
    // Balcony 3 railing
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(x + 118, y + 54, 34, 4);

    // Master Bedroom Window (Brown-themed luxury bedroom for Ahmad & Beenish)
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 158, y + 35, 10, 22);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x + 160, y + 38, 6, 16);

    // House Nameplate on Lawn
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 18, y + 106, 85, 12);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('ISLAMABAD 5-MARLA VILLA', x + 21, y + 114);

    // Islamabad Pine Tree on Left
    ctx.fillStyle = '#064E3B';
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 105);
    ctx.lineTo(x - 5, y + 70);
    ctx.lineTo(x + 15, y + 70);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 75);
    ctx.lineTo(x - 2, y + 50);
    ctx.lineTo(x + 12, y + 50);
    ctx.fill();
    ctx.fillStyle = '#451A03';
    ctx.fillRect(x + 3, y + 105, 4, 14);
  }

  /**
   * 2. SECRET MAFIA SAFEHOUSE & THE BATMOBILE TUMBLER
   * Dark modern obsidian mansion with Batman Batmobile parked on the driveway!
   */
  private static drawMafiaSafehouse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Carbon-fiber Driveway
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 10, y + 75, 170, 45);
    ctx.fillStyle = '#0F172A';
    for (let dx = x + 12; dx < x + 175; dx += 8) {
      ctx.fillRect(dx, y + 75, 4, 45);
    }

    // Brutalist Modern Obsidian Mansion Facade
    ctx.fillStyle = '#0F172A'; // Obsidian black
    ctx.fillRect(x + 20, y + 15, 150, 75);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 22, y + 17, 146, 6); // Titanium parapet roof edge

    // High-tech Floor-to-Ceiling Tinted Surveillance Glass
    ctx.fillStyle = '#090D16';
    ctx.fillRect(x + 30, y + 28, 55, 40);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x + 32, y + 30, 2, 36); // Cyan laser status line

    // Biometric Security Blast Door
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 100, y + 42, 30, 48);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 103, y + 45, 24, 42);

    // Animated Red Laser Scanner across blast door!
    const laserY = y + 48 + ((frame * 0.8) % 36);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(x + 103, Math.floor(laserY), 24, 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fillRect(x + 103, Math.floor(laserY) - 2, 24, 6);

    // Security Camera Dome with Red Blinking LED
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(x + 115, y + 35, 5, 0, Math.PI * 2);
    ctx.fill();
    if (Math.sin(frame * 0.15) > 0) {
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(x + 114, y + 36, 2, 2);
    }

    // --- THE BATMAN BATMOBILE TUMBLER (Parked on Driveway!) ---
    const tx = x + 25;
    const ty = y + 80;

    // Rear Dual Monster Offroad Tires
    ctx.fillStyle = '#090D16';
    ctx.fillRect(tx, ty + 10, 16, 26);
    ctx.fillRect(tx + 4, ty + 12, 10, 22);
    ctx.fillStyle = '#334155';
    ctx.fillRect(tx + 6, ty + 18, 6, 10); // Steel wheel hub

    // Front Wheels
    ctx.fillStyle = '#090D16';
    ctx.fillRect(tx + 52, ty + 16, 12, 18);
    ctx.fillStyle = '#334155';
    ctx.fillRect(tx + 55, ty + 20, 6, 8);

    // Armored Faceted Tumbler Chassis
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(tx + 12, ty + 18);
    ctx.lineTo(tx + 28, ty + 6);
    ctx.lineTo(tx + 46, ty + 6);
    ctx.lineTo(tx + 60, ty + 16);
    ctx.lineTo(tx + 64, ty + 26);
    ctx.lineTo(tx + 12, ty + 26);
    ctx.fill();

    // Matte Carbon Armor Plates & Wing Flaps
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(tx + 20, ty + 10, 24, 14);
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx + 16, ty + 4, 8, 4); // Rear left fin
    ctx.fillRect(tx + 36, ty + 4, 8, 4); // Rear right fin

    // Gold Caliper Brakes
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tx + 8, ty + 22, 2, 4);

    // Jet Turbine Afterburner Exhaust (Cyan Pulse!)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(tx - 4, ty + 16, 6, 8);
    const pulseW = 6 + Math.sin(frame * 0.25) * 4;
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(tx - 4 - pulseW, ty + 18, pulseW, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(tx - 4 - pulseW * 0.5, ty + 19, pulseW * 0.5, 2);

    // Batman Tumbler Label
    ctx.fillStyle = '#EF4444';
    ctx.font = '5px monospace';
    ctx.fillText('BATMOBILE // TUMBLER', tx + 8, ty + 38);

    // Safehouse Plaque
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 95, y + 105, 75, 12);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '5px monospace';
    ctx.fillText('MAFIA SAFEHOUSE', x + 100, y + 113);
  }

  /**
   * 3. SWEET DREAMS BAKERY & PASTRY PARLOUR
   * Pastel pink and cream facade with striped awning and bakery display window!
   */
  private static drawBakery(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Parisian Brick Base
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(x + 10, y + 20, 160, 85);
    ctx.fillStyle = '#FCE7F3'; // Pastel pink upper wall
    ctx.fillRect(x + 12, y + 22, 156, 81);

    // Decorative Roof Cornice
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(x + 8, y + 16, 164, 6);
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x + 6, y + 14, 168, 3);

    // Brick Chimney with sweet vanilla smoke puffs
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(x + 140, y - 2, 12, 18);
    const puffY = (frame * 0.07) % 14;
    ctx.fillStyle = 'rgba(255, 241, 242, 0.6)';
    ctx.beginPath();
    ctx.arc(x + 146, y - 6 - puffY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Striped Pink & White Scalloped Awning
    const awningY = y + 36;
    for (let ax = x + 14; ax < x + 160; ax += 12) {
      const isPink = (Math.floor((ax - x) / 12) % 2) === 0;
      ctx.fillStyle = isPink ? '#EC4899' : '#FFFFFF';
      ctx.fillRect(ax, awningY, 12, 16);
      // Scalloped bottom edge
      ctx.beginPath();
      ctx.arc(ax + 6, awningY + 16, 6, 0, Math.PI);
      ctx.fill();
    }

    // Grand Bay Pastry Display Window
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 20, y + 60, 75, 40);
    ctx.fillStyle = '#FEF08A'; // Warm glowing bakery display
    ctx.fillRect(x + 22, y + 62, 71, 36);

    // Tiered Display Shelves inside Window
    ctx.fillStyle = '#92400E';
    ctx.fillRect(x + 24, y + 76, 67, 2);
    ctx.fillRect(x + 24, y + 88, 67, 2);

    // Pastries & Cakes on Display!
    // Top Shelf: Tiered Strawberry Birthday Cake
    ctx.fillStyle = '#FB7185';
    ctx.fillRect(x + 32, y + 68, 14, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 34, y + 66, 10, 3); // White icing
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(x + 38, y + 64, 2, 2); // Strawberry top!

    // Chocolate Croissants on Shelf 2
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 30, y + 80, 10, 5);
    ctx.fillRect(x + 45, y + 80, 10, 5);
    ctx.fillRect(x + 60, y + 80, 10, 5);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 32, y + 79, 6, 2);

    // Fruit Tarts on Shelf 3
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x + 30, y + 91, 8, 4);
    ctx.fillRect(x + 44, y + 91, 8, 4);
    ctx.fillRect(x + 58, y + 91, 8, 4);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(x + 32, y + 90, 4, 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x + 46, y + 90, 4, 2);

    // Cozy Bakery Door
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x + 105, y + 58, 26, 45);
    ctx.fillStyle = '#FCE7F3';
    ctx.fillRect(x + 110, y + 64, 16, 16); // Heart-shaped door window
    ctx.fillStyle = '#F59E0B'; // Brass door knob
    ctx.fillRect(x + 124, y + 82, 3, 3);

    // Hanging Ornamental Golden Pretzel/Cupcake Sign
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 138, y + 54, 18, 2); // Iron bracket
    ctx.fillRect(x + 144, y + 56, 2, 6);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(x + 145, y + 68, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x + 141, y + 66, 8, 4);

    // Flowerboxes with blooming pink roses
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 18, y + 100, 79, 5);
    ctx.fillStyle = '#EC4899';
    for (let fx = x + 20; fx < x + 95; fx += 8) {
      ctx.fillRect(fx, y + 98, 4, 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(fx + 1, y + 99, 2, 2);
      ctx.fillStyle = '#EC4899';
    }

    // Bakery Title Plaque
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(x + 20, y + 24, 120, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '6px monospace';
    ctx.fillText('SWEET DREAMS PATISSERIE', x + 24, y + 31);
  }

  /**
   * 4. QUEEN BEENISH'S MOUNTAIN CASTLE
   * Stone fortress with twin round towers, royal purple banners, torches, and mountain peaks!
   */
  private static drawCastle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Majestic Moonlit Mountain Peaks behind fortress
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 40);
    ctx.lineTo(x + 40, y - 10);
    ctx.lineTo(x + 95, y + 15);
    ctx.lineTo(x + 150, y - 20);
    ctx.lineTo(x + 210, y + 40);
    ctx.fill();

    // Main Stone Castle Wall
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 30, y + 30, 130, 85);
    // Stone block mortar lines
    ctx.fillStyle = '#475569';
    for (let sy = y + 35; sy < y + 115; sy += 12) {
      for (let sx = x + 30; sx < x + 160; sx += 20) {
        ctx.fillRect(sx, sy, 18, 10);
      }
    }

    // Left Fortified Tower
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 15, y + 10, 32, 105);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 12, y + 6, 38, 8); // Crenelations
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 18, y + 4, 6, 4);
    ctx.fillRect(x + 30, y + 4, 6, 4);

    // Right Fortified Tower
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 145, y + 10, 32, 105);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 142, y + 6, 38, 8);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 148, y + 4, 6, 4);
    ctx.fillRect(x + 160, y + 4, 6, 4);

    // Royal Purple Banners hanging down the towers!
    ctx.fillStyle = '#7C3AED'; // Velvet purple
    ctx.fillRect(x + 22, y + 25, 18, 55);
    ctx.fillRect(x + 152, y + 25, 18, 55);
    // Embroidered gold star on banners
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 29, y + 45, 4, 4);
    ctx.fillRect(x + 159, y + 45, 4, 4);
    // V-cut banner tails
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(x + 22, y + 80);
    ctx.lineTo(x + 31, y + 74);
    ctx.lineTo(x + 40, y + 80);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 152, y + 80);
    ctx.lineTo(x + 161, y + 74);
    ctx.lineTo(x + 170, y + 80);
    ctx.fill();

    // Central Stone Balcony (Mountain View)
    ctx.fillStyle = '#64748B';
    ctx.fillRect(x + 75, y + 36, 40, 16);
    ctx.fillStyle = '#C084FC'; // Royal velvet interior glow
    ctx.fillRect(x + 80, y + 24, 30, 20);
    // Stone balustrade
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 73, y + 46, 44, 6);

    // Grand Gothic Arched Castle Gate
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(x + 95, y + 78, 22, Math.PI, 0);
    ctx.lineTo(x + 117, y + 115);
    ctx.lineTo(x + 73, y + 115);
    ctx.fill();

    // Iron-studded Oak Doors
    ctx.fillStyle = '#3E2417';
    ctx.fillRect(x + 76, y + 78, 38, 37);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 94, y + 78, 2, 37); // Door seam
    // Iron cross-bands & rivets
    ctx.fillStyle = '#64748B';
    ctx.fillRect(x + 76, y + 88, 38, 3);
    ctx.fillRect(x + 76, y + 102, 38, 3);

    // Wall Sconce Torches with Animated Fire!
    const drawTorch = (tx: number, ty: number) => {
      ctx.fillStyle = '#475569';
      ctx.fillRect(tx, ty, 3, 10);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(tx - 2, ty - 2, 7, 4);

      // Flickering flame
      const f1 = Math.sin(frame * 0.3 + tx) * 2;
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(tx - 1, ty - 7 + f1, 5, 6);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(tx, ty - 5 + f1, 3, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(tx + 1, ty - 3 + f1, 1, 2);
    };
    drawTorch(x + 60, y + 85);
    drawTorch(x + 128, y + 85);

    // Castle Crest Inscription
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 45, y + 116, 100, 10);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('QUEEN BEENISH KA SHAHI QILA', x + 48, y + 123);
  }

  /**
   * 5. 12-MARLA GAON HAVELI (HIRA KI HAVELI)
   * Red clay brick haveli, carved wooden jharoka, courtyard with charpaiyan, and running tubewell!
   */
  private static drawGaonHaveli(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    // Sprawling Courtyard (Vehrra) Ground
    ctx.fillStyle = '#3E2F20';
    ctx.fillRect(x + 10, y + 30, 220, 85);

    // Red Clay Brick Haveli Base
    ctx.fillStyle = '#7C2D12';
    ctx.fillRect(x + 30, y + 10, 180, 55);
    // Brick pattern
    ctx.fillStyle = '#9A3412';
    for (let hy = y + 14; hy < y + 65; hy += 8) {
      for (let hx = x + 32; hx < x + 208; hx += 16) {
        ctx.fillRect(hx, hy, 14, 6);
      }
    }

    // Mughal Carved Archway Upper Cornice
    ctx.fillStyle = '#B45309';
    ctx.fillRect(x + 25, y + 6, 190, 6);

    // Traditional Carved Sheesham Wood Jharoka Balcony (Upper level)
    ctx.fillStyle = '#451A03';
    ctx.fillRect(x + 100, y + 14, 40, 24);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 104, y + 18, 14, 16); // Left jharoka window
    ctx.fillRect(x + 122, y + 18, 14, 16); // Right jharoka window
    // Wooden lattice jali
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 104, y + 26, 32, 2);

    // Massive Carved Sheesham Haveli Darwaza (Main Entrance)
    ctx.fillStyle = '#3E1C0A';
    ctx.beginPath();
    ctx.arc(x + 120, y + 50, 18, Math.PI, 0);
    ctx.lineTo(x + 138, y + 75);
    ctx.lineTo(x + 102, y + 75);
    ctx.fill();
    // Heavy brass studs & brass ring door-knockers
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 112, y + 58, 3, 3);
    ctx.fillRect(x + 125, y + 58, 3, 3);

    // --- COURTYARD (VEHRRA) ELEMENTS ---

    // Lush Shady Neem Tree on the Left
    this.drawDetailedTree(ctx, x + 35, y + 75, 'oak', frame);

    // 2 Traditional Woven Charpaiyan with Colorful Khes!
    const drawCharpai = (cx: number, cy: number, khesColor: string) => {
      // 4 Wooden legs
      ctx.fillStyle = '#78350F';
      ctx.fillRect(cx, cy, 3, 10);
      ctx.fillRect(cx + 28, cy, 3, 10);
      ctx.fillRect(cx, cy + 14, 3, 10);
      ctx.fillRect(cx + 28, cy + 14, 3, 10);

      // Wooden side rails
      ctx.fillStyle = '#92400E';
      ctx.fillRect(cx, cy + 2, 31, 3);
      ctx.fillRect(cx, cy + 12, 31, 3);

      // Woven Cotton Khes Bedding
      ctx.fillStyle = khesColor;
      ctx.fillRect(cx + 2, cy + 4, 27, 9);
      // Traditional Gao Takkiya (Bolster Pillow)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx + 23, cy + 4, 4, 9);
    };
    drawCharpai(x + 60, y + 78, '#DC2626'); // Red geometric khes
    drawCharpai(x + 100, y + 84, '#F59E0B'); // Golden yellow khes

    // Terracotta Matkas (Earthen water jugs)
    ctx.fillStyle = '#9A3412';
    ctx.beginPath();
    ctx.arc(x + 95, y + 92, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 94, y + 86, 2, 3);

    // Crate of Fresh Pakistani Mangoes!
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + 140, y + 88, 16, 12);
    ctx.fillStyle = '#FACC15'; // Chaunsa & Sindhri mangoes
    ctx.fillRect(x + 142, y + 90, 4, 4);
    ctx.fillRect(x + 148, y + 90, 4, 4);
    ctx.fillRect(x + 145, y + 94, 4, 4);

    // --- WORKING TUBEWELL WITH SPLASHING WATER STREAM! ---
    const tbx = x + 175;
    const tby = y + 76;

    // Cast-iron tubewell pump motor & black pipe
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(tbx, tby + 4, 14, 16);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(tbx + 14, tby + 8, 12, 6); // Pipe spout

    // Concrete Water Basin Trough
    ctx.fillStyle = '#64748B';
    ctx.fillRect(tbx + 18, tby + 14, 30, 20);
    ctx.fillStyle = '#0284C7'; // Deep pool water
    ctx.fillRect(tbx + 20, tby + 16, 26, 16);

    // Animated Gushing Tubewell Water Stream!
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(tbx + 24, tby + 12, 4, 10);
    const splashR = (frame * 0.5) % 8;
    ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.beginPath();
    ctx.arc(tbx + 26, tby + 24, splashR, 0, Math.PI * 2);
    ctx.stroke();

    // Tubewell Label
    ctx.fillStyle = '#38BDF8';
    ctx.font = '5px monospace';
    ctx.fillText('TUBEWELL', tbx + 16, tby + 38);

    // Haveli Plaque
    ctx.fillStyle = '#3E1C0A';
    ctx.fillRect(x + 70, y + 110, 100, 10);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '5px monospace';
    ctx.fillText('HIRA KI HAVELI // 12 MARLA', x + 74, y + 117);
  }

  /**
   * FOREGROUND OCCLUSION PASS (Drawn AFTER Beenish & Pagluu sprites, BEFORE lighting & UI bubbles)
   * Ensures characters walk UNDER overhead archways, pergola crossbeams, portal lintels, and upper tree canopies
   * when standing behind/underneath them.
   */
  public static renderForeground(
    ctx: CanvasRenderingContext2D,
    roomId: string,
    _width: number,
    _height: number,
    frame: number,
    playerPos: { x: number; y: number },
    pagluPos: { x: number; y: number }
  ): void {
    const isCharBehind = (trunkBaseY: number, minX: number, maxX: number) => {
      const pFeetY = playerPos.y + 26;
      const tFeetY = pagluPos.y + 26;
      const pBehind = pFeetY < trunkBaseY && playerPos.x + 24 > minX && playerPos.x < maxX;
      const tBehind = tFeetY < trunkBaseY && pagluPos.x + 24 > minX && pagluPos.x < maxX;
      return pBehind || tBehind;
    };

    if (roomId === 'overworld') {
      // 1. Arrival Pavilion Overhead Pergola Crossbeam, Climbing Vines & Hanging Fairy Lights (x=740, y=680)
      const px = 740;
      const py = 680;
      if (isCharBehind(py + 22, px - 10, px + 120)) {
        // Pergola Crossbeam Arch
        ctx.fillStyle = '#3E2417';
        ctx.fillRect(px + 2, py - 32, 106, 8);
        ctx.fillStyle = '#5A3828';
        ctx.fillRect(px + 4, py - 30, 102, 3);
        ctx.fillStyle = '#1D4537';
        ctx.fillRect(px + 12, py - 34, 86, 6);
        // Overhead blossoms
        const topBlooms = [
          { bx: px + 24, by: py - 35, color: '#FFFFFF' },
          { bx: px + 38, by: py - 36, color: '#FDF2F8' },
          { bx: px + 54, by: py - 35, color: '#FFFFFF' },
          { bx: px + 70, by: py - 36, color: '#FDF2F8' },
          { bx: px + 84, by: py - 35, color: '#FFFFFF' },
        ];
        topBlooms.forEach(b => {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.bx, b.by, 4, 4);
          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(b.bx + 1, b.by + 1, 2, 2);
        });
        // Hanging Fairy Lights Garland
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 16, py - 24);
        ctx.quadraticCurveTo(px + 55, py - 14, px + 94, py - 24);
        ctx.stroke();
        for (let l = 0; l < 7; l++) {
          const t = (l + 0.5) / 7;
          const lx = (px + 16) * (1 - t) + (px + 94) * t;
          const ly = (py - 24) * (1 - t) * (1 - t) + (py - 14) * 2 * (1 - t) * t + (py - 24) * t * t;
          const bulbGlow = Math.sin(frame * 0.12 + l * 1.2) * 0.35 + 0.65;
          ctx.fillStyle = `rgba(254, 240, 138, ${bulbGlow})`;
          ctx.fillRect(Math.floor(lx - 1), Math.floor(ly), 3, 3);
        }
      }

      // 2. Portal Overhead Lintels & Awnings
      // Mafia Portal top titanium beam (4, 545)
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 545, 52, 16);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(4, 546, 52, 3);

      // Bakery Portal top awning cap (1540, 550)
      ctx.fillStyle = '#BE185D';
      ctx.fillRect(1540, 550, 35, 8);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(1542, 550, 31, 4);

      // Haveli Portal top crossbeam (760, 1140)
      ctx.fillStyle = '#92400E';
      ctx.fillRect(752, 1146, 80, 6);

      // Dream Estates Portal top archway beam (490, 1020)
      if (isCharBehind(1058, 480, 555)) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(494, 1020, 46, 12);
        ctx.fillStyle = '#64748B';
        ctx.fillRect(496, 1022, 42, 2);
        ctx.fillStyle = '#F59E0B';
        ctx.font = '6px monospace';
        ctx.fillText('DREAM ESTATES', 495, 1029);
      }

      // 3. Overworld Tree Canopies (drawn over characters when character is north of trunk base y+50)
      const overworldTrees: Array<{ x: number; y: number; type: 'oak' | 'pine' | 'willow' }> = [
        { x: 160, y: 260, type: 'pine' },
        { x: 440, y: 340, type: 'oak' },
        { x: 1140, y: 340, type: 'oak' },
        { x: 1480, y: 260, type: 'pine' },
        { x: 440, y: 880, type: 'oak' },
        { x: 1140, y: 880, type: 'oak' },
        { x: 1480, y: 920, type: 'pine' },
        { x: 230, y: 720, type: 'willow' },
      ];
      overworldTrees.forEach(t => {
        if (isCharBehind(t.y + 50, t.x - 16, t.x + 58)) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(t.x - 20, t.y - 10, 90, 42);
          ctx.clip();
          this.drawDetailedTree(ctx, t.x, t.y, t.type, frame);
          ctx.restore();
        }
      });
    } else if (roomId === 'bakery_realm') {
      // Outdoor Feast Pergola overhead rafters & fairy lights (x: 185..305, y: 340..356)
      if (isCharBehind(415, 175, 315)) {
        ctx.fillStyle = '#5C2D12';
        ctx.fillRect(185, 342, 118, 6);
        for (let rx = 190; rx <= 298; rx += 18) {
          ctx.fillStyle = '#78350F';
          ctx.fillRect(rx, 339, 6, 10);
        }
        for (let lx = 196; lx <= 292; lx += 16) {
          const glow = Math.sin(frame * 0.1 + lx) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
          ctx.fillRect(lx, 348, 3, 3);
        }
      }
    }
  }
}


