import { BureauReport, MuseumExhibit, ArchiveMemory, FutureVignette, JournalEntry } from '../types/expedition';

export const EXPLORER_INFO = {
  name: "Beenish Tasaffar",
  codename: "Beenie",
  title: "11/10 Baddie, BOLD",
  birthdayDate: "October 27",
  missionStatus: "THE BIRTHDAY EXPEDITION",
  boyfriendBias: "100% (Non-negotiable)",
};

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'bureau_complete',
    title: 'Investigate the Bureau of Unreasonable Boyfriends',
    location: 'bureau',
    completed: false,
    rewardStar: 1,
  },
  {
    id: 'museum_complete',
    title: 'Inspect the Museum of Beenish Exhibits',
    location: 'museum',
    completed: false,
    rewardStar: 2,
  },
  {
    id: 'court_complete',
    title: 'Attend the Court of Absolutely No Flaws',
    location: 'court',
    completed: false,
    rewardStar: 3,
  },
  {
    id: 'archive_complete',
    title: 'Recover Classified Memories in the Archive',
    location: 'archive',
    completed: false,
    rewardStar: 4,
  },
  {
    id: 'observatory_complete',
    title: 'Gaze at the 5 Dream Houses in the Observatory',
    location: 'observatory',
    completed: false,
    rewardStar: 5,
  },
  {
    id: 'garden_complete',
    title: 'Discover the Secret Hidden Garden',
    location: 'garden',
    completed: false,
    rewardStar: 6,
  },
];

export const BUREAU_REPORTS: BureauReport[] = [
  {
    id: 'hmm_protocol',
    code: 'CASE-001A',
    title: 'The "Hmm" Decryption Protocol',
    subject: "Beenish's 5 stages of 'Hmm'",
    investigator: 'Her deeply observant boyfriend',
    objectivity: 'Empirically verified through survival experience',
    finding: 'Scientific breakdown of subject’s expressions:\n\n• "3hm" = Gussay may. Extreme emergency. Cease all arguments immediately and provide dark chocolates.\n• "hmm" = Acha acha. Agreement reached, peace maintained.\n• "tanz" = Pure sarcasm. Investigator is being thoroughly roasted.\n• "hm hm" = Shakki nighayen. Suspicious eyes watching every move.\n• "hm hm hm" = No samajh aa rahi. Complete confusion.',
    caption: 'Exhibit A: The single most dangerous linguistic dictionary in the world.',
    soundType: 'rustle',
  },
  {
    id: 'favorite_personalities',
    code: 'CASE-001B',
    title: 'Top 3 Personalities of All Time',
    subject: 'Historical & Personal Importance Ranking',
    investigator: 'Official Bureau Ethics Committee',
    objectivity: '100% Verified Truth',
    finding: 'Official verified ranking of Beenish’s favorite humans in existence:\n\n1. MEEEEEE (Her Boyfriend) — The undisputed, glorious #1.\n2. Quaid-e-Azam — The father of the nation takes an honorable 2nd place.\n3. Asmaa — A solid, honored 3rd place.\n\nInvestigator note: Beating the founder of Pakistan for the #1 spot remains the single greatest accomplishment of my life.',
    caption: 'Exhibit B: The official ranking. Quaid-e-Azam understands and respects the decision.',
    soundType: 'chime',
  },
  {
    id: '11_out_of_10_baddie',
    code: 'CASE-001C',
    title: 'The 11/10 Baddie, BOLD Dossier',
    subject: 'Unusually high aesthetic and personality ratings',
    investigator: 'Someone with his jaw permanently on the floor',
    objectivity: 'Undeniable reality',
    finding: 'Physical and temperamental analysis: Subject is an indisputable 11/10 Baddie. Bold, brilliant, sharply witty, and capable of rendering the investigator completely speechless just by walking into the room. Ordinary rating scales have shattered.',
    caption: 'Exhibit C: Documented case of an 11/10 holding absolute power.',
    soundType: 'rustle',
  },
  {
    id: 'dhayeer_saari_chocolates',
    code: 'CASE-001D',
    title: 'The Dhayeeer Saari Chocolates & Paisay Vault',
    subject: 'Demand for mounds of sweets and galactic wealth',
    investigator: 'Her willing accomplice',
    objectivity: 'Pure devotion',
    finding: 'Requisite supplies for Beenish’s complete happiness:\n\n• Dark Chocolates: Dhayeeeer saari.\n• Meethi & Milk Chocolates: Dhayeeeer saari.\n• Kinder Joys, Nutella, and Koko Krunch: Endless piles.\n• Paisay: Dhayeeer saryyyyyyyy.\n\nRuling: She deserves every single rupee, coin, and chocolate bar in the known universe.',
    caption: 'Exhibit D: Emergency supplies safely locked in Bureau Drawer #07.',
    soundType: 'chime',
  },
];

