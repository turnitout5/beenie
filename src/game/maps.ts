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

      // Left boundary: open at y: 530-630 (Mafia Stealth Highway)
      { x: 0, y: 0, width: 25, height: 530 },
      { x: 0, y: 630, width: 25, height: 570 },

      // Right boundary: open at y: 530-630 (Bakery Pastry Lane)
      { x: 1575, y: 0, width: 25, height: 530 },
      { x: 1575, y: 630, width: 25, height: 570 },

      // Spacious Building Footprints:
      // 1. Bureau of Unreasonable Boyfriends (West Precinct)
      { x: 200, y: 390, width: 170, height: 90 },

      // 2. Museum of Beenish (North-Center Terrace)
      { x: 690, y: 210, width: 220, height: 95 },

      // 3. Court of Absolutely No Flaws (East Precinct)
      { x: 1230, y: 390, width: 170, height: 90 },

      // 4. Archive of Things That Happened (Southeast Glade)
      { x: 1240, y: 750, width: 160, height: 95 },

      // 5. Secret Garden Ivy Gate (Southeast Boundary)
      // Open passage at x: 1285-1355
      { x: 1200, y: 1040, width: 85, height: 35 },
      { x: 1355, y: 1040, width: 95, height: 35 },

      // 6. South-West Reflecting Water Pond (Natural organic boundary)
      { x: 190, y: 760, width: 260, height: 160 },

      // Decorative Tree Trunks (Spaced out naturally across meadows)
      { x: 440, y: 460, width: 24, height: 18 },
      { x: 1080, y: 460, width: 24, height: 18 },
      { x: 440, y: 880, width: 24, height: 18 },
      { x: 1080, y: 880, width: 24, height: 18 },
      { x: 160, y: 710, width: 26, height: 18 }, // Willow tree trunk
    ],
    interactables: [
      // --- THE 5 DREAM ESTATES SCENIC PASSES ---
      {
        id: 'path_to_islamabad',
        x: 100,
        y: 15,
        width: 70,
        height: 35,
        promptLabel: '[ E ] Margalla Hills Trail to Islamabad 5-Marla House →',
        type: 'door',
        targetRoom: 'islamabad_realm',
        targetPos: { x: 388, y: 500 },
      },
      {
        id: 'path_to_castle',
        x: 1390,
        y: 15,
        width: 80,
        height: 35,
        promptLabel: '[ E ] Mountain Pass to Queen Beenish\'s Castle →',
        type: 'door',
        targetRoom: 'castle_realm',
        targetPos: { x: 100, y: 440 },
      },
      {
        id: 'path_to_mafia',
        x: 10,
        y: 550,
        width: 35,
        height: 60,
        promptLabel: '← [ E ] Highway to Dark Brutalist Mafia Home & Batmobile',
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
        promptLabel: '[ E ] Pastry Lane to Sweet Dreams Bakery →',
        type: 'door',
        targetRoom: 'bakery_realm',
        targetPos: { x: 100, y: 440 },
      },
      {
        id: 'path_to_haveli',
        x: 770,
        y: 1150,
        width: 65,
        height: 35,
        promptLabel: '↓ [ E ] Desi Gaon Trail to 12-Marla Haveli & Tubewell',
        type: 'door',
        targetRoom: 'haveli_realm',
        targetPos: { x: 388, y: 120 },
      },

      // --- THE 4 CHAPTER BUILDINGS & OBSERVATORY & GARDEN GATE ---
      {
        id: 'door_bureau',
        x: 270,
        y: 465,
        width: 35,
        height: 25,
        promptLabel: '[ E ] Enter Bureau of Unreasonable Boyfriends',
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
        promptLabel: '[ E ] Enter Museum of Beenish',
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
        promptLabel: '[ E ] Climb Mountain Trail to Hilltop Observatory',
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
        promptLabel: '[ E ] Enter Court of Absolutely No Flaws',
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
        promptLabel: '[ E ] Enter Archive of Things That Happened',
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
        promptLabel: '[ E ] Secret Garden Rose Gate',
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
        promptLabel: '[ E ] Birthday Table: Strawberry Cake, White Pasta & Wish',
        type: 'birthday_cake',
      },
      {
        id: 'world_signpost',
        x: 730,
        y: 715,
        width: 30,
        height: 30,
        promptLabel: '[ E ] Read Valley Guidepost: Directions & Districts',
        type: 'signpost',
      },
      {
        id: 'pond_bench',
        x: 390,
        y: 765,
        width: 35,
        height: 25,
        promptLabel: '[ E ] Sit by Reflecting Pond & Weeping Willow',
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
        promptLabel: '[ E ] Exit to Valley',
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
        promptLabel: '[ E ] Inspect Case Files',
        type: 'filing_cabinet',
      },
      {
        id: 'bureau_desk_talk',
        x: 235,
        y: 130,
        width: 35,
        height: 30,
        promptLabel: '[ E ] Talk to Pagluu',
        type: 'bureau_desk',
      },
      {
        id: 'bureau_drawer_secret',
        x: 385,
        y: 110,
        width: 40,
        height: 30,
        promptLabel: '[ E ] Desk Drawer #07',
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
      { x: 350, y: 140, width: 60, height: 45 },
      { x: 470, y: 140, width: 60, height: 45 },
    ],
    interactables: [
      {
        id: 'museum_exit',
        x: 280,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: '[ E ] Exit to Valley',
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
        promptLabel: '[ E ] Ninja H2R & Dodge Challenger',
        type: 'museum_portrait_1',
      },
      {
        id: 'museum_p2_key',
        x: 220,
        y: 55,
        width: 50,
        height: 35,
        promptLabel: '[ E ] White Jet Vision & Secret Key',
        type: 'museum_portrait_2',
      },
      {
        id: 'museum_achieve',
        x: 360,
        y: 180,
        width: 40,
        height: 30,
        promptLabel: '[ E ] Cricket & Badminton Arena',
        type: 'museum_achievements',
      },
      {
        id: 'museum_phenom',
        x: 480,
        y: 180,
        width: 40,
        height: 30,
        promptLabel: '[ E ] Sialkot to Islamabad Map',
        type: 'museum_phenomenon',
      },
      {
        id: 'museum_ted_npc',
        x: 160,
        y: 180,
        width: 30,
        height: 30,
        promptLabel: '[ E ] Talk to Pagluu',
        type: 'npc_ted',
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
        promptLabel: '[ E ] Exit Court',
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
        promptLabel: '[ E ] Address the Court',
        type: 'court_judge',
      },
      {
        id: 'prosecution_files',
        x: 110,
        y: 255,
        width: 40,
        height: 30,
        promptLabel: '[ E ] Review "hm hm hm" & Paisay Charges',
        type: 'court_prosecution',
      },
      {
        id: 'judge_secret_note',
        x: 250,
        y: 65,
        width: 40,
        height: 20,
        promptLabel: '[ E ] Inspect Behind Bench',
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
      { x: 220, y: 240, width: 110, height: 40 },
    ],
    interactables: [
      {
        id: 'archive_exit',
        x: 260,
        y: 420,
        width: 40,
        height: 20,
        promptLabel: '[ E ] Exit to Valley',
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
        promptLabel: '[ E ] The Three Anthems',
        type: 'archive_crystal_1',
      },
      {
        id: 'memory_crystal_2',
        x: 260,
        y: 150,
        width: 30,
        height: 30,
        promptLabel: '[ E ] 2 AM White Pasta & Sweets',
        type: 'archive_crystal_2',
      },
      {
        id: 'memory_crystal_3',
        x: 420,
        y: 160,
        width: 30,
        height: 30,
        promptLabel: '[ E ] binishieeees@gmail.com Log',
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
    ],
    interactables: [
      {
        id: 'observatory_exit',
        x: 230,
        y: 370,
        width: 40,
        height: 20,
        promptLabel: '[ E ] Return to Valley',
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
        promptLabel: '[ E ] Inspect The 5 Dream Houses',
        type: 'observatory_telescope',
      },
      {
        id: 'observatory_altar_naming',
        x: 280,
        y: 130,
        width: 40,
        height: 40,
        promptLabel: '[ E ] Name The Constellation',
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
        promptLabel: '[ E ] Exit Garden',
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
        promptLabel: '[ E ] Sit & Read Birthday Love Letter',
        type: 'garden_bench',
      },
    ],
  },

  dream_estates: {
    id: 'dream_estates',
    name: 'The 5 Dream Estates of Beenish & Ahmad',
    width: 900,
    height: 700,
    defaultSpawn: { x: 450, y: 350 },
    theme: 'valley',
    collisionBoxes: [
      // Outer boundaries
      { x: 0, y: 0, width: 900, height: 40 },
      { x: 0, y: 680, width: 900, height: 20 },
      { x: 0, y: 0, width: 20, height: 700 },
      { x: 880, y: 0, width: 20, height: 700 },
      // Building 1: Islamabad 5-Marla Family House
      { x: 50, y: 55, width: 190, height: 120 },
      // Building 2: Secret Mafia Safehouse & Batmobile
      { x: 660, y: 55, width: 190, height: 120 },
      // Building 3: Sweet Dreams Bakery & Pastry Parlour
      { x: 50, y: 290, width: 180, height: 110 },
      // Building 4: Queen Beenish's Mountain Castle
      { x: 660, y: 290, width: 190, height: 130 },
      // Building 5: 12-Marla Gaon Haveli (Hira Ki Haveli)
      { x: 330, y: 490, width: 240, height: 120 },
      // Central fountain plaza perimeter
      { x: 420, y: 310, width: 60, height: 50 },
    ],
    interactables: [
      {
        id: 'door_estates_exit',
        x: 430,
        y: 380,
        width: 40,
        height: 25,
        promptLabel: '[ E ] Return to Valley of Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 800, y: 720 },
      },
      {
        id: 'house_islamabad',
        x: 115,
        y: 155,
        width: 60,
        height: 30,
        promptLabel: '[ E ] Enter Islamabad 5-Marla Family House',
        type: 'house_islamabad',
      },
      {
        id: 'house_mafia',
        x: 725,
        y: 155,
        width: 60,
        height: 30,
        promptLabel: '[ E ] Enter Secret Mafia Safehouse & Batmobile',
        type: 'house_mafia',
      },
      {
        id: 'house_bakery',
        x: 110,
        y: 380,
        width: 60,
        height: 30,
        promptLabel: '[ E ] Enter Sweet Dreams Bakery & Pastry Parlour',
        type: 'house_bakery',
      },
      {
        id: 'house_castle',
        x: 725,
        y: 400,
        width: 60,
        height: 30,
        promptLabel: '[ E ] Enter Queen Beenish\'s Mountain Castle',
        type: 'house_castle',
      },
      {
        id: 'house_haveli',
        x: 420,
        y: 475,
        width: 60,
        height: 30,
        promptLabel: '[ E ] Enter 12-Marla Gaon Haveli (Hira Ki Haveli)',
        type: 'house_haveli',
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
        promptLabel: '↓ [ E ] Return to Valley of the Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 1410, y: 70 },
      },
      {
        id: 'house_castle',
        x: 360,
        y: 270,
        width: 80,
        height: 50,
        promptLabel: "[ E ] Enter Queen Beenish's Throne Hall & Court",
        type: 'house_castle',
      },
      {
        id: 'castle_balcony',
        x: 365,
        y: 190,
        width: 70,
        height: 35,
        promptLabel: '[ E ] Mountain Vista Balcony (Breathtaking Views)',
        type: 'signpost',
      },
      {
        id: 'castle_torches',
        x: 310,
        y: 295,
        width: 35,
        height: 30,
        promptLabel: '[ E ] Royal Wall Sconce Torches',
        type: 'signpost',
      },
      {
        id: 'castle_banners',
        x: 455,
        y: 295,
        width: 35,
        height: 30,
        promptLabel: '[ E ] Royal Velvet Banners (Queen Beenish Star)',
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
    ],
    interactables: [
      {
        id: 'door_mafia_exit',
        x: 740,
        y: 330,
        width: 40,
        height: 70,
        promptLabel: '→ [ E ] Highway Tunnel to Valley of the Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 60, y: 580 },
      },
      {
        id: 'bat_computer',
        x: 320,
        y: 145,
        width: 160,
        height: 35,
        promptLabel: '[ E ] Access Bat-Computer Super Terminal (11/10 Baddie Telemetry)',
        type: 'house_mafia',
      },
      {
        id: 'batmobile_tumbler',
        x: 250,
        y: 275,
        width: 130,
        height: 70,
        promptLabel: '[ E ] Batmobile Tumbler (Cyan Afterburner & Heavy Armor)',
        type: 'house_mafia',
      },
      {
        id: 'mafia_garage',
        x: 80,
        y: 225,
        width: 120,
        height: 75,
        promptLabel: '[ E ] High-Octane Bay: Kawasaki Ninja H2R & Dodge Challenger',
        type: 'garage_vehicles',
      },
      {
        id: 'mafia_armory',
        x: 600,
        y: 200,
        width: 130,
        height: 75,
        promptLabel: '[ E ] Batsuit & 11/10 Baddie Armory Vault (Biometric Laser)',
        type: 'house_mafia',
      },
      {
        id: 'mafia_paisay',
        x: 550,
        y: 410,
        width: 140,
        height: 75,
        promptLabel: '[ E ] Paisay Vault: DHAYYERRRR SARYYYYYYYYYY PAISAY (100 Billion)',
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
        promptLabel: '↓ [ E ] Return to Valley of the Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 135, y: 70 },
      },
      {
        id: 'house_islamabad',
        x: 360,
        y: 285,
        width: 80,
        height: 50,
        promptLabel: '[ E ] Enter Islamabad 5-Marla Family Villa',
        type: 'house_islamabad',
      },
      {
        id: 'islamabad_sofa_bay',
        x: 235,
        y: 285,
        width: 70,
        height: 45,
        promptLabel: '[ E ] Look through Living Room Window: Baraaa Sofa for Beenie',
        type: 'signpost',
      },
      {
        id: 'islamabad_kids_rooms',
        x: 350,
        y: 195,
        width: 100,
        height: 40,
        promptLabel: "[ E ] Look up at Balconies: 3 Kids' Rooms (Samurai Jack, Starry, Pink Princess & Bear)",
        type: 'signpost',
      },
      {
        id: 'islamabad_lawn_sign',
        x: 230,
        y: 420,
        width: 50,
        height: 35,
        promptLabel: '[ E ] Read Villa Plaque: Islamabad 5-Marla Dream Sanctuary',
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
      // Outdoor cafe tables
      { x: 310, y: 385, width: 65, height: 50 },
      { x: 500, y: 385, width: 65, height: 50 },
    ],
    interactables: [
      {
        id: 'door_bakery_exit',
        x: 20,
        y: 330,
        width: 50,
        height: 70,
        promptLabel: '← [ E ] Return to Valley of the Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 1510, y: 580 },
      },
      {
        id: 'house_bakery',
        x: 435,
        y: 260,
        width: 75,
        height: 50,
        promptLabel: '[ E ] Enter Sweet Dreams Patisserie',
        type: 'house_bakery',
      },
      {
        id: 'bakery_display',
        x: 255,
        y: 260,
        width: 125,
        height: 45,
        promptLabel: '[ E ] Inspect Fresh Pastries, Croissants & Strawberry Cakes',
        type: 'signpost',
      },
      {
        id: 'bakery_cafe_table',
        x: 320,
        y: 375,
        width: 55,
        height: 40,
        promptLabel: '[ E ] Sit at Parisian Cafe Table (Taaza Coffee & Macarons)',
        type: 'signpost',
      },
      {
        id: 'feast_terrace',
        x: 200,
        y: 375,
        width: 90,
        height: 55,
        promptLabel: '[ E ] 2 AM Feast Terrace (White Pasta, Chocolates, Nutella & Kinder Joy)',
        type: 'feast_table',
      },
      {
        id: 'bakery_pretzel_sign',
        x: 530,
        y: 235,
        width: 40,
        height: 35,
        promptLabel: '[ E ] Golden Pretzel & Cupcake Emblem',
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
    defaultSpawn: { x: 388, y: 130 },
    theme: 'valley',
    collisionBoxes: [
      // Top boundary with open approach road at x: 340-460
      { x: 0, y: 0, width: 340, height: 70 },
      { x: 460, y: 0, width: 340, height: 70 },
      { x: 0, y: 550, width: 800, height: 50 },
      { x: 0, y: 0, width: 60, height: 600 },
      { x: 740, y: 0, width: 60, height: 600 },
      // Red clay brick haveli building
      { x: 190, y: 200, width: 420, height: 170 },
      // Shady neem tree
      { x: 110, y: 310, width: 55, height: 55 },
      // Working tubewell trough basin
      { x: 575, y: 375, width: 85, height: 65 },
    ],
    interactables: [
      {
        id: 'door_haveli_exit',
        x: 360,
        y: 40,
        width: 80,
        height: 45,
        promptLabel: '↑ [ E ] Return to Valley of the Stars',
        type: 'door',
        targetRoom: 'overworld',
        targetPos: { x: 800, y: 1100 },
      },
      {
        id: 'house_haveli',
        x: 360,
        y: 350,
        width: 80,
        height: 50,
        promptLabel: '[ E ] Enter Carved Sheesham Haveli Darwaza',
        type: 'house_haveli',
      },
      {
        id: 'haveli_charpai',
        x: 220,
        y: 405,
        width: 75,
        height: 45,
        promptLabel: '[ E ] Relax on Woven Charpai under Neem Tree',
        type: 'signpost',
      },
      {
        id: 'haveli_tubewell',
        x: 575,
        y: 365,
        width: 85,
        height: 50,
        promptLabel: '[ E ] Splash in Gushing Tubewell Water & Eat Fresh Mangoes',
        type: 'signpost',
      },
      {
        id: 'haveli_jharoka',
        x: 365,
        y: 245,
        width: 70,
        height: 40,
        promptLabel: '[ E ] Look up at Carved Sheesham Jharoka Balcony',
        type: 'signpost',
      },
    ],
  },
};

