import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { soundEngine } from '../audio/soundEngine';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';

export const CourtScene: React.FC = () => {
  const { state, reachVerdict } = useExpedition();
  const { courtVerdictReached } = state;

  const [trialStep, setTrialStep] = useState(courtVerdictReached ? 4 : 0);
  const [isSearching, setIsSearching] = useState(false);
  const [showSecretNote, setShowSecretNote] = useState(false);

  const handleSearchFlaws = () => {
    soundEngine.playPaperRustle();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setTrialStep(1); // 0 flaws found
    }, 1200);
  };

  const handleObjection = () => {
    soundEngine.playGavel();
    setTrialStep(2); // Boyfriend objects dramatically
  };

  const handleDeliverVerdict = () => {
    soundEngine.playGavel();
    reachVerdict();
    setTrialStep(4); // Verdict rendered
  };

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px 20px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Courtroom Header */}
      <div
        className="pixel-panel pixel-panel-gold"
        style={{
          marginBottom: '28px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          textAlign: 'center',
        }}
      >
        <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
          SUPREME TRIBUNAL OF AFFECTION // TRIAL INQUIRY
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
            color: 'var(--color-lantern-gold)',
            margin: '6px 0',
          }}
        >
          THE COURT OF ABSOLUTELY NO FLAWS
        </h1>
        <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)' }}>
          "Case File #999: State vs. Beenish Tasaffar (Allegation: Imperfection)"
        </p>
      </div>

      {/* Courtroom Visual Chamber */}
      <div
        className="pixel-panel"
        style={{
          backgroundColor: 'var(--color-void-navy)',
          padding: '28px 20px',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        {/* Judge's Bench with Oversized Wig Character */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '28px',
            position: 'relative',
          }}
        >
          {/* Judge Pixel Sprite with Oversized Wig */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              soundEngine.playClick();
              setShowSecretNote(true);
            }}
            title="Click behind the Judge's bench to inspect"
          >
            <svg width="64" height="60" viewBox="0 0 24 24" shapeRendering="crispEdges" className="pixel-art">
              {/* Oversized White Wig */}
              <rect x="5" y="1" width="14" height="6" fill="#F4EBDD" />
              <rect x="3" y="3" width="18" height="8" fill="#F4EBDD" />
              <rect x="2" y="7" width="5" height="7" fill="#F4EBDD" />
              <rect x="17" y="7" width="5" height="7" fill="#F4EBDD" />
              {/* Face */}
              <rect x="8" y="7" width="8" height="6" fill="#F3B79C" />
              <rect x="9" y="9" width="2" height="2" fill="#101329" />
              <rect x="13" y="9" width="2" height="2" fill="#101329" />
              <rect x="10" y="11" width="4" height="1" fill="#9588BD" />
              {/* Black Judicial Robes */}
              <rect x="6" y="13" width="12" height="10" fill="#1B2042" />
              <rect x="10" y="13" width="4" height="4" fill="#F4EBDD" />
            </svg>

            {/* Bench & Gavel */}
            <div
              style={{
                width: '180px',
                height: '24px',
                backgroundColor: 'var(--color-twilight-blue)',
                boxShadow: '0 -2px 0 var(--color-muted-periwinkle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '-4px',
              }}
            >
              <span style={{ fontSize: '0.7rem' }} className="font-mono">⚖️ THE HON. JUDGE</span>
              <span style={{ fontSize: '0.9rem' }}>🔨</span>
            </div>
          </div>

          <div
            className="font-mono"
            style={{
              marginTop: '10px',
              fontSize: '0.85rem',
              color: 'var(--color-warm-peach)',
              textAlign: 'center',
            }}
          >
            "This court is now in session. Counsel, present your evidence."
          </div>
        </div>

        {/* Defense & Prosecution Benches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Prosecution Desk (Towering Empty Folders) */}
          <div
            style={{
              backgroundColor: 'var(--color-midnight-indigo)',
              border: '2px solid var(--color-twilight-blue)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-rose-glow)', marginBottom: '8px' }}>
              PROSECUTION EVIDENCE DOSSIER
            </div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
            <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)' }}>
              {isSearching
                ? 'Searching archives for flaws...'
                : trialStep >= 1
                ? 'Result: 0 Flaws Found (Investigation Incompetent)'
                : 'Stack of alleged imperfections awaiting examination.'}
            </p>
          </div>

          {/* Defense Desk (Boyfriend) */}
          <div
            style={{
              backgroundColor: 'var(--color-midnight-indigo)',
              border: '2px solid var(--color-twilight-blue)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', marginBottom: '8px' }}>
              LEAD DEFENSE COUNSEL
            </div>
            <CompanionBoyfriend
              pose={trialStep === 2 ? 'thumbsup' : 'idle'}
              initialQuote="I demand this entire trial be dismissed on the grounds that Beenish is undeniably adorable!"
            />
          </div>
        </div>

        {/* Trial Progression Steps */}
        <div style={{ textAlign: 'center' }}>
          {trialStep === 0 && (
            <button
              disabled={isSearching}
              onClick={handleSearchFlaws}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ padding: '14px 28px', fontSize: '0.9rem' }}
            >
              <span>{isSearching ? 'SEARCHING ARCHIVES...' : 'SEARCH EVIDENCE FOR FLAWS 🔍'}</span>
            </button>
          )}

          {trialStep === 1 && (
            <div style={{ animation: 'fadeIn 200ms ease' }}>
              <p className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.9rem', marginBottom: '14px' }}>
                Prosecution found 0 flaws. Prosecution now demands an honest statement from the boyfriend.
              </p>
              <button
                onClick={handleObjection}
                className="pixel-btn pixel-btn-peach font-display"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>SHOUT: OBJECTION! 📢</span>
              </button>
            </div>
          )}

          {trialStep === 2 && (
            <div style={{ animation: 'fadeIn 200ms ease' }}>
              <div
                className="font-display"
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-lantern-gold)',
                  marginBottom: '12px',
                }}
              >
                "OBJECTION! THE DEFENSE IS TOO IN LOVE TO COMPLY!"
              </div>
              <button
                onClick={handleDeliverVerdict}
                className="pixel-btn pixel-btn-primary font-display"
                style={{ padding: '14px 28px', fontSize: '0.9rem' }}
              >
                <span>BANG GAVEL FOR FINAL VERDICT 🔨</span>
              </button>
            </div>
          )}

          {trialStep >= 3 && (
            /* The Official Stamped Verdict */
            <div
              className="pixel-panel pixel-panel-gold"
              style={{
                backgroundColor: 'var(--color-void-navy)',
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'left',
                animation: 'scaleUp 300ms ease',
              }}
            >
              <div className="pixel-panel-header">
                <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                  SUPREME COURT RULING // FINAL DISPOSITION
                </span>
                <span className="pixel-badge pixel-badge-gold">VERDICT RENDERED</span>
              </div>

              <div
                className="font-display"
                style={{
                  fontSize: '1.4rem',
                  color: 'var(--color-rose-glow)',
                  textAlign: 'center',
                  margin: '12px 0',
                }}
              >
                ★ VERDICT: NOT GUILTY ★
              </div>

              <div
                className="font-mono"
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.8',
                  color: 'var(--color-moon-cream)',
                  backgroundColor: 'var(--color-midnight-indigo)',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div><strong>DEFENDANT:</strong> Beenish Tasaffar</div>
                <div><strong>FINDING:</strong> The defense is hopelessly biased, the prosecution has no evidence, and the judge has decided to go home.</div>
                <div style={{ marginTop: '8px', color: 'var(--color-dusty-lavender)' }}>
                  <em>"Notice: This case may be reopened if the boyfriend ever develops a functioning sense of objectivity."</em>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span className="pixel-badge pixel-badge-gold font-mono" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                  ✓ STAR #03 RECOVERED AND ASCENDED TO THE SKY!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secret Note Modal behind Judge's Bench */}
      {showSecretNote && (
        <div className="pixel-modal-backdrop" onClick={() => setShowSecretNote(false)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-peach"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💌</div>
            <div className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginBottom: '10px' }}>
              SECRET NOTE BEHIND THE BENCH
            </div>
            <p
              className="font-mono"
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-moon-cream)',
                lineHeight: '1.7',
                marginBottom: '20px',
              }}
            >
              "P.S. There never were any flaws. You are completely and wonderfully perfect to me, Beenie. ♡"
            </p>
            <button
              onClick={() => setShowSecretNote(false)}
              className="pixel-btn pixel-btn-peach font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              CLOSE SECRET NOTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
