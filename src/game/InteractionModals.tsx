import React, { useState, useEffect } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { InteractableObject } from './types';
import { 
  BUREAU_REPORTS, 
  BIRTHDAY_LETTER,
  ARCHIVE_MEMORIES,
  FUTURE_VIGNETTES
} from '../data/personalization';
import { soundEngine } from '../audio/soundEngine';

interface InteractionModalsProps {
  activeObject: InteractableObject | null;
  onClose: () => void;
}

export const InteractionModals: React.FC<InteractionModalsProps> = ({
  activeObject,
  onClose,
}) => {
  const { 
    state, 
    markReportRead, 
    stampBureau, 
    unlockGarden, 
    examineExhibit, 
    readMemory, 
    viewVignette,
    setConstellationName, 
    reachVerdict,
    recoverStar,
    setPuzzleState
  } = useExpedition();

  const { readReports, bureauStamped, inventory, namedConstellation } = state;
  const hasBrassKey = inventory.includes('brass_key');

  // Sub-states initialized to valid personal data keys & persisted expedition progress
  const [selectedReportId, setSelectedReportId] = useState<string>(BUREAU_REPORTS[0]?.id || 'hmm_protocol');
  const [constellationInput, setConstellationInput] = useState<string>(namedConstellation || '');
  const [candlesBlown, setCandlesBlown] = useState<boolean>(Boolean(state.candlesBlown));
  const [paisayTotal, setPaisayTotal] = useState<number>(100000000000);
  const [snackMessage, setSnackMessage] = useState<string | null>(null);
  const [revvingVehicle, setRevvingVehicle] = useState<'h2r' | 'challenger' | null>(null);
  const [islamabadRoom, setIslamabadRoom] = useState<'living' | 'boy1' | 'boy2' | 'girl' | 'gaming' | 'master'>('living');
  const [mafiaTab, setMafiaTab] = useState<'tumbler' | 'armory' | 'surveillance'>('tumbler');
  const [bakeryTab, setBakeryTab] = useState<'parlour' | 'ovens' | 'fondue'>('parlour');
  const [castleTab, setCastleTab] = useState<'throne' | 'balcony'>('throne');
  const [haveliTab, setHaveliTab] = useState<'courtyard' | 'tubewell'>('courtyard');
  const [tumblerRevved, setTumblerRevved] = useState<boolean>(false);
  const [lassiCount, setLassiCount] = useState<number>(2);
  const [activeVignetteId, setActiveVignetteId] = useState<string | null>(null);
  const [pagluDialogueIndex, setPagluDialogueIndex] = useState<number>(0);

  // Reset transient feedback messages whenever active interactable changes or modal closes
  useEffect(() => {
    setSnackMessage(null);
    setRevvingVehicle(null);
    setTumblerRevved(false);
  }, [activeObject?.id]);

  const handleClose = () => {
    setSnackMessage(null);
    setRevvingVehicle(null);
    setTumblerRevved(false);
    onClose();
  };

  // Engineered Puzzle States (Synced with persisted ExpeditionState so solved puzzles stay solved!)
  // Ch. 1: Bureau Pleadings Match-up
  const [selectedDefenses, setSelectedDefenses] = useState<Record<string, string>>(
    state.bureauChargesSolved || state.bureauStamped
      ? { charge_hmm: 'tanz', charge_baddie: 'malai', charge_sweets: 'reparations' }
      : ({} as Record<string, string>)
  );
  // Ch. 2: Museum Jet Observation Cipher
  const [selectedSteps, setSelectedSteps] = useState<number>(() =>
    state.museumJetCodeSolved || hasBrassKey ? 4 : 2
  );
  const [selectedColor, setSelectedColor] = useState<string>(() =>
    state.museumJetCodeSolved || hasBrassKey ? 'White' : 'Emerald'
  );
  // Ch. 3: Court Scales Tokens
  const [activeTokens, setActiveTokens] = useState<string[]>(() =>
    state.courtScalesBalanced || state.courtVerdictReached
      ? ['chai_kisses', 'pure_heart', 'wife_crush']
      : []
  );
  // Ch. 4: Archive Chronology
  const [chronologyOrder, setChronologyOrder] = useState<string[]>(() =>
    state.archiveChronologySolved || state.recoveredStarIds.includes(4)
      ? ['mem_email_origin', 'mem_white_pasta', 'mem_songs', 'mem_birthday_vow']
      : ['mem_white_pasta', 'mem_birthday_vow', 'mem_email_origin', 'mem_songs']
  );
  const [selectedShard, setSelectedShard] = useState<string | null>(null);
  // Ch. 5: Observatory Star Nodes
  const [linkedNodes, setLinkedNodes] = useState<string[]>(() =>
    state.observatoryConstellationConnected || Boolean(state.namedConstellation)
      ? ['node_islamabad', 'node_mafia', 'node_bakery', 'node_castle', 'node_haveli']
      : []
  );
  // Ch. 6: Garden 3 Lanterns
  const [gardenLanterns, setGardenLanterns] = useState<number[]>(() =>
    (state.gardenLanternsLit ?? 0) >= 3 || state.recoveredStarIds.includes(6)
      ? [1, 2, 3]
      : []
  );

  if (!activeObject) return null;

  // 1. FILING CABINET (BUREAU OF UNREASONABLE PAGLU)
  if (activeObject.type === 'filing_cabinet') {
    const report = BUREAU_REPORTS.find(r => r.id === selectedReportId) || BUREAU_REPORTS[0];

    const charges = [
      {
        id: 'charge_hmm',
        title: "1. Jab Beghum G 'hm hm hm' bolti hain 😅",
        allegation: "Pagluu foran confuse ho jata hai aur chocolate hazir karta hai!",
        correctChoice: 'tanz',
        options: [
          { key: 'tanz', label: "Pure Tanz & Roast mode: Pagluu ki khair nai!" },
          { key: 'typo', label: "Galti se type ho gaya phone par." },
          { key: 'denial', label: "Mainay to aisa kuch nai kaha!" }
        ]
      },
      {
        id: 'charge_baddie',
        title: "2. 11/10 Baddie Beenish Tasaffar",
        allegation: "Itni haseena k Pagluu ka moun permanent khula reh jata hai!",
        correctChoice: 'malai',
        options: [
          { key: 'light', label: "Lighting achi thi bas." },
          { key: 'malai', label: "Sari ki sari aap malai! White-white baal aur chotu si chin 11/10 baddie hain!" },
          { key: 'modest', label: "Bas aese hi normal hoon." }
        ]
      },
      {
        id: 'charge_sweets',
        title: "3. Dhayeeer Saari Chocolates & Paisay",
        allegation: "Late night chocolates aur endless paisay ki demand!",
        correctChoice: 'reparations',
        options: [
          { key: 'budget', label: "Monthly budget k andar rehna chahiye." },
          { key: 'reparations', label: "Meri Paaaari deserves all the chocolates and paisay in the universe!" },
          { key: 'apples', label: "Green apples kha lenge." }
        ]
      }
    ];

    const allPleadingsCorrect = 
      selectedDefenses['charge_hmm'] === 'tanz' &&
      selectedDefenses['charge_baddie'] === 'malai' &&
      selectedDefenses['charge_sweets'] === 'reparations';

    const handleStamp = () => {
      soundEngine.playStamp();
      stampBureau();
      setPuzzleState({ bureauChargesSolved: true });
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <div>
              <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Meri Pyari Paaaari Ki Pyari Baatein ♥
              </span>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem', marginTop: '2px' }}>
                Reasons Why Beenish Is 11/10 Sundar &amp; Flawless ♥
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Folder tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {BUREAU_REPORTS.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  soundEngine.playPaperRustle();
                  setSelectedReportId(r.id);
                  markReportRead(r.id);
                }}
                className={`pixel-btn ${selectedReportId === r.id ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {r.title} {readReports.includes(r.id) && ' ♥'}
              </button>
            ))}
          </div>

          {/* Report Body */}
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '18px', marginBottom: '16px', lineHeight: '1.7' }}>
            <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-dusty-lavender)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(246, 215, 139, 0.2)', paddingBottom: '6px' }}>
              <span>From: <strong style={{ color: 'var(--color-lantern-gold)' }}>Ahmad (Apka Pagluu ♥)</strong></span>
              <span>For: <strong style={{ color: 'var(--color-warm-peach)' }}>Meri Paaaari (Beenish)</strong></span>
            </div>

            {/* Special Interactive Render: The "Hmm" Dictionary */}
            {report.id === 'hmm_protocol' && (
              <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-twilight-blue)', padding: '14px', margin: '14px 0' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  THE PAAARI "HMM" DICTIONARY 😅
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)' }}>
                    <strong style={{ color: 'var(--color-rose-glow)' }}>"hm hm hm"</strong> = Gussay may (Extreme emergency! Cease all arguments immediately and provide dark chocolates).
                  </div>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(107, 178, 142, 0.15)', borderLeft: '3px solid var(--color-forest-moss)' }}>
                    <strong style={{ color: 'var(--color-forest-moss)' }}>"hmm"</strong> = Acha acha (Agreement reached, peace maintained).
                  </div>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(246, 215, 139, 0.15)', borderLeft: '3px solid var(--color-lantern-gold)' }}>
                    <strong style={{ color: 'var(--color-lantern-gold)' }}>"tanz"</strong> = Pure sarcasm (Investigator is being thoroughly roasted).
                  </div>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(149, 136, 189, 0.15)', borderLeft: '3px solid var(--color-dream-lilac)' }}>
                    <strong style={{ color: 'var(--color-dream-lilac)' }}>"hm hm"</strong> = Shakki nighayen (Suspicious eyes watching every move).
                  </div>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(74, 88, 138, 0.25)', borderLeft: '3px solid var(--color-twilight-blue)' }}>
                    <strong style={{ color: 'var(--color-moon-cream)' }}>"hmmmmmm"</strong> = No samajh aa rahi (Complete confusion).
                  </div>
                </div>
              </div>
            )}

            {/* Special Interactive Render: Top Personalities */}
            {report.id === 'favorite_personalities' && (
              <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-lantern-gold)', padding: '14px', margin: '14px 0', textAlign: 'center' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  MERI PAAARI KE SAB SE FAVORITE INSAAN ♥
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', margin: '12px 0' }}>
                  <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.15)', border: '2px solid var(--color-lantern-gold)', padding: '10px 16px', minWidth: '160px' }}>
                    <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem' }}>#1 MEEEEEE</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)' }}>Ahmad / Pagluu (Undisputed #1)</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '10px 14px', minWidth: '130px' }}>
                    <div className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '0.95rem' }}>#2 Quaid-e-Azam</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>Honorable 2nd</div>
                  </div>
                </div>
                <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-warm-peach)', fontStyle: 'italic', margin: 0 }}>
                  "Beating the founder of Pakistan for the #1 spot remains the single greatest achievement of my life."
                </p>
              </div>
            )}

            <div style={{ margin: '12px 0' }}>
              <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--color-warm-peach)', fontWeight: 600 }}>PAGLUU KI SACHI BAAT:</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--color-moon-cream)', whiteSpace: 'pre-line', marginTop: '6px' }}>
                {report.finding}
              </p>
            </div>

            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', backgroundColor: 'rgba(243, 183, 156, 0.1)', padding: '8px 12px' }}>
              {report.caption}
            </div>
          </div>

          {/* Interactive Defense Pleadings Puzzle */}
          {!bureauStamped && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-lantern-gold)', padding: '18px', marginBottom: '18px' }}>
              <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Meri Paaaari Ki Pyari Defenses ♥
              </div>
              <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', marginBottom: '14px', lineHeight: '1.6' }}>
                Teeno pyari baaton k baray mein batayein k sachi baat kya hai:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                {charges.map(c => (
                  <div key={c.id} style={{ backgroundColor: 'var(--color-void-navy)', padding: '12px', borderLeft: '3px solid var(--color-warm-peach)' }}>
                    <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px' }}>
                      {c.title}
                    </div>
                    <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem', marginBottom: '8px' }}>
                      {c.allegation}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {c.options.map(opt => {
                        const isSelected = selectedDefenses[c.id] === opt.key;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedDefenses(prev => ({ ...prev, [c.id]: opt.key }));
                            }}
                            className={`pixel-btn ${isSelected ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                            style={{ textAlign: 'left', fontSize: '0.78rem', padding: '6px 10px', justifyContent: 'flex-start' }}
                          >
                            {isSelected ? '[✓] ' : '[ ] '} {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {allPleadingsCorrect ? (
                <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.15)', border: '1px dashed var(--color-lantern-gold)', padding: '10px', textAlign: 'center', marginBottom: '8px' }}>
                  <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    ♥ Teeno baatein bilkul sach hain! Meri Paaaari 100% adorable hain! ♥
                  </span>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <span className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem' }}>
                    (Teeno pyari baaton ko choose karein taakay official stamp lag jaye!)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Official Stamp & Clue */}
          <div style={{ textAlign: 'center' }}>
            {bureauStamped ? (
              <div>
                <div className="font-display" style={{ color: 'var(--color-rose-glow)', fontSize: '1.05rem', border: '2px solid var(--color-rose-glow)', padding: '10px 20px', display: 'inline-block', transform: 'rotate(-2deg)', marginBottom: '16px' }}>
                  ★ VERDICT: 11/10 GUILTY OF BEING THE LOVE OF MY LIFE! ★
                </div>
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', maxWidth: '520px', margin: '0 auto 14px auto', textAlign: 'left' }}>
                  <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    Ahmad's Note (For Meri Paaaari ♥):
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', lineHeight: '1.7' }}>
                    "Meri jaan Paaaari, I hid the antique brass key to Drawer #07 behind your White Jet painting in the Museum of Beenish! Exit the Bureau and follow the grand promenade North to inspect Portrait #2!"
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ width: '100%', maxWidth: '520px', justifyContent: 'center', padding: '12px' }}
                >
                  Chalo Museum Chalein Meri Jaan →
                </button>
              </div>
            ) : (
              <button 
                disabled={!allPleadingsCorrect}
                onClick={handleStamp} 
                className="pixel-btn pixel-btn-primary font-display" 
                style={{ padding: '12px 28px', opacity: allPleadingsCorrect ? 1 : 0.4, cursor: allPleadingsCorrect ? 'pointer' : 'not-allowed' }}
              >
                STAMP FILE (OFFICIALLY ADORABLE) ♥
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. BUREAU DESK DRAWER (SECRET KEY INTERACTION)
  if (activeObject.type === 'bureau_drawer') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', letterSpacing: '0.12em', marginBottom: '8px' }}>
            {hasBrassKey ? 'Chabi Lag Gayi! Drawer Ready Hai ♥' : 'Drawer #07 Locked Hai'}
          </div>
          <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '10px' }}>
            {hasBrassKey ? 'Desk Drawer #07 Khul Gaya!' : 'Locked Desk Drawer #07'}
          </h2>

          {hasBrassKey ? (
            <div>
              <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', lineHeight: '1.8', marginBottom: '16px', textAlign: 'left' }}>
                You insert Antique Brass Key #07 found behind the White Jet frame in the Museum. With a satisfying metallic click, the heavy oak drawer glides open.
                <br /><br />
                Inside rests the <strong>Overgrown Botanical Map</strong> pointing directly toward the blooming rose ivy gate in the Southeast, surrounded by an emergency stash: mounds of Dark, Milk, and Meethi chocolates (dhayeeeer saari!), Kinder Joys, and a jar of Nutella!
              </p>
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px dashed var(--color-warm-peach)', padding: '14px', marginBottom: '18px', textAlign: 'left' }}>
                <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', marginBottom: '4px' }}>
                  Pyara sa Note (Ahmad ki taraf se):
                </div>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: '1.7' }}>
                  "For my 11/10 baddie when she needs sugar or when she hits me with hm hm hm. Now take this botanical map, and head East to the Court of Absolutely No Flaws!"
                </div>
              </div>
              <div className="pixel-badge pixel-badge-gold font-mono" style={{ marginBottom: '20px', padding: '6px 14px' }}>
                Chocolates &amp; Map Mil Gaya! Chalo Court of No Flaws chaltay hain ♥
              </div>
              <button 
                onClick={() => {
                  soundEngine.playKeyUnlock();
                  setPuzzleState({
                    drawer07Unlocked: true,
                    inventory: inventory.includes('botanical_map') ? inventory : [...inventory, 'botanical_map'],
                  });
                  onClose();
                }} 
                className="pixel-btn pixel-btn-peach font-display" 
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                Chocolates Aur Map Uthayein (Chalo Court Chalein ♥)
              </button>
            </div>
          ) : (
            <div>
              <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', marginBottom: '18px' }}>
                The drawer is sealed with an antique brass cylinder lock. A small brass plaque reads:
                <br /><em style={{ color: 'var(--color-warm-peach)' }}>"The key is tucked behind her private jet vision in the Museum of Beenish."</em>
              </p>
              <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
                SEARCH THE MUSEUM FOR THE KEY
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. TALK TO PAGLUU (STAGE-AWARE & ROOM-AWARE DIEGETIC COMPANION GUIDE)
  if (activeObject.type === 'bureau_desk' || activeObject.type === 'npc_ted') {
    const getPagluQuote = () => {
      // Dream Estates & Realms Guidance
      if (state.currentLocation === 'dream_estates') {
        return "Humara dream boulevard! 5 pyare ghar hain meri jaan: Islamabad Villa, Mafia Batcave, Sweet Dreams Bakery, Royal Castle, aur Gaon Haveli! Kahan chalein pehle?";
      }
      if (state.currentLocation === 'haveli_realm') {
        return "Hira Ki Haveli! Neem k darakht k neechay charpai par araam karein, ya tubewell k thanday paani may aam dho kar khayen meri Paaaari!";
      }
      if (state.currentLocation === 'castle_realm') {
        return "Queen Beenish ka royal palace! Balcony say door paharon ka nazaara dekhein, is poori saltanat ki rani sirf aap hain!";
      }
      if (state.currentLocation === 'mafia_realm') {
        return "Batman Tumbler aur 100 billion ka paisay vault! Ninja H2R par drive karein ya Bat-Computer check karein meri 11/10 baddie!";
      }
      if (state.currentLocation === 'islamabad_realm') {
        return "Islamabad F-7 Villa! Living room may apka baraaa sofa aur upar 3 pyare bacchon k rooms hain meri jaan!";
      }
      if (state.currentLocation === 'bakery_realm') {
        return "Sweet Dreams Bakery! Strawberry tarts, chocolate croissants, aur 2 AM white pasta feast terrace apka intezar kar raha hai!";
      }

      // Room-specific contextual guidance first
      if (state.currentLocation === 'bureau') {
        if (!bureauStamped) {
          return "Aajaen meri Paaaari! Left side par Filing Cabinet dekhein aur teeno pyari baaton ko select karein taakay file par stamp laga dein!";
        }
        if (!hasBrassKey) {
          return "File to stamp ho gayi meri jaan! Ab Museum chalte hain—wahan aap ki White Jet painting k peechay Drawer #07 ki chabi chupi hai!";
        }
        if (!state.drawer07Unlocked) {
          return "Chabi mil gayi! Right side par Desk Drawer #07 khol kar apni emergency chocolates aur Botanical Map nikal lein!";
        }
        return "Bureau ka kaam mukammal ho gaya meri Beghum G! Chalo ab East ki taraf Court of Absolutely No Flaws chaltay hain!";
      }
      if (state.currentLocation === 'museum') {
        if (!hasBrassKey) {
          return "North wall par White Jet wali painting dekhein meri Paaaari! 4 silver steps aur white dress select karein to secret brass key mil jaye gi!";
        }
        return "Key mil gayi meri jaan! Chalo wapis Bureau chalte hain aur Drawer #07 kholte hain!";
      }
      if (state.currentLocation === 'court') {
        if (!state.courtVerdictReached) {
          return "Aajaen Judge sahab ki chair par Your Honor! Scales of Love par teen pyare tokens rakh kar 15 kg barabar karein aur gavel bajayein!";
        }
        return "Zero flaws certify ho gaye meri rani! Ab Southeast ki taraf stone Archive of Memories chalte hain!";
      }
      if (state.currentLocation === 'archive') {
        if (!state.archiveChronologySolved) {
          return "Memory crystals ko chhoo kar humari 4 pyari yaadon ko timeline mein lagayein: Email Origin -> Late Night White Pasta -> Teen Gaane -> Birthday Vow!";
        }
        return "Saaray crystals Bol Na Halke Halke ke sath resonating hain! Ab pahaar k upar Hilltop Observatory chaltay hain meri Paaaari!";
      }
      if (state.currentLocation === 'observatory') {
        if (!namedConstellation) {
          return "Telescope se dekhein meri jaan, humare 5 dream houses ke sitaron ko link karein aur aasman par humara pyara naam likhein!";
        }
        return `Humara sitara "${namedConstellation}" aasman par chamak raha hai! Secret Rose Garden ka rasta khul gaya hai, chalein wahan chalte hain!`;
      }
      if (state.currentLocation === 'garden') {
        if (state.starsRecovered < 7) {
          return "Garden bench par baithiye mere paas meri Paaaari... 3 Rose Lanterns jala kar birthday letter parhiye jo mainay apkay liye likha hai.";
        }
        return "Saaray 7 sitaray valley par chamak rahy hain! Chalein central plaza may chal kar cake ki candles blow kartay hain!";
      }

      // Overworld stage-by-stage guidance
      if (!bureauStamped) {
        return "Aajaen meri Paaaari! Chalein pehle Bureau of Unreasonable Paglu chalte hain aur apka official case file stamp karte hain!";
      }
      if (!hasBrassKey) {
        return "Chalo meri jaan, ab Museum of Beenish chalte hain! Wahan aap ki White Jet painting k peechay Drawer #07 ki chabi chupi hai!";
      }
      if (!state.drawer07Unlocked) {
        return "Key mil gayi! Chalo wapis Bureau chal kar Drawer #07 kholte hain, wahan dhayeeer saari chocolates hain!";
      }
      if (!state.courtVerdictReached) {
        return "Chalo meri Beghum G, ab Court of Absolutely No Flaws chalte hain—wahan sab ko batana hai k aap mein ZERO flaws hain!";
      }
      if (!state.archiveChronologySolved) {
        return "Ab Southeast stone Archive of Memories chaltay hain meri Paaaari, humare pyare gaane sunte hain aur yaadein taza karte hain!";
      }
      if (!namedConstellation) {
        return "Pahaar k upar Hilltop Observatory chalte hain meri jaan! Wahan se aasman mein sitaron ko dekh kar humara pyara naam likhenge!";
      }
      if (state.starsRecovered < 7) {
        return "Secret Rose Garden ka rasta khul gaya hai meri Paaaari! Wahan chaltay hain, aap k liye mainay aik bohot pyara letter likha hai...";
      }
      if (!state.candlesBlown) {
        return "Saaray 7 sitaray chamak rahy hain meri Paaaari! Central table par aajaen aur mil kar birthday candles blow kartay hain!";
      }
      return "Happy Birthday meri Paaaari, meri Beghum G! Saaray 7 sitaray aap k hain... aajaen 5 dream houses ghoomtay hain!";
    };

    const storyHint = getPagluQuote();
    const sweetQuotes = [
      storyHint,
      "Bas meri Paaaari hain. Samajh nai aata, bas hain.",
      "ufff kitu sundar hain meri Beghum G...",
      "yummm yumm chaaki mar leni many! SARI KI SARI AAP MALAIIIII!",
      "wo chotu si chin to mera permanent all-time crush hay!",
      "noseeyyyy khaaa jani manyyyyy!",
      "CASE FILE #001: Pagluu ka dil officially Paaaari ke paas confiscated hai.",
      "aryyyy.....sunyen tooo! Kahan bhagi ja rahi hain meri jaan?",
      "Dunya may koi aur Beenish Tasaffar jesi genius aur pyari baddie ho hi nai sakti!",
      "Did you know every single star in this sky was placed here just for my Paaaari?",
      "11/10 baddie energy, Pagluu is permanently incapacitated.",
    ];

    const currentQuote = sweetQuotes[pagluDialogueIndex % sweetQuotes.length];

    const handleNextQuote = () => {
      soundEngine.playClick();
      setPagluDialogueIndex(prev => prev + 1);
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div 
          className="pixel-modal-content pixel-panel pixel-panel-peach" 
          onClick={e => e.stopPropagation()} 
          style={{ 
            maxWidth: '520px', 
            backgroundColor: 'var(--color-void-navy)', 
            padding: '24px',
            textAlign: 'center' 
          }}
        >
          {/* Header */}
          <div className="pixel-panel-header" style={{ marginBottom: '16px' }}>
            <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.85rem', letterSpacing: '0.08em', fontWeight: 'bold' }}>
              ♥ Pagluu (Ahmad) &bull; Paaaari Ka Boyfriend
            </span>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono" title="Close">[X]</button>
          </div>

          {/* Large Full-Sized Pagluu Portrait */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            <div 
              style={{
                width: '100px',
                height: '116px',
                padding: '6px',
                backgroundColor: 'rgba(30, 27, 75, 0.6)',
                borderRadius: '8px',
                border: '2px solid var(--color-warm-peach)',
                boxShadow: '0 0 16px rgba(243, 183, 156, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'floatGentle 3s ease-in-out infinite',
              }}
            >
              <svg
                width="84"
                height="98"
                viewBox="0 0 24 28"
                shapeRendering="crispEdges"
                className="pixel-art"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))',
                  transform: 'scale(1.05)',
                }}
              >
                {/* Hair - Dark indigo / navy clusters */}
                <rect x="7" y="2" width="10" height="3" fill="#101329" />
                <rect x="6" y="3" width="12" height="4" fill="#1B2042" />
                <rect x="5" y="4" width="3" height="4" fill="#1B2042" />
                <rect x="16" y="4" width="3" height="4" fill="#1B2042" />
                {/* Hair highlights */}
                <rect x="8" y="3" width="4" height="1" fill="#30385F" />

                {/* Face - Warm Peach */}
                <rect x="7" y="7" width="10" height="7" fill="#F3B79C" />
                {/* Eyes */}
                <rect x="9" y="9" width="2" height="2" fill="#101329" />
                <rect x="13" y="9" width="2" height="2" fill="#101329" />
                {/* Eye twinkles */}
                <rect x="9" y="9" width="1" height="1" fill="#F4EBDD" />
                <rect x="13" y="9" width="1" height="1" fill="#F4EBDD" />
                {/* Cheeks / Blush */}
                <rect x="7" y="11" width="2" height="1" fill="#E98FAF" />
                <rect x="15" y="11" width="2" height="1" fill="#E98FAF" />
                {/* Smile */}
                <rect x="10" y="12" width="4" height="1" fill="#9588BD" />

                {/* Neck */}
                <rect x="10" y="14" width="4" height="1" fill="#F3B79C" />

                {/* Hoodie / Jacket - Twilight Blue & Dream Lilac accents */}
                <rect x="6" y="15" width="12" height="7" fill="#30385F" />
                <rect x="9" y="15" width="6" height="7" fill="#666FA0" />
                {/* Collar / Strings */}
                <rect x="10" y="16" width="1" height="3" fill="#F4EBDD" />
                <rect x="13" y="16" width="1" height="3" fill="#F4EBDD" />

                {/* Arms / Hands - Thumbs-up pose */}
                <rect x="4" y="16" width="2" height="5" fill="#30385F" />
                <rect x="4" y="21" width="2" height="2" fill="#F3B79C" />
                <rect x="18" y="14" width="3" height="3" fill="#F3B79C" />
                <rect x="19" y="13" width="1" height="2" fill="#F3B79C" />
                <rect x="17" y="17" width="3" height="4" fill="#30385F" />

                {/* Pants - Dark Void Navy */}
                <rect x="7" y="22" width="10" height="4" fill="#101329" />
                <rect x="7" y="23" width="4" height="3" fill="#101329" />
                <rect x="13" y="23" width="4" height="3" fill="#101329" />

                {/* Shoes - Moon Cream & Lavender */}
                <rect x="6" y="26" width="5" height="2" fill="#F4EBDD" />
                <rect x="13" y="26" width="5" height="2" fill="#F4EBDD" />
              </svg>
            </div>
            <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.74rem', marginTop: '6px' }}>
              &ldquo;Apka Pagluu humesha ap k sath hai ♥&rdquo;
            </span>
          </div>

          {/* In-Flow Dedicated Dialogue Speech Box (Never Clipped!) */}
          <div 
            style={{
              position: 'relative',
              backgroundColor: '#1E1B4B',
              border: '2px solid var(--color-warm-peach)',
              borderRadius: '6px',
              padding: '16px 20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(243, 183, 156, 0.15)',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {/* Top pointer arrow */}
            <div 
              style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid var(--color-warm-peach)',
              }}
            />
            <p 
              className="font-mono" 
              style={{ 
                color: '#FEF08A', 
                fontSize: '0.98rem', 
                lineHeight: '1.65', 
                margin: 0,
                fontWeight: 500,
              }}
            >
              &ldquo;{currentQuote}&rdquo;
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleNextQuote} 
              className="pixel-btn pixel-btn-ghost font-display" 
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
              title="Ahmad ki aur batain sunein"
            >
              ♥ Aur Batain Karein
            </button>
            <button 
              onClick={handleClose} 
              className="pixel-btn pixel-btn-primary font-display" 
              style={{ flex: 1.2, justifyContent: 'center', fontSize: '0.88rem' }}
            >
              ✦ Keep Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MUSEUM PORTRAITS & EXHIBITS
  if (activeObject.type.startsWith('museum_')) {
    const isPortrait2 = activeObject.type === 'museum_portrait_2';
    const isAchieve = activeObject.type === 'museum_achievements';
    const isPhenom = activeObject.type === 'museum_phenomenon';

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              Museum of Beenish ♥
            </span>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Portrait 1: Kawasaki Ninja H2R & Dodge Challenger */}
          {activeObject.type === 'museum_portrait_1' && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Paaaari Ki Speed ♥
              </div>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '8px' }}>
                THE KAWASAKI NINJA H2R &amp; DODGE CHALLENGER
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '16px' }}>
                For a girl who doesn’t do ordinary speed. A twin showcase of the beastly Kawasaki Ninja H2R superbike and the roaring Dodge Challenger muscle car. The only machines fast enough to match her 11/10 baddie energy.
              </p>
              <div className="font-mono" style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '12px', color: 'var(--color-warm-peach)', fontStyle: 'italic', marginBottom: '20px' }}>
                "You on an H2R is honestly the most terrifyingly attractive concept ever conceived."
              </div>
              <button 
                onClick={() => { 
                  examineExhibit('exhibit_ninja_h2r'); 
                  onClose(); 
                }} 
                className="pixel-btn pixel-btn-primary font-display" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                RETURN TO GALLERY
              </button>
            </div>
          )}

          {/* Portrait 2: White/Grey Jet Vision & Secret Brass Key */}
          {isPortrait2 && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Paaaari Ki Queen Walk ♥
              </div>
              <h3 className="font-display" style={{ color: 'var(--color-dream-lilac)', fontSize: '1.15rem', marginBottom: '8px' }}>
                THE WHITE/GREY PRIVATE JET VISION
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '16px' }}>
                A documented vision: Meri Paaaari (Beenie) stepping down the stairs of a sleek white and grey private jet in a white dress, while Ahmad (Pagluu) stands on the tarmac with his mouth hanging open in sheer, helpless awe.
              </p>
              <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontStyle: 'italic', marginBottom: '14px' }}>
                "Looking at you with my mouth open is my permanent natural state anyway."
              </div>

              {/* Framed Visual Pixel-Art Canvas of Portrait #02 so player can visually inspect the 4 airstair steps & white dress */}
              <div style={{ backgroundColor: '#0F172A', border: '3px solid var(--color-lantern-gold)', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 240 84" width="100%" height="110" style={{ imageRendering: 'pixelated', backgroundColor: '#101329', border: '1px solid #30385F' }}>
                  {/* Night Sky Stars */}
                  <rect x="20" y="10" width="2" height="2" fill="#F6D78B" />
                  <rect x="75" y="14" width="2" height="2" fill="#FFFFFF" />
                  <rect x="145" y="8" width="2" height="2" fill="#F6D78B" />
                  <rect x="205" y="12" width="2" height="2" fill="#C3A9E8" />
                  {/* Tarmac Runway */}
                  <rect x="0" y="58" width="240" height="26" fill="#2A2E3D" />
                  <rect x="12" y="74" width="18" height="2" fill="#FBBF24" />
                  <rect x="48" y="74" width="18" height="2" fill="#FBBF24" />
                  {/* Sleek White & Grey Private Jet */}
                  <rect x="14" y="16" width="20" height="18" fill="#E2E8F0" />
                  <rect x="18" y="20" width="6" height="4" fill="#F59E0B" />
                  <rect x="24" y="30" width="88" height="16" fill="#F8FAFC" />
                  <rect x="28" y="44" width="80" height="5" fill="#94A3B8" />
                  <rect x="96" y="32" width="12" height="6" fill="#1E3A8A" />
                  {/* 4 Cabin Windows */}
                  <rect x="42" y="34" width="6" height="6" fill="#FEF08A" />
                  <rect x="54" y="34" width="6" height="6" fill="#FEF08A" />
                  <rect x="66" y="34" width="6" height="6" fill="#FEF08A" />
                  <rect x="78" y="34" width="6" height="6" fill="#FEF08A" />
                  {/* 4 Distinct Silver Boarding Airstair Steps */}
                  <rect x="106" y="44" width="10" height="4" fill="#CBD5E1" />
                  <rect x="114" y="49" width="10" height="4" fill="#E2E8F0" />
                  <rect x="122" y="54" width="10" height="4" fill="#CBD5E1" />
                  <rect x="130" y="59" width="10" height="4" fill="#E2E8F0" />
                  {/* Crimson Red Carpet */}
                  <rect x="138" y="61" width="76" height="10" fill="#991B1B" />
                  <rect x="138" y="61" width="76" height="1" fill="#F59E0B" />
                  <rect x="138" y="70" width="76" height="1" fill="#F59E0B" />
                  {/* Paaaari (Beenish) in Radiant White Dress with White Hair Streak */}
                  <rect x="154" y="37" width="8" height="8" fill="#1E1B4B" />
                  <rect x="159" y="38" width="2" height="6" fill="#FFFFFF" />
                  <rect x="156" y="41" width="6" height="5" fill="#FFEDD5" />
                  <rect x="154" y="46" width="8" height="14" fill="#FFFFFF" />
                  <rect x="152" y="53" width="12" height="7" fill="#F8FAFC" />
                  <rect x="154" y="50" width="8" height="2" fill="#FCE7F3" />
                  {/* Pagluu (Ahmad) with Jaw Dropped & Heart Emote */}
                  <rect x="190" y="34" width="4" height="4" fill="#F43F5E" />
                  <rect x="188" y="40" width="8" height="5" fill="#0F172A" />
                  <rect x="188" y="45" width="8" height="6" fill="#FED7AA" />
                  <rect x="189" y="48" width="3" height="3" fill="#7F1D1D" />
                  <rect x="187" y="51" width="10" height="11" fill="#1E3A8A" />
                </svg>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-lantern-gold)', marginTop: '6px' }}>
                  Sleek White-Grey Jet &bull; 4 Silver Steps &bull; Radiant White Dress ♥
                </div>
              </div>

              {/* Interactive Observation Cipher Lock */}
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-lantern-gold)', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                  Painting Ki Pyari Si Puzzle ♥
                </div>
                <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', marginBottom: '14px', lineHeight: '1.6' }}>
                  A locked brass plate beneath the canvas poses a challenge:
                  <br /><em style={{ color: 'var(--color-warm-peach)' }}>"Observe the painting closely, Beenie: How many steps are on the silver airstairs, and what color dress is Paaaari wearing?"</em>
                </p>

                {/* Steps Selector */}
                <div style={{ marginBottom: '12px' }}>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', marginBottom: '4px' }}>
                    AIRSTAIR STEPS:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[2, 3, 4, 5].map(st => (
                      <button
                        key={st}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedSteps(st);
                        }}
                        className={`pixel-btn ${selectedSteps === st ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        {st} STEPS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dress Color Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', marginBottom: '4px' }}>
                    DRESS COLOR:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Emerald', 'White', 'Rose', 'Midnight'].map(col => (
                      <button
                        key={col}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedColor(col);
                        }}
                        className={`pixel-btn ${selectedColor === col ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result & Key Collection */}
                {selectedSteps === 4 && selectedColor === 'White' ? (
                  <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.15)', border: '1px dashed var(--color-lantern-gold)', padding: '12px', textAlign: 'center' }}>
                    <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.9rem', marginBottom: '6px' }}>
                      Wah meri Paaaari! Chota sa box khul gaya!
                    </div>
                    <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem', marginBottom: '10px' }}>
                      {hasBrassKey 
                        ? 'You have already pocketed Antique Brass Key #07.'
                        : 'A gleaming Antique Brass Key rests inside with a small tag stamped "#07".'}
                    </p>
                    {!hasBrassKey && (
                      <button
                        onClick={() => {
                          soundEngine.playStarChime();
                          examineExhibit('exhibit_white_jet');
                          recoverStar(2, 'museum_complete');
                          setPuzzleState({
                            inventory: hasBrassKey ? inventory : [...inventory, 'brass_key'],
                            museumJetCodeSolved: true,
                          });
                        }}
                        className="pixel-btn pixel-btn-primary font-display"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Antique Brass Key #07 Aur Star Uthayein ♥
                      </button>
                    )}
                    {hasBrassKey && (
                      <div>
                        <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '10px' }}>
                          Ab wapis Bureau chal kar Drawer #07 kholte hain!
                        </div>
                        <button
                          onClick={handleClose}
                          className="pixel-btn pixel-btn-peach font-display"
                          style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                        >
                          RETURN TO BUREAU FOR DRAWER #07 →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem', textAlign: 'center' }}>
                    (Painting mein dekh kar batayein kitnay steps hain aur dress kis color ki hai!)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements: Cricket & Badminton Champion */}
          {isAchieve && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Meri Champion Paaaari ♥
              </div>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '8px' }}>
                THE CRICKET &amp; BADMINTON CHAMPION ARENA
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '16px' }}>
                Twin crossed badminton rackets and a cricket bat. Top marks in academics, fierce determination in life, and an undefeated champion on the court. Anyone who challenges her will lose quickly.
              </p>
              <div style={{ fontStyle: 'italic', color: 'var(--color-warm-peach)', marginBottom: '20px' }}>
                "Position holder, fierce athlete, and still the cutest person on this planet."
              </div>
              <button 
                onClick={() => { 
                  examineExhibit('exhibit_athlete'); 
                  onClose(); 
                }} 
                className="pixel-btn pixel-btn-primary font-display" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                HONOR THE CHAMPION
              </button>
            </div>
          )}

          {/* Phenomenon: Sialkot Roots & Islamabad Dreams */}
          {isPhenom && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Sialkot Se Islamabad Tak ♥
              </div>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '8px' }}>
                THE SIALKOT ROOTS &amp; ISLAMABAD DREAMS
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '16px' }}>
                A carved sandstone map connecting her beloved hometown of Sialkot to the quiet, tree-lined hills of Islamabad where the five-marla dream family house will stand.
              </p>
              <div className="font-mono" style={{ fontSize: '0.95rem', color: 'var(--color-warm-peach)', fontWeight: 'bold', margin: '14px 0 24px' }}>
                "From Sialkot to Islamabad, everywhere I look, I only see a future with you."
              </div>
              <button 
                onClick={() => { 
                  examineExhibit('exhibit_twin_cities'); 
                  onClose(); 
                }} 
                className="pixel-btn pixel-btn-peach font-display" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ACCEPT OUR JOURNEY
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. COURTROOM INTERACTIONS
  if (activeObject.type.startsWith('court_')) {
    if (activeObject.type === 'court_bench_secret') {
      return (
        <div className="pixel-modal-backdrop" onClick={handleClose}>
          <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Judge Chair Ke Peechay Note ♥
            </div>
            <h3 className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginBottom: '10px' }}>
              NOTE BEHIND THE JUDGE'S BENCH
            </h3>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
              "P.S. There never were any flaws. You are completely and wonderfully perfect to me, Beenie. Zero flaws forever!"
            </p>
            <button onClick={handleClose} className="pixel-btn pixel-btn-peach font-display" style={{ width: '100%', justifyContent: 'center' }}>
              KEEP SECRET NOTE
            </button>
          </div>
        </div>
      );
    }

    if (activeObject.type === 'court_defense') {
      return (
        <div className="pixel-modal-backdrop" onClick={handleClose}>
          <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', backgroundColor: 'var(--color-void-navy)' }}>
            <div className="pixel-panel-header">
              <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                Defense Counsel: Aapka Pagluu ♥
              </span>
              <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
            </div>
            <div style={{ padding: '16px', lineHeight: '1.75' }}>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '10px' }}>
                COUNSEL FOR THE DEFENSE: PAGLUU (AHMAD)
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.86rem', marginBottom: '12px' }}>
                "Your Honor, even though I am also the Prosecutor AND the Judge, as Defense Counsel I formally declare my client Beenish Tasaffar is an 11/10 baddie and completely above the law!"
              </p>
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '12px', marginBottom: '16px' }}>
                <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '6px' }}>
                  LEGAL STRATEGY TO BALANCE THE 15 KG SCALES OF LOVE:
                </div>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem' }}>
                  Place the <strong>three +5 kg tokens of pure devotion</strong> (<em>Forehead Kisses &amp; Elaichi Chai</em>, <em>Kind Heart for Siblings &amp; Mama Baba</em>, and <em>Permanent Best Friend &amp; Future Wife</em>) on the Defense Pan at the Judge's Bench to reach <strong>15 kg</strong>!
                </div>
              </div>
              <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                PROCEED TO THE JUDGE'S BENCH
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeObject.type === 'court_prosecution') {
      return (
        <div className="pixel-modal-backdrop" onClick={handleClose}>
          <div className="pixel-modal-content pixel-panel pixel-panel-rose" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', backgroundColor: 'var(--color-void-navy)' }}>
            <div className="pixel-panel-header">
              <span className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.75rem' }}>
                Pagluu Ka Pyara Sa Shikayat Nama 😅
              </span>
              <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
            </div>
            <div style={{ padding: '16px', lineHeight: '1.75' }}>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '10px' }}>
                PAGLUU KI 15 KG PYARI SHIKAYATEN ♥
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.84rem', marginBottom: '12px' }}>
                "Meri pyari Paaaari, Beghum G, 11/10 Baddie par Pagluu ki taraf say ye 3 intehayi pyari shikayaten darj hain jo Left Scale par <strong>15 kg</strong> banati hain:"
              </p>
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', borderLeft: '3px solid var(--color-rose-glow)', padding: '12px 16px', marginBottom: '16px' }}>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem', lineHeight: '1.8' }}>
                  <div>1. <strong>Shikayat I (5 kg):</strong> Raat ko sote huay saari kambal chura leti hain aur masoom ban jati hain!</div>
                  <div>2. <strong>Shikayat II (5 kg):</strong> Chotu si chin aur pyari noseeyyy itni sundar hain k dil wahan gir jata hai!</div>
                  <div>3. <strong>Shikayat III (5 kg):</strong> Har argument <em>"hm hm hm"</em> bol kar aur meethi tanz kar k aasaani se jeet jati hain!</div>
                </div>
              </div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', marginBottom: '16px' }}>
                ♥ <strong>Ab Kya Karna Hai:</strong> Seedha center may <strong>Judge's Bench</strong> par jayen (`[ Enter ] Address the Court`) aur 3 pyaray jawabaat (+5 kg each) chun kar scale barabar karein!
              </div>
              <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                CHALO JUDGE'S BENCH PAR JAYEN →
              </button>
            </div>
          </div>
        </div>
      );
    }

    const grievancesTarget = 15;
    const tokens = [
      { id: 'chai_kisses', label: 'Forehead Kisses & Steaming Elaichi Chai (+5 kg)', weight: 5 },
      { id: 'pure_heart', label: 'Kind Heart That Loves Siblings & Mama Baba (+5 kg)', weight: 5 },
      { id: 'wife_crush', label: "Ahmad's Permanent Best Friend & Future Wife (+5 kg)", weight: 5 },
      { id: 'spicy_tanz', label: 'Spicy Tanz When Ahmad Acts Unreasonable (-5 kg)', weight: -5 },
    ];

    const currentWeight = activeTokens.reduce((sum, tId) => {
      const tok = tokens.find(t => t.id === tId);
      return sum + (tok ? tok.weight : 0);
    }, 0);

    const isScalesBalanced = currentWeight === grievancesTarget;

    const handleGavel = () => {
      soundEngine.playGavel();
      reachVerdict();
      recoverStar(3, 'court_complete');
      setPuzzleState({ courtScalesBalanced: true });
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>COURT OF ABSOLUTELY NO FLAWS</span>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', marginBottom: '6px' }}>
              The Scales of Love ♥
            </div>
            <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '8px' }}>
              COURT PROCEEDINGS: THE "HM HM HM" &amp; 100% CUTE CASE
            </h3>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.84rem', marginBottom: '16px', lineHeight: '1.6' }}>
              Pagluu nay Left Scale par 15 kg pyari shikayaten rakhi hain. Paaaari ko Right Scale par 3 pyaray jawabaat (+5 kg each) rakh kar scale barabar karna hai!
            </p>

            {/* Visual Balance Scale Box */}
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-twilight-blue)', padding: '18px', marginBottom: '18px', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                {/* Left Pan */}
                <div style={{ backgroundColor: 'var(--color-void-navy)', padding: '12px', borderLeft: '3px solid var(--color-rose-glow)' }}>
                  <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                    PAGLUU KI SHIKAYATEN (15 kg)
                  </div>
                  <ul className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)', margin: 0, paddingLeft: '16px', lineHeight: '1.7' }}>
                    <li>Raat ko kambal chura lena (5 kg)</li>
                    <li>Noseeyyy unconstitutionally pyari (5 kg)</li>
                    <li>"hm hm hm" se har baat jeetna (5 kg)</li>
                  </ul>
                </div>

                {/* Right Pan */}
                <div style={{ backgroundColor: 'var(--color-void-navy)', padding: '12px', borderLeft: `3px solid ${isScalesBalanced ? 'var(--color-lantern-gold)' : 'var(--color-warm-peach)'}` }}>
                  <div className="font-mono" style={{ color: isScalesBalanced ? 'var(--color-lantern-gold)' : 'var(--color-warm-peach)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                    PAAAARI KA SCALE ({currentWeight} kg / 15 kg)
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>
                    {activeTokens.length === 0 ? 'Abhi koi baat add nai hui. Neeche se 3 options chunein!' : (
                      <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--color-moon-cream)', lineHeight: '1.7' }}>
                        {activeTokens.map(tId => {
                          const tok = tokens.find(t => t.id === tId);
                          return <li key={tId}>{tok?.label}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Token Selector Buttons */}
              <div style={{ marginBottom: '14px' }}>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', marginBottom: '6px' }}>
                  TEEN (3) PYARI BAATEIN CHUNEIN TA-KAY SCALE 15 KG HO JAYE:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {tokens.map(tok => {
                    const isSelected = activeTokens.includes(tok.id);
                    return (
                      <button
                        key={tok.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveTokens(prev => 
                            isSelected ? prev.filter(id => id !== tok.id) : [...prev, tok.id]
                          );
                        }}
                        className={`pixel-btn ${isSelected ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                        style={{ fontSize: '0.75rem', padding: '8px', textAlign: 'left' }}
                      >
                        {isSelected ? '[✓ ON SCALE] ' : '[+ PLACE] '} {tok.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scale Status Gauge */}
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: isScalesBalanced ? 'rgba(246, 215, 139, 0.15)' : 'rgba(235, 122, 154, 0.1)', border: `1px dashed ${isScalesBalanced ? 'var(--color-lantern-gold)' : 'var(--color-rose-glow)'}` }}>
                <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 'bold', color: isScalesBalanced ? 'var(--color-lantern-gold)' : 'var(--color-rose-glow)' }}>
                  {isScalesBalanced 
                    ? '♥ Scales bilkul barabar ho gayin: Zero Flaws Certified! ♥'
                    : currentWeight < 15 
                      ? '(Thora sa pyaar aur add karein scales barabar karne k liye!)' 
                      : '(Bohooot zyada meetha ho gaya!)'}
                </span>
              </div>
            </div>

            {/* Verdict Gavel Action */}
            {state.courtVerdictReached ? (
              <div>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem', border: '2px solid var(--color-lantern-gold)', padding: '10px 20px', display: 'inline-block', marginBottom: '14px' }}>
                  ★ VERDICT: NOT GUILTY ON ALL COUNTS — ZERO FLAWS CERTIFIED! ★
                </div>
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', maxWidth: '520px', margin: '0 auto 14px auto', textAlign: 'left' }}>
                  <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    Ahmad's Note (For Meri Paaaari ♥):
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', lineHeight: '1.7' }}>
                    "The court declares Beenish Tasaffar completely and wonderfully perfect. Now exit the Court and follow the stone road Southeast to the ancient stone Archive to recover our musical memories!"
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ width: '100%', maxWidth: '520px', justifyContent: 'center', padding: '12px' }}
                >
                  Chalo Archive of Memories Chalein Meri Jaan →
                </button>
              </div>
            ) : (
              <button
                disabled={!isScalesBalanced}
                onClick={handleGavel}
                className="pixel-btn pixel-btn-primary font-display"
                style={{ padding: '14px 28px', opacity: isScalesBalanced ? 1 : 0.4, cursor: isScalesBalanced ? 'pointer' : 'not-allowed', width: '100%', justifyContent: 'center' }}
              >
                STRIKE GAVEL &amp; ACQUIT DEFENDANT WITH FULL HONORS
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. ARCHIVE MEMORY CRYSTALS (THE CHRONOLOGY OF LOVE PUZZLE & INDIVIDUAL CRYSTAL MEMORIES)
  if (activeObject.type.startsWith('archive_crystal_')) {
    const crystalMap: Record<string, string> = {
      archive_crystal_1: 'mem_songs',
      archive_crystal_2: 'mem_white_pasta',
      archive_crystal_3: 'mem_email_origin',
    };
    const activeMemId = crystalMap[activeObject.type] || 'mem_songs';
    const activeMem = ARCHIVE_MEMORIES.find(m => m.id === activeMemId) || ARCHIVE_MEMORIES[0];

    const memoryShards: { [id: string]: { id: string; title: string; desc: string; date: string } } = {
      mem_email_origin: {
        id: 'mem_email_origin',
        title: '1. Origin: binishieeees@gmail.com',
        desc: 'The initial email thread where our universe was quietly born.',
        date: 'Beginning of Everything'
      },
      mem_white_pasta: {
        id: 'mem_white_pasta',
        title: '2. First Late-Night Laugh & 2 AM White Pasta',
        desc: 'Eating hot pasta, cracking Kinder Joys, and talking until morning.',
        date: 'Late Night Wonder'
      },
      mem_songs: {
        id: 'mem_songs',
        title: '3. The Three Anthems',
        desc: 'Bol Na Halke Halke, Mohabbat Jisko Bakhsh De, and Lo Maan Liya.',
        date: 'Soundtrack of Love'
      },
      mem_birthday_vow: {
        id: 'mem_birthday_vow',
        title: '4. First Anniversary & October 31st Vow',
        desc: 'Aik saal sath sath, and an eternal vow for all the years to come.',
        date: 'October 31st Celebration'
      }
    };

    const targetChronology = ['mem_email_origin', 'mem_white_pasta', 'mem_songs', 'mem_birthday_vow'];
    const isChronologyResonant = chronologyOrder.every((id, idx) => id === targetChronology[idx]);

    const handleShardClick = (clickedId: string) => {
      soundEngine.playClick();
      if (!selectedShard) {
        setSelectedShard(clickedId);
      } else {
        if (selectedShard !== clickedId) {
          const newOrder = [...chronologyOrder];
          const idxA = newOrder.indexOf(selectedShard);
          const idxB = newOrder.indexOf(clickedId);
          newOrder[idxA] = clickedId;
          newOrder[idxB] = selectedShard;
          setChronologyOrder(newOrder);
        }
        setSelectedShard(null);
      }
    };

    const handleRecoverArchiveStar = () => {
      soundEngine.playBolNaHalkeHalke();
      readMemory(activeMem.id);
      readMemory('mem_songs');
      recoverStar(4, 'archive_complete');
      setPuzzleState({ archiveChronologySolved: true });
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-dream-lilac)', fontSize: '0.75rem' }}>
              Archive of Memories // Humari Pyari Yaadain ♥
            </span>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ textAlign: 'center', padding: '14px' }}>
            {/* Featured Crystal Memory Card */}
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-dream-lilac)', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.98rem' }}>
                  ♥ {activeMem.title}
                </span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    readMemory(activeMem.id);
                  }}
                  className="pixel-btn pixel-btn-ghost font-mono"
                  style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                >
                  {state.readMemories.includes(activeMem.id) ? '♥ Saved' : 'Save Memory'}
                </button>
              </div>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem', lineHeight: '1.65', margin: '0 0 8px 0' }}>
                {activeMem.fullNote}
              </p>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.76rem', fontStyle: 'italic' }}>
                "{activeMem.preview}"
              </div>

              {activeMem.id === 'mem_songs' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--color-twilight-blue)' }}>
                  <button
                    onClick={() => {
                      readMemory('mem_songs');
                      soundEngine.playBolNaHalkeHalke();
                    }}
                    className="pixel-btn pixel-btn-primary font-mono"
                    style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                  >
                    ♪ PLAY: BOL NA HALKE HALKE
                  </button>
                  <button
                    onClick={() => {
                      readMemory('mem_songs');
                      soundEngine.playSong('mohabat');
                    }}
                    className="pixel-btn pixel-btn-peach font-mono"
                    style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                  >
                    ♪ PLAY: MOHABBAT JISKO BAKHSH DE
                  </button>
                  <button
                    onClick={() => soundEngine.pauseSong()}
                    className="pixel-btn pixel-btn-ghost font-mono"
                    style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                  >
                    [ STOP MP3 ]
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.08rem', marginBottom: '6px' }}>
              Humari Yaadon Ki Timeline ♥
            </h3>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
              The memory shards on the pedestal are scrambled in time! Click any card to select it, then click another to swap their positions into correct chronological sequence:
            </p>

            {/* Chronology Shard Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', textAlign: 'left' }}>
              {chronologyOrder.map((shardId, idx) => {
                const shard = memoryShards[shardId];
                const isSelected = selectedShard === shardId;
                const isCorrectSlot = shardId === targetChronology[idx];
                return (
                  <div
                    key={shardId}
                    onClick={() => handleShardClick(shardId)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(246, 215, 139, 0.2)' : 'var(--color-midnight-indigo)',
                      border: `2px solid ${isSelected ? 'var(--color-lantern-gold)' : isCorrectSlot ? 'var(--color-forest-moss)' : 'var(--color-twilight-blue)'}`,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div className="font-mono" style={{ color: isCorrectSlot ? 'var(--color-forest-moss)' : 'var(--color-warm-peach)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                        #{idx + 1}. {shard.title}
                      </div>
                      <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {shard.desc}
                      </div>
                    </div>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: isCorrectSlot ? 'var(--color-forest-moss)' : 'var(--color-dusty-lavender)' }}>
                      {isCorrectSlot ? '♥ Sahi Jagah' : isSelected ? 'Selected' : 'Tap to Swap'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Resonance Feedback */}
            {isChronologyResonant ? (
              <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.15)', border: '1px dashed var(--color-lantern-gold)', padding: '12px', marginBottom: '18px' }}>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.92rem', marginBottom: '4px' }}>
                  ♥ Saari pyari yaadein apni jagah par aa gayin! ♥
                </div>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem' }}>
                  The ancient Gothic stained glass window shines radiant pink and gold. The melody of Bol Na Halke Halke fills the stone chamber.
                </div>
              </div>
            ) : (
              <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem', marginBottom: '16px' }}>
                (Cards ko tap kar k timeline ke mutabiq arrange karein!)
              </div>
            )}

            {/* Action */}
            {state.recoveredStarIds.includes(4) ? (
              <div>
                <div className="pixel-badge pixel-badge-gold font-mono" style={{ marginBottom: '14px', padding: '6px 14px' }}>
                  Star #4 Chamak Gaya! Saari Yaadein Hamesha K Liye Mehfooz Hain ♥
                </div>
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', marginBottom: '14px', textAlign: 'left' }}>
                  <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    Ahmad's Note (For Meri Paaaari ♥):
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', lineHeight: '1.7' }}>
                    "The memories of our first year are eternal, meri jaan. Now exit the Archive and follow the northern mountain trail up to the Hilltop Observatory to link our 5 Dream Constellations!"
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  Chalo Hilltop Observatory Chalein Meri Jaan →
                </button>
              </div>
            ) : (
              <button
                disabled={!isChronologyResonant}
                onClick={handleRecoverArchiveStar}
                className="pixel-btn pixel-btn-primary font-display"
                style={{ width: '100%', padding: '14px', justifyContent: 'center', opacity: isChronologyResonant ? 1 : 0.4, cursor: isChronologyResonant ? 'pointer' : 'not-allowed' }}
              >
                RESONATE MEMORY SHARDS &amp; AWAKEN STAR 4
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 7. OBSERVATORY TELESCOPE & ALTAR (THE 5 DREAM CONSTELLATIONS LINKER)
  if (activeObject.type === 'observatory_altar' || activeObject.type === 'observatory_telescope') {
    const estateNodes = [
      { id: 'node_islamabad', vigId: 'vig_islamabad_house', name: 'Islamabad 5-Marla Villa', tag: 'Baraaa Sofa & 3 Kids Rooms' },
      { id: 'node_mafia', vigId: 'vig_mafia_house', name: 'The Batcave Safehouse', tag: 'Batmobile Tumbler & Stealth' },
      { id: 'node_bakery', vigId: 'vig_bakery_house', name: 'Sweet Dreams Bakery', tag: 'Strawberry Cake & Croissants' },
      { id: 'node_castle', vigId: 'vig_queen_castle', name: "Queen Beenish's Castle", tag: "Queen's Alpine Throne" },
      { id: 'node_haveli', vigId: 'vig_gaon_haveli', name: '12-Marla Gaon Haveli', tag: 'Desi Tubewell & Cool Shade' },
    ];

    const allNodesLinked = estateNodes.every(n => linkedNodes.includes(n.id));
    const selectedVignette = FUTURE_VIGNETTES.find(v => v.id === activeVignetteId) || null;

    const toggleNodeLink = (nodeId: string, vigId: string) => {
      soundEngine.playClick();
      viewVignette(vigId);
      setActiveVignetteId(vigId);
      setLinkedNodes(prev => 
        prev.includes(nodeId) ? prev : [...prev, nodeId]
      );
    };

    const handleInscribeConstellation = () => {
      soundEngine.playStarChime();
      const finalName = constellationInput.trim() || "Paaaari's Starlight";
      setConstellationName(finalName);
      recoverStar(5, 'observatory_complete');
      unlockGarden();
      setPuzzleState({ observatoryConstellationConnected: true });
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
              Hilltop Celestial Observatory ♥
            </span>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginBottom: '8px' }}>
              Humare 5 Dream Estates Ke Sitaray ♥
            </h3>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
              Gaze through the great brass telescope upon the northern night sky! Click each of our 5 Dream Estate star nodes to connect the celestial circuit of our future:
            </p>

            {/* Constellation Circuit Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', textAlign: 'left' }}>
              {estateNodes.map((n) => {
                const isLinked = linkedNodes.includes(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => toggleNodeLink(n.id, n.vigId)}
                    className={`pixel-btn ${isLinked ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                    style={{ fontSize: '0.75rem', padding: '10px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{isLinked ? '★ ' : '☆ '} {n.name}</span>
                    <span style={{ fontSize: '0.7rem', color: isLinked ? 'var(--color-void-navy)' : 'var(--color-dusty-lavender)' }}>{n.tag}</span>
                  </button>
                );
              })}
            </div>

            {selectedVignette && (
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-dream-lilac)', padding: '12px', marginBottom: '14px', textAlign: 'left' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  Telescope Vision: {selectedVignette.title} ♥
                </div>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.76rem', lineHeight: '1.6' }}>
                  {selectedVignette.description}
                </div>
                <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.74rem', fontStyle: 'italic', marginTop: '6px' }}>
                  "{selectedVignette.unlockedNote}"
                </div>
              </div>
            )}

            {/* Progress status */}
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: `1px dashed ${allNodesLinked ? 'var(--color-lantern-gold)' : 'var(--color-twilight-blue)'}`, padding: '10px', marginBottom: '16px' }}>
              <span className="font-mono" style={{ color: allNodesLinked ? 'var(--color-lantern-gold)' : 'var(--color-warm-peach)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                Dream Estates Linked: {linkedNodes.length} / 5 ♥
              </span>
            </div>

            {/* Name input & inscribe */}
            {allNodesLinked && !namedConstellation && (
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', border: '1px solid var(--color-lantern-gold)', marginBottom: '16px', textAlign: 'left' }}>
                <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  Humare Sitaron Ka Naam Rakhein:
                </div>
                <input
                  type="text"
                  value={constellationInput}
                  onChange={e => setConstellationInput(e.target.value)}
                  placeholder="Paaaari's Starlight"
                  className="font-mono"
                  style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-twilight-blue)', color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '12px' }}
                />
                <button
                  onClick={handleInscribeConstellation}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  Aasman Mein Naam Likhein &amp; Secret Garden Kholein ♥
                </button>
              </div>
            )}

            {namedConstellation && (
              <div>
                <div className="pixel-badge pixel-badge-gold font-mono" style={{ marginBottom: '14px', padding: '6px 14px' }}>
                  Sitaron Ka Naam: "{namedConstellation}" &bull; Star #5 Roshan Ho Gaya ♥
                </div>
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', marginBottom: '14px', textAlign: 'left' }}>
                  <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    Secret Rose Garden Ka Darwaza Khul Gaya!
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', lineHeight: '1.7' }}>
                    "The celestial energy has broken the seal! The blooming Ivy Rose Gate in the Southeast has swung wide open. Walk southeast to the Secret Rose Garden for your final surprise!"
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  Chalo Secret Rose Garden Chalein Meri Jaan →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 8. SECRET ROSE GARDEN (THE 3 LANTERNS & BIRTHDAY LOVE LETTER)
  if (activeObject.type === 'garden_bench') {
    const lanterns = [
      { id: 1, name: 'Lantern of Kindness', color: '#F472B6', virtue: 'Her soft, tender heart for her siblings, mama, and baba' },
      { id: 2, name: 'Lantern of Brilliance', color: '#F59E0B', virtue: 'Position holder, artistic genius, and undisputed 11/10 baddie' },
      { id: 3, name: 'Lantern of Forever', color: '#C084FC', virtue: 'Sari zindagi sath nibhanay aur hamesha khayal rakhne ka pakka wada' },
    ];

    const allLanternsLit = gardenLanterns.includes(1) && gardenLanterns.includes(2) && gardenLanterns.includes(3);

    const lightLantern = (lId: number) => {
      soundEngine.playClick();
      setGardenLanterns(prev => prev.includes(lId) ? prev : [...prev, lId]);
    };

    const handleClimaxReceive = () => {
      soundEngine.playStarChime();
      soundEngine.playBirthdayJingle();
      recoverStar(6, 'garden_complete');
      recoverStar(7);
      setPuzzleState({ gardenLanternsLit: 3 });
    };

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', backgroundColor: 'var(--color-void-navy)', padding: '30px 24px', border: '2px solid var(--color-lantern-gold)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px dashed var(--color-twilight-blue)', paddingBottom: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              October 31 &bull; Humara Secret Rose Garden ♥
            </div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem' }}>
              {allLanternsLit ? BIRTHDAY_LETTER.title : 'THE 3 ROSE LANTERNS OF DEVOTION'}
            </div>
          </div>

          {!allLanternsLit ? (
            <div>
              <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', textAlign: 'center', marginBottom: '18px' }}>
                Three sacred unlit brass lanterns stand around the weeping willow fountain in the cool evening breeze. Ignite each lantern with Ahmad's companion flame to awaken the fountain's starlight:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {lanterns.map(l => {
                  const isLit = gardenLanterns.includes(l.id);
                  return (
                    <div
                      key={l.id}
                      style={{
                        backgroundColor: 'var(--color-midnight-indigo)',
                        border: `2px solid ${isLit ? l.color : 'var(--color-twilight-blue)'}`,
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div className="font-display" style={{ color: isLit ? l.color : 'var(--color-warm-peach)', fontSize: '0.92rem' }}>
                          {isLit ? '★ ' : '☆ '} {l.name}
                        </div>
                        <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem', marginTop: '2px' }}>
                          {l.virtue}
                        </div>
                      </div>
                      <button
                        disabled={isLit}
                        onClick={() => lightLantern(l.id)}
                        className={`pixel-btn ${isLit ? 'pixel-btn-ghost' : 'pixel-btn-primary'} font-mono`}
                        style={{ fontSize: '0.75rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                      >
                        {isLit ? '♥ Roshan' : 'Roshan Karein'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="font-mono" style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-warm-peach)' }}>
                (Teeno pyari lanterns ko jala kar Ahmad ka birthday letter parhein!)
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem' }}>
                  {BIRTHDAY_LETTER.salutation}
                </span>
              </div>

              {/* Letter Paragraphs */}
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', lineHeight: '1.85', color: 'var(--color-moon-cream)', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '280px', overflowY: 'auto', paddingRight: '8px' }}>
                {BIRTHDAY_LETTER.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed var(--color-twilight-blue)', paddingTop: '14px', textAlign: 'right', marginBottom: '18px' }}>
                <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.85rem' }}>{BIRTHDAY_LETTER.signoff}</div>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginTop: '2px' }}>Forever aapka Pagluu, Ahmad</div>
                <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.9rem', marginTop: '8px', fontStyle: 'italic' }}>
                  "{BIRTHDAY_LETTER.postscript}"
                </div>
              </div>

              {!state.recoveredStarIds.includes(6) ? (
                <button
                  onClick={handleClimaxReceive}
                  className="pixel-btn pixel-btn-peach font-display"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
                >
                  Birthday Letter Parhein &amp; Star #7 Roshan Karein ♥
                </button>
              ) : (
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', textAlign: 'center' }}>
                  <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.95rem', marginBottom: '4px' }}>
                    ★ Saaray 7 Sitaray Roshan Ho Gaye! Happy Birthday Meri Paaaari! ★
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', marginBottom: '12px' }}>
                    The entire Valley of the Stars is ablaze with celestial light! Return to the Central Birthday Table in the Overworld to blow the candles with Ahmad!
                  </div>
                  <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                    RETURN TO CENTRAL BIRTHDAY TABLE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 9. BIRTHDAY CAKE & MOMENT FOR BEENISH
  if (activeObject.type === 'birthday_cake') {
    const isGrandFinale = state.starsRecovered >= 7;
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div 
          className="pixel-modal-content pixel-panel pixel-panel-gold" 
          onClick={e => e.stopPropagation()} 
          style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)', padding: '28px' }}
        >
          <div className="pixel-panel-header" style={{ marginBottom: '18px' }}>
            <div>
              <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem', letterSpacing: '0.12em' }}>
                {isGrandFinale ? 'October 31 • 00:00:00 • Happy Birthday Meri Jaan!' : 'October 31 • Birthday Plaza'}
              </span>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginTop: '2px' }}>
                {isGrandFinale ? 'Happy Birthday, Meri Paaaari (Beenish Tasaffar)!' : 'A Birthday Moment For Paaaari (Beenish)'}
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {isGrandFinale && (
            <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.16)', border: '2px solid var(--color-lantern-gold)', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
              <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.95rem' }}>
                ★ Saaray 7 Sitaray Valley Par Chamak Rahay Hain! ★
              </div>
              <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.78rem', marginTop: '4px' }}>
                Constellation "{namedConstellation || "Paaaari's Starlight"}" is inscribed forever in the October 31st sky.
              </div>
            </div>
          )}

          {!candlesBlown ? (
            <div>
              <div 
                style={{ 
                  backgroundColor: 'var(--color-midnight-indigo)', 
                  border: '1px solid var(--color-twilight-blue)', 
                  padding: '18px', 
                  marginBottom: '20px', 
                  lineHeight: '1.8' 
                }}
              >
                <p className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--color-moon-cream)', marginBottom: '12px' }}>
                  Linen runner par do-tier strawberry celebration cake rakha hai, sath may steaming hot White Pasta ka bowl, mounds of Kinder Joy, aur Nutella ka jar! Shaam ki thandi hawa may 3 candles gently flicker kar rahi hain.
                </p>
                <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-warm-peach)', fontStyle: 'italic' }}>
                  "Aankhein band karein aur ek pyari si birthday wish maangein, meri Paaaari, meri Beghum G..."
                </p>
              </div>

              <button
                onClick={() => {
                  soundEngine.playBlowCandles();
                  soundEngine.playConfettiPop();
                  soundEngine.playBirthdayJingle();
                  setCandlesBlown(true);
                  setPuzzleState({ candlesBlown: true });
                }}
                className="pixel-btn pixel-btn-primary font-display"
                style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '0.95rem' }}
              >
                Make A Wish &amp; Blow Out The Candles
              </button>
            </div>
          ) : (
            <div>
              <div 
                style={{ 
                  backgroundColor: 'var(--color-midnight-indigo)', 
                  border: '1px solid var(--color-twilight-blue)', 
                  padding: '20px', 
                  marginBottom: '20px', 
                  lineHeight: '1.8' 
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-dusty-lavender)', marginBottom: '10px' }}>
                  [The flames drift away into three thin curls of lavender smoke as golden starlight showers the plaza.]
                </div>
                <p className="font-mono" style={{ fontSize: '0.92rem', color: 'var(--color-moon-cream)', marginBottom: '14px' }}>
                  May this year bring you endless barkat, dil ka sukoon, top honors, aur dhayeeer saaray paisay! Aapka Pagluu hamesha aap k sath hai, har kadam par cheer karta hua. Happy Birthday meri Paaaari!
                </p>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', textAlign: 'right', fontSize: '0.95rem' }}>
                  — Aapka Pagluu (Ahmad)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setCandlesBlown(false);
                    setPuzzleState({ candlesBlown: false });
                  }}
                  className="pixel-btn pixel-btn-ghost font-mono"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  Relight Candles
                </button>
                <button
                  onClick={handleClose}
                  className="pixel-btn pixel-btn-peach font-display"
                  style={{ flex: 2, padding: '12px', justifyContent: 'center' }}
                >
                  Valley Ghoomein &amp; Enjoy Karein ♥
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 10. LANDMARKS, SIGNS & PROXIMITY INSPECTABLES
  if (activeObject.type === 'signpost') {
    const id = activeObject.id;

    // Detailed metadata per landmark
    let category = 'LANDMARK PLAQUE';
    let title = 'Valley Guidepost';
    let accentColor = 'var(--color-lantern-gold)';
    let description = 'Guidepost parhien meri jaan! Poori dunya may aap k liye pyaray surprises bikhray huay hain!';
    let extraNote = '';
    let actions: Array<{ label: string; feedback: string }> = [];

    if (id === 'world_signpost') {
      category = 'Humare 5 Dream Estates Ka Map ♥';
      title = 'Map of The 5 Dream Estates';
      accentColor = '#38BDF8';
      description = 'Ahmad (Pagluu) ka banaya hua master map! Is valley say 5 mukhtalif pathways nikalte hain jo seedha humary 5 dream houses ki taraf jatay hain:\n\n1. North-West: Margalla Trail -> Islamabad 5-Marla Luxury Villa\n2. West: Stealth Highway -> The Batcave & Dark Brutalist Safehouse\n3. East: Pastry Lane -> Sweet Dreams Bakery & Patisserie\n4. North-East: Mountain Pass -> Queen Beenish\'s Royal Mountain Castle\n5. South: Desi Trail -> 12-Marla Gaon Haveli & Gushing Tubewell';
      extraNote = 'Chalein meri Paaaari, batayein pehly kahan chalna hai? Sab jagah aap ki marzi!';
      actions = [
        { label: 'PLAN TODAY\'S ROAD TRIP', feedback: 'Pehle Batmobile may long drive, phir Bakery may white pasta aur strawberry cake, aur shaam ko Haveli may tubewell k paani may sukoon!' }
      ];
    } else if (id === 'pond_bench') {
      category = 'Sukoon Bhari Jheel ♥';
      title = 'Willow Lakeside Bench & Still Waters';
      accentColor = '#38BDF8';
      description = "Thandi shaam, weeping willow ki jhuki hui tehniyan, aur neelay paani par tairtay lotus blossoms...\n\n\"Yahan baith kar bas aap ka hath pakarna hai, aur paani may chaand ka aks dekhna hai. Sari dunya ka shor tham jata hai jab aap sath hoti hain meri Paaaari.\"";
      extraNote = 'Ahmad\'s Promise: "Paani may girnay nai doon ga, hamesha thaam kar rakhun ga!"';
      actions = [
        { label: 'WATCH LOTUS RIPPLES WITH AHMAD', feedback: 'Lotus k phool paani par softly float kar rahy hain... ek gehri, sukoon bhari khamoshi aur be-inteha pyaar.' },
        { label: 'SKIP A SMOOTH RIVER PEBBLE', feedback: 'Pebble paani par 4 dafa bounce hua! Ahmad taaliyan bajanay laga: "Meri Paaaari ka nishana 100/100!"' }
      ];
    } else if (id === 'hub_signpost') {
      category = 'Valley Crossroads ♥';
      title = 'Valley of the Stars Crossroads';
      accentColor = 'var(--color-lantern-gold)';
      description = 'North ki taraf Bureau of Unreasonable Paglu, Museum of Beenish, aur Court of No Flaws hain. East may ancient Archive tower aur Secret Rose Garden hai. Charon konon say humary dream houses k pathways nikalte hain!';
      extraNote = 'Har rasta khula hai meri jaan. Aap jahan bhi jayen gi, aap ka Pagluu aap k peechay peechay chalay ga!';
    } else if (id === 'estates_signpost') {
      category = 'Dream Estates Gateway ♥';
      title = 'The 5 Dream Estates Gateway';
      accentColor = '#C084FC';
      description = 'Yahan se aap The 5 Dream Estates ki plaza may dakhil hotay hain, jahan Islamabad, Mafia Safehouse, Bakery, Castle aur Gaon Haveli sab aik sath bikhray huay hain!';
      extraNote = 'Aik aik ghar may aap k liye dher saara pyaar aur memories sanjo kar rakhi hain.';
    } else if (id === 'arrival_plaque') {
      category = 'Welcome Meri Paaaari ♥';
      title = "Paaaari's Birthday Expedition Archway";
      accentColor = '#F59E0B';
      description = "Mera paala bacha, meri jaan Beenish! Welcome to the Valley of the Stars, crafted with every ounce of my heart for October 31st!\n\nIs valley may humari zindagi ki saari pyari memories, sapnay, aur 6 Lost Constellation Stars bikhray huay hain. North ki taraf Bureau, Museum aur Court hain. East may Archive aur Secret Garden hai. Charon konon say humary 5 dream houses k raastay nikalte hain.\n\nAap jahan bhi jayen gi, aap ka Ahmad (Pagluu) hamesha aap k sath hai!";
      extraNote = 'Ahmad\'s Vow: "Sari zindagi may aap ka khayal rakhun ga, aap ko hansaoon ga, aur har din aap ka birthday celebrate karun ga!"';
      actions = [
        { label: 'HOLD AHMAD\'S HAND', feedback: 'Ahmad nay aap ka hath zor say pakar liya... dono ki ungliyan perfectly fit ho gayin! Ek pyara sa sukoon phail gaya.' },
        { label: 'SMELL FRESH JASMINE BOUQUET', feedback: 'Chambeli aur motia ki behad meethi aur taaza khushboo hawa may ghol gayi... bilkul aap ki tarah pakeeza aur pyari!' }
      ];
    } else if (id === 'note_pavilion') {
      category = 'Pagluu Ka Pyara Sa Note ♥';
      title = 'Sticky Note #1: Pavilion Timber Pillar';
      accentColor = '#FACC15';
      description = "Melaa bachaaa! Alyyy lyyyy lyyy!\n\nAik saal se sath hain hum, aur har din pehle se zyada pyara lagta hai. Itna chotu sa dill hai aap ka, aur itna narm. Ap sa talented, ap sa pyara, ap sa kind insan poori kainat may doosra koi nai hai. Happy Birthday meri Beenish!";
      extraNote = 'PS: Pagluu ki taraf se 10,000 hugs aur unlimited forehead kisses!';
      actions = [
        { label: 'POCKET THE STICKY NOTE', feedback: 'Aap nay yellow note hifazat say apnay inventory pouch may rakh liya taakay hamesha parh sakein!' }
      ];
    } else if (id === 'note_willow') {
      category = 'Pagluu Ka Pyara Sa Note ♥';
      title = 'Sticky Note #2: Weeping Willow by the Water';
      accentColor = '#FACC15';
      description = "Caution: Beenie might get galli geeli in the pond! mmxmmMmXMm!\n\nWater bohot gehra aur thanda hai paaaari, boat par beth kar lotus flowers dekhein, lekin paani may chhalang mat lagana warna Pagluu ko bhi tairna paray ga aap ko bachanay k liye!";
      extraNote = 'PS: Agar geeli ho bhi gayin to garam elaichi chai aur fluffy towel ready hain!';
      actions = [
        { label: 'SPLASH SOME COLD WATER ON AHMAD', feedback: 'Chapaaak! Thanda paani Ahmad k face par gaya aur wo hansnay laga: \'Hayee meri zalim paaaari!\'' }
      ];
    } else if (id === 'note_bureau') {
      category = 'Pagluu Ka Pyara Sa Note ♥';
      title = 'Sticky Note #3: Bureau Street Lantern';
      accentColor = '#FACC15';
      description = "Bubu's Official Complaints Box!\n\nSection 42-A: Pagluu k saray unreasonable harkatain are hereby classified as 'unconstitutionally cute'. Kisi bhi shikayat ki soorat may sirf hug aur chocolates di jayen gi!";
      extraNote = 'Bureau Officer Ahmad: "Mera stamp tayyar hai Beenish ka naam top par laganay k liye!"';
      actions = [
        { label: 'FILE CUTE COMPLAINT', feedback: 'Shikayat darj hui: \'Pagluu bohot zyada tang karta hai aur bohot zyada pyar karta hai!\' Case closed!' }
      ];
    } else if (id === 'note_museum') {
      category = 'Pagluu Ka Pyara Sa Note ♥';
      title = 'Sticky Note #4: Museum Marble Pillar';
      accentColor = '#FACC15';
      description = "Official Record from the Ministry of Genius:\n\nPosition holder, topper, gold medalist of my heart, and greatest human being alive. Yahan museum may har drawing aur har achievement aap ki mehnat ki gawahi deti hai!";
      extraNote = 'PS: Beenish Tasaffar jaisa koi aur ban hi nai sakta, period.';
      actions = [
        { label: 'PROUDLY ADJUST GLASSES', feedback: 'Aap nay muskura kar apnay specs theek kiye... 100/10 elegance aur genius energy!' }
      ];
    } else if (id === 'note_court') {
      category = 'Pagluu Ka Pyara Sa Note ♥';
      title = 'Sticky Note #5: Court Bronze Post';
      accentColor = '#FACC15';
      description = "Road to the Court of No Flaws!\n\nSpoiler Alert: Honorable Chief Justice Ahmad has already examined the evidence across 365 days. The verdict is irrevocable: Beenish Tasaffar has ZERO flaws. Absolutely none!";
      extraNote = 'Verdict stamped in 24k gold ink: "Case Dismissed with Love."';
      actions = [
        { label: 'BANG THE JUDGE\'S GAVEL', feedback: 'Thak! Thak! Thak! \'Adalat faisla sunati hai k Beenish dunya ki sab say pyari larki hain!\'' }
      ];
    } else if (id === 'islamabad_sofa_bay') {
      category = 'Islamabad Villa: Living Room &amp; Bara Sofa ♥';
      title = 'The Baraaa Sofa for Beenie (Window View)';
      accentColor = '#FB7185';
      description = 'Khirki say andar dekhein: Floor-to-ceiling panoramic glass k peechay living room ka warm golden glow! Andar rakha hai the famous BARAAA SOFA FOR BEENIE — massive plush cream velvet L-shaped sofa, blush pink silk cushions, aur walnut coffee table par garam garam steaming cardamom (elaichi) chai k 2 mugs!';
      extraNote = 'Pagluu Note: "Meri choti si Beenie jab thak jayen to is baray sofa par poora phail kar curl up ho sakti hain! May sath baith kar unka sar dabaon ga aur unko garam chai pilaoon ga!"';
      actions = [
        { label: 'CURL UP ON THE BARAAA SOFA', feedback: 'Aap soft cream velvet sofa may dhas gayin... itna soft, itna cozy! Pagluu nay aap ko warm blanket orha di!' },
        { label: 'SIP STEAMING ELAICHI CHAI', feedback: 'Chuski lein taaza cardamom chai ki... garam, meethi, aur full of sukoon!' }
      ];
    } else if (id === 'islamabad_kids_rooms') {
      category = 'Islamabad Villa: Bachon Ke Rooms ♥';
      title = 'The 3 Kids\' Balconies & Rooms';
      accentColor = '#38BDF8';
      description = 'Upar 3 balconies nazar aa rahi hain, har bache ka apna separate themed room:\n\n• Room 1 (Left): Boy 1 — Samurai Jack Japanese room, ocean blue lighting, aur railing par rakhi hui steel Samurai Jack Katana!\n• Room 2 (Center): Boy 2 — Starry lavender galaxy room, constellation wall art, fairy lights, aur brass telescope!\n• Room 3 (Right): Baby Girl — Princess room, sheer white canopy, aur balcony chair par betha hua THE GIANT 6-FOOT TEDDY BEAR with pink bow tie!';
      extraNote = 'Pagluu Note: "Har bache k liye humne unki pasand ka room banaya hai taakay wo apni mama ki tarah creative aur genius banein!"';
      actions = [
        { label: 'HUG THE GIANT 6-FOOT TEDDY BEAR', feedback: 'Bara sa teddy bear itna fluffy aur chubby hai k aap us ki baahon may gum ho gayin! Hug hug hug!' },
        { label: 'INSPECT SAMURAI JACK KATANA', feedback: 'Chamakdar Japanese steel blade... perfectly balanced for justice and chivalry!' }
      ];
    } else if (id === 'islamabad_lawn_sign') {
      category = 'Margalla Hills Dream Sanctuary ♥';
      title = 'Sector F-7 Margalla Dream Sanctuary';
      accentColor = '#22C55E';
      description = 'Margalla Hills ki thandi hawayen, samnay khulay pahaad, aur lawn may khilti hui hot pink Bougainvillea aur khushbudaar Chambeli (jasmine). Sukoon, shanti aur humari choti si duniya.';
      extraNote = 'Dunya ka sab say pyara ghar, jahan sirf Beenish Tasaffar ki hukmarani hai.';
    } else if (id === 'bakery_display') {
      category = 'Sweet Dreams Bakery ♥';
      title = 'Tiered Pastry Display Window';
      accentColor = '#F472B6';
      description = 'Sheeshay k andar dekhein: Tiered mahogany shelves par saji hain taaza bakes:\n\n• Top Shelf: Multi-tiered strawberry birthday cake with vanilla rosettes & fresh red strawberries, plus pastel heart macarons!\n• Middle Shelf: Golden flaky chocolate croissants (pain au chocolat), cinnamon buns, aur wicker basket may French baguettes!\n• Bottom Shelf: Glossy fruit tarts with blueberries and raspberries, chocolate truffles, and eclairs!';
      extraNote = 'Bakery Chef Note: "Aap k liye har subah taaza naye cakes bake honge, bilkul hot and fresh!"';
      actions = [
        { label: 'TASTE A FRESH STRAWBERRY ROSETTE', feedback: 'Yummmmm! Fresh strawberry cream pighal gayi munh may... 100/10 sweetness!' },
        { label: 'GRAB A HOT CHOCOLATE CROISSANT', feedback: 'Crispy flaky crust aur andar say warm dark chocolate ka lava nikal aya! Maza aa gaya!' },
        { label: 'EAT A PISTACHIO MACARON', feedback: 'Crunchy delicate shell with velvety smooth pistachio ganache! Parisian perfection!' }
      ];
    } else if (id === 'bakery_cafe_table') {
      category = 'Cozy Cafe Table ♥';
      title = 'Bistro Table & Cafe au Lait';
      accentColor = '#F59E0B';
      description = 'Rain-slicked wet cobblestones k kinare cast-iron bistro set. Samnay taaza cappuccino with delicate heart-shaped latte art aur macarons ki plate.';
      extraNote = 'Baithiye meri Paaaari, thandi hawa chal rahi hai aur cherry blossom k phool hawa may ud rahe hain.';
      actions = [
        { label: 'SIP TAAZA CAPPUCCINO WITH LATTE ART', feedback: 'Creamy froth with rich aromatic coffee... warming your hands in the cool evening breeze!' }
      ];
    } else if (id === 'bakery_pretzel_sign') {
      category = 'Sweet Dreams Bakery Emblem ♥';
      title = 'Gilded Golden Pretzel & Cupcake Crest';
      accentColor = '#F59E0B';
      description = 'Wrought-iron bracket par latakta hua gilded golden pretzel emblem. Ye sign mark karta hai k ye Sweet Dreams Patisserie sirf aur sirf Beenish Tasaffar (Bubu) ki khushi k liye waqf hai!';
    } else if (id === 'haveli_charpai') {
      category = '12-Marla Haveli: Khula Vehrra ♥';
      title = 'Woven Charpai under Ancient Neem Tree';
      accentColor = '#F59E0B';
      description = 'Khulay earthen aangan (vehrra) may ancient Neem tree ki thandi chhaon talay bichi hai authentic turned-walnut charpai. Upar Phulkari aur geometric Khes bicha hai, cylindrical cotton bolsters (gao takkay) lagay huay hain. Sath may brass glasses may chilled sweet lassi with fresh white butter (makkhan) rakhi hai!';
      extraNote = 'Desi sukoon ka king spot! Thandi hawa chal rahi hai aur khet saaf nazar aa rahe hain.';
      actions = [
        { label: 'LOUNGE ON CHARPAI WITH GAO TAKKIYA', feedback: 'Aap charpai par let gayin, sar takkiya par rakha... neem k patton ki sar-sarahat aur bilkul pure sukoon!' },
        { label: 'DRINK CHILLED MEETHI LASSI', feedback: 'Heavy brass tumbler say thandi lassi ka ghoont... upar terta hua taaza makkhan! Hayee maza!' }
      ];
    } else if (id === 'haveli_tubewell') {
      category = 'Thanda Tubewell &amp; Taaza Aam ♥';
      title = 'Working Tubewell & Fresh Mango Crates';
      accentColor = '#38BDF8';
      description = 'Cast-iron electric motor tezz chal raha hai, aur thick curved pipe say crystal-clear barf jaisa thanda paani lagataar gush kar k concrete hauzi may gir raha hai! Hauzi may foaming white froth aur ripples ban rahe hain. Sath may Chaunsa aur Sindhri aam ki lakri ki crates bhari pari hain!';
      extraNote = 'Gaon ki dhoop may tubewell k paani ka chheenta parna dunya ka sab say bara sukoon hai.';
      actions = [
        { label: 'SPLASH IN GUSHING TUBEWELL WATER', feedback: 'Chhaapaak! Barf jaisa thanda taaza paani aap k munh hath par laga... saari thakan door ho gayi!' },
        { label: 'EAT A RIPE CHAUNSA MANGO', feedback: 'Meetha, raseela Chaunsa aam! Hath pooray mango juice say bhar gaye... itna tasty!' }
      ];
    } else if (id === 'haveli_jharoka') {
      category = 'Sheesham Jharoka Balcony ♥';
      title = 'Carved Sheesham Jharoka Balcony';
      accentColor = '#F59E0B';
      description = 'Lal eenton ki haveli k upper floor par khubsoorat antique Sheesham wood jharoka with hand-carved geometric jali lattice. Yahan se poora pind, gandum k khait aur tubewell ka nazaara dikhta hai.';
      extraNote = 'Sham k waqt yahan lantern jalta hai aur hawayen aati hain.';
    } else if (id === 'castle_balcony') {
      category = 'Queen Beenish Ka Shahi Mehal ♥';
      title = 'Karakoram Mountain Vista Balcony';
      accentColor = '#C084FC';
      description = 'Buland pahaari choti par shahi stone balcony. Samnay Karakoram aur Himalaya k barfeele peaks, aasman may chamakta hua crescent moon aur celestial nebula! Is unchaai par khare ho kar lagta hai dunya humary kadmon may hai.';
      extraNote = 'Queen Beenish ki saltanat, jahan koi gham dakhil nai ho sakta.';
      actions = [
        { label: 'GAZE OVER THE MOUNTAIN KINGDOM', feedback: 'Aap nay badalon aur barfeele pahaaron ko dekha... hawa thandi aur taaza hai, aur aap sach may saltanat ki malika hain!' }
      ];
    } else if (id === 'castle_torches') {
      category = 'ROYAL SCONCES';
      title = 'Imperial Castle Fire Braziers';
      accentColor = '#F59E0B';
      description = 'Cast-iron cauldrons may dehakti hui aag ki laptain jo shahi red carpet aur granite ashlar stone blocks ko golden roshni say nikharti hain.';
    } else if (id === 'castle_banners') {
      category = 'IMPERIAL HERALDRY';
      title = 'Royal Velvet Banners (Queen Beenish Star)';
      accentColor = '#8B5CF6';
      description = 'Unchay fortress bastions say latakte huay deep purple velvet shahi banners, jin par sonay k taaron say Queen Beenish ka celestial star emblem kashida kiya gaya hai!';
    }

    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', backgroundColor: 'var(--color-void-navy)', borderColor: accentColor }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: accentColor, fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                [ {category} ]
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                {title}
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            <p className="font-mono" style={{ fontSize: '0.86rem', color: 'var(--color-moon-cream)', margin: '0 0 12px 0', whiteSpace: 'pre-line' }}>
              {description}
            </p>

            {extraNote && (
              <div className="font-mono" style={{ fontSize: '0.8rem', color: '#FDE68A', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '10px 14px', borderLeft: `3px solid ${accentColor}`, marginBottom: '12px' }}>
                {extraNote}
              </div>
            )}

            {snackMessage && (
              <div className="font-mono" style={{ fontSize: '0.82rem', color: '#4ADE80', backgroundColor: 'rgba(34, 197, 94, 0.15)', padding: '8px 12px', borderLeft: '3px solid #22C55E', marginBottom: '12px' }}>
                {snackMessage}
              </div>
            )}

            {actions.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {actions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playCoin();
                      setSnackMessage(act.feedback);
                    }}
                    className="pixel-btn pixel-btn-primary font-display"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            CLOSE INSPECTION
          </button>
        </div>
      </div>
    );
  }

  // 12. HIGH-OCTANE SPEED GARAGE: NINJA H2R & DODGE CHALLENGER
  if (activeObject.type === 'garage_vehicles') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Paaaari Ka Speed Garage ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', margin: '4px 0 0 0' }}>
                Kawasaki Ninja H2R &amp; Dodge Challenger
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px', lineHeight: '1.7' }}>
            <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
              Meri Paaaari ko ordinary speed bilkul pasand nai! Yahan aapki two favorite machines full shine kar rahi hain:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ADE80', padding: '10px' }}>
                <div className="font-display" style={{ color: '#4ADE80', fontSize: '0.95rem' }}>KAWASAKI NINJA H2R</div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--color-moon-cream)', marginTop: '4px' }}>
                  310 HP Supercharged monster! Neon lime green trellis frame, carbon wings, aur blued titanium exhaust!
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.1)', border: '1px solid var(--color-lantern-gold)', padding: '10px' }}>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.95rem' }}>DODGE CHALLENGER</div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--color-moon-cream)', marginTop: '4px' }}>
                  Pitch-black V8 muscle car! Twin hood scoops, roaring quad exhaust, aur custom number plate: <strong>BEE-11</strong>!
                </div>
              </div>
            </div>
          </div>

          {revvingVehicle && (
            <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px dashed var(--color-lantern-gold)', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
              <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.85rem' }}>
                {revvingVehicle === 'h2r' 
                  ? 'VROOOOMMM! 310 HP supercharged engine revved! Paaaari zooming past with wind in her hair at 350 km/h!' 
                  : 'RUMMMBLEEE! Deep V8 American muscle roar! Pitch-black Challenger shaking the ground in style!'}
              </div>
            </div>
          )}

          <div style={{ backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)', padding: '12px', marginBottom: '18px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontStyle: 'italic' }}>
              "Statement by Pagluu: Aap ko H2R par ya Challenger chalate dekh kar mera to heart attack pakka hai... 11/10 baddie transportation reserved only for meri Beghum G!"
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                soundEngine.playHorn(1);
                setRevvingVehicle('h2r');
              }}
              className="pixel-btn font-display"
              style={{ flex: 1, backgroundColor: '#15803D', color: '#FFFFFF', justifyContent: 'center' }}
            >
              REV THE NINJA H2R
            </button>
            <button
              onClick={() => {
                soundEngine.playHorn(2);
                setRevvingVehicle('challenger');
              }}
              className="pixel-btn font-display"
              style={{ flex: 1, backgroundColor: '#334155', color: '#F8FAFC', justifyContent: 'center' }}
            >
              RUMBLE THE CHALLENGER
            </button>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display">
              CLOSE GARAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 13. PRIVATE JET APRON & RED CARPET VISION
  if (activeObject.type === 'jet_tarmac') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Humara Khawab: White Jet &amp; Red Carpet Walk ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', margin: '4px 0 0 0' }}>
                The White Jet &amp; Red Carpet Vision
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '18px', lineHeight: '1.8' }}>
            <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', marginBottom: '12px' }}>
              Ye dream vision humara officially register ho chuka hai:
            </p>
            <div className="font-mono" style={{ backgroundColor: 'var(--color-void-navy)', padding: '12px', borderLeft: '3px solid var(--color-lantern-gold)', fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
              Sleek white aur platinum grey luxury jet tarmac par land ho chuka hai. Mobile airstairs lag chuki hain aur neechay crimson velvet red carpet bich chuka hai...
              <br /><br />
              Meri Paaaari white dress may elegant pose k sath stairs se utar rahi hain, looking like an absolute queen of the universe!
              <br /><br />
              Aur tarmac par khara aapka Pagluu (Ahmad) moun khol kar hairat se dekh rha hai k ya Allah, meri Paaaari kitni pyari lag rahi hain!
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)', padding: '12px', marginBottom: '18px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontStyle: 'italic' }}>
              "Pagluu ka permanent state: Aap ko dekh kar moun khula reh jana to mera natural reaction hai. Ye private jet aur ye red carpet walk hum real life may bhi zaroor sach karenge inshallah!"
            </div>
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-peach font-display" style={{ width: '100%', justifyContent: 'center' }}>
            I AM READY FOR MY RED CARPET WALK
          </button>
        </div>
      </div>
    );
  }

  // 14. 2 AM FEAST TABLE: WHITE PASTA & SWEETS
  if (activeObject.type === 'feast_table') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                2 AM Feast: White Pasta &amp; Chocolates ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', margin: '4px 0 0 0' }}>
                2 AM Feast Table: White Pasta &amp; Sweets
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px', lineHeight: '1.8' }}>
            <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
              Midnight cravings ka VIP menu hazir hai meri Beghum G k liye:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255, 248, 231, 0.1)', padding: '8px', border: '1px solid #FFFBEB' }}>
                <strong style={{ color: '#FEF08A', fontSize: '0.82rem' }}>Steaming White Pasta</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--color-moon-cream)' }}>Creamy Alfredo sauce with butter and parsley!</p>
              </div>
              <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.1)', padding: '8px', border: '1px solid var(--color-lantern-gold)' }}>
                <strong style={{ color: 'var(--color-lantern-gold)', fontSize: '0.82rem' }}>Dhayeeer Saari Chocolates</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--color-moon-cream)' }}>Dark chocolate, milk chocolate, and meethi chocolate!</p>
              </div>
              <div style={{ backgroundColor: 'rgba(69, 26, 3, 0.25)', padding: '8px', border: '1px solid #78350F' }}>
                <strong style={{ color: '#FCD34D', fontSize: '0.82rem' }}>Nutella &amp; Spoons</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--color-moon-cream)' }}>Baray baray spoons direct jar k andar!</p>
              </div>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '8px', border: '1px solid #EF4444' }}>
                <strong style={{ color: '#FCA5A5', fontSize: '0.82rem' }}>Kinder Joys &amp; Coco Crunch</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--color-moon-cream)' }}>Crispy wafer balls aur big cereal bowl!</p>
              </div>
            </div>
          </div>

          {snackMessage && (
            <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px dashed var(--color-rose-glow)', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
              <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.85rem' }}>
                {snackMessage}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <button
              onClick={() => {
                soundEngine.playPaperRustle();
                setSnackMessage('Garam garam creamy white pasta... melt in mouth! Pagluu: "Aap k liye fresh banaya hai, pura bowl finish karein!"');
              }}
              className="pixel-btn font-display"
              style={{ flex: 1, minWidth: '140px', backgroundColor: '#FDE047', color: '#1E293B', justifyContent: 'center' }}
            >
              TASTE WHITE PASTA
            </button>
            <button
              onClick={() => {
                soundEngine.playStarChime();
                setSnackMessage('Crack! Kinder Joy open hui! Crispy wafer balls + creamy sweet milk. Toy inside: A gold star for Paaaari!');
              }}
              className="pixel-btn font-display"
              style={{ flex: 1, minWidth: '140px', backgroundColor: '#FB923C', color: '#1E293B', justifyContent: 'center' }}
            >
              EAT KINDER JOY
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSnackMessage('Bara sa Nutella ka chamach! Pure chocolate heaven! Pagluu: "Jitna dil chahe khayein, koi rokne wala nai!"');
              }}
              className="pixel-btn font-display"
              style={{ flex: 1, minWidth: '140px', backgroundColor: '#78350F', color: '#FEF3C7', justifyContent: 'center' }}
            >
              BIG SPOON NUTELLA
            </button>
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            SAVOR THE LATE NIGHT FEAST
          </button>
        </div>
      </div>
    );
  }

  // 15. PAISAY VAULT: DHAYYERRRR SARYYYYYYYYYY PAISAY
  if (activeObject.type === 'paisay_vault') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', marginBottom: '6px' }}>
            Dhayeeer Saaray Paisay ♥
          </div>
          <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.3rem', margin: '0 0 14px 0' }}>
            DHAYYERRRR SARYYYYYYYYYY PAISAY
          </h2>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-lantern-gold)', padding: '20px', marginBottom: '18px' }}>
            <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.8rem', marginBottom: '6px' }}>
              CURRENT VERIFIED TREASURY BALANCE FOR BEENISH:
            </div>
            <div className="font-display" style={{ fontSize: '1.6rem', color: '#4ADE80', letterSpacing: '0.04em' }}>
              PKR {paisayTotal.toLocaleString()}
            </div>
            <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.78rem', marginTop: '6px' }}>
              (+ INFINITE LOVE &amp; UNCONDITIONAL DEVOTION)
            </div>
          </div>

          <p className="font-mono" style={{ fontSize: '0.86rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', marginBottom: '18px' }}>
            Meri Beghum G ko mangne ki bhi zaroorat nai hai. Dunya ka saara paisa, saari daulat, aur saari khushiyan aap k kadmon may hazir hain!
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                soundEngine.playCoin();
                setPaisayTotal(prev => prev + 50000000000);
              }}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              ADD MORE PAISAY (+ 50 BILLION)
            </button>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display">
              CLOSE VAULT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 16. SPORTS ARENA: CRICKET & BADMINTON
  if (activeObject.type === 'sports_arena') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Cricket &amp; Badminton Arena ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', margin: '4px 0 0 0' }}>
                Cricket &amp; Badminton Championship Ground
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px', lineHeight: '1.8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem' }}>OFFICIAL HEAD-TO-HEAD STATS:</span>
              <span className="font-mono" style={{ backgroundColor: '#15803D', color: '#FFFFFF', padding: '2px 8px', fontSize: '0.75rem', borderRadius: '2px' }}>PAAARI WINS</span>
            </div>
            <div className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
              <div>&bull; <strong>Badminton:</strong> Paaaari’s smash speed: 400 km/h! Shuttlecock seedha court k paar, Pagluu bas dekhta reh gaya!</div>
              <div>&bull; <strong>Cricket:</strong> 6 balls par 6 sixers! Wickets intact, Pagluu ki bowling full dhulai!</div>
              <div>&bull; <strong>Overall Score vs Pagluu:</strong> 100 Wins - 0 Losses (Undisputed Champion: Beenish)!</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)', padding: '12px', marginBottom: '18px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontStyle: 'italic' }}>
              "Pagluu: Class may bhi position holder aur sports may bhi undefeated boss! May to aap se har match haar kar bhi sab se zyada khush hota hun kyun k jeet to meri Paaaari ki hui hai!"
            </div>
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            ACCEPT THE CHAMPIONSHIP TROPHY
          </button>
        </div>
      </div>
    );
  }

  // 17. LOCKED SECRET GARDEN ROSE GATE
  if (activeObject.id === 'door_garden' && !state.secretGardenUnlocked) {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-rose" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Secret Rose Garden Ka Darwaza
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', margin: '4px 0 0 0' }}>
                The Secret Hidden Garden Gate
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px', lineHeight: '1.8' }}>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.86rem', margin: '0 0 10px 0' }}>
              Bhari antique zanjeeren aur gulab ki belain is darwazay par lipti hui hain. Aik bohot meethi aur sukoon bhari khushboo andar say aa rahi hai...
            </p>
            <div style={{ backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)', padding: '10px 14px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.84rem' }}>
                <strong>Pagluu:</strong> "Meri pyari Paaaari, is garden may aap k liye sab say bara birthday secret aur love letter chupa hai! Pehly valley ki locations say 5 missing stars recover karo aur Museum say antique brass key dhoondo, phir ye gate aap k liye khul jaye ga!"
              </div>
            </div>
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            I WILL RECOVER THE STARS FOR MY PAGLUU
          </button>
        </div>
      </div>
    );
  }

  // 19. BUILDING 1: ISLAMABAD 5-MARLA FAMILY HOUSE
  if (activeObject.type === 'house_islamabad') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Islamabad 5-Marla Villa ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                The Islamabad 5-Marla Family House
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Room Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('living'); }}
              className={`pixel-btn ${islamabadRoom === 'living' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Living Room &amp; Bara Sofa
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('boy1'); }}
              className={`pixel-btn ${islamabadRoom === 'boy1' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Boy 1 (Samurai Blue)
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('boy2'); }}
              className={`pixel-btn ${islamabadRoom === 'boy2' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Boy 2 (Light Purple)
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('girl'); }}
              className={`pixel-btn ${islamabadRoom === 'girl' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Baby Girl (Bara Bear)
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('gaming'); }}
              className={`pixel-btn ${islamabadRoom === 'gaming' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              The Gaming Room
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIslamabadRoom('master'); }}
              className={`pixel-btn ${islamabadRoom === 'master' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Master Bedroom (Brown)
            </button>
          </div>

          {/* Room Visualizer & Blueprint Detail */}
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            {islamabadRoom === 'living' && (
              <div>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem', marginBottom: '8px' }}>
                  THE GRAND LIVING ROOM // BARA SOFA FOR CHOTI SI BEENIE
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Center stage par rakha hai humara legendary <strong>BARAAA SOFA</strong>! Itna bara aur narm sofa k meri chootiii sinnnn beeenieeee us may bilkul choti si ban kar pillows aur soft blankets may dhas jaye gi, popcorn khatay huay apny favourite shows dekhay gi, aur Pagluu us k paas baith kar us ki pyari pyari batain sunay ga.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', backgroundColor: 'rgba(246, 215, 139, 0.1)', padding: '8px 12px', borderLeft: '3px solid var(--color-lantern-gold)' }}>
                  Features: Stone fireplace, couple photo frames on the mantle, warm golden amber lights, and floor-to-ceiling glass overlooking Islamabad pine hills.
                </div>
              </div>
            )}

            {islamabadRoom === 'boy1' && (
              <div>
                <div className="font-display" style={{ color: '#60A5FA', fontSize: '1.05rem', marginBottom: '8px' }}>
                  BOY 1 BEDROOM // SAMURAI JACK BLUE SUITE
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Deep sapphire blue and white walls with sleek Japanese minimalist wood trims. Wall par katana swords display aur legendary Samurai Jack posters! Desk par animation drawing tablets aur martial arts trophies.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#93C5FD', backgroundColor: 'rgba(96, 165, 250, 0.1)', padding: '8px 12px', borderLeft: '3px solid #60A5FA' }}>
                  Private Balcony: Blue LED starlight railing looking out toward the Margalla Ridge.
                </div>
              </div>
            )}

            {islamabadRoom === 'boy2' && (
              <div>
                <div className="font-display" style={{ color: '#C084FC', fontSize: '1.05rem', marginBottom: '8px' }}>
                  BOY 2 BEDROOM // LIGHT PURPLE ASTRONOMY HAVEN
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Soft calming lavender-purple aesthetic with a celestial starry ceiling that glows in the dark. Corner may high-precision brass telescope pointing through the glass balcony, bookshelves full of science, robotics, and coding manuals.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#E9D5FF', backgroundColor: 'rgba(192, 132, 252, 0.1)', padding: '8px 12px', borderLeft: '3px solid #C084FC' }}>
                  Private Balcony: Lavender fairylights with quiet reading nook.
                </div>
              </div>
            )}

            {islamabadRoom === 'girl' && (
              <div>
                <div className="font-display" style={{ color: '#F472B6', fontSize: '1.05rem', marginBottom: '8px' }}>
                  BABY GIRL BEDROOM // PRINCESS SUITE &amp; BARA SA BEAR
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Fairy baby-pink walls with warm pastel white cloud decor. Corner may baitha hai <strong>BARAAA SA TEDDY BEAR</strong> (literally sofa jitna bara fluffy bear jo us ko protect karta hai!). White princess canopy bed with twinkling fairy lights and dollhouse.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#FBCFE8', backgroundColor: 'rgba(244, 114, 182, 0.1)', padding: '8px 12px', borderLeft: '3px solid #F472B6' }}>
                  Private Balcony: Pink rose flowerboxes with little wind-chimes singing sweet melodies.
                </div>
              </div>
            )}

            {islamabadRoom === 'gaming' && (
              <div>
                <div className="font-display" style={{ color: '#4ADE80', fontSize: '1.05rem', marginBottom: '8px' }}>
                  THE COUPLE GAMING ROOM // DUAL HIGH-END BATTLESTATIONS
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Side-by-side dual custom PC rigs! Ek Beenish ka aur ek Pagluu ka. Ultra-wide curved OLED monitors, custom mechanical keyboards with creamy switches, RGB bias backlighting, gaming headsets, and ergonomic recliners.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#86EFAC', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '8px 12px', borderLeft: '3px solid #4ADE80' }}>
                  Snack fridge stocked with cold iced tea, chocolates, Kinder Joys, and hot noodles maker for 2 AM gaming sessions!
                </div>
              </div>
            )}

            {islamabadRoom === 'master' && (
              <div>
                <div className="font-display" style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '8px' }}>
                  MASTER BEDROOM // WARM BROWN WALNUT LUXURY SUITE
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Rich brown walnut hardwood, warm earth-tones, ambient recessed golden cove lighting. King-size bed with orthopedic mattress, walk-in dressing wardrobe specifically customized for Beenish's elegant dresses and abayas, and private ensuite spa bathroom.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#FDE68A', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderLeft: '3px solid #F59E0B' }}>
                  Master Balcony: Direct panoramic view of the Margalla Hills sunrise every single morning!
                </div>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)', padding: '10px 14px', marginBottom: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', fontStyle: 'italic' }}>
              "Pagluu: Har bacha apny kamray may khush rahy ga, aur humara ye 5-marla ghar humari dunya ka sab say pyara aashiyana ho ga. Meri pyari Beenie, ye sab aap k liye banay ga!"
            </div>
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            CLOSE BLUEPRINT VIEW
          </button>
        </div>
      </div>
    );
  }

  // 20. BUILDING 2: SECRET MAFIA SAFEHOUSE & BATMOBILE
  if (activeObject.type === 'house_mafia') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-rose" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: '#EF4444', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                The Batcave Safehouse &amp; Batmobile Tumbler ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                Secret Mafia Safehouse &amp; Batmobile Tumbler
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => { soundEngine.playClick(); setMafiaTab('tumbler'); }}
              className={`pixel-btn ${mafiaTab === 'tumbler' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              The Batmobile Tumbler Bay
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setMafiaTab('armory'); }}
              className={`pixel-btn ${mafiaTab === 'armory' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Biometric Armory Vault
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setMafiaTab('surveillance'); }}
              className={`pixel-btn ${mafiaTab === 'surveillance' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Tactical Command Lounge
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            {mafiaTab === 'tumbler' && (
              <div>
                <div className="font-display" style={{ color: '#38BDF8', fontSize: '1.05rem', marginBottom: '8px' }}>
                  THE BATMAN BATMOBILE TUMBLER // SPECIFICATIONS
                </div>
                <div className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', marginBottom: '12px' }}>
                  <div>&bull; <strong>Chassis:</strong> Matte obsidian carbon-composite military armor (bulletproof &amp; blast-resistant).</div>
                  <div>&bull; <strong>Propulsion:</strong> Jet turbine vector thruster with 1,500 HP afterburner.</div>
                  <div>&bull; <strong>Passenger Comfort:</strong> Heated memory-foam bucket seats for Beenish &amp; Ahmad with Bose surround sound playing "Bol Na Halke Halke".</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      soundEngine.playHorn(2);
                      setTumblerRevved(true);
                      setTimeout(() => setTumblerRevved(false), 2000);
                    }}
                    className="pixel-btn pixel-btn-primary font-display"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    REV JET TURBINE AFTERBURNER
                  </button>
                  {tumblerRevved && (
                    <span className="font-mono" style={{ color: '#38BDF8', fontSize: '0.8rem' }}>
                      TURBINE ROARING: 18,000 RPM CYCLING!
                    </span>
                  )}
                </div>
              </div>
            )}

            {mafiaTab === 'armory' && (
              <div>
                <div className="font-display" style={{ color: '#EF4444', fontSize: '1.05rem', marginBottom: '8px' }}>
                  BIOMETRIC ARMORY &amp; PROTECTIVE VAULT
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
                  State-of-the-art encrypted safehouse. Facial recognition sirf 2 logon ko allow karta hai: The Boss (Ahmad) and The Real Boss (Beenish). Dunya may koi bhi meri Paaaari ki taraf aankh utha kar bhi nai dekh sakta, 24/7 automated drone security active rehti hai!
                </p>
              </div>
            )}

            {mafiaTab === 'surveillance' && (
              <div>
                <div className="font-display" style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '8px' }}>
                  TACTICAL SURVEILLANCE &amp; STEALTH LOUNGE
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
                  High-resolution satellite monitors, encrypted satellite uplinks, soundproofed black leather lounge, and an Italian espresso bar to keep Pagluu fueled for late night plans.
                </p>
              </div>
            )}
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            EXIT SAFEHOUSE
          </button>
        </div>
      </div>
    );
  }

  // 21. BUILDING 3: SWEET DREAMS BAKERY & PASTRY PARLOUR
  if (activeObject.type === 'house_bakery') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-rose" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: '#F472B6', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Sweet Dreams Bakery &amp; Pastry Parlour ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                Sweet Dreams Bakery &amp; Pastry Parlour
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => { soundEngine.playClick(); setBakeryTab('parlour'); }}
              className={`pixel-btn ${bakeryTab === 'parlour' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Pastry Display Parlour
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setBakeryTab('ovens'); }}
              className={`pixel-btn ${bakeryTab === 'ovens' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Stone Deck Baking Ovens
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setBakeryTab('fondue'); }}
              className={`pixel-btn ${bakeryTab === 'fondue' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Belgian Chocolate Fondue
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            {bakeryTab === 'parlour' && (
              <div>
                <div className="font-display" style={{ color: '#F472B6', fontSize: '1.05rem', marginBottom: '8px' }}>
                  FRESH PASTRIES &amp; SWEET TREATS
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Har subah taaza naram croissants, Belgian chocolate eclairs, red velvet cupcakes, aur fresh strawberry tarts ki khushboo poori hawa may phail jati hai.
                </p>
                <button
                  onClick={() => {
                    soundEngine.playStarChime();
                    setSnackMessage("Aap nay taaza strawberry tart chakh lia! Melt-in-mouth sweetness for my sweetest Paaaari!");
                    setTimeout(() => setSnackMessage(null), 3000);
                  }}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  SAMPLE A STRAWBERRY TART
                </button>
                {snackMessage && (
                  <div className="font-mono" style={{ color: '#FDE047', fontSize: '0.8rem', marginTop: '8px' }}>
                    {snackMessage}
                  </div>
                )}
              </div>
            )}

            {bakeryTab === 'ovens' && (
              <div>
                <div className="font-display" style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '8px' }}>
                  COMMERCIAL STONE DECK BAKING OVENS
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
                  Heavy granite baking tables dusted with flour, European steam deck ovens, marble rolling pins, and secret pastry recipes crafted specially for Beenish's sweet cravings!
                </p>
              </div>
            )}

            {bakeryTab === 'fondue' && (
              <div>
                <div className="font-display" style={{ color: '#C084FC', fontSize: '1.05rem', marginBottom: '8px' }}>
                  BELGIAN CHOCOLATE FONDUE FOUNTAIN
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
                  Pighli hui rich Belgian milk chocolate ka 4-tier fountain! Strawberries, marshmallows, and wafer sticks dip kar k enjoy kar sakty hain.
                </p>
              </div>
            )}
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            EXIT BAKERY
          </button>
        </div>
      </div>
    );
  }

  // 22. BUILDING 4: QUEEN BEENISH'S MOUNTAIN CASTLE
  if (activeObject.type === 'house_castle') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: '#C084FC', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                Queen Beenish’s Mountain Castle ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                Queen Beenish’s Mountain Castle
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => { soundEngine.playClick(); setCastleTab('throne'); }}
              className={`pixel-btn ${castleTab === 'throne' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Royal Grand Throne Room
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setCastleTab('balcony'); }}
              className={`pixel-btn ${castleTab === 'balcony' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Mountain Starlight Balcony
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            {castleTab === 'throne' && (
              <div>
                <div className="font-display" style={{ color: '#C084FC', fontSize: '1.05rem', marginBottom: '8px' }}>
                  THE IMPERIAL THRONE OF BEENISH TASSAFFAR
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Velvet purple aur gold se saja hua shahi takht! Poori dunya par hukoomat karnay wali Queen Beenish yahan tashreef farma hain, aur un ka sab say vafadaar Pagluu un k agay sir jhukaye khidmat may khara hai.
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', backgroundColor: 'rgba(192, 132, 252, 0.15)', padding: '8px 12px', borderLeft: '3px solid #C084FC' }}>
                  Court Decree: Queen Beenish ka har hukam aakhri qanoon hai. Flaws: Strictly Zero!
                </div>
              </div>
            )}

            {castleTab === 'balcony' && (
              <div>
                <div className="font-display" style={{ color: '#FDE047', fontSize: '1.05rem', marginBottom: '8px' }}>
                  HIGH PEAK MOUNTAIN BALCONY
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)' }}>
                  Hawa may khushgawar thandak aur aasman may sitaray. Balcony par kharay ho kar poori valley aur paharon ka nazara daikha ja sakta hai jahan humara pyaar hamesha roshan rahy ga.
                </p>
              </div>
            )}
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            EXIT CASTLE
          </button>
        </div>
      </div>
    );
  }

  // 23. BUILDING 5: 12-MARLA GAON HAVELI (HIRA KI HAVELI)
  if (activeObject.type === 'house_haveli') {
    return (
      <div className="pixel-modal-backdrop" onClick={handleClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-twilight-blue)', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <div className="font-mono" style={{ color: '#F59E0B', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
                12-Marla Gaon Haveli (Hira Ki Haveli) ♥
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
                12-Marla Gaon Haveli (Hira Ki Haveli)
              </h2>
            </div>
            <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => { soundEngine.playClick(); setHaveliTab('courtyard'); }}
              className={`pixel-btn ${haveliTab === 'courtyard' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Vehrra &amp; Charpaiyan
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setHaveliTab('tubewell'); }}
              className={`pixel-btn ${haveliTab === 'tubewell' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Tubewell &amp; Mango Feast
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '14px', lineHeight: '1.75' }}>
            {haveliTab === 'courtyard' && (
              <div>
                <div className="font-display" style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '8px' }}>
                  KHULA VEHRRA // SHADY NEEM TREE &amp; CHARPAIYAN
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 10px 0' }}>
                  Lal eenton (clay bricks) ki khubsoorat haveli ka khula aangan (vehrra). Neem k darakht k thanday saye may bichi hain 2 khubsoorat charpaiyan jin par rang-barangay khes aur gao takkay lagay huay hain. Gaon ki taaza thandi hawa aur sukoon!
                </p>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#FDE68A', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderLeft: '3px solid #F59E0B' }}>
                  Sheesham darwaza aur Mughal jharoka balcony jahan se poora gaon aur haryali nazar aati hai.
                </div>
              </div>
            )}

            {haveliTab === 'tubewell' && (
              <div>
                <div className="font-display" style={{ color: '#38BDF8', fontSize: '1.05rem', marginBottom: '8px' }}>
                  CHALTA HUA TUBEWELL &amp; TAAZA AAM
                </div>
                <p className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--color-moon-cream)', margin: '0 0 12px 0' }}>
                  Tubewell ki moti dhar se nikalta hua barf jaisa thanda paani seedha cement ki hauzi may gir raha hai! Sath may Chaunsa aur Sindhri aam ki taaza crates rakhi hain.
                </p>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      soundEngine.playCoin();
                      setLassiCount(prev => prev + 1);
                    }}
                    className="pixel-btn pixel-btn-primary font-display"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    DRINK CHILLED MEETHI LASSI ({lassiCount} DRUNK)
                  </button>
                  <span className="font-mono" style={{ color: '#38BDF8', fontSize: '0.8rem' }}>
                    Brass glass: Full makkhan &amp; malai!
                  </span>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
            EXIT HAVELI
          </button>
        </div>
      </div>
    );
  }



  return null;
};
