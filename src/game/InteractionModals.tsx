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

  // Sub-states
  const [selectedReportId, setSelectedReportId] = useState<string>('hair');
  const [courtStep, setCourtStep] = useState<number>(0);
  const [isSearchingCourt, setIsSearchingCourt] = useState<boolean>(false);
  const [constellationInput, setConstellationInput] = useState<string>('');
  const [selectedVignetteId, setSelectedVignetteId] = useState<string>('fut_photoshoot');

  if (!activeObject) return null;

  // 1. FILING CABINET (BUREAU)
  if (activeObject.type === 'filing_cabinet') {
    const report = BUREAU_REPORTS.find(r => r.id === selectedReportId) || BUREAU_REPORTS[0];

    const handleStamp = () => {
      soundEngine.playStamp();
      stampBureau();
    };

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <div>
              <span className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem' }}>BUREAU CASE FILE #001</span>
              <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginTop: '2px' }}>
                REASONS BEENISH IS UNREASONABLY ADORABLE
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
                {r.title} {readReports.includes(r.id) && '✓'}
              </button>
            ))}
          </div>

          {/* Report Body */}
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px', lineHeight: '1.7' }}>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-dusty-lavender)', marginBottom: '8px' }}>
              <div><strong>SUBJECT:</strong> {report.subject}</div>
              <div><strong>INVESTIGATOR:</strong> {report.investigator}</div>
              <div><strong>OBJECTIVITY:</strong> <span style={{ color: 'var(--color-rose-glow)' }}>{report.objectivity}</span></div>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-warm-peach)', textTransform: 'uppercase' }}>FINDING:</div>
              <p style={{ fontFamily: report.id === 'soft_heart' ? 'var(--font-body)' : 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--color-moon-cream)', fontStyle: report.id === 'soft_heart' ? 'italic' : 'normal' }}>
                "{report.finding}"
              </p>
            </div>

            {/* Special Eyes Incident Gag */}
            {report.id === 'eyes' && (
              <div style={{ textAlign: 'center', margin: '12px 0', backgroundColor: 'var(--color-void-navy)', padding: '10px' }}>
                <div style={{ display: 'inline-block', transform: 'rotate(-25deg)' }}>
                  <CompanionBoyfriend pose="blush" initialQuote="I am temporarily incapacitated by looking directly at her eyes!" />
                </div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-rose-glow)', marginTop: '6px' }}>
                  [INVESTIGATOR HAS COLLAPSED FROM OVERWHELMING ADORATION]
                </div>
              </div>
            )}

            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', backgroundColor: 'rgba(243, 183, 156, 0.1)', padding: '8px' }}>
              {report.caption}
            </div>
          </div>

          {/* Official Stamp */}
          <div style={{ textAlign: 'center' }}>
            {bureauStamped ? (
              <div className="font-display" style={{ color: 'var(--color-rose-glow)', fontSize: '1.1rem', border: '3px solid var(--color-rose-glow)', padding: '8px 16px', display: 'inline-block', transform: 'rotate(-3deg)' }}>
                ★ SUBJECT IS EXTREMELY LOVED. CASE CLOSED. ★
              </div>
            ) : (
              <button onClick={handleStamp} className="pixel-btn pixel-btn-primary font-display" style={{ padding: '12px 24px' }}>
                STAMP OFFICIAL CASE FILE 📑
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
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{hasBrassKey ? '🗝️ 🗺️ 🌹' : '🔒'}</div>
          <h2 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '8px' }}>
            {hasBrassKey ? 'DESK DRAWER #07 UNLOCKED!' : 'LOCKED DESK DRAWER #07'}
          </h2>

          {hasBrassKey ? (
            <div>
              <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', marginBottom: '16px' }}>
                You insert the Antique Brass Key from the museum. With a crisp click, the drawer slides open!
                Inside lies an <strong>Overgrown Botanical Map</strong> with dried lavender petals, pointing toward the concealed ivy gate in the Valley!
              </p>
              <div className="pixel-badge pixel-badge-gold" style={{ marginBottom: '20px' }}>
                ✨ THE SECRET GARDEN IS NOW PERMANENTLY ACCESSIBLE!
              </div>
              <button 
                onClick={() => {
                  unlockGarden();
                  onClose();
                }} 
                className="pixel-btn pixel-btn-peach font-display" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                POCKET THE BOTANICAL MAP
              </button>
            </div>
          ) : (
            <div>
              <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7', marginBottom: '16px' }}>
                The drawer is tightly locked with an antique brass lock. A small inscription reads:
                <br /><em style={{ color: 'var(--color-warm-peach)' }}>"The key is kept where her portraits reside (Museum of Beenish)."</em>
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
          return "The stars fell all across the Valley, but honestly, walking out here with you makes the whole sky bright anyway. Where should we go next? ♡";
        case 'bureau':
          return "I spent three days verifying allegation #03 for your case file. Can confirm: completely, objectively adorable. Did you check Drawer #07?";
        case 'museum':
          return "They put all these exhibits up, but you're still the only true masterpiece in this entire gallery, Beenie. (P.S. Did you check behind the frame?)";
        case 'court':
          return "I may be wearing the judge's wig, but let the record state that I am 100% unconditionally biased in your favor!";
        case 'archive':
          return "Every single memory in these crystals is etched into my heart forever. That ordinary conversation? It made my entire year.";
        case 'observatory':
          return "Looking through this telescope into the future... whatever chapters we write together, I know it's going to be my favorite adventure.";
        case 'garden':
          return "Come sit beside me on the bench under the willow tree, Beenie... I wrote something for you. ♡";
        default:
          return "I've been working on this expedition for weeks! Hope you're loving every step, Beenie ♡";
      }
    };

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-peach" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <CompanionBoyfriend pose="thumbsup" initialQuote={getTedQuote()} />
          <div style={{ marginTop: '20px' }}>
            <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
              KEEP EXPLORING TOGETHER ♡
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
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
              MUSEUM OF BEENISH // EXHIBITION ARCHIVE
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          {isPortrait2 && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🖼️</div>
              <h3 className="font-display" style={{ color: 'var(--color-dream-lilac)', fontSize: '1.1rem', marginBottom: '6px' }}>
                PORTRAIT #02: THE ELEGANT GAZE
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '16px' }}>
                "Even someone who only caught a glimpse would stop and remember."
              </p>

              {/* Secret Key Behind Frame */}
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px dashed var(--color-lantern-gold)', padding: '16px', marginBottom: '20px' }}>
                <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.9rem', marginBottom: '6px' }}>
                  🗝️ SECRET ITEM DISCOVERED BEHIND FRAME!
                </div>
                <p className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', marginBottom: '12px' }}>
                  {hasBrassKey 
                    ? 'You have already recovered the Antique Brass Key from behind this portrait!'
                    : 'A small antique brass key is taped to the back of the frame! (Unlocks Drawer #07 in the Bureau)'}
                </p>
                {!hasBrassKey && (
                  <button 
                    onClick={() => {
                      soundEngine.playStarChime();
                      inventory.push('brass_key');
                      examineExhibit('ex_glance');
                      recoverStar(2, 'museum_complete');
                      onClose();
                    }}
                    className="pixel-btn pixel-btn-primary font-display"
                  >
                    TAKE BRASS KEY 🗝️
                  </button>
                )}
              </div>
            </div>
          )}

          {activeObject.type === 'museum_portrait_1' && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🖼️</div>
              <h3 className="font-display" style={{ color: 'var(--color-dream-lilac)', fontSize: '1.1rem', marginBottom: '6px' }}>
                PORTRAIT #01: UNCONTROLLABLE LAUGHTER
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '20px' }}>
                "The world sees a stunning girl. I get to see the exact moment your laughter fills the room and makes everything lighter."
              </p>
              <button onClick={() => { examineExhibit('ex_laughter'); onClose(); }} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                RETURN TO GALLERY
              </button>
            </div>
          )}

          {isAchieve && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '6px' }}>
                THE POSITION HOLDER ARTIFACT
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '16px' }}>
                An exceptionally rare specimen. Known abilities: Working tirelessly, achieving top honors, and somehow still being the cutest human in the room.
              </p>
              <div style={{ fontStyle: 'italic', color: 'var(--color-warm-peach)', marginBottom: '20px' }}>
                "I am so endlessly proud of everything you accomplish, Beenie."
              </div>
              <button onClick={() => { examineExhibit('ex_position'); onClose(); }} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                HONOR THE POSITION HOLDER
              </button>
            </div>
          )}

          {isPhenom && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>✨</div>
              <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '6px' }}>
                THE UNEXPLAINABLE BEENISH PHENOMENON
              </h3>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '16px' }}>
                Scientists have spent years studying this phenomenon without reaching a consensus. Her boyfriend has reached the following conclusion:
              </p>
              <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--color-warm-peach)', fontWeight: 'bold', margin: '14px 0 24px' }}>
                "Bas meri Beenish hain. Samajh nahi aata, bas hain."
              </div>
              <button onClick={() => { examineExhibit('ex_phenomenon'); onClose(); }} className="pixel-btn pixel-btn-peach font-display" style={{ width: '100%', justifyContent: 'center' }}>
                ACCEPT THE PHENOMENON ♡
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💌</div>
            <h3 className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginBottom: '10px' }}>
              SECRET NOTE BEHIND JUDGE'S BENCH
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
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚖️ 🔨</div>
            <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '10px' }}>
              TRIAL PROCEEDINGS: STATE VS. BEENISH
            </h3>

            {courtStep === 0 && (
              <div>
                <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  The prosecution has alleged that Beenish possesses flaws. Search the evidence records now:
                </p>
                <button
                  disabled={isSearchingCourt}
                  onClick={() => {
                    soundEngine.playPaperRustle();
                    setIsSearchingCourt(true);
                    setTimeout(() => {
                      setIsSearchingCourt(false);
                      setCourtStep(1);
                    }, 1000);
                  }}
                  className="pixel-btn pixel-btn-primary font-display"
                >
                  {isSearchingCourt ? 'SEARCHING ARCHIVES...' : 'SEARCH EVIDENCE FOR FLAWS 🔍'}
                </button>
              </div>
            )}

            {courtStep === 1 && (
              <div>
                <p className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.9rem', marginBottom: '14px' }}>
                  Prosecution found 0 records! They now ask the boyfriend for an honest statement.
                </p>
                <button
                  onClick={() => {
                    soundEngine.playGavel();
                    setCourtStep(2);
                  }}
                  className="pixel-btn pixel-btn-peach font-display"
                >
                  SHOUT: OBJECTION! 📢
                </button>
              </div>
            )}

            {courtStep >= 2 && (
              <div>
                <div className="font-display" style={{ color: 'var(--color-rose-glow)', fontSize: '1.3rem', margin: '14px 0' }}>
                  ★ VERDICT: NOT GUILTY ★
                </div>
                <div className="font-mono" style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', fontSize: '0.85rem', color: 'var(--color-moon-cream)', textAlign: 'left', marginBottom: '16px' }}>
                  <div><strong>FINDING:</strong> The defense is hopelessly biased, the prosecution has no evidence, and the judge has decided to go home.</div>
                  <div style={{ color: 'var(--color-dusty-lavender)', marginTop: '6px' }}>
                    <em>"Notice: This case may be reopened if the boyfriend ever develops a functioning sense of objectivity."</em>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    reachVerdict();
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

    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-dream-lilac)', fontSize: '0.75rem' }}>
              MEMORY ARTIFACT // {memory.dateOrMoment}
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

          <h3 className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '1.05rem', marginBottom: '14px' }}>
            {memory.title}
          </h3>

          {/* Chat transcript simulation for ordinary conversation */}
          {memory.id === 'mem_ordinary' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', border: '1px solid var(--color-twilight-blue)', marginBottom: '16px' }}>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-dusty-lavender)', marginBottom: '8px' }}>RECONSTRUCTED CHAT:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--color-twilight-blue)', padding: '6px 10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-warm-peach)', fontSize: '0.65rem', display: 'block' }}>Beenish:</span>
                  "Hey! Are you awake?"
                </div>
                <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--color-void-navy)', border: '1px solid var(--color-lantern-gold)', padding: '6px 10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-lantern-gold)', fontSize: '0.65rem', display: 'block' }}>Ted:</span>
                  "Yeah! Thinking about you. Everything okay?"
                </div>
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--color-twilight-blue)', padding: '6px 10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-warm-peach)', fontSize: '0.65rem', display: 'block' }}>Beenish:</span>
                  "Yeah, you made my whole day today :)"
                </div>
              </div>
            </div>
          )}

          {/* Audio log simulation for laughter */}
          {memory.id === 'mem_laugh' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2rem' }}>😂</span>
              <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)' }}>
                [AUDIO LOG]: Uncontrollable laughter recorded. Neither party remembers what the joke was. Status: Pure joy.
              </p>
            </div>
          )}

          {/* Classified Memory */}
          {memory.id === 'mem_classified' && (
            <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-lantern-gold)', padding: '12px', textAlign: 'center', marginBottom: '16px' }}>
              <span className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.85rem' }}>★ CLASSIFIED MEMORY DECRYPTED ★</span>
            </div>
          )}

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '16px', border: '1px solid var(--color-twilight-blue)', marginBottom: '20px' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>WHY IT MATTERS:</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-moon-cream)', fontStyle: 'italic', lineHeight: '1.7' }}>
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
            PRESERVE IN HEART ♡
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
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}>
          <div className="pixel-panel-header">
            <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
              TELESCOPE VIEW // FUTURE CHAPTERS
            </span>
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost font-mono">[X]</button>
          </div>

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
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              >
                {v.title}
              </button>
            ))}
          </div>

          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-twilight-blue)', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
              {vig.sceneVisual === 'photoshoot' && '📸 💃 🤪'}
              {vig.sceneVisual === 'walk' && '🏮 👫 🌙'}
              {vig.sceneVisual === 'reels' && '🎬 🕺 💃'}
              {vig.sceneVisual === 'date' && '🕯️ ☕ 🍽️'}
            </div>
            <h4 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginBottom: '6px' }}>{vig.title}</h4>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '12px' }}>{vig.description}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-warm-peach)', fontStyle: 'italic' }}>
              "{vig.unlockedNote}"
            </p>
          </div>

          <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            LOOK FORWARD TO THIS ♡
          </button>
        </div>
      </div>
    );
  }

  if (activeObject.type === 'observatory_altar') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>✦ ✨ ✦</div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '8px' }}>
            A FUTURE WE HAVEN’T FIGURED OUT YET
          </h3>

          {namedConstellation ? (
            <div>
              <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Constellation Name: <strong style={{ color: 'var(--color-lantern-gold)' }}>"{namedConstellation}"</strong>
              </p>
              <div className="pixel-badge pixel-badge-gold" style={{ marginBottom: '20px' }}>
                ★ INSCRIBED IN THE SKY FOREVER!
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
                    border: '2px solid var(--color-twilight-blue)',
                    color: 'var(--color-moon-cream)',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    outline: 'none',
                  }}
                />
                <button type="submit" disabled={!constellationInput.trim()} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
                  INSCRIBE IN SKY ✦
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
        <div className="pixel-modal-content pixel-panel pixel-panel-gold" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', backgroundColor: 'var(--color-void-navy)', padding: '36px 28px', border: '3px solid var(--color-lantern-gold)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px dashed var(--color-twilight-blue)', paddingBottom: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💌</div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.3rem', marginBottom: '4px' }}>
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

          <div style={{ borderTop: '2px dashed var(--color-twilight-blue)', paddingTop: '16px', textAlign: 'right', marginBottom: '20px' }}>
            <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.85rem' }}>{BIRTHDAY_LETTER.signoff}</div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginTop: '4px' }}>Ted ♡</div>
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
            SIT TOGETHER IN PEACE FOREVER ♡
          </button>
        </div>
      </div>
    );
  }

  // 9. OVERWORLD SIGNPOST
  if (activeObject.type === 'signpost') {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧭</div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginBottom: '14px' }}>
            VALLEY OF THE STARS SIGNPOST
          </h3>
          <div className="font-mono" style={{ textAlign: 'left', lineHeight: '1.9', fontSize: '0.85rem', color: 'var(--color-moon-cream)', backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', marginBottom: '20px' }}>
            <div>↖ <strong>NORTH-WEST:</strong> Bureau of Unreasonable Boyfriends</div>
            <div>↑ <strong>NORTH:</strong> The Museum of Beenish</div>
            <div>↗ <strong>NORTH-EAST:</strong> Court of Absolutely No Flaws</div>
            <div>→ <strong>EAST:</strong> Archive of Things That Happened</div>
            <div>⇡ <strong>HILLTOP:</strong> Observatory of Future Stars</div>
            <div>↘ <strong>SOUTH-EAST:</strong> {state.secretGardenUnlocked ? '🌹 The Secret Garden' : '🔒 Concealed Ivy Gate'}</div>
          </div>
          <button onClick={onClose} className="pixel-btn pixel-btn-primary font-display" style={{ width: '100%', justifyContent: 'center' }}>
            CLOSE SIGNPOST
          </button>
        </div>
      </div>
    );
  }

  // 10. SECRET GARDEN GATE (LOCKED HINT)
  if (activeObject.id === 'door_garden' && !state.secretGardenUnlocked) {
    return (
      <div className="pixel-modal-backdrop" onClick={onClose}>
        <div className="pixel-modal-content pixel-panel pixel-panel-lilac" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔒 🌿 🗝️</div>
          <h3 className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1rem', marginBottom: '10px' }}>
            CONCEALED IVY GATE (LOCKED)
          </h3>
          <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '16px' }}>
            Dense ivy and wild roses twist around an ancient iron gate. A weathered wooden plaque reads:
          </p>
          <div className="font-mono" style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '12px', color: 'var(--color-warm-peach)', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '20px' }}>
            "The key is hidden behind a beloved portrait in the Museum of Beenish.
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
