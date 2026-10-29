import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { soundEngine } from '../audio/soundEngine';
import {
  PixelLockIcon,
  PixelUnlockIcon,
  PixelHourglassIcon,
  PixelLanternIcon,
  PixelHornIcon,
  PixelHeartIcon,
  PixelCrownIcon,
  PixelEnvelopeIcon,
  PixelStarIcon,
  PixelRewindIcon,
  PixelEmbraceIcon,
  PixelArrowRightIcon,
  FloatingPixelParticle,
} from '../components/PixelIcons';

/**
 * Handcrafted Pixel-Art SVG Diorama:
 * 1. In "sad" mode (Pre-00:00:00 Dark Timer): Pagluu & Paaaari separated in the cold dark rain, looking lonely and waiting for midnight.
 * 2. In "heavenly" mode (00:00:00 Unlocked): Pagluu & Paaaari wrapped in a tight warm HUG while Pagluu leans in to KISS Paaaari on the cheek/forehead with bursting pink hearts!
 */
const CoupleVignetteSVG: React.FC<{
  mode: 'sad' | 'heavenly';
  kissActive: boolean;
  onKissClick?: () => void;
}> = ({ mode, kissActive, onKissClick }) => {
  if (mode === 'sad') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          userSelect: 'none',
          margin: '8px 0 18px',
        }}
      >
        <svg
          width="260"
          height="120"
          viewBox="0 0 130 60"
          shapeRendering="crispEdges"
          className="pixel-art"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.85))',
          }}
        >
          {/* Cold dark ground shadow */}
          <rect x="10" y="52" width="110" height="4" fill="#05070F" />
          <rect x="16" y="50" width="32" height="3" fill="#0B0F22" />
          <rect x="82" y="50" width="32" height="3" fill="#0B0F22" />

          {/* Rain Clouds above them */}
          <rect x="14" y="4" width="28" height="5" fill="#1C223A" />
          <rect x="18" y="2" width="20" height="3" fill="#252C48" />
          <rect x="88" y="4" width="28" height="5" fill="#1C223A" />
          <rect x="92" y="2" width="20" height="3" fill="#252C48" />

          {/* Falling rain streaks */}
          <rect x="20" y="12" width="1" height="5" fill="#4B5B82" opacity="0.6" />
          <rect x="28" y="16" width="1" height="5" fill="#4B5B82" opacity="0.5" />
          <rect x="35" y="11" width="1" height="5" fill="#4B5B82" opacity="0.6" />
          <rect x="94" y="13" width="1" height="5" fill="#4B5B82" opacity="0.6" />
          <rect x="103" y="16" width="1" height="5" fill="#4B5B82" opacity="0.5" />
          <rect x="110" y="11" width="1" height="5" fill="#4B5B82" opacity="0.6" />

          {/* === LEFT: SAD LONELY PAGLUU (AHMAD) IN THE COLD DARK === */}
          <g transform="translate(20, 22)">
            {/* Hair */}
            <rect x="7" y="2" width="10" height="3" fill="#0C0F20" />
            <rect x="6" y="3" width="12" height="4" fill="#141830" />
            <rect x="5" y="4" width="3" height="4" fill="#141830" />
            <rect x="16" y="4" width="3" height="4" fill="#141830" />
            {/* Face (pale/cold in the dark) */}
            <rect x="7" y="7" width="10" height="7" fill="#C99680" />
            {/* Sad drooping eyebrows & eyes looking down */}
            <rect x="8" y="8" width="2" height="1" fill="#141830" />
            <rect x="14" y="8" width="2" height="1" fill="#141830" />
            <rect x="9" y="10" width="2" height="1" fill="#0C0F20" />
            <rect x="13" y="10" width="2" height="1" fill="#0C0F20" />
            {/* Little teardrop on Pagluu's cheek */}
            <rect x="15" y="11" width="1" height="2" fill="#639BFF" />
            {/* Sad frown */}
            <rect x="10" y="12" width="4" height="1" fill="#5A4B6E" />
            <rect x="9" y="13" width="1" height="1" fill="#5A4B6E" />
            <rect x="14" y="13" width="1" height="1" fill="#5A4B6E" />
            {/* Hoodie (desaturated dark blue) */}
            <rect x="6" y="15" width="12" height="7" fill="#1E2440" />
            <rect x="9" y="15" width="6" height="7" fill="#374069" />
            <rect x="4" y="16" width="2" height="5" fill="#1E2440" />
            <rect x="18" y="16" width="2" height="5" fill="#1E2440" />
            {/* Pants & Shoes */}
            <rect x="7" y="22" width="10" height="4" fill="#0A0C18" />
            <rect x="6" y="26" width="5" height="2" fill="#8C879E" />
            <rect x="13" y="26" width="5" height="2" fill="#8C879E" />
          </g>

          {/* === CENTER: COLD IRON LOCK & CHAIN BETWEEN THEM === */}
          <g transform="translate(57, 25)">
            {/* Chain links */}
            <rect x="-12" y="11" width="12" height="2" fill="#3A415E" />
            <rect x="16" y="11" width="12" height="2" fill="#3A415E" />
            {/* Padlock shackle */}
            <rect x="4" y="2" width="8" height="6" fill="#525B7A" />
            <rect x="6" y="4" width="4" height="4" fill="#080A14" />
            {/* Padlock body */}
            <rect x="2" y="8" width="12" height="10" fill="#2A304A" />
            <rect x="3" y="9" width="10" height="8" fill="#3A4262" />
            {/* Keyhole */}
            <rect x="7" y="11" width="2" height="2" fill="#080A14" />
            <rect x="7" y="13" width="2" height="2" fill="#080A14" />
          </g>

          {/* === RIGHT: BEENISH (PAAAARI) WAITING IN THE DARK === */}
          <g transform="translate(86, 22)">
            {/* Hair with signature white hair streak */}
            <rect x="6" y="2" width="12" height="4" fill="#0C0F20" />
            <rect x="5" y="3" width="14" height="6" fill="#151933" />
            <rect x="4" y="5" width="4" height="8" fill="#151933" />
            <rect x="16" y="5" width="4" height="8" fill="#151933" />
            <rect x="6" y="3" width="2" height="5" fill="#CBD5E1" />
            <rect x="5" y="7" width="2" height="5" fill="#94A3B8" />
            {/* Face */}
            <rect x="7" y="7" width="10" height="7" fill="#C99680" />
            {/* Sad waiting eyes */}
            <rect x="8" y="10" width="2" height="1" fill="#0C0F20" />
            <rect x="14" y="10" width="2" height="1" fill="#0C0F20" />
            <rect x="8" y="11" width="1" height="2" fill="#639BFF" />
            {/* Sad pout */}
            <rect x="11" y="12" width="2" height="1" fill="#8C5872" />
            {/* Scarf & Jacket */}
            <rect x="7" y="14" width="10" height="2" fill="#B8B0A4" />
            <rect x="6" y="16" width="12" height="6" fill="#5A527A" />
            <rect x="8" y="16" width="8" height="6" fill="#7A6B9E" />
            <rect x="4" y="16" width="2" height="5" fill="#5A527A" />
            <rect x="18" y="16" width="2" height="5" fill="#5A527A" />
            {/* Skirt & Boots */}
            <rect x="7" y="22" width="10" height="3" fill="#12162E" />
            <rect x="7" y="25" width="4" height="3" fill="#232947" />
            <rect x="13" y="25" width="4" height="3" fill="#232947" />
          </g>
        </svg>
        <div
          className="font-mono"
          style={{
            fontSize: '0.78rem',
            color: '#7C85A6',
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: '4px',
          }}
        >
          &ldquo;Abhi 31st October ke 00:00:00 nahi bajay... Pagluu is waiting in the cold dark to hug &amp; kiss his Paaaari...&rdquo;
        </div>
      </div>
    );
  }

  // === HEAVENLY MODE: BOTH CHARACTERS HUGGING TIGHTLY & AHMAD KISSING BEENISH! ===
  return (
    <div
      onClick={onKissClick}
      title="Click for an extra birthday hug & kiss from Pagluu!"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        margin: '6px 0 16px',
      }}
    >
      {/* Floating Kiss / Speech Bubble Above Their Hug */}
      <div
        className="font-mono"
        style={{
          background: 'linear-gradient(135deg, #FFF0F6 0%, #FFD6E8 100%)',
          color: '#7A1C4B',
          padding: '8px 18px',
          borderRadius: '999px',
          border: '2px solid #FF85B3',
          boxShadow: '0 6px 20px rgba(255, 105, 180, 0.45), 0 0 15px rgba(255, 255, 255, 0.8)',
          fontSize: '0.86rem',
          fontWeight: 700,
          marginBottom: '10px',
          textAlign: 'center',
          transform: kissActive ? 'scale(1.08) translateY(-3px)' : 'scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.3)',
        }}
      >
        {kissActive
          ? '💋 MUAAAH!! *Tightest Birthday Hug & Forehead Kiss for Meri Paaaari!* 💖✨'
          : '🤗💖 *Hugging Meri Beghum G Tightly* — Happy Birthday Meri Jaan! 💋'}
      </div>

      <svg
        width="280"
        height="165"
        viewBox="0 0 96 58"
        shapeRendering="crispEdges"
        className="pixel-art"
        style={{
          filter: 'drop-shadow(0 8px 22px rgba(255, 105, 180, 0.55))',
          transform: kissActive ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Heavenly Rose-Pink & Golden Glowing Heart Halo Behind the Couple */}
        <rect x="28" y="6" width="16" height="4" fill="#FFB3D1" opacity="0.45" />
        <rect x="52" y="6" width="16" height="4" fill="#FFB3D1" opacity="0.45" />
        <rect x="24" y="10" width="48" height="6" fill="#FFCCE0" opacity="0.5" />
        <rect x="22" y="16" width="52" height="12" fill="#FFE0EE" opacity="0.55" />
        <rect x="26" y="28" width="44" height="8" fill="#FFCCE0" opacity="0.5" />
        <rect x="32" y="36" width="32" height="6" fill="#FFB3D1" opacity="0.45" />
        <rect x="38" y="42" width="20" height="4" fill="#FF99C2" opacity="0.4" />
        <rect x="44" y="46" width="8" height="3" fill="#FF80B3" opacity="0.4" />

        {/* Heavenly Pearlescent Pink & Cream Cloud Cushion Beneath Their Feet */}
        <rect x="18" y="48" width="60" height="6" fill="#FFD9EC" />
        <rect x="14" y="50" width="68" height="5" fill="#FFF0F7" />
        <rect x="22" y="46" width="16" height="3" fill="#FFF5FA" />
        <rect x="40" y="45" width="18" height="4" fill="#FFFFFF" />
        <rect x="60" y="46" width="14" height="3" fill="#FFF5FA" />

        {/* Floating Pixel Hearts & Golden Sparkles Around Their Embrace */}
        {/* Left Floating Pink Heart */}
        <g transform={kissActive ? 'translate(10, 12)' : 'translate(12, 16)'}>
          <rect x="1" y="0" width="2" height="1" fill="#FF4D8D" />
          <rect x="4" y="0" width="2" height="1" fill="#FF4D8D" />
          <rect x="0" y="1" width="7" height="2" fill="#FF6FA5" />
          <rect x="1" y="3" width="5" height="1" fill="#FF4D8D" />
          <rect x="2" y="4" width="3" height="1" fill="#FF4D8D" />
          <rect x="3" y="5" width="1" height="1" fill="#FF4D8D" />
        </g>

        {/* Right Floating Pink Heart */}
        <g transform={kissActive ? 'translate(78, 11)' : 'translate(76, 15)'}>
          <rect x="1" y="0" width="2" height="1" fill="#FF4D8D" />
          <rect x="4" y="0" width="2" height="1" fill="#FF4D8D" />
          <rect x="0" y="1" width="7" height="2" fill="#FF6FA5" />
          <rect x="1" y="3" width="5" height="1" fill="#FF4D8D" />
          <rect x="2" y="4" width="3" height="1" fill="#FF4D8D" />
          <rect x="3" y="5" width="1" height="1" fill="#FF4D8D" />
        </g>

        {/* Center Top Big Kiss Heart Right Above Their Heads! */}
        <g transform={kissActive ? 'translate(43, 3)' : 'translate(43, 6)'}>
          <rect x="1" y="0" width="3" height="1" fill="#FF2E7E" />
          <rect x="6" y="0" width="3" height="1" fill="#FF2E7E" />
          <rect x="0" y="1" width="10" height="3" fill="#FF5C99" />
          <rect x="1" y="1" width="2" height="1" fill="#FFB8D4" />
          <rect x="1" y="4" width="8" height="2" fill="#FF2E7E" />
          <rect x="2" y="6" width="6" height="1" fill="#FF2E7E" />
          <rect x="3" y="7" width="4" height="1" fill="#E6005C" />
          <rect x="4" y="8" width="2" height="1" fill="#E6005C" />
        </g>

        {/* Golden Star Twinkles */}
        <rect x="20" y="8" width="2" height="2" fill="#F6D78B" />
        <rect x="74" y="7" width="2" height="2" fill="#F6D78B" />
        <rect x="15" y="30" width="2" height="2" fill="#FFF0B3" />
        <rect x="81" y="29" width="2" height="2" fill="#FFF0B3" />

        {/* ============================================================== */}
        {/* THE COUPLE HUGGING & KISSING IN THE CENTER                     */}
        {/* Ahmad (Male, Left) leaning in + kissing Beenish (Female, Right) */}
        {/* ============================================================== */}

        {/* --- BEENISH (PAAAARI - RIGHT SIDE OF EMBRACE) --- */}
        <g transform="translate(44, 18)">
          {/* Golden Birthday Princess Tiara / Crown on Beenish's Head! */}
          <rect x="7" y="-2" width="10" height="2" fill="#F6D78B" />
          <rect x="8" y="-4" width="2" height="2" fill="#FFE89E" />
          <rect x="11" y="-5" width="2" height="3" fill="#FFF4C2" />
          <rect x="14" y="-4" width="2" height="2" fill="#FFE89E" />
          {/* Pink ruby gem in center of crown */}
          <rect x="11" y="-3" width="2" height="1" fill="#FF3B8B" />

          {/* Beenish's Hair - Voluminous dark indigo with lavender highlights & signature White Streak */}
          <rect x="6" y="0" width="12" height="4" fill="#101329" />
          <rect x="5" y="1" width="14" height="6" fill="#1B2042" />
          <rect x="4" y="4" width="3" height="8" fill="#1B2042" />
          <rect x="16" y="4" width="4" height="9" fill="#1B2042" />
          <rect x="13" y="2" width="3" height="1" fill="#C3A9E8" />
          {/* Beenish's Signature White Hair Streak (white-white baal) */}
          <rect x="6" y="1" width="2" height="5" fill="#FFFFFF" />
          <rect x="5" y="5" width="2" height="5" fill="#E0E7FF" />

          {/* Beenish's Face - Warm Peach, tilted slightly toward Ahmad */}
          <rect x="6" y="6" width="10" height="7" fill="#F3B79C" />

          {/* Happy Blushing Closed/Sparkling Eyes receiving the kiss! */}
          <rect x="7" y="8" width="2" height="1" fill="#101329" />
          <rect x="12" y="8" width="2" height="1" fill="#101329" />
          <rect x="7" y="7" width="1" height="1" fill="#F6D78B" />
          <rect x="13" y="7" width="1" height="1" fill="#F6D78B" />

          {/* Extra Rosy Pink Blushing Cheeks! */}
          <rect x="6" y="10" width="3" height="2" fill="#FF66A3" />
          <rect x="13" y="10" width="3" height="2" fill="#FF66A3" />

          {/* Sweet Happy Smile */}
          <rect x="9" y="11" width="3" height="1" fill="#D94B82" />

          {/* Cozy Cream Scarf & Dreamy Pink/Lavender Birthday Dress */}
          <rect x="6" y="13" width="10" height="2" fill="#FFF0F5" />
          <rect x="5" y="15" width="12" height="8" fill="#E888B5" />
          <rect x="7" y="15" width="8" height="8" fill="#FFB3D6" />
          <rect x="5" y="20" width="12" height="1" fill="#F6D78B" />

          {/* Skirt & Boots */}
          <rect x="6" y="23" width="10" height="4" fill="#3B1D4A" />
          <rect x="6" y="27" width="4" height="3" fill="#592E6E" />
          <rect x="12" y="27" width="4" height="3" fill="#592E6E" />
        </g>

        {/* --- AHMAD (PAGLUU - LEFT SIDE OF EMBRACE, LEANING IN & KISSING HER!) --- */}
        <g transform={kissActive ? 'translate(29, 17)' : 'translate(27, 18)'}>
          {/* Hair - Dark navy clusters */}
          <rect x="7" y="0" width="11" height="3" fill="#101329" />
          <rect x="6" y="1" width="13" height="4" fill="#1B2042" />
          <rect x="5" y="3" width="3" height="4" fill="#1B2042" />
          <rect x="9" y="2" width="4" height="1" fill="#434E82" />

          {/* Face - Leaning right toward Beenish's cheek/forehead! */}
          <rect x="8" y="5" width="11" height="7" fill="#F3B79C" />

          {/* Happy Loving Closed Eye (facing right toward Beenish) */}
          <rect x="14" y="7" width="3" height="1" fill="#101329" />
          <rect x="10" y="7" width="2" height="1" fill="#101329" />

          {/* Rosy Blush on Ahmad's Cheek */}
          <rect x="12" y="9" width="3" height="2" fill="#FF77A9" />

          {/* Kissing Lips (Puckered right onto Beenish's cheek/forehead!) */}
          <rect x="18" y="9" width="3" height="2" fill="#E95288" />
          <rect x="19" y="8" width="2" height="1" fill="#FF85B3" />

          {/* Neck & Jacket */}
          <rect x="10" y="12" width="5" height="2" fill="#F3B79C" />
          <rect x="6" y="14" width="12" height="8" fill="#30385F" />
          <rect x="9" y="14" width="7" height="8" fill="#666FA0" />

          {/* Pants & Cream Shoes */}
          <rect x="7" y="22" width="10" height="5" fill="#101329" />
          <rect x="7" y="27" width="5" height="3" fill="#F4EBDD" />
          <rect x="13" y="27" width="5" height="3" fill="#F4EBDD" />
        </g>

        {/* --- INTERLOCKED HUGGING ARMS WRAPPED AROUND EACH OTHER! --- */}
        {/* Ahmad's right arm wrapping all the way around Beenish's waist/back */}
        <rect x="36" y="33" width="22" height="3" fill="#30385F" />
        <rect x="57" y="33" width="3" height="3" fill="#F3B79C" />
        {/* Beenish's left arm wrapping warmly around Ahmad's shoulder/neck */}
        <rect x="35" y="30" width="16" height="3" fill="#E888B5" />
        <rect x="33" y="30" width="3" height="3" fill="#F3B79C" />

        {/* Sparkle Kiss Starburst Right Where His Lips Touch Her Cheek! */}
        <rect x="48" y="24" width="2" height="2" fill="#FFFFFF" />
        <rect x="47" y="25" width="4" height="1" fill="#FF99C8" />
        <rect x="49" y="22" width="2" height="2" fill="#FF3B8B" />
      </svg>

      <div
        className="font-mono"
        style={{
          fontSize: '0.76rem',
          color: '#FFE0EE',
          marginTop: '4px',
          textShadow: '0 1px 6px rgba(122, 28, 75, 0.8)',
        }}
      >
        (Click us anytime for extra birthday hugs &amp; kisses! 💋💖)
      </div>
    </div>
  );
};

