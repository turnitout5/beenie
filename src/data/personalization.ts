import { BureauReport, MuseumExhibit, ArchiveMemory, FutureVignette, JournalEntry } from '../types/expedition';

export const EXPLORER_INFO = {
  name: "Beenish Tasaffar",
  codename: "Beenie",
  title: "The Reason The Universe Exists",
  birthdayDate: "October 27",
  missionStatus: "CRITICAL: RECOVER THE STARS",
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
    title: 'Map Future Constellations in the Observatory',
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
    id: 'hair',
    code: 'CASE-001A',
    title: 'The Hair Incident',
    subject: "Beenish's hair",
    investigator: 'Her boyfriend',
    objectivity: '0%',
    finding: 'Investigator cannot be trusted to discuss this subject normally. Physical evidence demonstrates overwhelming aesthetic perfection.',
    caption: 'Exhibit A: Documented case of hair defying ordinary scientific parameters.',
    soundType: 'rustle',
  },
  {
    id: 'eyes',
    code: 'CASE-001B',
    title: 'The Eyes Incident',
    subject: "Beenish's eyes and expressions",
    investigator: 'Her boyfriend',
    objectivity: 'Less than 0%',
    finding: 'Looking directly at the subject causes sudden loss of vocabulary, elevated pulse, and uncontrollable adoration.',
    caption: 'Exhibit B: Direct gaze analysis. Result: Complete surrender.',
    soundType: 'rustle',
  },
  {
    id: 'intelligence',
    code: 'CASE-001C',
    title: 'The Intelligence Incident',
    subject: 'Academic brilliance and sheer capability',
    investigator: 'Official Commendation Board',
    objectivity: '100% Verified Truth',
    finding: 'Certified Genius. Possesses dangerous levels of talent, focus, and drive while somehow still remaining the cutest human alive.',
    caption: 'Official Certificate: Recognition of extraordinary intelligence and unmatched grace.',
    soundType: 'chime',
  },
  {
    id: 'soft_heart',
    code: 'CASE-001D',
    title: 'The Soft Heart Investigation',
    subject: 'Her warmth, empathy, and care for family',
    investigator: 'Someone who notices every quiet moment',
    objectivity: 'Pure admiration',
    finding: 'Subject carries a softness that makes the world gentler. The way she cares for her siblings, honors her parents, and protects those she loves is her greatest magic.',
    caption: 'Exhibit D: The quiet truth beneath all the jokes.',
    soundType: 'chime',
  },
];

export const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'exhibit_portraits',
    wing: 'portrait',
    title: 'The Things Everyone Can See',
    subtitle: 'The Master Gallery',
    badge: 'Artifact #01',
    plaque: 'Photographs of Beenish Tasaffar displayed like invaluable museum masterpieces.',
    quote: 'Even someone who only caught a glimpse would stop and remember.',
  },
  {
    id: 'exhibit_notices',
    wing: 'notices',
    title: 'Things Her Boyfriend Notices',
    subtitle: 'The Micro-Observations Room',
    badge: 'Artifact #02',
    plaque: 'A collection of tiny details: the specific expression she makes when she is thinking, the way her laughter starts softly before filling the whole room, and how she tilts her head when she is curious.',
    quote: 'The world sees a beautiful girl. I get to see all the small reasons you are unforgettable.',
  },
  {
    id: 'exhibit_achievements',
    wing: 'achievements',
    title: 'The Position Holder Artifact',
    subtitle: 'Hall of Legendary Feats',
    badge: 'Artifact #03',
    plaque: 'An exceptionally rare specimen. Known abilities: Working tirelessly, achieving top honors, overcoming challenges, and making hard work look like second nature.',
    quote: 'I am so endlessly proud of everything you accomplish, Beenie.',
  },
  {
    id: 'exhibit_phenomenon',
    wing: 'phenomenon',
    title: 'The Unexplainable Beenish Phenomenon',
    subtitle: 'Overengineered Analysis Chamber',
    badge: 'CLASSIFIED PHENOMENON',
    plaque: 'Scientists have spent years studying this phenomenon using state-of-the-art instruments without reaching a consensus.',
    quote: 'Bas meri Beenish hain. Samajh nahi aata, bas hain.',
  },
];

