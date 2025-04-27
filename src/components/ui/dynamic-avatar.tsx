import React from 'react';

interface AvatarData {
  bgColor: string;
  shapeColor: string;
  faceColor: string;
  transform: string;
  shapeType: string;
  rx: string | number;
  faceType?: string;
  eyeType?: string;
  facePosition?: string;
}

interface DynamicAvatarProps {
  avatarData: AvatarData;
  size?: number;
  className?: string;
}

export default function DynamicAvatar({ avatarData, size = 40, className = '' }: DynamicAvatarProps) {
  const {
    bgColor,
    shapeColor,
    faceColor,
    transform,
    shapeType,
    rx,
    faceType = 'smile',
    eyeType = 'rect',
    facePosition = 'translate(0 0) rotate(0 18 18)'
  } = avatarData;

  // Generate a unique ID for the SVG mask
  const svgId = `avatar-mask-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
    >
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <mask
          id={svgId}
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='36'
          height='36'
        >
          <rect width='36' height='36' rx='72' fill='#FFFFFF'></rect>
        </mask>
        <g mask={`url(#${svgId})`}>
          <rect width='36' height='36' fill={bgColor}></rect>
          {shapeType === 'rect' && (
            <rect
              x='0'
              y='0'
              width='36'
              height='36'
              transform={transform}
              fill={shapeColor}
              rx={rx}
            ></rect>
          )}
          {shapeType === 'circle' && (
            <circle
              cx='18'
              cy='18'
              r='18'
              transform={transform}
              fill={shapeColor}
            ></circle>
          )}
          {shapeType === 'polygon' && (
            <polygon
              points='18,0 36,10 36,26 18,36 0,26 0,10'
              transform={transform}
              fill={shapeColor}
            ></polygon>
          )}
          <g transform={facePosition}>
            {/* Different types of mouths */}
            {faceType === 'smile' && (
              <path
                d='M13 19c3 1 7 1 10 0'
                stroke={faceColor}
                fill='none'
                strokeLinecap='round'
              />
            )}
            {faceType === 'grin' && (
              <path
                d='M11 19c4 2.5 10 2.5 14 0'
                stroke={faceColor}
                fill='none'
                strokeLinecap='round'
                strokeWidth='1.5'
              />
            )}
            {faceType === 'frown' && (
              <path
                d='M11 22c4 -2.5 10 -2.5 14 0'
                stroke={faceColor}
                fill='none'
                strokeLinecap='round'
              />
            )}
            {faceType === 'neutral' && (
              <path
                d='M11 20h14'
                stroke={faceColor}
                fill='none'
                strokeLinecap='round'
              />
            )}
            {faceType === 'surprised' && (
              <circle
                cx='18'
                cy='20'
                r='2'
                fill='none'
                stroke={faceColor}
              />
            )}
            {faceType === 'squiggle' && (
              <path
                d='M11 20c1.5-1 3 1 4.5 0c1.5-1 3 1 4.5 0c1.5-1 3 1 4.5 0'
                stroke={faceColor}
                fill='none'
                strokeLinecap='round'
              />
            )}
            {faceType === 'catSmile' && (
              <path
                d='M11,20 a1.5,0.75 0 0,0 14,0'
                fill={faceColor}
              />
            )}

            {/* Different types of eyes */}
            {eyeType === 'rect' && (
              <>
                <rect
                  x='14'
                  y='14'
                  width='1.5'
                  height='2'
                  rx='1'
                  stroke='none'
                  fill={faceColor}
                />
                <rect
                  x='22'
                  y='14'
                  width='1.5'
                  height='2'
                  rx='1'
                  stroke='none'
                  fill={faceColor}
                />
              </>
            )}
            {eyeType === 'circle' && (
              <>
                <circle
                  cx='14.5'
                  cy='14'
                  r='1.25'
                  fill={faceColor}
                />
                <circle
                  cx='22.5'
                  cy='14'
                  r='1.25'
                  fill={faceColor}
                />
              </>
            )}
            {eyeType === 'dot' && (
              <>
                <circle
                  cx='14.5'
                  cy='14'
                  r='0.75'
                  fill={faceColor}
                />
                <circle
                  cx='22.5'
                  cy='14'
                  r='0.75'
                  fill={faceColor}
                />
              </>
            )}
            {eyeType === 'oval' && (
              <>
                <ellipse
                  cx='14.5'
                  cy='14'
                  rx='2'
                  ry='1'
                  fill={faceColor}
                />
                <ellipse
                  cx='22.5'
                  cy='14'
                  rx='2'
                  ry='1'
                  fill={faceColor}
                />
              </>
            )}
            {eyeType === 'slash' && (
              <>
                <path
                  d='M13 13l3 2'
                  stroke={faceColor}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M21 13l3 2'
                  stroke={faceColor}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </>
            )}
            {eyeType === 'starry' && (
              <>
                <path
                  d='M14.5,14 l0.5,-1 l0.5,1 l1,-0.5 l-0.5,1 l1,0.5 l-1,0.5 l0.5,1 l-1,-0.5 l-0.5,1 l-0.5,-1 l-1,0.5 l0.5,-1 l-1,-0.5 l1,-0.5 l-0.5,-1 Z'
                  fill={faceColor}
                  strokeWidth='0.2'
                />
                <path
                  d='M22.5,14 l0.5,-1 l0.5,1 l1,-0.5 l-0.5,1 l1,0.5 l-1,0.5 l0.5,1 l-1,-0.5 l-0.5,1 l-0.5,-1 l-1,0.5 l0.5,-1 l-1,-0.5 l1,-0.5 l-0.5,-1 Z'
                  fill={faceColor}
                  strokeWidth='0.2'
                />
              </>
            )}
            {eyeType === 'sleepy' && (
              <>
                <path
                  d='M13 13.5c1 0.5 2 0.5 3 0'
                  stroke={faceColor}
                  fill='none'
                  strokeLinecap='round'
                />
                <path
                  d='M21 13.5c1 0.5 2 0.5 3 0'
                  stroke={faceColor}
                  fill='none'
                  strokeLinecap='round'
                />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
