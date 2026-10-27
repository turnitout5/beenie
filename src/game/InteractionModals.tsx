import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { InteractableObject } from './types';
import { 
  BUREAU_REPORTS, 
  ARCHIVE_MEMORIES, 
  FUTURE_VIGNETTES, 
  BIRTHDAY_LETTER 
} from '../data/personalization';
import { soundEngine } from '../audio/soundEngine';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';

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
    recoverStar 
  } = useExpedition();

  const { readReports, bureauStamped, inventory, namedConstellation } = state;
  const hasBrassKey = inventory.includes('brass_key');

  // Sub-states initialized to valid personal data keys
  const [selectedReportId, setSelectedReportId] = useState<string>(BUREAU_REPORTS[0]?.id || 'hmm_protocol');
  const [courtStep, setCourtStep] = useState<number>(0);
  const [isSearchingCourt, setIsSearchingCourt] = useState<boolean>(false);
  const [constellationInput, setConstellationInput] = useState<string>('');
  const [selectedVignetteId, setSelectedVignetteId] = useState<string>(FUTURE_VIGNETTES[0]?.id || 'house_islamabad');
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [playingSong, setPlayingSong] = useState<boolean>(false);

  if (!activeObject) return null;

  // 1. FILING CABINET (BUREAU OF UNREASONABLE BOYFRIENDS)
  if (activeObject.type === 'filing_cabinet') {
    const report = BUREAU_REPORTS.find(r => r.id === selectedReportId) || BUREAU_REPORTS[0];

    const handleStamp = () => {
      soundEngine.playStamp();
      stampBureau();
    };

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <div>
              <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                BUREAU CASE FILE #001 // THE BEENISH DOSSIERS
              </span>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem', marginTop: '2px' }}>
                REASONS BEENISH IS UNREASONABLY ADORABLE &amp; 11/10 BOLD
              </h2>
            </div>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
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
                {r.title} {readReports.includes(r.id) && '[READ]'}
              </button>
            ))}
          </div>

          {/* Report Body */}
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '18px', marginBottom: '16px', lineHeight: '1.7' }}>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-dusty-lavender)', marginBottom: '10px' }}>
              <div><strong>SUBJECT:</strong> {report.subject}</div>
              <div><strong>INVESTIGATOR:</strong> {report.investigator}</div>
              <div><strong>OBJECTIVITY:</strong> <span style={{ color: 'var(--color-rose-glow)' }}>{report.objectivity}</span></div>
            </div>

            {/* Special Interactive Render: The "Hmm" Decryption Protocol */}
            {report.id === 'hmm_protocol' && (
              <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-twilight-blue)', padding: '14px', margin: '14px 0' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  THE OFFICIAL "HMM" DECODER
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(235, 122, 154, 0.15)', borderLeft: '3px solid var(--color-rose-glow)' }}>
                    <strong style={{ color: 'var(--color-rose-glow)' }}>"3hm"</strong> = Gussay may (Extreme emergency! Cease all arguments immediately and provide dark chocolates).
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
                    <strong style={{ color: 'var(--color-moon-cream)' }}>"hm hm hm"</strong> = No samajh aa rahi (Complete confusion).
                  </div>
                </div>
              </div>
            )}

            {/* Special Interactive Render: Top 3 Personalities */}
            {report.id === 'favorite_personalities' && (
              <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-lantern-gold)', padding: '14px', margin: '14px 0', textAlign: 'center' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  THE OFFICIAL HISTORICAL PODIUM
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', margin: '12px 0' }}>
                  <div style={{ backgroundColor: 'rgba(246, 215, 139, 0.15)', border: '2px solid var(--color-lantern-gold)', padding: '10px 16px', minWidth: '160px' }}>
                    <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem' }}>#1 MEEEEEE</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)' }}>Her Boyfriend (Undisputed)</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '10px 14px', minWidth: '130px' }}>
                    <div className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '0.95rem' }}>#2 Quaid-e-Azam</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>Honorable 2nd</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '10px 14px', minWidth: '130px' }}>
                    <div className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '0.95rem' }}>#3 Asmaa</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>Solid 3rd</div>
                  </div>
                </div>
                <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-warm-peach)', fontStyle: 'italic', margin: 0 }}>
                  "Beating the founder of Pakistan for the #1 spot remains the single greatest achievement of my life."
                </p>
              </div>
            )}

            {/* Special Interactive Render: 11/10 Baddie */}
            {report.id === '11_out_of_10_baddie' && (
              <div style={{ textAlign: 'center', margin: '14px 0', backgroundColor: 'var(--color-void-navy)', padding: '14px', border: '1px solid var(--color-twilight-blue)' }}>
                <CompanionBoyfriend pose="blush" initialQuote="I am permanently incapacitated by her 11/10 baddie presence!" />
                <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-rose-glow)', marginTop: '8px' }}>
                  [INVESTIGATOR CANNOT COMPREHEND HOW GORGEOUS AND BOLD SHE IS]
                </div>
              </div>
            )}

            {/* Special Interactive Render: Dhayeeer Saari Chocolates */}
            {report.id === 'dhayeer_saari_chocolates' && (
              <div style={{ backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-forest-moss)', padding: '14px', margin: '14px 0' }}>
                <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', marginBottom: '8px' }}>
                  APPROVED SWEET HOARD INVENTORY:
                </div>
                <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-moon-cream)', lineHeight: '1.8' }}>
                  <div>&bull; Dark Chocolates: <strong style={{ color: 'var(--color-warm-peach)' }}>Dhayeeeer saari</strong></div>
                  <div>&bull; Meethi &amp; Milk Chocolates: <strong style={{ color: 'var(--color-warm-peach)' }}>Dhayeeeer saari</strong></div>
                  <div>&bull; Kinder Joys, Nutella &amp; Koko Krunch: <strong style={{ color: 'var(--color-lantern-gold)' }}>Endless stacks</strong></div>
                  <div>&bull; Paisay: <strong style={{ color: 'var(--color-rose-glow)' }}>DHAYYERRRR SARYYYYYYYYYY</strong></div>
                </div>
              </div>
            )}

            <div style={{ margin: '12px 0' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-warm-peach)', textTransform: 'uppercase' }}>OFFICIAL FINDING:</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--color-moon-cream)', whiteSpace: 'pre-line', marginTop: '6px' }}>
                {report.finding}
              </p>
            </div>

            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', backgroundColor: 'rgba(243, 183, 156, 0.1)', padding: '8px 12px' }}>
              {report.caption}
            </div>
          </div>

          {/* Official Stamp */}
          <div style={{ textAlign: 'center' }}>
            {bureauStamped ? (
              <div className="font-display" style={{ color: 'var(--color-rose-glow)', fontSize: '0.95rem', border: '2px solid var(--color-rose-glow)', padding: '8px 16px', display: 'inline-block', transform: 'rotate(-2deg)' }}>
                ★ SUBJECT IS UNCONDITIONALLY LOVED. CASE CLOSED. ★
              </div>
            ) : (
              <button onClick={handleStamp} className="pixel-btn pixel-btn-primary font-display" style={{ padding: '12px 24px' }}>
                STAMP OFFICIAL CASE FILE
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
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', letterSpacing: '0.12em', marginBottom: '8px' }}>
            {hasBrassKey ? '[ DRAWER UNLOCKED ]' : '[ SECURE DRAWER #07 ]'}
          </div>
          <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '10px' }}>
            {hasBrassKey ? 'DESK DRAWER #07 UNLOCKED' : 'LOCKED DESK DRAWER #07'}
          </h2>

          {hasBrassKey ? (
            <div>
              <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--color-moon-cream)', lineHeight: '1.8', marginBottom: '16px', textAlign: 'left' }}>
                You insert the Antique Brass Key found behind the White Jet frame in the Museum. With a crisp click, Drawer #07 glides open.
                <br /><br />
                Inside rests the <strong>Overgrown Botanical Map</strong> pointing directly toward the concealed ivy gate in the south, surrounded by an emergency stash: mounds of Dark, Milk, and Meethi chocolates (dhayeeeer saari!), Kinder Joys, and a jar of Nutella.
              </p>
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px dashed var(--color-warm-peach)', padding: '12px', marginBottom: '18px', textAlign: 'left' }}>
                <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', marginBottom: '4px' }}>
                  STICKY NOTE FROM TED:
                </div>
                <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  "For my 11/10 baddie when she needs sugar or when she hits me with 3hm. Now take this botanical map to the ivy gate in the south valley!"
                </div>
              </div>
              <div className="pixel-badge pixel-badge-gold font-mono" style={{ marginBottom: '20px' }}>
                THE SECRET GARDEN IS NOW ACCESSIBLE
              </div>
              <button 
                onClick={() => {
                  unlockGarden();
                  onClose();
                }} 
                className="pixel-btn pixel-btn-peach font-display" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                POCKET BOTANICAL MAP &amp; CHOCOLATES
              </button>
            </div>
          ) : (
            <div>
              <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', marginBottom: '16px' }}>
                The drawer is tightly locked with an antique brass lock. A small brass plaque reads:
                <br /><em style={{ color: 'var(--color-warm-peach)' }}>"The key is kept behind her private jet vision in the Museum of Beenish."</em>
              </p>
              <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-display" style={{ width: '100%', justifyContent: 'center' }}>
                SEARCH THE MUSEUM FOR THE KEY
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. TALK TO TED
  if (activeObject.type === 'bureau_desk' || activeObject.type === 'npc_ted') {
    const getTedQuote = () => {
      switch (state.currentLocation) {
        case 'hub':
          return "Walking through this valley with you... there is nowhere else in the world I'd rather be. Which place should we explore next, Beenie?";
        case 'bureau':
          return "I spent three days verifying allegation #03 for your case file. Can confirm: completely, objectively an 11/10 baddie. Did you check Drawer #07?";
        case 'museum':
          return "They put all these machines and trophies up, but you're still the only true masterpiece in this entire gallery, Beenie. (P.S. Check behind the White Jet frame!)";
        case 'court':
          return "I may be wearing the judge's wig, but let the record state: when you say 3hm, it is 100% my fault, and you deserve all the chocolates in the universe.";
        case 'archive':
          return "Every single song and memory in these crystals is etched into my heart forever. That email thread where it all started? Best day of my life.";
        case 'observatory':
          return "Looking at these five dream houses... from the Islamabad living room with the giant sofa for my choti si Beenie, to the mountain castle where you rule as Queen... I can't wait to build all of them with you.";
        case 'garden':
          return "Come sit beside me on the bench under the willow tree, Beenie... I wrote something just for you.";
        default:
          return "I've been working on this for weeks. Happy birthday, Beenie.";
      }
    };

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <CompanionBoyfriend pose="thumbsup" initialQuote={getTedQuote()} />
          <div style={{ marginTop: '20px' }}>
            <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
              KEEP EXPLORING TOGETHER
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
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              MUSEUM OF BEENISH // PERSONAL EXHIBITS
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Portrait 1: Kawasaki Ninja H2R & Dodge Challenger */}
          {activeObject.type === 'museum_portrait_1' && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                [ MACHINE GALLERY &bull; ARTIFACT #01 ]
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
                [ THE PROPHECY GALLERY &bull; ARTIFACT #02 ]
              </div>
              <h3 className="font-display" style={{ color: 'var(--color-dream-lilac)', fontSize: '1.15rem', marginBottom: '8px' }}>
                THE WHITE/GREY PRIVATE JET VISION
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '16px' }}>
                A documented vision: Meri Beenie stepping down the stairs of a sleek white and grey private jet in a white dress, while Ted stands on the tarmac with his mouth hanging open in sheer, helpless awe.
              </p>
              <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontStyle: 'italic', marginBottom: '20px' }}>
                "Looking at you with my mouth open is my permanent natural state anyway."
              </div>

              {/* Secret Key Behind Frame */}
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px dashed var(--color-lantern-gold)', padding: '16px', marginBottom: '20px' }}>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.9rem', marginBottom: '6px' }}>
                  SECRET ITEM DISCOVERED BEHIND FRAME
                </div>
                <p className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.82rem', marginBottom: '12px' }}>
                  {hasBrassKey 
                    ? 'You have already taken the Antique Brass Key from behind this frame.'
                    : 'A small antique brass key is tucked behind the canvas. It opens Drawer #07 in the Bureau of Unreasonable Boyfriends!'}
                </p>
                {!hasBrassKey && (
                  <button 
                    onClick={() => {
                      soundEngine.playStarChime();
                      inventory.push('brass_key');
                      examineExhibit('exhibit_white_jet');
                      recoverStar(2, 'museum_complete');
                      onClose();
                    }}
                    className="pixel-btn pixel-btn-primary font-display"
                  >
                    TAKE BRASS KEY
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Achievements: Cricket & Badminton Champion */}
          {isAchieve && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                [ HALL OF HONORS &bull; ARTIFACT #03 ]
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
                [ HERITAGE RELIEF MAP &bull; ARTIFACT #04 ]
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
        <div className="pixel-modal-backdrop" onClick={onClose}>
          <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
              [ SECRET BENCH NOTE ]
            </div>
            <h3 className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginBottom: '10px' }}>
              NOTE BEHIND THE JUDGE'S BENCH
            </h3>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
              "P.S. There never were any flaws. You are completely and wonderfully perfect to me, Beenie. ♡"
            </p>
            <button onClick={onClose} className="pixel-btn pixel-btn-peach font-display" style={{ width: '100%', justifyContent: 'center' }}>
              KEEP SECRET NOTE
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>COURT OF ABSOLUTELY NO FLAWS</span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', marginBottom: '6px' }}>
              [ CASE NO. 00-PERFECT &bull; THE STATE VS. BEENISH ]
            </div>
            <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '10px' }}>
              TRIAL PROCEEDINGS: THE "3HM" &amp; PAISAY INDICTMENT
            </h3>

            {courtStep === 0 && (
              <div>
                <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.6' }}>
                  The prosecution has alleged that Beenish possesses flaws (such as hitting her boyfriend with "3hm" and demanding endless chocolates and paisay). Search the evidence records now:
                </p>
                <button
                  disabled={isSearchingCourt}
                  onClick={() => {
                    soundEngine.playPaperRustle();
                    setIsSearchingCourt(true);
                    setTimeout(() => {
                      setIsSearchingCourt(false);
                      setCourtStep(1);
                    }, 800);
                  }}
                  className="pixel-btn pixel-btn-primary font-display"
                >
                  {isSearchingCourt ? 'SEARCHING ARCHIVES...' : 'SEARCH EVIDENCE FOR FLAWS'}
                </button>
              </div>
            )}

            {courtStep === 1 && (
              <div>
                <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '12px', border: '1px solid var(--color-twilight-blue)', marginBottom: '14px', textAlign: 'left' }}>
                  <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.8rem', fontWeight: 600 }}>
                    PROSECUTION REPORT: 0 FLAWS FOUND
                  </div>
                  <div className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.8rem', marginTop: '4px' }}>
                    The prosecution demands an immediate statement from the defense counsel regarding her 11/10 baddie status and chocolate demands.
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playGavel();
                    setCourtStep(2);
                  }}
                  className="pixel-btn pixel-btn-peach font-display"
                >
                  CALL OBJECTION
                </button>
              </div>
            )}

            {courtStep >= 2 && (
              <div>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', margin: '10px 0' }}>
                  "OBJECTION! THE DEFENSE IS UNCONDITIONALLY BIASED!"
                </div>
                <div className="font-mono" style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', fontSize: '0.85rem', color: 'var(--color-moon-cream)', textAlign: 'left', marginBottom: '16px', lineHeight: '1.7' }}>
                  <div><strong>STATEMENT BY TED:</strong> "When Beenish says '3hm', it is 100% my fault! And as for demanding dhayeeer saaray paisay and mounds of chocolates—she deserves every single rupee and chocolate bar in the entire cosmos!"</div>
                  <div style={{ color: 'var(--color-rose-glow)', marginTop: '8px', fontWeight: 'bold' }}>
                    ★ VERDICT: NOT GUILTY ON ALL COUNTS ★
                  </div>
                </div>
                <button 
                  onClick={() => {
                    reachVerdict();
                    recoverStar(3, 'court_complete');
                    onClose();
                  }}
                  className="pixel-btn pixel-btn-primary font-display" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  ACQUIT DEFENDANT WITH FULL HONORS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. ARCHIVE MEMORY CRYSTALS
  if (activeObject.type.startsWith('archive_crystal_')) {
    const memoryIdx = activeObject.type === 'archive_crystal_1' ? 0 : activeObject.type === 'archive_crystal_2' ? 1 : 2;
    const memory = ARCHIVE_MEMORIES[memoryIdx];

    const handlePlayBolNa = () => {
      soundEngine.playBolNaHalkeHalke();
      setPlayingSong(true);
      setTimeout(() => setPlayingSong(false), 5000);
    };

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-dream-lilac)', fontSize: '0.75rem' }}>
              MEMORY ARTIFACT // {memory.dateOrMoment}
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <h3 className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '1.05rem', marginBottom: '14px' }}>
            {memory.title}
          </h3>

          {/* Special Interactive Render: The 3 Core Anthems */}
          {memory.id === 'mem_songs' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', border: '1px solid var(--color-twilight-blue)', marginBottom: '16px' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', marginBottom: '10px', textTransform: 'uppercase' }}>
                OUR THREE ANTHEMS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-lantern-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--color-lantern-gold)' }}>1. Bol Na Halke Halke</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the quiet, tender evenings where no words are needed.</span>
                  </div>
                  <button 
                    onClick={handlePlayBolNa}
                    className="pixel-btn pixel-btn-ghost font-mono"
                    style={{ fontSize: '0.7rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
                  >
                    {playingSong ? 'PLAYING...' : 'PLAY MELODY'}
                  </button>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-rose-glow)' }}>
                  <strong style={{ color: 'var(--color-rose-glow)' }}>2. Mohabbat Jisko Bakhsh De Zindagi</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the kind of love that doesn’t bend and never ends.</span>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-warm-peach)' }}>
                  <strong style={{ color: 'var(--color-warm-peach)' }}>3. Lo Maan Liya Humne Hai Nahi Tumko</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the sweet ache of missing each other when miles feel too long.</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Interactive Render: 2 AM White Pasta & Sweets */}
          {memory.id === 'mem_white_pasta' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', border: '1px solid var(--color-twilight-blue)', marginBottom: '16px' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-warm-peach)', marginBottom: '8px' }}>[LATE NIGHT MENU]</div>
              <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7' }}>
                Steaming hot white pasta cooked to perfection, piles of Kinder Joys cracked open, jars of Nutella, and big midnight bowls of Koko Krunch. Eating good food with you and listening to you talk beats any fancy restaurant in the world.
              </p>
            </div>
          )}

          {/* Special Interactive Render: binishieeees@gmail.com */}
          {memory.id === 'mem_email_origin' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-lantern-gold)', padding: '14px', textAlign: 'center', marginBottom: '16px' }}>
              <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                CLASSIFIED ORIGIN RECORD // binishieeees@gmail.com
              </span>
              <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--color-warm-peach)', marginTop: '6px' }}>
                "Where everything began. If I could relive that first email thread a thousand times, I would choose you every single time."
              </p>
            </div>
          )}

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', border: '1px solid var(--color-twilight-blue)', marginBottom: '20px' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
              WHY IT MATTERS:
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--color-moon-cream)', fontStyle: 'italic', lineHeight: '1.7' }}>
              "{memory.fullNote}"
            </p>
          </div>

          <button 
            onClick={() => {
              readMemory(memory.id);
              recoverStar(4, 'archive_complete');
              onClose();
            }} 
            className="pixel-btn pixel-btn-primary font-display" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            KEEP IN MY HEART
          </button>
        </div>
      </div>
    );
  }

  // 7. OBSERVATORY TELESCOPE & ALTAR
  if (activeObject.type === 'observatory_telescope') {
    const vig = FUTURE_VIGNETTES.find(v => v.id === selectedVignetteId) || FUTURE_VIGNETTES[0];

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
              TELESCOPE VIEW // THE 5 DREAM HOUSES
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {/* Dream Houses Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {FUTURE_VIGNETTES.map(v => (
              <button
                key={v.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedVignetteId(v.id);
                  viewVignette(v.id);
                }}
                className={`pixel-btn ${selectedVignetteId === v.id ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                style={{ fontSize: '0.72rem', padding: '6px 10px' }}
              >
                {v.title.split('.')[0]}. {v.category}
              </button>
            ))}
          </div>

          {/* Vignette Body */}
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '20px', marginBottom: '20px' }}>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--color-warm-peach)', letterSpacing: '0.12em', marginBottom: '6px' }}>
              [ {vig.category.toUpperCase()} ]
            </div>
            <h4 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.05rem', marginBottom: '8px' }}>
              {vig.title}
            </h4>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '14px', lineHeight: '1.7' }}>
              {vig.description}
            </p>
            <div style={{ backgroundColor: 'var(--color-void-navy)', padding: '12px', borderLeft: '3px solid var(--color-lantern-gold)' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', marginBottom: '4px' }}>
                ARCHITECTURAL BLUEPRINT DETAILS:
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', whiteSpace: 'pre-line', margin: 0 }}>
                {vig.unlockedNote}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            LOOK FORWARD TO THIS
          </button>
        </div>
      </div>
    );
  }

  if (activeObject.type === 'observatory_altar') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', letterSpacing: '0.12em', marginBottom: '8px' }}>
            [ THE UNNAMED CONSTELLATION ]
          </div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '8px' }}>
            A FUTURE WE HAVEN’T FIGURED OUT YET
          </h3>

          {namedConstellation ? (
            <div>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Constellation Name: <strong style={{ color: 'var(--color-lantern-gold)' }}>"{namedConstellation}"</strong>
              </p>
              <div className="pixel-badge pixel-badge-gold font-mono" style={{ marginBottom: '20px' }}>
                INSCRIBED IN THE SKY FOREVER
              </div>
              <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                GAZE AT OUR CONSTELLATION
              </button>
            </div>
          ) : (
            <div>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
                At the center of the observatory is an unnamed constellation. What should our future be called, Beenie?
              </p>
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  if (!constellationInput.trim()) return;
                  setConstellationName(constellationInput.trim());
                  recoverStar(5, 'observatory_complete');
                  onClose();
                }}
              >
                <input
                  type="text"
                  value={constellationInput}
                  onChange={e => setConstellationInput(e.target.value)}
                  placeholder="Name this constellation..."
                  className="font-mono"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--color-midnight-indigo)',
                    border: '1px solid var(--color-twilight-blue)',
                    color: 'var(--color-moon-cream)',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    outline: 'none',
                  }}
                />
                <button type="submit" disabled={!constellationInput.trim()} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                  INSCRIBE IN SKY
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 8. SECRET GARDEN BENCH (THE BIRTHDAY LOVE LETTER)
  if (activeObject.type === 'garden_bench') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', backgroundColor: 'var(--color-void-navy)', padding: '36px 28px', border: '2px solid var(--color-lantern-gold)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px dashed var(--color-twilight-blue)', paddingBottom: '16px' }}>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              October 27 &bull; For Beenish
            </div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.25rem', marginBottom: '4px' }}>
              {BIRTHDAY_LETTER.title}
            </div>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.9rem' }}>
              {BIRTHDAY_LETTER.salutation}
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: '1.9', color: 'var(--color-moon-cream)', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {BIRTHDAY_LETTER.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed var(--color-twilight-blue)', paddingTop: '16px', textAlign: 'right', marginBottom: '20px' }}>
            <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.85rem' }}>{BIRTHDAY_LETTER.signoff}</div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginTop: '4px' }}>Ted</div>
            <div className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.95rem', marginTop: '10px', fontStyle: 'italic' }}>
              "{BIRTHDAY_LETTER.postscript}"
            </div>
          </div>

          <button 
            onClick={() => {
              recoverStar(6, 'garden_complete');
              recoverStar(7);
              onClose();
            }} 
            className="pixel-btn pixel-btn-peach font-display" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            SIT TOGETHER IN PEACE
          </button>
        </div>
      </div>
    );
  }

  // 9. BIRTHDAY CAKE & MOMENT FOR BEENISH
  if (activeObject.type === 'birthday_cake') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div 
          className="pixel-modal-content pixel-panel pixel-panel-gold" 
          onClick={e => e.stopPropagation()} 
          style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)', padding: '28px' }}
        >
          <div className="pixel-panel-header" style={{ marginBottom: '18px' }}>
            <div>
              <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem', letterSpacing: '0.12em' }}>
                OCTOBER 27 &bull; CENTRAL PLAZA
              </span>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.15rem', marginTop: '2px' }}>
                A Birthday Moment For Beenish
              </h2>
            </div>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

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
                  A two-tier celebration cake rests beside a steaming bowl of hot White Pasta, mounds of Kinder Joy, and a jar of Nutella on the linen runner under the evening sky. Three candles flicker gently in the quiet breeze.
                </p>
                <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-warm-peach)', fontStyle: 'italic' }}>
                  "Before you explore the rest of the valley, make a wish, Beenie."
                </p>
              </div>

              <button
                onClick={() => {
                  soundEngine.playBlowCandles();
                  soundEngine.playBirthdayJingle();
                  setCandlesBlown(true);
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
                  [The flames drift away into three thin curls of lavender smoke.]
                </div>
                <p className="font-mono" style={{ fontSize: '0.92rem', color: 'var(--color-moon-cream)', marginBottom: '14px' }}>
                  May this year bring you every blessing, peace of mind, high honors, and dhayeeer saaray paisay. I'm right beside you, cheering for you through all of it.
                </p>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', textAlign: 'right', fontSize: '0.95rem' }}>
                  — Ted
                </div>
              </div>

              <button
                onClick={onClose}
                className="pixel-btn pixel-btn-peach font-display"
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                Continue The Expedition
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 10. OVERWORLD SIGNPOST
  if (activeObject.type === 'signpost') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', marginBottom: '8px' }}>
            [ VALLEY GUIDEPOST ]
          </div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginBottom: '14px' }}>
            VALLEY OF THE STARS GUIDEPOST
          </h3>
          <div className="font-mono" style={{ textAlign: 'left', lineHeight: '2.0', fontSize: '0.85rem', color: 'var(--color-moon-cream)', backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', marginBottom: '20px', border: '1px solid var(--color-twilight-blue)' }}>
            <div>&bull; <strong>WEST:</strong> Bureau of Unreasonable Boyfriends (Start here)</div>
            <div>&bull; <strong>NORTH:</strong> The Museum of Beenish</div>
            <div>&bull; <strong>EAST:</strong> Court of Absolutely No Flaws</div>
            <div>&bull; <strong>SOUTHEAST:</strong> Archive of Things That Happened</div>
            <div>&bull; <strong>HILLTOP TRAIL:</strong> Observatory of Future Stars</div>
            <div>&bull; <strong>GARDEN GATE:</strong> {state.secretGardenUnlocked ? 'The Secret Garden (Open)' : 'Concealed Ivy Gate (Locked)'}</div>
          </div>
          <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            CLOSE GUIDEPOST
          </button>
        </div>
      </div>
    );
  }

  // 11. SECRET GARDEN GATE (LOCKED HINT)
  if (activeObject.id === 'door_garden' && !state.secretGardenUnlocked) {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.78rem', letterSpacing: '0.12em', marginBottom: '8px' }}>
            [ CONCEALED IVY GATE &bull; LOCKED ]
          </div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginBottom: '10px' }}>
            CONCEALED IVY GATE
          </h3>
          <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '16px' }}>
            Dense ivy and wild roses twist around an old iron gate. A weathered wooden plaque reads:
          </p>
          <div className="font-mono" style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '14px', color: 'var(--color-warm-peach)', fontSize: '0.82rem', lineHeight: '1.7', marginBottom: '20px' }}>
            "The key is hidden behind the White Jet frame in the Museum of Beenish.
            It opens Bureau Drawer #07, where the Botanical Map rests."
          </div>
          <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            FOLLOW THE CLUES
          </button>
        </div>
      </div>
    );
  }

  return null;
};