export const ARCHIVE_MEMORIES: ArchiveMemory[] = [
  {
    id: 'mem_ordinary',
    title: 'The Ordinary Conversation That Wasn’t Ordinary To Me',
    dateOrMoment: 'A quiet ordinary evening',
    preview: 'A message thread that felt like pure sunshine...',
    fullNote: 'You probably didn’t think much of this conversation at the time, but I still remember how genuinely happy I was talking to you. It was the moment I realized even ordinary seconds become precious when they belong to you.',
    isClassified: false,
  },
  {
    id: 'mem_laugh',
    title: 'The Time We Couldn’t Stop Laughing',
    dateOrMoment: 'Unscheduled Joy',
    preview: 'An inside joke that still brings a smile...',
    fullNote: 'That ridiculous moment when something small set us off and we couldn’t catch our breath. Your laugh is my favorite sound in the world.',
    isClassified: false,
  },
  {
    id: 'mem_classified',
    title: 'TOP SECRET: ARCHIVE INCIDENT #99',
    dateOrMoment: 'Permanently Inscribed in Memory',
    preview: '[CLASSIFIED MEMORY SHARD - CLICK TO DECRYPT]',
    fullNote: 'I don’t even remember every single detail we were debating or talking about that night. I just remember the overwhelming feeling of being so grateful that it was you.',
    isClassified: true,
  },
];

export const FUTURE_VIGNETTES: FutureVignette[] = [
  {
    id: 'fut_photoshoot',
    title: 'Our Proper Photoshoot',
    category: 'Visual Milestone',
    description: 'Two pixel characters attempting to take romantic photos. One poses elegantly while the other makes ridiculous faces.',
    sceneVisual: 'photoshoot',
    unlockedNote: 'We have a hundred silly memories, but I can’t wait for the day we dress up and take our absolute best pictures together.',
  },
  {
    id: 'fut_walks',
    title: 'Nighttime Walks Under The Stars',
    category: 'Peaceful Routine',
    description: 'Walking quietly along cool empty streets with no rush to be anywhere else.',
    sceneVisual: 'walk',
    unlockedNote: 'No phones, no noise. Just your hand in mine, talking about everything and nothing until the city falls asleep.',
  },
  {
    id: 'fut_reels',
    title: 'Ridiculous Couple Reels',
    category: 'Unreasonable Fun',
    description: 'Filming the most absurd, cute videos that we will laugh at for the next fifty years.',
    sceneVisual: 'reels',
    unlockedNote: 'I promise to cooperate with all your video ideas, even the completely embarrassing ones.',
  },
  {
    id: 'fut_date',
    title: 'The Dream Table For Two',
    category: 'Celebration',
    description: 'A cozy corner table with warm lighting and food we have been wanting to try.',
    sceneVisual: 'date',
    unlockedNote: 'Every date with you is an adventure. Looking forward to a lifetime of sharing meals and smiles.',
  },
];

export const BIRTHDAY_LETTER = {
  salutation: "My Dearest Beenish,",
  title: "A World Built Just For You",
  paragraphs: [
    "I wanted to build you something that could only exist because you're you, and I'm me.",
    "Not a standard card that gets tucked away, and not a generic romantic website with nine generic icons. I wanted you to step into a miniature universe where every joke is ours, where your brilliance is celebrated, and where every star that lit up along the way represents something real that I adore about you.",
    "From your hair that refuses to obey ordinary laws, to the unmatched talent that makes you a standout, to the tender heart that loves your family so deeply—you are the rarest person I have ever known.",
    "Whenever life feels overwhelming or demanding, I want you to remember this little world. It will always be here, peaceful and bright, reminding you that someone loves you with an unreasonable, steadfast devotion.",
    "Happy Birthday, my Beenie. You are my favorite expedition, my sweetest reality, and the girl I will always choose.",
  ],
  signoff: "Forever your unreasonable boyfriend,",
  postscript: "Bas meri Beenish hain. Samajh nahi aata, bas hain. ♡",
};
