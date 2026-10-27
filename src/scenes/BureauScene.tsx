import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { BUREAU_REPORTS } from '../data/personalization';
import { BureauReport } from '../types/expedition';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';
import { soundEngine } from '../audio/soundEngine';

export const BureauScene: React.FC = () => {
  const { state, markReportRead, stampBureau, unlockGarden, navigateTo } = useExpedition();
  const { readReports, bureauStamped, inventory } = state;

  const [activeReport, setActiveReport] = useState<BureauReport | null>(null);
  const [lampOn, setLampOn] = useState(true);
  const [isDrawerModalOpen, setIsDrawerModalOpen] = useState(false);
  const [drawerNotice, setDrawerNotice] = useState<string | null>(null);

  const hasBrassKey = inventory.includes('brass_key');

  const handleOpenReport = (report: BureauReport) => {
    soundEngine.playPaperRustle();
    setActiveReport(report);
    markReportRead(report.id);
  };

  const handleInteractDrawer = () => {
    if (hasBrassKey) {
      soundEngine.playKeyUnlock();
      unlockGarden();
      setIsDrawerModalOpen(true);
    } else {
      soundEngine.playClick();
      setDrawerNotice("The bottom drawer is sealed with an antique brass lock. An inscription reads: 'The key is kept where her portraits reside (Museum of Beenish).' ");
      setTimeout(() => setDrawerNotice(null), 6000);
    }
  };

  const handleApplyStamp = () => {
    if (bureauStamped) return;
    stampBureau();
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
      {/* Office Header */}
      <div
        className="pixel-panel pixel-panel-peach"
        style={{
          marginBottom: '28px',
          backgroundColor: lampOn ? 'rgba(27, 32, 66, 0.95)' : 'rgba(16, 19, 41, 0.95)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              OFFICIAL GOVERNMENT DIVISION // SECTOR 01
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--color-warm-peach)', margin: '4px 0' }}>
              THE BUREAU OF UNREASONABLE BOYFRIENDS
            </h1>
            <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)' }}>
              "One Investigator. Zero Objectivity. Mountains of Paperwork."
            </p>
          </div>

          {/* Desk Lamp Switch */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setLampOn(!lampOn);
            }}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            title="Toggle Desk Lamp"
          >
            {lampOn ? '💡 LAMP: ON' : '🌑 LAMP: OFF'}
          </button>
        </div>
      </div>

      {/* Office Environment Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Left Column: Filing Cabinet with Incident Folders */}
        <div className="pixel-panel" style={{ backgroundColor: 'var(--color-midnight-indigo)' }}>
          <div className="pixel-panel-header">
            <span className="font-display" style={{ fontSize: '0.85rem', color: 'var(--color-warm-peach)' }}>
              🗄️ CLASSIFIED FILING CABINET
            </span>
            <span className="pixel-badge font-mono" style={{ fontSize: '0.7rem' }}>
              {readReports.length} / {BUREAU_REPORTS.length} READ
            </span>
          </div>

          <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-dusty-lavender)', marginBottom: '16px' }}>
            Select an incident folder to examine official findings:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {BUREAU_REPORTS.map((report) => {
              const isRead = readReports.includes(report.id);
              return (
                <button
                  key={report.id}
                  onClick={() => handleOpenReport(report)}
                  className={`pixel-btn ${isRead ? 'pixel-btn-primary' : 'pixel-btn-peach'} font-mono`}
                  style={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '12px 14px',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>📂</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{report.code}: {report.title}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Subject: {report.subject}</div>
                  </div>
                  {isRead && <span style={{ color: 'var(--color-lantern-gold)' }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Secret Drawer (Plan.txt breadcrumb) */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px dashed var(--color-twilight-blue)' }}>
            <button
              onClick={handleInteractDrawer}
              className={`pixel-btn ${hasBrassKey ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px 14px',
                fontSize: '0.8rem',
              }}
            >
              <span>{hasBrassKey ? '🗝️ UNLOCK DESK DRAWER WITH BRASS KEY' : '🔒 DESK DRAWER #07 (LOCKED)'}</span>
            </button>

            {drawerNotice && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(233, 143, 175, 0.12)',
                  border: '1px solid var(--color-rose-glow)',
                  fontSize: '0.75rem',
                  color: 'var(--color-rose-glow)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.5',
                  animation: 'fadeIn 200ms ease',
                }}
              >
                {drawerNotice}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Wall of Evidence & The Biased Certificate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Framed Wall Certificate */}
          <div
            className="pixel-panel pixel-panel-gold"
            style={{
              backgroundColor: 'var(--color-void-navy)',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-lantern-gold)', letterSpacing: '0.1em' }}>
              OFFICIALLY INSCRIBED CERTIFICATE
            </div>
            <div
              className="font-display"
              style={{
                fontSize: '1.2rem',
                color: 'var(--color-lantern-gold)',
                margin: '10px 0',
                letterSpacing: '0.08em',
              }}
            >
              CERTIFIED: 100% BIASED
            </div>
            <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.5' }}>
              The investigator acknowledges that under no circumstances can he view Beenish with any semblance of scientific detachment.
            </p>
          </div>

          {/* Interactive Bureau Employee (Boyfriend) */}
          <div
            className="pixel-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'var(--color-midnight-indigo)',
              padding: '16px',
            }}
          >
            <CompanionBoyfriend
              pose="thumbsup"
              initialQuote="Oh, you're Beenish? We've been expecting you. Another report has been filed!"
            />
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)' }}>
              <div><strong style={{ color: 'var(--color-warm-peach)' }}>Desk Investigator:</strong> Ted</div>
              <div><strong style={{ color: 'var(--color-warm-peach)' }}>Case Status:</strong> {bureauStamped ? 'Officially Closed' : 'Under Investigation'}</div>
              <div style={{ color: 'var(--color-dusty-lavender)', marginTop: '4px' }}>
                "Review the reports, then stamp the folder to close the case!"
              </div>
            </div>
          </div>

          {/* Master Case Folder Rubber Stamp Action */}
          <div
            className="pixel-panel"
            style={{
              backgroundColor: 'var(--color-void-navy)',
              border: '2px dashed var(--color-warm-peach)',
              textAlign: 'center',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {bureauStamped ? (
              <div style={{ animation: 'scaleUp 300ms ease' }}>
                <div
                  className="font-display"
                  style={{
                    color: 'var(--color-rose-glow)',
                    fontSize: '1.1rem',
                    border: '3px solid var(--color-rose-glow)',
                    padding: '12px 16px',
                    display: 'inline-block',
                    transform: 'rotate(-4deg)',
                    boxShadow: '0 0 12px rgba(233, 143, 175, 0.4)',
                    marginBottom: '8px',
                  }}
                >
                  ★ SUBJECT IS EXTREMELY LOVED. CASE CLOSED. ★
                </div>
                <p className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem' }}>
                  ✓ STAR #01 RECOVERED AND RETURNED TO THE NIGHT SKY!
                </p>
              </div>
            ) : (
              <div>
                <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', marginBottom: '14px' }}>
                  {readReports.length >= 3
                    ? 'All reports examined. Ready for final official verdict:'
                    : `Read at least 3 reports to unlock the official stamp (${readReports.length}/3)`}
                </p>
                <button
                  disabled={readReports.length < 3}
                  onClick={handleApplyStamp}
                  className="pixel-btn pixel-btn-primary font-display"
                  style={{
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    opacity: readReports.length < 3 ? 0.5 : 1,
                    cursor: readReports.length < 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span>STAMP OFFICIAL CASE FILE 📑</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      {activeReport && (
        <div className="pixel-modal-backdrop" onClick={() => setActiveReport(null)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-peach"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}
          >
            {/* Folder Header */}
            <div className="pixel-panel-header">
              <div>
                <span className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem' }}>
                  {activeReport.code} // OFFICIAL INCIDENT DOSSIER
                </span>
                <h3 className="font-display" style={{ color: 'var(--color-warm-peach)', fontSize: '1rem', marginTop: '4px' }}>
                  {activeReport.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
              >
                [X]
              </button>
            </div>

            {/* Structured Report Metadata */}
            <div
              className="font-mono"
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                padding: '14px',
                border: '1px solid var(--color-twilight-blue)',
                fontSize: '0.85rem',
                lineHeight: '1.7',
                marginBottom: '16px',
              }}
            >
              <div><strong style={{ color: 'var(--color-dusty-lavender)' }}>SUBJECT:</strong> {activeReport.subject}</div>
              <div><strong style={{ color: 'var(--color-dusty-lavender)' }}>INVESTIGATOR:</strong> {activeReport.investigator}</div>
              <div><strong style={{ color: 'var(--color-dusty-lavender)' }}>MEASURED OBJECTIVITY:</strong> <span style={{ color: 'var(--color-rose-glow)' }}>{activeReport.objectivity}</span></div>
            </div>

            {/* Findings Text */}
            <div style={{ marginBottom: '20px' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-warm-peach)', textTransform: 'uppercase', marginBottom: '6px' }}>
                OFFICIAL FINDINGS:
              </div>
              <p
                style={{
                  fontFamily: activeReport.id === 'soft_heart' ? 'var(--font-body)' : 'var(--font-mono)',
                  fontSize: activeReport.id === 'soft_heart' ? '1rem' : '0.9rem',
                  color: 'var(--color-moon-cream)',
                  lineHeight: '1.7',
                  fontStyle: activeReport.id === 'soft_heart' ? 'italic' : 'normal',
                }}
              >
                "{activeReport.finding}"
              </p>
            </div>

            {/* Special Visual Gag for The Eyes Incident per Plan.txt */}
            {activeReport.id === 'eyes' && (
              <div style={{ textAlign: 'center', marginBottom: '16px', backgroundColor: 'var(--color-midnight-indigo)', padding: '14px', border: '1px solid var(--color-twilight-blue)' }}>
                <div style={{ display: 'inline-block', transform: 'rotate(-25deg) translateY(6px)', transition: 'transform 0.4s ease' }}>
                  <CompanionBoyfriend pose="blush" initialQuote="I am temporarily incapacitated by looking directly at her eyes!" />
                </div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-rose-glow)', marginTop: '8px' }}>
                  [INVESTIGATOR HAS COLLAPSED FROM ADORATION]
                </div>
              </div>
            )}

            {/* Caption / Evidence Note */}
            <div
              style={{
                backgroundColor: 'rgba(243, 183, 156, 0.08)',
                borderLeft: '3px solid var(--color-warm-peach)',
                padding: '10px 14px',
                marginBottom: '20px',
              }}
            >
              <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)' }}>
                {activeReport.caption}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveReport(null)}
              className="pixel-btn pixel-btn-peach font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              CLOSE FILE FOLDER
            </button>
          </div>
        </div>
      )}

      {/* Drawer Unlocked Modal */}
      {isDrawerModalOpen && (
        <div className="pixel-modal-backdrop" onClick={() => setIsDrawerModalOpen(false)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', backgroundColor: 'var(--color-void-navy)', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🗺️ 🗝️ 🌹</div>
            <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.1rem', marginBottom: '8px' }}>
              THE SECRET DESK DRAWER OPENS!
            </div>
            <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Found: An Overgrown Botanical Map &amp; Dried Lavender Petals
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '18px',
                marginBottom: '20px',
                textAlign: 'left',
                fontSize: '0.9rem',
                color: 'var(--color-moon-cream)',
                lineHeight: '1.7',
              }}
            >
              <p style={{ marginBottom: '8px' }}>
                "You turn the Brass Key. With a crisp metallic click, the drawer slides open."
              </p>
              <p style={{ fontStyle: 'italic', color: 'var(--color-warm-peach)' }}>
                "Inside rests a hand-drawn map pointing toward a hidden gate at the edge of the clearing. The Secret Garden has now been permanently discovered!"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setIsDrawerModalOpen(false);
                  navigateTo('garden');
                }}
                className="pixel-btn pixel-btn-peach font-display"
                style={{ flex: 1, minWidth: '200px', padding: '12px', fontSize: '0.85rem' }}
              >
                GO TO SECRET GARDEN NOW 🌹
              </button>
              <button
                onClick={() => setIsDrawerModalOpen(false)}
                className="pixel-btn pixel-btn-ghost font-display"
                style={{ padding: '12px 18px', fontSize: '0.85rem' }}
              >
                STAY IN BUREAU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
