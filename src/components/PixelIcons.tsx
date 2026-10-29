import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelLockIcon: React.FC<IconProps> = ({ size = 14, color = '#7A84A8', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="5" y="2" width="6" height="5" fill="none" stroke={color} strokeWidth="2" />
    <rect x="3" y="7" width="10" height="7" fill={color} />
    <rect x="7" y="9" width="2" height="2" fill="#080A14" />
    <rect x="7" y="11" width="2" height="2" fill="#080A14" />
  </svg>
);

export const PixelUnlockIcon: React.FC<IconProps> = ({ size = 14, color = '#6E789E', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="5" y="1" width="6" height="4" fill="none" stroke={color} strokeWidth="2" />
    <rect x="3" y="7" width="10" height="7" fill={color} />
    <rect x="7" y="9" width="2" height="3" fill="#080A14" />
  </svg>
);

export const PixelHourglassIcon: React.FC<IconProps> = ({ size = 14, color = '#6E789E', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="3" y="2" width="10" height="2" fill={color} />
    <rect x="3" y="12" width="10" height="2" fill={color} />
    <rect x="4" y="4" width="8" height="2" fill={color} />
    <rect x="5" y="6" width="6" height="2" fill={color} />
    <rect x="6" y="7" width="4" height="2" fill={color} />
    <rect x="5" y="8" width="6" height="2" fill={color} />
    <rect x="4" y="10" width="8" height="2" fill={color} />
    <rect x="7" y="9" width="2" height="2" fill="#F6D78B" />
  </svg>
);

export const PixelLanternIcon: React.FC<IconProps> = ({ size = 15, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="7" y="1" width="2" height="2" fill="#9BA5C9" />
    <rect x="5" y="3" width="6" height="2" fill="#5A6385" />
    <rect x="4" y="5" width="8" height="6" fill="#F6D78B" opacity="0.95" />
    <rect x="7" y="6" width="2" height="4" fill="#FFE89E" />
    <rect x="4" y="11" width="8" height="2" fill="#5A6385" />
    <rect x="3" y="5" width="1" height="6" fill="#333C5E" />
    <rect x="12" y="5" width="1" height="6" fill="#333C5E" />
  </svg>
);

export const PixelHornIcon: React.FC<IconProps> = ({ size = 15, color = '#FFFFFF', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="2" y="7" width="4" height="2" fill="#F6D78B" />
    <rect x="6" y="6" width="4" height="4" fill="#F6D78B" />
    <rect x="10" y="5" width="3" height="6" fill="#FFE89E" />
    <rect x="13" y="4" width="2" height="8" fill="#F6D78B" />
    <rect x="15" y="3" width="1" height="2" fill={color} />
    <rect x="15" y="7" width="1" height="2" fill={color} />
    <rect x="15" y="11" width="1" height="2" fill={color} />
  </svg>
);

export const PixelHeartIcon: React.FC<IconProps> = ({ size = 14, color = '#FF4D8D', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <rect x="2" y="3" width="5" height="2" fill={color} />
    <rect x="9" y="3" width="5" height="2" fill={color} />
    <rect x="1" y="5" width="14" height="4" fill={color} />
    <rect x="2" y="9" width="12" height="2" fill={color} />
    <rect x="4" y="11" width="8" height="2" fill={color} />
    <rect x="6" y="13" width="4" height="2" fill={color} />
    <rect x="3" y="4" width="2" height="2" fill="#FFB8D4" />
  </svg>
);

export const PixelCrownIcon: React.FC<IconProps> = ({ size = 16, color = '#F6D78B', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <rect x="2" y="11" width="12" height="3" fill={color} />
    <rect x="2" y="6" width="2" height="5" fill={color} />
    <rect x="7" y="4" width="2" height="7" fill="#FFE89E" />
    <rect x="12" y="6" width="2" height="5" fill={color} />
    <rect x="2" y="5" width="2" height="1" fill="#FF3B8B" />
    <rect x="7" y="3" width="2" height="1" fill="#FF3B8B" />
    <rect x="12" y="5" width="2" height="1" fill="#FF3B8B" />
    <rect x="4" y="12" width="2" height="1" fill="#FF3B8B" />
    <rect x="10" y="12" width="2" height="1" fill="#FF3B8B" />
  </svg>
);

export const PixelEnvelopeIcon: React.FC<IconProps> = ({ size = 14, color = '#FFB8D9', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <rect x="2" y="4" width="12" height="9" fill={color} />
    <rect x="3" y="5" width="10" height="7" fill="#FFF0F7" />
    <rect x="4" y="5" width="2" height="1" fill="#FF99C8" />
    <rect x="6" y="6" width="4" height="1" fill="#FF99C8" />
    <rect x="10" y="5" width="2" height="1" fill="#FF99C8" />
    <rect x="7" y="7" width="2" height="2" fill="#E95288" />
  </svg>
);

export const PixelStarIcon: React.FC<IconProps> = ({ size = 14, color = '#F6D78B', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <rect x="7" y="1" width="2" height="14" fill={color} />
    <rect x="1" y="7" width="14" height="2" fill={color} />
    <rect x="5" y="5" width="6" height="6" fill="#FFE89E" />
    <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelRewindIcon: React.FC<IconProps> = ({ size = 12, color = '#FFB8D9', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <polygon points="8,3 2,8 8,13" fill={color} />
    <polygon points="14,3 8,8 14,13" fill={color} />
  </svg>
);

export const PixelEmbraceIcon: React.FC<IconProps> = ({ size = 15, color = '#FFE6F2', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}
  >
    <circle cx="5" cy="4" r="2" fill={color} />
    <circle cx="11" cy="4" r="2" fill="#F6D78B" />
    <rect x="3" y="7" width="10" height="6" fill={color} rx="2" />
    <rect x="7" y="8" width="2" height="2" fill="#FF4D8D" />
  </svg>
);

export const PixelArrowRightIcon: React.FC<IconProps> = ({ size = 12, color = '#2A0D24', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', ...style }}
  >
    <polygon points="4,3 11,8 4,13" fill={color} />
  </svg>
);

/**
 * Floating particle rendered as crisp pixel-art SVG instead of platform emojis
 */
export const FloatingPixelParticle: React.FC<{
  type: 'heart' | 'star' | 'petal' | 'crown' | 'sparkle';
  size?: number;
}> = ({ type, size = 18 }) => {
  switch (type) {
    case 'heart':
      return <PixelHeartIcon size={size} color="#FF66A3" />;
    case 'star':
      return <PixelStarIcon size={size} color="#F6D78B" />;
    case 'crown':
      return <PixelCrownIcon size={size} color="#F6D78B" />;
    case 'petal':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
          <ellipse cx="8" cy="8" rx="5" ry="3" fill="#FF99C8" transform="rotate(35 8 8)" />
          <ellipse cx="8" cy="8" rx="3" ry="1.5" fill="#FFE0EE" transform="rotate(35 8 8)" />
        </svg>
      );
    case 'sparkle':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
          <rect x="7" y="3" width="2" height="10" fill="#FFF0F7" />
          <rect x="3" y="7" width="10" height="2" fill="#FFF0F7" />
          <rect x="6" y="6" width="4" height="4" fill="#FFD1E8" />
        </svg>
      );
  }
};

