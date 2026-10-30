import { RoomId } from '../game/types';

export interface MapLandmark {
  id: string;
  name: string;
  district: 'west' | 'north' | 'east' | 'south' | 'center' | 'estates';
  category: 'chapter' | 'estates' | 'nature' | 'plaza';
  x: number; // Overworld coordinate X (0..1600)
  y: number; // Overworld coordinate Y (0..1200)
  icon: string;
  subtitle: string;
  description: string;
  ahmadNote: string;
  associatedStar?: number;
  targetRoom?: RoomId;
  targetPos?: { x: number; y: number };
}

export const MAP_LANDMARKS: MapLandmark[] = [
  // --- 4 MAIN CHAPTER BUILDINGS ---
  {
    id: 'door_bureau',
    name: 'Bureau of Unreasonable Boyfriends',
    district: 'west',
    category: 'chapter',
    x: 270,
    y: 465,
    icon: '🏛️',
    subtitle: 'Star #01: Boyfriend Complaints Office',
    description: 'Where boyfriend infractions, suspicious late replies, and fake crimes are rigorously dismissed.',
    ahmadNote: 'Pehly stone road follow kar k North-West Bureau chalien! Pagluu par lagaye gay saray jhootay charges dismiss karwatay hain!',
    associatedStar: 1,
    targetRoom: 'bureau',
    targetPos: { x: 238, y: 340 },
  },
  {
    id: 'door_museum',
    name: 'Museum of Beenish',
    district: 'north',
    category: 'chapter',
    x: 780,
    y: 280,
    icon: '🏎️',
    subtitle: 'Star #02: Topper Exhibits & Supercars',
    description: 'Home to Beenish\'s Kawasaki Ninja H2R, Dodge Challenger, private jet, and academic topper honors.',
    ahmadNote: 'Meri topper larki ka museum! aap ki Kawasaki Ninja aur Dodge Challenger khari hai andar, aur portrait k peechay brass key hai!',
    associatedStar: 2,
    targetRoom: 'museum',
    targetPos: { x: 288, y: 390 },
  },
  {
    id: 'door_court',
    name: 'Supreme Court of Absolutely No Flaws',
    district: 'east',
    category: 'chapter',
    x: 1300,
    y: 465,
    icon: '⚖️',
    subtitle: 'Star #03: The 11/10 Baddie Trial',
    description: 'Supreme courtroom where Beenish is acquitted of all earthly flaw allegations with highest honors.',
    ahmadNote: 'East promenade par Supreme Court chalien! Judge sahab se apni official 11/10 baddie acquittal certificate lein!',
    associatedStar: 3,
    targetRoom: 'court',
    targetPos: { x: 258, y: 390 },
  },
  {
    id: 'door_archive',
    name: 'Archive of Things That Happened',
    district: 'east',
    category: 'chapter',
    x: 1305,
    y: 835,
    icon: '📚',
    subtitle: 'Star #04: Memory Crystals & 2 AM Pasta Feast',
    description: 'Sacred library chronicling email origins, our 3 anthems, and late-night creamy white pasta cravings.',
    ahmadNote: 'Humari pyari memories, email archive aur 2 AM creamy white pasta feast table!',
    associatedStar: 4,
    targetRoom: 'archive',
    targetPos: { x: 268, y: 390 },
  },
  {
    id: 'door_observatory',
    name: 'Hilltop Cosmic Observatory',
    district: 'north',
    category: 'chapter',
    x: 780,
    y: 45,
    icon: '🔭',
    subtitle: 'Star #05: Constellation Altar & Star Naming',
    description: 'High atop the starry peaks, an enchanted telescope reveals our immortal constellation in the sky.',
    ahmadNote: 'Pahar k upar telescope lagi hai... telescope may apna sitara dhoondein aur apny pyare haathon se uska naam likhein!',
    associatedStar: 5,
    targetRoom: 'observatory',
    targetPos: { x: 240, y: 340 },
  },
  {
    id: 'door_garden',
    name: 'Secret Hidden Rose Garden',
    district: 'east',
    category: 'nature',
    x: 1290,
    y: 1040,
    icon: '🌹',
    subtitle: 'Star #06: Moonlight Bench & Love Letter',
    description: 'Enclosed fragrant rose sanctuary blooming under moonlight with Ahmad\'s anniversary love letter.',
    ahmadNote: 'Aap ka secret rose garden! yahan bench par baith kar mera anniversary love letter parhiye meri jaan!',
    associatedStar: 6,
    targetRoom: 'garden',
    targetPos: { x: 260, y: 390 },
  },

  // --- THE 5 DREAM ESTATES & GRAND ARCH ---
  {
    id: 'path_to_estates',
    name: 'Grand Royal Arch: Dream Estates Boulevard',
    district: 'estates',
    category: 'estates',
    x: 520,
    y: 1020,
    icon: '🏰',
    subtitle: 'Star #07: The 5 Dream Houses of Paaaari',
    description: 'Grand illuminated boulevard leading directly to all five dream realms created exclusively for Beenish.',
    ahmadNote: 'Humary saray 5 dream homes aik sath! aajaen chaltay hain meri Beghum G!',
    associatedStar: 7,
    targetRoom: 'dream_estates',
    targetPos: { x: 450, y: 75 },
  },
  {
    id: 'path_to_islamabad',
    name: 'Islamabad 5-Marla Luxury Home',
    district: 'west',
    category: 'estates',
    x: 140,
    y: 35,
    icon: '⛰️',
    subtitle: 'Dream Home #1: Modern Minimalist House',
    description: 'Scenic Margalla breeze, cozy wide sofa for Beenie, warm modern kitchen, and mountain serenity.',
    ahmadNote: 'Humara 5-marla modern ghar! Margalla hills ki thandi hawa may araam se baithiye!',
    targetRoom: 'islamabad_realm',
    targetPos: { x: 388, y: 490 },
  },
  {
    id: 'path_to_mafia',
    name: 'Dark Brutalist Mafia Safehouse & Batmobile',
    district: 'west',
    category: 'estates',
    x: 35,
    y: 580,
    icon: '🦇',
    subtitle: 'Dream Home #2: Batman Safehouse & Tumbler',
    description: 'Matte-black armor, Bat-Computer terminal, and the armored Batmobile Tumbler ready for night drives.',
    ahmadNote: 'Idhar aayen meri baddie! apna Batman safehouse aur Batmobile dekhna hai?',
    targetRoom: 'mafia_realm',
    targetPos: { x: 680, y: 350 },
  },
  {
    id: 'path_to_bakery',
    name: 'Sweet Dreams French Bakery',
    district: 'east',
    category: 'estates',
    x: 1560,
    y: 580,
    icon: '🍰',
    subtitle: 'Dream Home #3: Bakery & Strawberry Tarts',
    description: 'Warm butter croissants, strawberry celebration cakes, and fresh dessert displays.',
    ahmadNote: 'Taaza strawberry tarts aur chocolate croissants! chalien meetha khayein meri jaan?',
    targetRoom: 'bakery_realm',
    targetPos: { x: 110, y: 360 },
  },
  {
    id: 'path_to_castle',
    name: 'Queen Beenish\'s Royal Fortress Castle',
    district: 'north',
    category: 'estates',
    x: 1430,
    y: 35,
    icon: '👑',
    subtitle: 'Dream Home #4: Alpine Throne & Fortress',
    description: 'Perched high in the snowy mountain pass, an opulent purple-velvet throne reserved for Queen Beenish.',
    ahmadNote: 'Aap ka shahi mountain castle meri Queen! samnay barfeeli chotiyan aur velvet ka shahi takht!',
    targetRoom: 'castle_realm',
    targetPos: { x: 388, y: 490 },
  },
  {
    id: 'path_to_haveli',
    name: '12-Marla Gaon Haveli (Hira Ki Haveli)',
    district: 'south',
    category: 'estates',
    x: 800,
    y: 1160,
    icon: '🌾',
    subtitle: 'Dream Home #5: Desi Haveli & Tubewell',
    description: 'Cool rushing tubewell water, village shade, open brick courtyard, and peaceful countryside bliss.',
    ahmadNote: 'Tubewell ka thanda meetha paani aur neem ki chhaon... desi haveli chalain meri sweetie?',
    targetRoom: 'haveli_realm',
    targetPos: { x: 388, y: 490 },
  },

  // --- PLAZA & NATURE ---
  {
    id: 'central_birthday_cake',
    name: 'Central Birthday Celebration Plaza',
    district: 'center',
    category: 'plaza',
    x: 800,
    y: 680,
    icon: '🎂',
    subtitle: 'Strawberry Cake, White Pasta & Wish Table',
    description: 'The heart of the Valley where Ahmad welcomed Beenish into her birthday dream world.',
    ahmadNote: 'Aap ka birthday celebration table! candle blow karein aur wish mangiye meri Paaaari!',
    targetPos: { x: 800, y: 720 },
  },
  {
    id: 'pond_bench',
    name: 'Lakeside Willow Pavilion & Bench',
    district: 'west',
    category: 'nature',
    x: 310,
    y: 760,
    icon: '🌊',
    subtitle: 'Reflecting Pond & Quiet Bench',
    description: 'Peaceful grassy bank under weeping willows overlooking the starry reflection pond.',
    ahmadNote: 'Thori der mere paas baith jao na... hath pakar kar sukoon say baithtay hain!',
    targetPos: { x: 310, y: 740 },
  },
];

