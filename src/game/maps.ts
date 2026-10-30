import { RoomDefinition, RoomId } from './types';

export const ROOMS: Record<RoomId, RoomDefinition> = {
  overworld: {
    id: 'overworld',
    name: 'The Valley of the Stars',
    width: 1600,
    height: 1200,
    defaultSpawn: { x: 800, y: 720 },
    theme: 'valley',
    collisionBoxes: [
      // Outer boundaries with wide open gateways:
      // Top boundary: open at x: 90-180 (Islamabad Trail), x: 740-860 (Observatory), and x: 1370-1490 (Castle Mountain Pass)
      { x: 0, y: 0, width: 90, height: 40 },
      { x: 180, y: 0, width: 560, height: 40 },
      { x: 860, y: 0, width: 510, height: 40 },
      { x: 1490, y: 0, width: 110, height: 40 },

      // Bottom boundary: open at x: 740-860 (Haveli Village Trail)
      { x: 0, y: 1180, width: 740, height: 20 },
      { x: 860, y: 1180, width: 740, height: 20 },

      // Left boundary: open at y: 535-635 (Mafia Stealth Highway)
      { x: 0, y: 0, width: 25, height: 535 },
      { x: 0, y: 635, width: 25, height: 565 },

      // Right boundary: open at y: 530-630 (Bakery Pastry Lane)
      { x: 1575, y: 0, width: 25, height: 530 },
      { x: 1575, y: 630, width: 25, height: 570 },

      // Spacious Building Footprints (Aligned to exact drawn facades):
      // 1. Bureau of Unreasonable Boyfriends (West Precinct: 200..340, 390..465)
      { x: 200, y: 390, width: 140, height: 75 },

      // 2. Museum of Beenish (North-Center Terrace: 690..860, 210..294)
      { x: 690, y: 210, width: 170, height: 84 },

      // 3. Court of Absolutely No Flaws (East Precinct: 1230..1370, 390..468)
      { x: 1230, y: 390, width: 140, height: 78 },

      // 4. Archive of Things That Happened (Southeast Glade: 1240..1360, 750..835)
      { x: 1240, y: 750, width: 120, height: 85 },

      // 5. Secret Garden Ivy Gate (Southeast Boundary)
      // Open passage at x: 1285-1355
      { x: 1200, y: 1040, width: 85, height: 35 },
      { x: 1355, y: 1040, width: 95, height: 35 },

      // 6. South-West Reflecting Water Pond (Leaves northern grassy bank y=742..772 open for Pond Bench)
      { x: 190, y: 775, width: 240, height: 135 },

      // 7. Decorative Tree Trunks (Aligned to exact drawn trunks at x+15, y+36)
      { x: 175, y: 296, width: 14, height: 18 },
      { x: 455, y: 376, width: 14, height: 18 },
      { x: 1155, y: 376, width: 14, height: 18 },
      { x: 1495, y: 296, width: 14, height: 18 },
      { x: 455, y: 916, width: 14, height: 18 },
      { x: 1155, y: 916, width: 14, height: 18 },
      { x: 1495, y: 956, width: 14, height: 18 },
      { x: 250, y: 754, width: 18, height: 20 }, // Weeping willow trunk

      // 8. Central Plaza Props & Landmarks
      { x: 766, y: 632, width: 72, height: 32 },  // Central Birthday Table
      { x: 742, y: 735, width: 18, height: 18 },  // World Directional Signpost base
      { x: 746, y: 685, width: 12, height: 55 },  // Arrival Pavilion Left Pillar
      { x: 832, y: 685, width: 12, height: 55 },  // Arrival Pavilion Right Pillar
      { x: 480, y: 205, width: 110, height: 45 }, // Private Jet Tarmac footprint
      { x: 965, y: 205, width: 100, height: 52 }, // Championship Sports Arena turf
    ],
    interactables: [
      // --- THE 5 DREAM ESTATES SCENIC PASSES ---
      {
        id: 'path_to_islamabad',
        x: 100,
        y: 15,
        width: 70,
        height: 35,
        promptLabel: 'Margalla Hills Trail to Islamabad 5-Marla House →',
        type: 'door',
        targetRoom: 'islamabad_realm',
        targetPos: { x: 388, y: 490 },
      },
      {
        id: 'path_to_castle',
        x: 1390,
        y: 15,
        width: 80,
        height: 35,
        promptLabel: 'Mountain Pass to Queen Beenish\'s Castle →',
        type: 'door',
        targetRoom: 'castle_realm',
        targetPos: { x: 388, y: 490 },
      },
      {
        id: 'path_to_mafia',
        x: 8,
        y: 545,
        width: 48,
        height: 72,
        promptLabel: 'Highway to Dark Brutalist Mafia Home & Batmobile',
        type: 'door',
        targetRoom: 'mafia_realm',
        targetPos: { x: 680, y: 350 },
      },
      {
        id: 'path_to_bakery',
        x: 1550,
        y: 550,
        width: 35,
        height: 60,
        promptLabel: 'Pastry Lane to Sweet Dreams Bakery →',
        type: 'door',
        targetRoom: 'bakery_realm',
        targetPos: { x: 110, y: 360 },
      },
      {
        id: 'path_to_haveli',
        x: 770,
        y: 1150,
        width: 65,
        height: 35,
        promptLabel: 'Desi Gaon Trail to 12-Marla Haveli & Tubewell',
        type: 'door',
        targetRoom: 'haveli_realm',
        targetPos: { x: 388, y: 130 },
      },
      {
        id: 'path_to_estates',
        x: 490,
        y: 1020,
        width: 60,
        height: 45,
        promptLabel: 'Enter Master Boulevard of All 5 Dream Estates',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 450, y: 75 },
      },
      {
        id: 'estates_signpost',
        x: 555,
        y: 1030,
        width: 35,
        height: 30,
        promptLabel: 'Read Master Dream Estates Directory',
        type: 'signpost',
      },

      // --- THE 4 CHAPTER BUILDINGS & OBSERVATORY & GARDEN GATE ---
      {
        id: 'door_bureau',
        x: 270,
        y: 465,
        width: 35,
        height: 25,
        promptLabel: 'Enter Bureau of Unreasonable Boyfriends',
        type: 'door',
        targetRoom: 'bureau',
        targetPos: { x: 238, y: 340 },
      },
      {
        id: 'door_museum',
        x: 780,
        y: 300,
        width: 40,
        height: 25,
        promptLabel: 'Enter Museum of Beenish',
        type: 'door',
        targetRoom: 'museum',
        targetPos: { x: 288, y: 390 },
      },
      {
        id: 'door_observatory',
        x: 780,
        y: 35,
        width: 45,
        height: 30,
        promptLabel: 'Climb Mountain Trail to Hilltop Observatory',
        type: 'door',
        targetRoom: 'observatory',
        targetPos: { x: 240, y: 340 },
      },
      {
        id: 'door_court',
        x: 1300,
        y: 465,
        width: 35,
        height: 25,
        promptLabel: 'Enter Court of Absolutely No Flaws',
        type: 'door',
        targetRoom: 'court',
        targetPos: { x: 258, y: 390 },
      },
      {
        id: 'door_archive',
        x: 1305,
        y: 835,
        width: 35,
        height: 25,
        promptLabel: 'Enter Archive of Things That Happened',
        type: 'door',
        targetRoom: 'archive',
        targetPos: { x: 268, y: 390 },
      },
      {
        id: 'door_garden',
        x: 1290,
        y: 1040,
        width: 60,
        height: 30,
        promptLabel: 'Secret Garden Rose Gate',
        type: 'door',
        targetRoom: 'garden',
        targetPos: { x: 260, y: 390 },
      },

      // --- CENTRAL PLAZA & NATURE LANDMARKS ---
      {
        id: 'central_birthday_cake',
        x: 768,
        y: 620,
        width: 64,
        height: 48,
        promptLabel: 'Birthday Table: Strawberry Cake, White Pasta & Wish',
        type: 'birthday_cake',
      },
      {
        id: 'world_signpost',
        x: 730,
        y: 715,
        width: 30,
        height: 30,
        promptLabel: 'Read Valley Guidepost: Directions & Districts',
        type: 'signpost',
      },
      {
        id: 'arrival_plaque',
        x: 775,
        y: 735,
        width: 42,
        height: 24,
        promptLabel: 'Read Brass Welcome Archway Plaque',
        type: 'signpost',
      },
      {
        id: 'pond_bench',
        x: 378,
        y: 738,
        width: 40,
        height: 24,
        promptLabel: 'Sit by Reflecting Pond & Weeping Willow',
        type: 'signpost',
      },
      {
        id: 'overworld_jet',
        x: 475,
        y: 200,
        width: 120,
        height: 65,
        promptLabel: 'Inspect Private White/Grey Jet & Red Carpet Vision',
        type: 'jet_tarmac',
      },
      {
        id: 'overworld_sports',
        x: 960,
        y: 200,
        width: 110,
        height: 65,
        promptLabel: 'Inspect Cricket Pitch & Badminton Court',
        type: 'sports_arena',
      },
      // --- 5 HANDWRITTEN STICKY NOTES ---
      {
        id: 'note_pavilion',
        x: 740,
        y: 695,
        width: 28,
        height: 28,
        promptLabel: 'Read Yellow Sticky Note #1 (Arrival Pavilion)',
        type: 'signpost',
      },
      {
        id: 'note_willow',
        x: 244,
        y: 742,
        width: 28,
        height: 28,
        promptLabel: 'Read Yellow Sticky Note #2 (Weeping Willow)',
        type: 'signpost',
      },
      {
        id: 'note_bureau',
        x: 344,
        y: 450,
        width: 28,
        height: 28,
        promptLabel: 'Read Yellow Sticky Note #3 (Bureau Wall)',
        type: 'signpost',
      },
      {
        id: 'note_museum',
        x: 660,
        y: 275,
        width: 28,
        height: 28,
        promptLabel: 'Read Yellow Sticky Note #4 (Museum Steps)',
        type: 'signpost',
      },
      {
        id: 'note_court',
        x: 1200,
        y: 450,
        width: 28,
        height: 28,
        promptLabel: 'Read Yellow Sticky Note #5 (Court Pillars)',
        type: 'signpost',
      },
    ],
  },

  bureau: {
    id: 'bureau',
    name: 'Bureau of Unreasonable Paglu',
    width: 500,
    height: 400,
    defaultSpawn: { x: 238, y: 340 },
    theme: 'office',
    collisionBoxes: [
      { x: 0, y: 0, width: 500, height: 50 },
      { x: 0, y: 380, width: 500, height: 20 },
      { x: 0, y: 0, width: 20, height: 400 },
      { x: 480, y: 0, width: 20, height: 400 },
      // Desk
      { x: 190, y: 150, width: 120, height: 45 },
      // Filing Cabinet
      { x: 60, y: 70, width: 70, height: 50 },
      // Side shelves
      { x: 370, y: 70, width: 80, height: 45 },
    ],
    interactables: [
      {
        id: 'bureau_exit',
        x: 230,
        y: 370,
        width: 40,
        height: 20,
        promptLabel: 'Exit to Valley',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 285, y: 505 },
      },
      {
        id: 'bureau_filing',
        x: 80,
        y: 115,
        width: 40,
        height: 30,
        promptLabel: 'Inspect Case Files',
        type: 'filing_cabinet',
      },
      {
        id: 'bureau_desk_talk',
        x: 235,
        y: 130,
        width: 35,
        height: 30,
        promptLabel: 'Talk to Pagluu',
        type: 'bureau_desk',
      },
      {
        id: 'bureau_drawer_secret',
        x: 385,
        y: 110,
        width: 40,
        height: 30,
        promptLabel: 'Desk Drawer #07',
        type: 'bureau_drawer',
      },
    ],
  },

  museum: {
    id: 'museum',
    name: 'The Museum of Beenish',
    width: 600,
    height: 450,
    defaultSpawn: { x: 288, y: 390 },
    theme: 'gallery',
    collisionBoxes: [
      { x: 0, y: 0, width: 600, height: 50 },
      { x: 0, y: 430, width: 600, height: 20 },
      { x: 0, y: 0, width: 20, height: 450 },
      { x: 580, y: 0, width: 20, height: 450 },
      // Exhibit Pedestals
      { x: 350, y: 140, width: 50, height: 45 },
      { x: 470, y: 140, width: 50, height: 45 },
    ],
    interactables: [
      {
        id: 'museum_exit',
        x: 280,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: 'Exit to Valley',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 800, y: 340 },
      },
      {
        id: 'museum_p1',
        x: 100,
        y: 55,
        width: 50,
        height: 35,
        promptLabel: 'Ninja H2R & Dodge Challenger',
        type: 'museum_portrait_1',
      },
      {
        id: 'museum_p2_key',
        x: 220,
        y: 55,
        width: 50,
        height: 35,
        promptLabel: 'White Jet Vision & Secret Key',
        type: 'museum_portrait_2',
      },
      {
        id: 'museum_achieve',
        x: 355,
        y: 180,
        width: 45,
        height: 30,
        promptLabel: 'Cricket & Badminton Arena',
        type: 'museum_achievements',
      },
      {
        id: 'museum_phenom',
        x: 475,
        y: 180,
        width: 45,
        height: 30,
        promptLabel: 'Sialkot to Islamabad Map',
        type: 'museum_phenomenon',
      },
    ],
  },

  court: {
    id: 'court',
    name: 'The Court of Absolutely No Flaws',
    width: 550,
    height: 450,
    defaultSpawn: { x: 258, y: 390 },
    theme: 'courtroom',
    collisionBoxes: [
      { x: 0, y: 0, width: 550, height: 60 },
      { x: 0, y: 430, width: 550, height: 20 },
      { x: 0, y: 0, width: 20, height: 450 },
      { x: 530, y: 0, width: 20, height: 450 },
      // Judge bench
      { x: 190, y: 80, width: 160, height: 50 },
      // Brass Witness Stand Railing
      { x: 240, y: 210, width: 60, height: 28 },
      // Tables
      { x: 80, y: 220, width: 100, height: 40 },
      { x: 350, y: 220, width: 100, height: 40 },
    ],
    interactables: [
      {
        id: 'court_exit',
        x: 250,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: 'Exit Court',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 1315, y: 505 },
      },
      {
        id: 'judge_action',
        x: 250,
        y: 130,
        width: 45,
        height: 30,
        promptLabel: 'Address the Court',
        type: 'court_judge',
      },
      {
        id: 'prosecution_files',
        x: 110,
        y: 255,
        width: 40,
        height: 30,
        promptLabel: 'Review "hm hm hm" & Paisay Charges',
        type: 'court_prosecution',
      },
      {
        id: 'defense_files',
        x: 350,
        y: 220,
        width: 100,
        height: 45,
        promptLabel: 'Inspect Pagluu\'s Defense File & Pyari Baatein ♥',
        type: 'court_defense',
      },
      {
        id: 'judge_secret_note',
        x: 245,
        y: 75,
        width: 55,
        height: 30,
        promptLabel: 'Inspect Secret Note Behind Bench',
        type: 'court_bench_secret',
      },
    ],
  },

  archive: {
    id: 'archive',
    name: 'The Archive of Things That Happened',
    width: 550,
    height: 450,
    defaultSpawn: { x: 268, y: 390 },
    theme: 'library',
    collisionBoxes: [
      { x: 0, y: 0, width: 550, height: 50 },
      { x: 0, y: 430, width: 550, height: 20 },
      { x: 0, y: 0, width: 20, height: 450 },
      { x: 530, y: 0, width: 20, height: 450 },
      // Bookshelves
      { x: 40, y: 60, width: 130, height: 40 },
      { x: 210, y: 60, width: 130, height: 40 },
      { x: 380, y: 60, width: 130, height: 40 },
      // Central reading table
      { x: 215, y: 230, width: 120, height: 40 },
    ],
    interactables: [
      {
        id: 'archive_exit',
        x: 260,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: 'Exit to Valley',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 1320, y: 875 },
      },
      {
        id: 'memory_crystal_1',
        x: 100,
        y: 160,
        width: 30,
        height: 30,
        promptLabel: 'The Three Anthems',
        type: 'archive_crystal_1',
      },
      {
        id: 'memory_crystal_2',
        x: 260,
        y: 150,
        width: 30,
        height: 30,
        promptLabel: '2 AM White Pasta & Sweets',
        type: 'archive_crystal_2',
      },
      {
        id: 'memory_crystal_3',
        x: 420,
        y: 160,
        width: 30,
        height: 30,
        promptLabel: 'binishieeees@gmail.com Log',
        type: 'archive_crystal_3',
      },
    ],
  },

  observatory: {
    id: 'observatory',
    name: 'Hilltop Observatory of Future Stars',
    width: 500,
    height: 400,
    defaultSpawn: { x: 240, y: 340 },
    theme: 'observatory',
    collisionBoxes: [
      { x: 0, y: 0, width: 500, height: 50 },
      { x: 0, y: 380, width: 500, height: 20 },
      { x: 0, y: 0, width: 20, height: 400 },
      { x: 480, y: 0, width: 20, height: 400 },
      // Star map tables
      { x: 60, y: 120, width: 80, height: 40 },
      { x: 360, y: 120, width: 80, height: 40 },
      // Brass Telescope & Constellation Altar
      { x: 180, y: 125, width: 32, height: 28 },
      { x: 278, y: 125, width: 40, height: 28 },
    ],
    interactables: [
      {
        id: 'observatory_exit',
        x: 230,
        y: 370,
        width: 40,
        height: 20,
        promptLabel: 'Return to Valley',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 800, y: 80 },
      },
      {
        id: 'observatory_scope',
        x: 180,
        y: 130,
        width: 40,
        height: 40,
        promptLabel: 'Inspect The 5 Dream Houses',
        type: 'observatory_telescope',
      },
      {
        id: 'observatory_altar_naming',
        x: 280,
        y: 130,
        width: 40,
        height: 40,
        promptLabel: 'Name The Constellation',
        type: 'observatory_altar',
      },
    ],
  },

  garden: {
    id: 'garden',
    name: 'The Secret Hidden Garden',
    width: 550,
    height: 450,
    defaultSpawn: { x: 260, y: 390 },
    theme: 'garden',
    collisionBoxes: [
      { x: 0, y: 0, width: 550, height: 50 },
      { x: 0, y: 430, width: 550, height: 20 },
      { x: 0, y: 0, width: 20, height: 450 },
      { x: 530, y: 0, width: 20, height: 450 },
      // Pond boundary
      { x: 80, y: 180, width: 140, height: 90 },
      // Ancient tree
      { x: 360, y: 60, width: 100, height: 60 },
    ],
    interactables: [
      {
        id: 'garden_exit',
        x: 250,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: 'Exit Garden',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 1320, y: 1000 },
      },
      {
        id: 'garden_bench_letter',
        x: 370,
        y: 145,
        width: 60,
        height: 35,
        promptLabel: 'Sit & Read Birthday Love Letter',
        type: 'garden_bench',
      },
    ],
  },

  dream_estates: {
    id: 'dream_estates',
    name: 'The 5 Dream Estates of Beenish & Ahmad',
    width: 900,
    height: 700,
    defaultSpawn: { x: 450, y: 75 },
    theme: 'valley',
    collisionBoxes: [
      // Top boundary with open gateway at x: 405-495 (Grand Valley Arch Gate)
      { x: 0, y: 0, width: 405, height: 40 },
      { x: 495, y: 0, width: 405, height: 40 },
      // Gate stone pillars
      { x: 395, y: 0, width: 14, height: 42 },
      { x: 491, y: 0, width: 14, height: 42 },
      // Outer boundaries
      { x: 0, y: 680, width: 900, height: 20 },
      { x: 0, y: 0, width: 20, height: 700 },
      { x: 880, y: 0, width: 20, height: 700 },
      // Building 1: Islamabad 5-Marla Family House
      { x: 50, y: 55, width: 190, height: 95 },
      // Building 2: Secret Mafia Safehouse & Batmobile
      { x: 660, y: 55, width: 190, height: 95 },
      // Building 3: Sweet Dreams Bakery & Pastry Parlour
      { x: 50, y: 290, width: 180, height: 110 },
      // Building 4: Queen Beenish's Mountain Castle
      { x: 660, y: 290, width: 190, height: 130 },
      // Building 5: 12-Marla Gaon Haveli (Hira Ki Haveli)
      { x: 330, y: 490, width: 240, height: 65 },
      // Central fountain plaza perimeter
      { x: 420, y: 310, width: 60, height: 50 },
    ],
    interactables: [
      {
        id: 'door_estates_exit',
        x: 415,
        y: 8,
        width: 70,
        height: 32,
        promptLabel: '↑ Return through Grand Gate to Valley of Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 520, y: 960 },
      },
      {
        id: 'plaza_fountain',
        x: 420,
        y: 355,
        width: 60,
        height: 30,
        promptLabel: 'Make a Birthday Wish at the Plaza Fountain with Pagluu',
        type: 'signpost',
      },
      {
        id: 'house_islamabad',
        x: 115,
        y: 150,
        width: 60,
        height: 35,
        promptLabel: 'Enter Islamabad 5-Marla Family House',
        type: 'door',
        targetRoom: 'islamabad_realm',
        targetPos: { x: 388, y: 500 },
      },
      {
        id: 'house_mafia',
        x: 720,
        y: 150,
        width: 70,
        height: 35,
        promptLabel: 'Enter Secret Mafia Safehouse & Batmobile',
        type: 'door',
        targetRoom: 'mafia_realm',
        targetPos: { x: 680, y: 350 },
      },
      {
        id: 'house_bakery',
        x: 110,
        y: 395,
        width: 60,
        height: 30,
        promptLabel: 'Enter Sweet Dreams Bakery & Pastry Parlour',
        type: 'door',
        targetRoom: 'bakery_realm',
        targetPos: { x: 110, y: 360 },
      },
      {
        id: 'house_castle',
        x: 725,
        y: 415,
        width: 60,
        height: 30,
        promptLabel: "Enter Queen Beenish's Mountain Castle",
        type: 'door',
        targetRoom: 'castle_realm',
        targetPos: { x: 388, y: 500 },
      },
      {
        id: 'house_haveli',
        x: 420,
        y: 550,
        width: 60,
        height: 35,
        promptLabel: 'Enter 12-Marla Gaon Haveli (Hira Ki Haveli)',
        type: 'door',
        targetRoom: 'haveli_realm',
        targetPos: { x: 388, y: 520 },
      },
    ],
  },

  // ==========================================
  // REALM 1: QUEEN BEENISH'S MOUNTAIN CASTLE
  // ==========================================
  castle_realm: {
    id: 'castle_realm',
    name: "Queen Beenish's Royal Mountain Castle",
    width: 800,
    height: 600,
    defaultSpawn: { x: 388, y: 490 },
    theme: 'observatory',
    collisionBoxes: [
      // Mountain cliffs boundaries
      { x: 0, y: 0, width: 800, height: 70 },
      { x: 0, y: 0, width: 70, height: 600 },
      { x: 730, y: 0, width: 70, height: 600 },
      // Bottom boundary leaving open approach road at x: 340-460
      { x: 0, y: 560, width: 340, height: 40 },
      { x: 460, y: 560, width: 340, height: 40 },
      // Castle fortress structure & towers (cannot walk through walls)
      { x: 190, y: 120, width: 420, height: 160 },
      { x: 110, y: 90, width: 100, height: 260 }, // Left Tower
      { x: 590, y: 90, width: 100, height: 260 }, // Right Tower
      // Parapet stone battlements
      { x: 210, y: 280, width: 130, height: 20 },
      { x: 460, y: 280, width: 130, height: 20 },
    ],
    interactables: [
      {
        id: 'door_castle_exit',
        x: 360,
        y: 535,
        width: 80,
        height: 45,
        promptLabel: 'Return to Dream Estates Boulevard',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 745, y: 450 },
      },
      {
        id: 'house_castle',
        x: 360,
        y: 270,
        width: 80,
        height: 50,
        promptLabel: "Enter Queen Beenish's Throne Hall & Court",
        type: 'house_castle',
      },
      {
        id: 'castle_balcony',
        x: 250,
        y: 270,
        width: 70,
        height: 35,
        promptLabel: 'Mountain Vista Balcony (Breathtaking Views)',
        type: 'signpost',
      },
      {
        id: 'castle_torches',
        x: 310,
        y: 285,
        width: 40,
        height: 35,
        promptLabel: 'Royal Wall Sconce Torches',
        type: 'signpost',
      },
      {
        id: 'castle_banners',
        x: 595,
        y: 335,
        width: 85,
        height: 35,
        promptLabel: 'Royal Velvet Banners (Queen Beenish Star)',
        type: 'signpost',
      },
    ],
  },

  // ============================================================
  // REALM 2: THE BATCAVE // DARK BRUTALIST MAFIA COMPOUND
  // ============================================================
  mafia_realm: {
    id: 'mafia_realm',
    name: 'The Batcave // Dark Brutalist Subterranean Compound',
    width: 800,
    height: 600,
    defaultSpawn: { x: 680, y: 350 },
    theme: 'office',
    collisionBoxes: [
      // Perimeter Cavern & Concrete Cantilever Walls
      { x: 0, y: 0, width: 800, height: 165 }, // Bat-Computer Mega Wall & Consoles
      { x: 0, y: 550, width: 800, height: 50 },  // Bottom Perimeter Wall
      { x: 0, y: 0, width: 65, height: 600 },    // Left Rock Cavern Wall
      // Right Wall with open Highway Tunnel at y: 310-410
      { x: 755, y: 0, width: 45, height: 310 },
      { x: 755, y: 410, width: 45, height: 190 },
      // High-Octane Vehicle Bay (Ninja H2R & Dodge Challenger)
      { x: 65, y: 210, width: 145, height: 105 },
      // Central Batmobile Tumbler Turntable Platform
      { x: 230, y: 260, width: 170, height: 100 },
      // Batsuit & 11/10 Baddie Armory Display Pods (East Wall)
      { x: 580, y: 180, width: 175, height: 105 },
      // The Paisay Vault Treasury (South-East)
      { x: 530, y: 395, width: 185, height: 105 },
      // Cantilever Structural Pillar Bases
      { x: 100, y: 520, width: 30, height: 35 },
      { x: 670, y: 520, width: 30, height: 35 },
    ],
    interactables: [
      {
        id: 'door_mafia_exit',
        x: 740,
        y: 330,
        width: 40,
        height: 70,
        promptLabel: '→ Highway Tunnel to Dream Estates Boulevard',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 740, y: 185 },
      },
      {
        id: 'bat_computer',
        x: 320,
        y: 145,
        width: 160,
        height: 35,
        promptLabel: 'Access Bat-Computer Super Terminal (11/10 Baddie Status ♥)',
        type: 'house_mafia',
      },
      {
        id: 'batmobile_tumbler',
        x: 250,
        y: 275,
        width: 130,
        height: 70,
        promptLabel: 'Batmobile Tumbler (Cyan Afterburner & Heavy Armor)',
        type: 'house_mafia',
      },
      {
        id: 'mafia_garage',
        x: 80,
        y: 225,
        width: 120,
        height: 75,
        promptLabel: 'High-Octane Bay: Kawasaki Ninja H2R & Dodge Challenger',
        type: 'garage_vehicles',
      },
      {
        id: 'mafia_armory',
        x: 600,
        y: 200,
        width: 130,
        height: 75,
        promptLabel: 'Batsuit & 11/10 Baddie Armory Vault (Biometric Laser)',
        type: 'house_mafia',
      },
      {
        id: 'mafia_paisay',
        x: 550,
        y: 410,
        width: 140,
        height: 75,
        promptLabel: 'Paisay Vault: DHAYYERRRR SARYYYYYYYYYY PAISAY (100 Billion)',
        type: 'paisay_vault',
      },
    ],
  },

  // ==========================================
  // REALM 3: ISLAMABAD 5-MARLA FAMILY HOUSE
  // ==========================================
  islamabad_realm: {
    id: 'islamabad_realm',
    name: 'Islamabad 5-Marla Family Sanctuary',
    width: 800,
    height: 600,
    defaultSpawn: { x: 388, y: 490 },
    theme: 'valley',
    collisionBoxes: [
      // Margalla pine forests boundaries
      { x: 0, y: 0, width: 800, height: 90 },
      { x: 0, y: 0, width: 90, height: 600 },
      { x: 710, y: 0, width: 90, height: 600 },
      // Bottom boundary leaving open approach road at x: 340-460
      { x: 0, y: 550, width: 340, height: 50 },
      { x: 460, y: 550, width: 340, height: 50 },
      // 2-Story modern villa structure
      { x: 170, y: 110, width: 460, height: 190 },
      // Front lawn fences and flowerbeds
      { x: 150, y: 340, width: 80, height: 40 },
      { x: 570, y: 340, width: 80, height: 40 },
    ],
    interactables: [
      {
        id: 'door_islamabad_exit',
        x: 360,
        y: 535,
        width: 80,
        height: 45,
        promptLabel: 'Return to Dream Estates Boulevard',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 145, y: 185 },
      },
      {
        id: 'house_islamabad',
        x: 360,
        y: 285,
        width: 80,
        height: 50,
        promptLabel: 'Enter Islamabad 5-Marla Family Villa',
        type: 'house_islamabad',
      },
      {
        id: 'islamabad_sofa_bay',
        x: 470,
        y: 285,
        width: 110,
        height: 40,
        promptLabel: 'Look through Living Room Window: Baraaa Sofa for Beenie',
        type: 'signpost',
      },
      {
        id: 'islamabad_kids_rooms',
        x: 255,
        y: 285,
        width: 85,
        height: 40,
        promptLabel: "Look up at Balconies: 3 Kids' Rooms (Samurai Jack, Starry, Pink Princess & Bear)",
        type: 'signpost',
      },
      {
        id: 'islamabad_lawn_sign',
        x: 228,
        y: 416,
        width: 50,
        height: 35,
        promptLabel: 'Read Villa Plaque: Islamabad 5-Marla Dream Sanctuary',
        type: 'signpost',
      },
    ],
  },

  // ==========================================
  // REALM 4: SWEET DREAMS BAKERY & PATISSERIE
  // ==========================================
  bakery_realm: {
    id: 'bakery_realm',
    name: 'Sweet Dreams Patisserie & Bakery',
    width: 800,
    height: 600,
    defaultSpawn: { x: 110, y: 360 },
    theme: 'gallery',
    collisionBoxes: [
      // Boulevard boundaries
      { x: 0, y: 0, width: 800, height: 80 },
      { x: 0, y: 540, width: 800, height: 60 },
      { x: 740, y: 0, width: 60, height: 600 },
      // Left boundary with open street exit at y: 310-410
      { x: 0, y: 0, width: 60, height: 310 },
      { x: 0, y: 410, width: 60, height: 190 },
      // Bakery building structure
      { x: 190, y: 100, width: 490, height: 180 },
      // Outdoor Feast Table & Parisian Bistro Tables (Aligned to drawn tables)
      { x: 195, y: 386, width: 84, height: 32 },
      { x: 474, y: 388, width: 46, height: 24 },
      { x: 604, y: 388, width: 46, height: 24 },
    ],
    interactables: [
      {
        id: 'door_bakery_exit',
        x: 20,
        y: 330,
        width: 50,
        height: 70,
        promptLabel: 'Return to Dream Estates Boulevard',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 135, y: 425 },
      },
      {
        id: 'house_bakery',
        x: 435,
        y: 260,
        width: 75,
        height: 50,
        promptLabel: 'Enter Sweet Dreams Patisserie',
        type: 'house_bakery',
      },
      {
        id: 'bakery_display',
        x: 255,
        y: 260,
        width: 125,
        height: 45,
        promptLabel: 'Inspect Fresh Pastries, Croissants & Strawberry Cakes',
        type: 'signpost',
      },
      {
        id: 'bakery_cafe_table',
        x: 470,
        y: 380,
        width: 55,
        height: 35,
        promptLabel: 'Sit at Parisian Cafe Table (Taaza Coffee & Macarons)',
        type: 'signpost',
      },
      {
        id: 'feast_terrace',
        x: 190,
        y: 380,
        width: 95,
        height: 45,
        promptLabel: '2 AM Feast Terrace (White Pasta, Chocolates, Nutella & Kinder Joy)',
        type: 'feast_table',
      },
      {
        id: 'bakery_pretzel_sign',
        x: 645,
        y: 245,
        width: 45,
        height: 45,
        promptLabel: 'Golden Pretzel & Cupcake Emblem',
        type: 'signpost',
      },
    ],
  },

  // ==========================================
  // REALM 5: 12-MARLA GAON HAVELI & TUBEWELL
  // ==========================================
  haveli_realm: {
    id: 'haveli_realm',
    name: '12-Marla Gaon Haveli (Hira Ki Haveli)',
    width: 800,
    height: 600,
    defaultSpawn: { x: 388, y: 520 },
    theme: 'valley',
    collisionBoxes: [
      // Top boundary solid to protect the golden sunset sky & fields
      { x: 0, y: 0, width: 800, height: 150 },
      // Side boundaries
      { x: 0, y: 0, width: 60, height: 600 },
      { x: 740, y: 0, width: 60, height: 600 },
      // Bottom boundary leaving open approach road at x: 340-460
      { x: 0, y: 560, width: 340, height: 40 },
      { x: 460, y: 560, width: 340, height: 40 },
      // Red clay brick haveli building (Aligned to drawn facade y: 150..340)
      { x: 190, y: 150, width: 420, height: 190 },
      // Shady neem tree
      { x: 110, y: 310, width: 55, height: 55 },
      // Woven Charpaiyan in Courtyard
      { x: 215, y: 405, width: 65, height: 40 },
      { x: 215, y: 468, width: 65, height: 40 },
      // Working tubewell pump motor & hauzi water trough
      { x: 555, y: 355, width: 150, height: 88 },
    ],
    interactables: [
      {
        id: 'door_haveli_exit',
        x: 350,
        y: 545,
        width: 100,
        height: 45,
        promptLabel: 'v Return to Dream Estates Boulevard',
        type: 'door',
        targetRoom: 'dream_estates',
        targetPos: { x: 450, y: 585 },
      },
      {
        id: 'house_haveli',
        x: 360,
        y: 325,
        width: 80,
        height: 35,
        promptLabel: 'Enter Carved Sheesham Haveli Darwaza',
        type: 'house_haveli',
      },
      {
        id: 'haveli_charpai',
        x: 215,
        y: 400,
        width: 75,
        height: 48,
        promptLabel: 'Relax on Woven Charpai under Neem Tree',
        type: 'signpost',
      },
      {
        id: 'haveli_tubewell',
        x: 550,
        y: 350,
        width: 160,
        height: 95,
        promptLabel: 'Splash in Gushing Tubewell Water & Eat Fresh Mangoes',
        type: 'signpost',
      },
      {
        id: 'haveli_jharoka',
        x: 240,
        y: 325,
        width: 65,
        height: 35,
        promptLabel: 'Look up at Carved Sheesham Jharoka Balcony',
        type: 'signpost',
      },
    ],
  },
};

