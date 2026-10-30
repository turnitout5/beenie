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
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [judgeComment, setJudgeComment] = useState("This court is now in session. Counsel, present your evidence.");

  const judgeComments = [
    "This court is now in session. Counsel, present your evidence.",
    "Order! Order in the court! Will the defense please stop looking so smitten?",
    "I have evaluated the evidence. The defendant is unequivocally adorable.",
    "This court hereby declares the prosecution utterly outmatched by cuteness.",
  ];

  const handleJudgeClick = () => {
    soundEngine.playGavel();
    const nextComment = judgeComments[Math.floor(Math.random() * judgeComments.length)];
    setJudgeComment(nextComment);
  };

  const handleSearchFlaws = () => {
    soundEngine.playPaperRustle();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setTrialStep(1); // 0 flaws found
    }, 1200);
  };

  const handleRetry = () => {
    soundEngine.playClick();
    setTrialStep(0);
    setJudgeComment("Court reconvened for a re-investigation... still waiting for actual evidence!");
  };

  const handleObjection = () => {
    soundEngine.playGavel();
    setTrialStep(2); // Pagluu objects dramatically
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
            onClick={handleJudgeClick}
            title="Click the Judge to hear judicial rulings"
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
              <span style={{ fontSize: '0.7rem' }} className="font-mono">THE HON. JUDGE</span>
            </div>
          </div>

          <div
            className="font-mono"
            style={{
              marginTop: '10px',
              fontSize: '0.85rem',
              color: 'var(--color-warm-peach)',
              textAlign: 'center',
              backgroundColor: 'var(--color-midnight-indigo)',
              padding: '6px 14px',
              border: '1px solid var(--color-twilight-blue)',
              maxWidth: '480px',
            }}
          >
            "{judgeComment}"
          </div>

          {/* Quick link to peek behind the bench */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowSecretNote(true);
            }}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{ marginTop: '8px', fontSize: '0.7rem', padding: '2px 8px', minHeight: '26px' }}
          >
            [PEEK BEHIND JUDGE'S BENCH]
          </button>
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-rose-glow)', marginBottom: '8px' }}>
                PAGLUU KI PYARI SHIKAYATEN FILE
              </div>
              <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-lantern-gold)', marginBottom: '8px' }}>[DOCUMENTS]</div>
              <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', marginBottom: '12px' }}>
                {isSearching
                  ? 'Searching archives for flaws...'
                  : trialStep >= 1
                  ? 'Result: 0 Flaws Found (Investigation Incompetent)'
                  : 'Stack of alleged imperfections awaiting examination.'}
              </p>
            </div>

            <button
              onClick={() => {
                soundEngine.playPaperRustle();
                setShowEvidenceModal(true);
              }}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              EXAMINE EVIDENCE
            </button>
          </div>

          {/* Defense Desk (Pagluu / Ahmad) */}
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
              LEAD DEFENSE COUNSEL (PAGLUU)
            </div>
            <CompanionBoyfriend
              pose={trialStep === 2 ? 'thumbsup' : 'idle'}
              initialQuote="I demand this entire trial be dismissed on the grounds that Paaaari is undeniably, overwhelmingly adorable!"
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
              <span>{isSearching ? 'SEARCHING ARCHIVES...' : 'SEARCH EVIDENCE FOR FLAWS'}</span>
            </button>
          )}

          {trialStep === 1 && (
            <div style={{ animation: 'fadeIn 200ms ease' }}>
              <p className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.9rem', marginBottom: '14px' }}>
                Prosecution found 0 flaws. Prosecution now demands an honest statement from Pagluu.
              </p>
              <button
                onClick={handleObjection}
                className="pixel-btn pixel-btn-peach font-display"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>CALL OBJECTION</span>
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
                <span>DELIVER FINAL VERDICT</span>
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
                <div><strong>DEFENDANT:</strong> Paaaari / Beghum G (Beenish Tasaffar)</div>
                <div><strong>FINDING:</strong> The defense is hopelessly biased, the prosecution has no evidence, and the judge has decided to go home.</div>
                <div style={{ marginTop: '8px', color: 'var(--color-dusty-lavender)' }}>
                  <em>"Notice: This case may be reopened if Pagluu ever develops a functioning sense of objectivity."</em>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span className="pixel-badge pixel-badge-gold font-mono" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                  ✓ STAR #03 RECOVERED AND ASCENDED TO THE SKY!
                </span>
              </div>

              {/* Retry Investigation Button */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={handleRetry}
                  className="pixel-btn pixel-btn-ghost font-display"
                  style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                >
                  <span>RETRY INVESTIGATION</span>
                </button>
                <button
                  onClick={() => setShowSecretNote(true)}
                  className="pixel-btn pixel-btn-peach font-display"
                  style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                >
                  <span>VIEW BENCH NOTE</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Absurd Evidence Modal */}
      {showEvidenceModal && (
        <div className="pixel-modal-backdrop" onClick={() => setShowEvidenceModal(false)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', backgroundColor: 'var(--color-void-navy)' }}
          >
            <div className="pixel-panel-header">
              <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                PROSECUTION ARCHIVE // FAILED EXHIBITS
              </span>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
              >
                [X]
              </button>
            </div>

            <h3 className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginBottom: '14px' }}>
              ALLEGED IMPERFECTIONS INVESTIGATED:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '12px', borderLeft: '3px solid var(--color-rose-glow)' }}>
                <strong className="font-mono" style={{ color: 'var(--color-rose-glow)', fontSize: '0.8rem', display: 'block' }}>
                  ALLEGED FLAW #01: "THE 'HM HM HM' PROTOCOL VIOLATION"
                </strong>
                <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', marginTop: '4px' }}>
                  Accused of hitting Pagluu with "hm hm hm" whenever he makes a mistake, inducing immediate panic and an emergency order of dark chocolates.
                </p>
                <span className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.7rem' }}>
                  Pagluu's Plea: "Guilty of being completely in the right—when Paaaari says hm hm hm, it is 100% my fault."
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '12px', borderLeft: '3px solid var(--color-warm-peach)' }}>
                <strong className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', display: 'block' }}>
                  ALLEGED FLAW #02: "DHAYEEER SAARAY PAISAY EXTORTION"
                </strong>
                <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', marginTop: '4px' }}>
                  Accused of demanding endless mounds of Kinder Joys, Nutella, Koko Krunch, and "DHAYYERRRR SARYYYYYYYYYY PAISAY".
                </p>
                <span className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.7rem' }}>
                  Finding: Acquitted with highest honors. She deserves every single rupee and chocolate bar in the known universe.
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', padding: '12px', borderLeft: '3px solid var(--color-lantern-gold)' }}>
                <strong className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem', display: 'block' }}>
                  ALLEGED FLAW #03: "11/10 BADDIE, BOLD DEFIANCE"
                </strong>
                <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', marginTop: '4px' }}>
                  Accused of shattering all earthly rating scales by existing as an indisputable 11/10 baddie, rendering Pagluu permanently speechless.
                </p>
                <span className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.7rem' }}>
                  Finding: Irrevocably adored and celebrated forever.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEvidenceModal(false)}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              DISMISS ABSURD CHARGES
            </button>
          </div>
        </div>
      )}

      {/* Secret Note Modal behind Judge's Bench */}
      {showSecretNote && (
        <div className="pixel-modal-backdrop" onClick={() => setShowSecretNote(false)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-peach"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}
          >
          <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', marginBottom: '8px' }}>[BENCH NOTE]</div>
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