export const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'exhibit_ninja_h2r',
    wing: 'portrait',
    title: 'The Kawasaki Ninja H2R & Dodge Challenger',
    subtitle: 'High-Octane Machine Gallery',
    badge: 'Artifact #01',
    plaque: 'For a girl who doesn’t do ordinary speed. A twin showcase of the beastly Kawasaki Ninja H2R superbike and the roaring Dodge Challenger muscle car. The only machines fast enough to match her 11/10 baddie energy.',
    quote: 'You on an H2R is honestly the most terrifyingly attractive concept ever conceived.',
  },
  {
    id: 'exhibit_white_jet',
    wing: 'notices',
    title: 'The White/Grey Private Jet Vision',
    subtitle: 'The Prophecy Gallery',
    badge: 'Artifact #02',
    plaque: 'A documented vision: Meri Beenie stepping down the stairs of a sleek white and grey private jet in a white dress, while Ted stands on the tarmac with his mouth hanging open in sheer, helpless awe.',
    quote: 'Looking at you with my mouth open is my permanent natural state anyway.',
  },
  {
    id: 'exhibit_athlete',
    wing: 'achievements',
    title: 'The Cricket & Badminton Champion Arena',
    subtitle: 'Hall of Legendary Feats',
    badge: 'Artifact #03',
    plaque: 'Twin crossed badminton rackets and a cricket bat. Top marks in academics, fierce determination in life, and an undefeated champion on the court. Anyone who challenges her will lose quickly.',
    quote: 'Position holder, fierce athlete, and still the cutest person on this planet.',
  },
  {
    id: 'exhibit_twin_cities',
    wing: 'phenomenon',
    title: 'The Sialkot Roots & Islamabad Dreams',
    subtitle: 'The Heritage Relief Map',
    badge: 'Artifact #04',
    plaque: 'A carved sandstone map connecting her beloved hometown of Sialkot to the quiet, tree-lined hills of Islamabad where the five-marla dream family house will stand.',
    quote: 'From Sialkot to Islamabad, everywhere I look, I only see a future with you.',
  },
];

export const ARCHIVE_MEMORIES: ArchiveMemory[] = [
  {
    id: 'mem_songs',
    title: 'The Three Anthems of Our Heart',
    dateOrMoment: 'Songs that belong to us',
    preview: 'Bol na halke halke... Mohabbat jisko bakhsh de zindagi... Lo maan lia...',
    fullNote: 'Whenever these three songs play, the whole world fades out:\n\n1. "Bol Na Halke Halke" — for the quiet, tender evenings where no words are needed.\n2. "Mohabbat Jisko Bakhsh De Zindagi" — for the kind of love that doesn’t bend, doesn’t waver, and never ends.\n3. "Lo Maan Liya Humne Hai Nahi Tumko" — for the sweet ache of missing each other when miles feel too long.\n\nYou are in every single lyric, Beenie.',
    isClassified: false,
  },
  {
    id: 'mem_white_pasta',
    title: '2 AM White Pasta & Midnight Sweets',
    dateOrMoment: 'The Late Night Cravings',
    preview: 'Steaming white pasta, piles of Kinder Joy, and Nutella spoonfuls...',
    fullNote: 'The late-night feasts: steaming hot white pasta made just the way you like it, mounds of Kinder Joys cracked open, jars of Nutella, and big midnight bowls of Koko Krunch. Eating good food with you and listening to you talk is better than any five-star restaurant in the world.',
    isClassified: false,
  },
  {
    id: 'mem_email_origin',
    title: 'TOP SECRET: The binishieeees@gmail.com Log',
    dateOrMoment: 'Where everything began',
    preview: '[CLASSIFIED ORIGIN RECORD - CLICK TO DECRYPT]',
    fullNote: 'To binishieeees@gmail.com — the address where the magic first sparked. I still remember the very first messages, the flutter in my chest, the way you teased me, and how fast I fell for you. If I could relive that beginning a thousand times, I would choose you every single time.',
    isClassified: true,
  },
];