export const BootScene: React.FC = () => {
  const { navigateTo } = useExpedition();

  // Compute target: 00:00:00 of October 31 (Month index 9 = October)
  const getTargetTimestamp = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    return new Date(year, 9, 31, 0, 0, 0, 0).getTime();
  }, []);

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [forceUnlocked, setForceUnlocked] = useState<boolean>(false);
  const [simulatedCountdownEnd, setSimulatedCountdownEnd] = useState<number | null>(null);
  const [hasCelebrationFired, setHasCelebrationFired] = useState<boolean>(false);
  const [kissActive, setKissActive] = useState<boolean>(true);
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{ id: number; left: number; type: 'heart' | 'star' | 'petal' | 'crown' | 'sparkle' }>
  >([]);

  const [bootStep, setBootStep] = useState(0);
  const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 });
  const [evadeMessage, setEvadeMessage] = useState('Too much cuteness, let me blush first');
  const [evadeCount, setEvadeCount] = useState(0);
  const [earlyClickMessage, setEarlyClickMessage] = useState<string | null>(null);
  const [sadQuoteIdx, setSadQuoteIdx] = useState(0);
  const runawayBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastSecRef = useRef<number>(-1);

  const targetMs = simulatedCountdownEnd !== null ? simulatedCountdownEnd : getTargetTimestamp();
  const remainingMs = Math.max(0, targetMs - nowMs);
  const isUnlocked = forceUnlocked || remainingMs <= 0;

  const sadQuotes = [
    'Abhi 31st October ke 00:00:00 nahi bajay... Without my Paaaari’s birthday, the whole sky is dark and lonely.',
    'Waqt itna ahista kyun chal raha hai... Pagluu is counting every single heartbeat in the cold rain.',
    'All the hugs, forehead kisses, funny horns, and your starry birthday world are locked behind 00:00:00...',
    'Sabar meri Beghum G... The moment the clock strikes 00:00:00 on 31st October, this darkness turns into heaven.',
  ];

  const evadeQuips = [
    'Nice try, meri Paaaari! 💖',
    'No escaping Pagluu’s hugs today! 🤗',
    'Another kiss first! Muaaah! 💋',
    'Too slow, Beghum G! ✨',
    'You have 7 birthday stars waiting for you!',
    'Pagluu built a whole world for you, chalo na! 🌸',
  ];

  // Ahmad's very sweet birthday wish lines revealed in the Heavenly Pinky Opening
  const noteLines = [
    'To Meri Paaaari, Meri Beghum G, Meri Jaan 💖,',
    '00:00:00 • 31st October is finally here! The dark, lonely wait is over because at this exact midnight, the brightest soul in my universe was born.',
    'Come here first—let your Pagluu pull you into the tightest hug, hold you close, and give you a thousand birthday kisses! (Muaaah! 💋)',
    'Ufff kitu sundar hain meri Paaaari... From your smile to your nakhray to your signature white-white baal, you make my whole life feel like heaven.',
    'May Allah bless every step of your life with endless khushiyan, peace, and every dream your heart desires—and may I spend every 31st October holding you just like this.',
    'I built an entire Valley of the Stars with seven places of our memories waiting just behind this door for you. Happy Birthday, my love! ♥',
  ];

  // Trigger the celebratory burst of funny horns + birthday melody + floating particles
  const triggerMidnightCelebration = useCallback(() => {
    soundEngine.playBirthdayHornFanfare();
    soundEngine.playKissChime();
    setTimeout(() => {
      soundEngine.playBirthdayJingle();
    }, 1500);
    setTimeout(() => {
      soundEngine.startBolNaHalkeHalkeTuneLoop();
    }, 4500);

    const particleTypes: Array<'heart' | 'star' | 'petal' | 'crown' | 'sparkle'> = [
      'heart',
      'star',
      'petal',
      'sparkle',
      'heart',
      'crown',
      'petal',
    ];
    const burst = Array.from({ length: 16 }, (_, idx) => ({
      id: Date.now() + idx,
      left: 8 + Math.random() * 84,
      type: particleTypes[idx % particleTypes.length],
    }));
    setFloatingParticles(burst);
  }, []);

  // Live 1-second / 250ms timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      const rem = Math.max(0, (simulatedCountdownEnd !== null ? simulatedCountdownEnd : getTargetTimestamp()) - current);
      const sec = Math.ceil(rem / 1000);
      if (rem > 0 && sec !== lastSecRef.current) {
        lastSecRef.current = sec;
        soundEngine.playSadTick();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [getTargetTimestamp, simulatedCountdownEnd]);

  // Rotate sad messages during the Dark & Sad Timer
  useEffect(() => {
    if (isUnlocked) return;
    const rot = setInterval(() => {
      setSadQuoteIdx(prev => (prev + 1) % sadQuotes.length);
    }, 5000);
    return () => clearInterval(rot);
  }, [isUnlocked, sadQuotes.length]);

  // Fire celebration the moment `isUnlocked` becomes true!
  useEffect(() => {
    if (isUnlocked && !hasCelebrationFired) {
      setHasCelebrationFired(true);
      triggerMidnightCelebration();
    }
  }, [isUnlocked, hasCelebrationFired, triggerMidnightCelebration]);

  // Gentle automatic kiss & hug pulse in Heavenly mode
  useEffect(() => {
    if (!isUnlocked) return;
    const kissTimer = setInterval(() => {
      setKissActive(prev => !prev);
    }, 2400);
    return () => clearInterval(kissTimer);
  }, [isUnlocked]);

  // Typewriter reveal of the birthday wish lines once unlocked
  useEffect(() => {
    if (!isUnlocked) return;
    soundEngine.startNightAmbience();
    if (bootStep < noteLines.length) {
      const timer = setTimeout(() => {
        soundEngine.playClick();
        setBootStep(prev => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, bootStep, noteLines.length]);

  const handleExtraKiss = () => {
    setKissActive(true);
    soundEngine.playKissChime();
    const extraTypes: Array<'heart' | 'star' | 'petal' | 'sparkle'> = ['heart', 'sparkle', 'petal', 'heart'];
    const extra = Array.from({ length: 8 }, (_, idx) => ({
      id: Date.now() + Math.random() * 1000 + idx,
      left: 20 + Math.random() * 60,
      type: extraTypes[idx % extraTypes.length],
    }));
    setFloatingParticles(prev => [...prev.slice(-16), ...extra]);
  };

  const handleEvade = () => {
    soundEngine.playClick();
    const nextCount = evadeCount + 1;
    setEvadeCount(nextCount);
    setEvadeMessage(evadeQuips[nextCount % evadeQuips.length]);

    const randX = (Math.random() - 0.5) * 240;
    const randY = (Math.random() - 0.5) * 140;
    setEvadeOffset({ x: randX, y: randY });
  };

  const handleAccept = () => {
    soundEngine.playStarChime();
    soundEngine.startBolNaHalkeHalkeTuneLoop();
    navigateTo('hub');
  };

  // Keyboard shortcuts:
  // - Shift + U: Test 5-second countdown / instant unlock for Ahmad
  // - Enter / Space (when unlocked): Reveal all lines or Step Into The Valley
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        setForceUnlocked(true);
        return;
      }
      if (!isUnlocked) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (bootStep < noteLines.length) {
          soundEngine.playClick();
          setBootStep(noteLines.length);
        } else {
          soundEngine.playStarChime();
          soundEngine.startBolNaHalkeHalkeTuneLoop();
          navigateTo('hub');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isUnlocked, bootStep, noteLines.length, navigateTo]);

  // Breakdown remaining time into DD : HH : MM : SS
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad2 = (n: number) => String(n).padStart(2, '0');

  // ============================================================================
  // RENDER 1: DARK & SAD PRE-MIDNIGHT COUNTDOWN SCREEN (Before 00:00:00 Oct 31)
  // ============================================================================
  if (!isUnlocked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 20px',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse at 50% 25%, #0D1124 0%, #060812 58%, #020307 100%)',
          color: '#8E96B8',
        }}
      >
        {/* Falling Dark Rain Streaks Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(105deg, rgba(120, 145, 195, 0.07) 0px, rgba(120, 145, 195, 0.07) 1px, transparent 1px, transparent 28px)',
            opacity: 0.7,
          }}
        />

        {/* Top Gloomy Header */}
        <div style={{ textAlign: 'center', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.75rem',
              color: '#5E678A',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PixelLockIcon size={14} color="#7A84A8" />
            <span>Sealed in the Dark &bull; Waiting for 31st October 00:00:00</span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(1.25rem, 3.2vw, 2rem)',
              color: '#7A84A8',
              letterSpacing: '0.08em',
              margin: 0,
              textShadow: '0 2px 18px rgba(0, 0, 0, 0.9)',
            }}
          >
            NOT YET 00:00:00 ON 31ST OCTOBER...
          </h1>
          <p
            className="font-mono"
            style={{
              color: '#5A6385',
              fontSize: '0.84rem',
              marginTop: '6px',
            }}
          >
            The world is dark, cold, and sad until my Paaaari&apos;s birthday arrives.
          </p>
        </div>

        {/* Sad Separated Characters in the Rain */}
        <CoupleVignetteSVG mode="sad" kissActive={false} />

        {/* Big Melancholic Countdown Timer Box */}
        <div
          style={{
            maxWidth: '620px',
            width: '100%',
            backgroundColor: 'rgba(8, 10, 22, 0.92)',
            border: '2px solid #222944',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.92), inset 0 0 28px rgba(5, 7, 15, 0.9)',
            padding: '24px 20px',
            marginBottom: '20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.74rem',
              color: '#636D92',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Countdown to 00:00:00 &bull; October 31
          </div>

          {/* DD : HH : MM : SS Grid */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '18px',
            }}
          >
            {[
              { label: 'DAYS', val: pad2(days) },
              { label: 'HOURS', val: pad2(hours) },
              { label: 'MINUTES', val: pad2(minutes) },
              { label: 'SECONDS', val: pad2(seconds) },
            ].map((item, idx) => (
              <React.Fragment key={item.label}>
                <div
                  style={{
                    minWidth: '88px',
                    padding: '14px 12px',
                    backgroundColor: '#050711',
                    border: '1px solid #262E4D',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.85)',
                  }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: 'clamp(1.35rem, 3.5vw, 2rem)',
                      color: '#9BA5C9',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {item.val}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.66rem',
                      color: '#515A7A',
                      letterSpacing: '0.14em',
                      marginTop: '6px',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
                {idx < 3 && (
                  <span
                    className="font-display"
                    style={{
                      fontSize: '1.4rem',
                      color: '#3D4666',
                    }}
                  >
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Rotating Sad Quote */}
          <div
            className="font-mono"
            style={{
              fontSize: '0.84rem',
              color: '#7E88AD',
              lineHeight: '1.6',
              minHeight: '44px',
              padding: '0 10px',
            }}
          >
            &ldquo;{sadQuotes[sadQuoteIdx]}&rdquo;
          </div>

          {earlyClickMessage && (
            <div
              className="font-mono"
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: 'rgba(22, 27, 51, 0.85)',
                border: '1px solid #3C466E',
                color: '#B0B9DB',
                fontSize: '0.8rem',
              }}
            >
              {earlyClickMessage}
            </div>
          )}
        </div>

        {/* Interactive Wait / Peek Button (also primes browser audio for 00:00:00!) */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            onClick={() => {
              soundEngine.startNightAmbience();
              soundEngine.playClick();
              setEarlyClickMessage(
                'Audio ready for midnight! Sabar meri Paaaari—at 00:00:00 on 31st October the horns will blow and Pagluu will hug & kiss you! 💖'
              );
            }}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{
              padding: '12px 20px',
              fontSize: '0.82rem',
              color: '#9BA5C9',
              borderColor: '#333C5E',
              backgroundColor: 'rgba(13, 17, 36, 0.85)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <PixelLanternIcon size={15} />
            <span>Sit With Pagluu in the Dark (Ready Sound for 00:00:00)</span>
          </button>
        </div>

        {/* Discreet Preview Controls for Ahmad to test the 00:00:00 Countdown & Unlock right now */}
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: 0.55,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            onClick={() => {
              soundEngine.startNightAmbience();
              soundEngine.playClick();
              setSimulatedCountdownEnd(Date.now() + 5000);
              setEarlyClickMessage('Simulating final 5 seconds before 00:00:00 October 31...');
            }}
            className="font-mono"
            style={{
              background: 'transparent',
              border: '1px dashed #3A4366',
              color: '#6E789E',
              padding: '6px 12px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <PixelHourglassIcon size={12} color="#6E789E" />
            <span>[Pagluu Test: Simulate Final 5s Countdown to 00:00:00]</span>
          </button>
          <button
            onClick={() => {
              setForceUnlocked(true);
            }}
            className="font-mono"
            style={{
              background: 'transparent',
              border: '1px dashed #3A4366',
              color: '#6E789E',
              padding: '6px 12px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <PixelUnlockIcon size={12} color="#6E789E" />
            <span>[Pagluu Test: Unlock 00:00:00 Immediately]</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: AFTER OPENING — VERY PINKY, HEAVENLY, CUTEST BIRTHDAY REVEAL!
  // ============================================================================
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        zIndex: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
        background:
          'radial-gradient(circle at 50% 18%, rgba(255, 194, 224, 0.42) 0%, rgba(233, 115, 172, 0.28) 32%, rgba(74, 21, 59, 0.92) 72%, rgba(42, 13, 36, 0.97) 100%)',
      }}
    >
      {/* Heavenly Soft Pink & Rose-Gold Ambient Glow Orbs */}
      <div
        style={{
          position: 'fixed',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '680px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 182, 217, 0.45) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Pixel Particles */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {floatingParticles.map((p, i) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              bottom: `${(i * 7) % 85}%`,
              animation: 'float 3.2s ease-in-out infinite',
              animationDelay: `${(i % 5) * 0.3}s`,
              opacity: 0.85,
              filter: 'drop-shadow(0 2px 8px rgba(255, 105, 180, 0.5))',
            }}
          >
            <FloatingPixelParticle type={p.type} size={i % 2 === 0 ? 20 : 16} />
          </div>
        ))}
      </div>

      {/* Heavenly Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.78rem',
            color: '#FFD1E6',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            textShadow: '0 1px 8px rgba(255, 77, 148, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <PixelStarIcon size={14} color="#F6D78B" />
          <span>00:00:00 &bull; October 31 &bull; The Wait Is Over!</span>
          <PixelStarIcon size={14} color="#F6D78B" />
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.35rem, 3.6vw, 2.35rem)',
            color: '#FFF0F7',
            letterSpacing: '0.06em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textShadow:
              '0 0 22px rgba(255, 117, 179, 0.85), 0 0 42px rgba(246, 215, 139, 0.55)',
          }}
        >
          <PixelCrownIcon size={24} color="#F6D78B" />
          <span>HAPPY BIRTHDAY MERI PAAAARI!</span>
          <PixelHeartIcon size={20} color="#FF4D8D" />
        </h1>
        <p
          className="font-mono"
          style={{
            color: '#FFC2DF',
            fontSize: '0.88rem',
            marginTop: '5px',
          }}
        >
          A heavenly world built for Paaaari (Beenish) by her Pagluu (Ahmad) ♥
        </p>
      </div>

      {/* HUGGING & KISSING CHARACTERS CENTERPIECE */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <CoupleVignetteSVG
          mode="heavenly"
          kissActive={kissActive}
          onKissClick={handleExtraKiss}
        />
      </div>

      {/* Quick Funny Horns & Extra Kiss Interactive Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={() => {
            soundEngine.playBirthdayHornFanfare();
            handleExtraKiss();
          }}
          className="pixel-btn font-mono"
          style={{
            padding: '8px 16px',
            fontSize: '0.78rem',
            background: 'linear-gradient(135deg, #FF66A3 0%, #FF3385 100%)',
            color: '#FFFFFF',
            border: '2px solid #FFD1E6',
            boxShadow: '0 4px 16px rgba(255, 51, 133, 0.45)',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <PixelHornIcon size={16} color="#FFFFFF" />
          <span>Blow Funny Birthday Horns + Big Kiss!</span>
          <PixelHeartIcon size={12} color="#FFFFFF" style={{ marginLeft: '6px' }} />
        </button>
        <button
          onClick={handleExtraKiss}
          className="pixel-btn font-mono"
          style={{
            padding: '8px 16px',
            fontSize: '0.78rem',
            background: 'rgba(255, 224, 240, 0.18)',
            color: '#FFE6F2',
            border: '1px solid #FF99C8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <PixelEmbraceIcon size={15} color="#FFE6F2" />
          <span>Hug &amp; Kiss Her Again (Muaaah!)</span>
        </button>
      </div>

      {/* Heavenly Pinky & Rose-Gold Birthday Wish Note Panel */}
      <div
        className="pixel-panel"
        onClick={() => {
          if (bootStep < noteLines.length) {
            soundEngine.playClick();
            setBootStep(noteLines.length);
          }
        }}
        style={{
          maxWidth: '660px',
          width: '100%',
          background:
            'linear-gradient(160deg, rgba(68, 18, 52, 0.92) 0%, rgba(46, 12, 38, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          padding: '24px 26px',
          marginBottom: '22px',
          border: '2px solid #FF99C8',
          boxShadow:
            '0 0 0 2px #F6D78B, 0 12px 38px rgba(255, 77, 148, 0.38), inset 0 0 24px rgba(255, 182, 217, 0.15)',
          cursor: bootStep < noteLines.length ? 'pointer' : 'default',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 153, 200, 0.4)',
            paddingBottom: '10px',
            marginBottom: '16px',
          }}
        >
          <span
            className="font-mono"
            style={{
              color: '#FFB8D9',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <PixelEnvelopeIcon size={14} color="#FFB8D9" />
            <span>Midnight Birthday Wish &bull; From Pagluu (Ahmad)</span>
          </span>
          <span
            className="font-mono"
            style={{
              color: '#F6D78B',
              fontSize: '0.76rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>For Meri Paaaari</span>
            <PixelHeartIcon size={12} color="#FF66A3" />
          </span>
        </div>

        {/* Written Birthday Wish Lines */}
        <div
          className="font-mono"
          style={{
            minHeight: '165px',
            fontSize: '0.92rem',
            lineHeight: '1.8',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {noteLines.slice(0, bootStep).map((line, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', animation: 'fadeIn 250ms ease' }}>
              <span style={{ color: '#FF85B3' }}>♥</span>
              <span
                style={{
                  color:
                    idx === 0
                      ? '#F6D78B'
                      : idx === noteLines.length - 1
                      ? '#FFB3D9'
                      : idx === 2
                      ? '#FFD1E8'
                      : '#FFF0F7',
                  fontWeight: idx === 0 || idx === noteLines.length - 1 ? 600 : 400,
                }}
              >
                {line}
              </span>
            </div>
          ))}

          {bootStep < noteLines.length && (
            <div style={{ color: '#FFB8D9', animation: 'starTwinkle 0.8s infinite' }}>
              ♥ _ <span style={{ fontSize: '0.75rem', color: '#FF99C8' }}>[click to read full birthday wish]</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons to Step Into The 7-Stage Valley */}
      {bootStep >= noteLines.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            onClick={handleAccept}
            className="pixel-btn pixel-btn-primary font-display"
            style={{
              padding: '15px 32px',
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #FF7EB6 0%, #F6D78B 100%)',
              color: '#2A0D24',
              border: '2px solid #FFF0F7',
              boxShadow: '0 0 24px rgba(255, 126, 182, 0.7)',
              animation: 'scaleUp 300ms ease',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <PixelStarIcon size={16} color="#2A0D24" style={{ marginRight: '8px' }} />
            <span>Step Into Your Birthday Valley</span>
            <PixelArrowRightIcon size={14} color="#2A0D24" />
          </button>

          <button
            ref={runawayBtnRef}
            onMouseEnter={handleEvade}
            onTouchStart={handleEvade}
            onClick={handleEvade}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{
              padding: '14px 22px',
              fontSize: '0.84rem',
              transform: `translate(${evadeOffset.x}px, ${evadeOffset.y}px)`,
              transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1)',
              borderColor: '#FF99C8',
              color: '#FFE0EE',
              cursor: 'pointer',
            }}
          >
            <span>{evadeMessage}</span>
          </button>
        </div>
      )}

      {/* Subtle option to preview the Dark & Sad Timer again */}
      <div style={{ marginTop: '16px', opacity: 0.5, position: 'relative', zIndex: 2 }}>
        <button
          onClick={() => {
            setForceUnlocked(false);
            setHasCelebrationFired(false);
            setSimulatedCountdownEnd(Date.now() + 8000);
          }}
          className="font-mono"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFB8D9',
            fontSize: '0.72rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <PixelRewindIcon size={12} color="#FFB8D9" />
          <span>Replay the Dark &amp; Sad Countdown &rarr; 00:00:00 Reveal</span>
        </button>
      </div>
    </div>
  );
};