/**
 * Returns current objective and Ahmad's guide voice based on game state
 */
export function getActiveObjective(state: {
  starsRecovered: number;
  bureauStamped: boolean;
  inventory: string[];
  drawer07Unlocked?: boolean;
  courtVerdictReached: boolean;
  namedConstellation: string | null;
  secretGardenUnlocked: boolean;
}): {
  targetLandmarkId: string;
  chapter: string;
  title: string;
  direction: string;
  ahmadGuide: string;
  icon: string;
} {
  const {
    starsRecovered,
    bureauStamped,
    inventory,
    drawer07Unlocked,
    courtVerdictReached,
    namedConstellation,
    secretGardenUnlocked,
  } = state;

  if (starsRecovered === 0 && !bureauStamped) {
    return {
      targetLandmarkId: 'door_bureau',
      chapter: 'Chapter 1',
      title: 'Bureau of Unreasonable Boyfriends',
      direction: 'North-West (West Precinct)',
      ahmadGuide: 'Pehly stone road follow kar k North-West Bureau of Unreasonable Boyfriends chalien! Pagluu par lagaye gay saray jhootay charges dismiss karwatay hain!',
      icon: '🏛️',
    };
  }

  if (bureauStamped && !inventory.includes('brass_key') && !drawer07Unlocked) {
    return {
      targetLandmarkId: 'door_museum',
      chapter: 'Chapter 2',
      title: 'Museum of Beenish',
      direction: 'North (Terrace)',
      ahmadGuide: 'Bureau clear ho gaya! Ab seedha North chalain Museum of Beenish! Aap ki Kawasaki Ninja H2R aur Dodge Challenger dekhain, aur portrait k peechay brass key dhoondein!',
      icon: '🏎️',
    };
  }

  if (inventory.includes('brass_key') && !drawer07Unlocked) {
    return {
      targetLandmarkId: 'door_bureau',
      chapter: 'Chapter 1 Secret',
      title: 'Unlock Drawer 07 in Bureau',
      direction: 'North-West (Bureau)',
      ahmadGuide: 'Museum se Antique Brass Key mil gayi! Wapis Bureau chal kar Drawer 07 kholain aur emergency chocolates lein!',
      icon: '🔑',
    };
  }

  if (drawer07Unlocked && !courtVerdictReached) {
    return {
      targetLandmarkId: 'door_court',
      chapter: 'Chapter 3',
      title: 'Supreme Court of Absolutely No Flaws',
      direction: 'East (Promenade)',
      ahmadGuide: 'Ab East promenade par Supreme Court of Absolutely No Flaws chalain! Judge sahab se apni official 11/10 baddie acquittal certificate lein!',
      icon: '⚖️',
    };
  }

  if (courtVerdictReached && starsRecovered < 4) {
    return {
      targetLandmarkId: 'door_archive',
      chapter: 'Chapter 4',
      title: 'Archive of Things That Happened',
      direction: 'South-East (Glade)',
      ahmadGuide: 'Court may jeet gaye! Ab South-East glade may Archive chalain! Humari email memories aur 2 AM white pasta feast table apka intezar kar raha hai!',
      icon: '📚',
    };
  }

  if (starsRecovered >= 4 && !namedConstellation) {
    return {
      targetLandmarkId: 'door_observatory',
      chapter: 'Chapter 5',
      title: 'Hilltop Cosmic Observatory',
      direction: 'North Mountain Peak',
      ahmadGuide: 'Ab North paharon par chadh kar Hilltop Observatory chalain! Telescope se sitaray connect karein aur aasman par humaray star ka naam likhein!',
      icon: '🔭',
    };
  }

  if (namedConstellation && !secretGardenUnlocked) {
    return {
      targetLandmarkId: 'door_garden',
      chapter: 'Chapter 6',
      title: 'Secret Hidden Rose Garden',
      direction: 'South-East (Ivy Gate)',
      ahmadGuide: 'Aasman roshan ho gaya! South-East par Secret Rose Garden ka ivy gate khul chuka hai! Aajaen chal kar Pagluu ka anniversary letter parhein!',
      icon: '🌹',
    };
  }

  return {
    targetLandmarkId: 'path_to_estates',
    chapter: 'Chapter 7',
    title: 'Master Boulevard of All 5 Dream Estates',
    direction: 'South-West (Grand Arch Gate)',
    ahmadGuide: 'Meri Queen! Ab Grand Arch se Dream Estates boulevard may dakhil hon! Islamabad house, Mafia safehouse, Sweet Bakery, Royal Castle aur Gaon Haveli ghoomein!',
    icon: '🏰',
  };
}