export const FUTURE_VIGNETTES: FutureVignette[] = [
  {
    id: 'house_islamabad',
    title: '1. The Islamabad Family House (5 Marla)',
    category: 'Our Dream Home',
    description: '5 marla in the quiet green hills of Islamabad. 3 bedrooms for our 3 children (2 boys, 1 girl) — each child gets their own room.',
    sceneVisual: 'family_house',
    unlockedNote: '• Boys’ room: Samurai Jack theme with deep blue.\n• Girl’s room: Soft light purple and pastel pink with a giant stuffed teddy bear.\n• The living room: A giant, extra-wide sofa built specifically for my choti si Beenie to curl up on.\n• The Gaming Room for late-night gaming sessions.\n• A cozy brown-themed study for Ted.',
  },
  {
    id: 'house_mafia',
    title: '2. The Secret Mafia Base',
    category: 'High-Stakes Adventure',
    description: 'A secret jet-black mansion with reinforced glass walls, a Batman-style basement, and the Tumbler car.',
    sceneVisual: 'mafia_base',
    unlockedNote: 'Underground shooting range, snipers, makeup-concealed weapons, and secret rings. A blacksmith forge with custom forged daggers and swords, a bar with delicate crystal glasses, and a command room where I oversee your high-stakes missions. Pure unstoppable adventure together.',
  },
  {
    id: 'house_bakery',
    title: '3. The Dream Bakery',
    category: 'Sweet Sanctuary',
    description: 'A cozy artisan bakery with warm timber beams, the scent of vanilla and fresh breads, and endless desserts.',
    sceneVisual: 'bakery',
    unlockedNote: 'Freshly baked croissants, big plates of hot white pasta for lunch, and stacks upon stacks of Nutella, chocolates, and pastries. A peaceful haven where you can bake, taste, and smile all day long.',
  },
  {
    id: 'house_castle',
    title: '4. Meri Queen’s Mountain Castle',
    category: 'Royal Realm',
    description: 'A towering stone castle perched on an alpine mountain crest, overlooking misty valleys and wild forests.',
    sceneVisual: 'mountain_castle',
    unlockedNote: 'Grand royal banquet table, a tall minaret tower for Princess Beenie, giant crystal jhoomar (chandeliers), and glowing fanoos (lanterns) along stone halls. Red carpets, warm wolf and white bear furs, delicate heels in the Queen’s royal wardrobe, mounted horseback archery, armored knights, and Queen Beenie’s custom forged sword.',
  },
  {
    id: 'house_haveli',
    title: '5. Gaon Haveli / Hira Ki Haveli (12 Marla)',
    category: 'Village Peace',
    description: '12 marla open courtyard, matti ka ghar (clay walls), green khet (fields) stretching to the horizon, and the cool rushing tubewell.',
    sceneVisual: 'gaon_haveli',
    unlockedNote: 'Woven charpaiyan laid out under the open starry sky, sitting side-by-side on a traditional chadar with a warm cup of chai, listening to the water hum from the tubewell as the evening breeze cools the air. Pure, quiet, undisturbed peace with you.',
  },
];

export const BIRTHDAY_LETTER = {
  salutation: "My Dearest Beenish,",
  title: "A World Built Just For You",
  paragraphs: [
    "I wanted to build you something that could only exist because you're you, and I'm me.",
    "Not a standard card that gets tucked away, and not a generic romantic website. I wanted you to step into a miniature universe where every joke is ours—from the moments you hit me with a '3hm' when you're mad, to beating Quaid-e-Azam for the #1 spot on your favorite personalities list.",
    "From your 11/10 baddie energy, to your academic brilliance, to the way you demand 'dhayeeeer saaray paisay' and mounds of chocolates—every single star in this valley represents something real that I adore about you.",
    "Whether it's our 5-marla family house in Islamabad with the giant sofa for my choti si Beenie, the secret mafia base, the mountain castle where you rule as Queen with your sword, or the quiet gaon haveli under the open sky on the charpaiyan—I promise to build all these worlds with you in real life.",
    "Happy Birthday, my Beenie. You are my favorite adventure, my sweetest reality, and the girl I will always choose.",
  ],
  signoff: "Forever your unreasonable boyfriend,",
  postscript: "Bas meri Beenish hain. Samajh nahi aata, bas hain. ♡",
};
