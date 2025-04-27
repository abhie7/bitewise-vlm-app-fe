'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'

interface Avatar {
  id: number
  svg: React.ReactNode
  alt: string
  avatarData?: {
    bgColor: string
    shapeColor: string
    faceColor: string
    transform: string
    shapeType: string
    rx: string | number
  }
}

interface AvatarPickerProps {
  username?: string
  onAvatarChange?: (avatar: Avatar) => void
}

const avatars: Avatar[] = [
  {
    id: 1,
    svg: (
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
        aria-label='Avatar 1'
      >
        <mask
          id=':r111:'
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='36'
          height='36'
        >
          <rect width='36' height='36' rx='72' fill='#FFFFFF' />
        </mask>
        <g mask='url(#:r111:)'>
          <rect width='36' height='36' fill='#ff005b' />
          <rect
            x='0'
            y='0'
            width='36'
            height='36'
            transform='translate(9 -5) rotate(219 18 18) scale(1)'
            fill='#ffb238'
            rx='6'
          />
          <g transform='translate(4.5 -4) rotate(9 18 18)'>
            <path
              d='M15 19c2 1 4 1 6 0'
              stroke='#000000'
              fill='none'
              strokeLinecap='round'
            />
            <rect
              x='10'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#000000'
            />
            <rect
              x='24'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#000000'
            />
          </g>
        </g>
      </svg>
    ),
    alt: 'Avatar 1',
  },
  {
    id: 2,
    svg: (
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
      >
        <mask
          id=':R4mrttb:'
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='36'
          height='36'
        >
          <rect width='36' height='36' rx='72' fill='#FFFFFF'></rect>
        </mask>
        <g mask='url(#:R4mrttb:)'>
          <rect width='36' height='36' fill='#ff7d10'></rect>
          <rect
            x='0'
            y='0'
            width='36'
            height='36'
            transform='translate(5 -1) rotate(55 18 18) scale(1.1)'
            fill='#0a0310'
            rx='6'
          />
          <g transform='translate(7 -6) rotate(-5 18 18)'>
            <path
              d='M15 20c2 1 4 1 6 0'
              stroke='#FFFFFF'
              fill='none'
              strokeLinecap='round'
            />
            <rect
              x='14'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#FFFFFF'
            />
            <rect
              x='20'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#FFFFFF'
            />
          </g>
        </g>
      </svg>
    ),
    alt: 'Avatar 4',
  },
  {
    id: 3,
    svg: (
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
      >
        <mask
          id=':r11c:'
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='36'
          height='36'
        >
          <rect width='36' height='36' rx='72' fill='#FFFFFF'></rect>
        </mask>
        <g mask='url(#:r11c:)'>
          <rect width='36' height='36' fill='#0a0310' />
          <rect
            x='0'
            y='0'
            width='36'
            height='36'
            transform='translate(-3 7) rotate(227 18 18) scale(1.2)'
            fill='#ff005b'
            rx='36'
          />
          <g transform='translate(-3 3.5) rotate(7 18 18)'>
            <path d='M13,21 a1,0.75 0 0,0 10,0' fill='#FFFFFF' />
            <rect
              x='12'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#FFFFFF'
            />
            <rect
              x='22'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#FFFFFF'
            />
          </g>
        </g>
      </svg>
    ),
    alt: 'Avatar 2',
  },
  {
    id: 4,
    svg: (
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
      >
        <mask
          id=':r1gg:'
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='36'
          height='36'
        >
          <rect width='36' height='36' rx='72' fill='#FFFFFF'></rect>
        </mask>
        <g mask='url(#:r1gg:)'>
          <rect width='36' height='36' fill='#d8fcb3'></rect>
          <rect
            x='0'
            y='0'
            width='36'
            height='36'
            transform='translate(9 -5) rotate(219 18 18) scale(1)'
            fill='#89fcb3'
            rx='6'
          ></rect>
          <g transform='translate(4.5 -4) rotate(9 18 18)'>
            <path
              d='M15 19c2 1 4 1 6 0'
              stroke='#000000'
              fill='none'
              strokeLinecap='round'
            ></path>
            <rect
              x='10'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#000000'
            ></rect>
            <rect
              x='24'
              y='14'
              width='1.5'
              height='2'
              rx='1'
              stroke='none'
              fill='#000000'
            ></rect>
          </g>
        </g>
      </svg>
    ),
    alt: 'Avatar 3',
  },
]

const getRandomColor = () => {
  const colors = [
    '#ff005b', '#ffb238', '#0a0310', '#ff7d10', '#d8fcb3',
    '#89fcb3', '#4287f5', '#8f44fd', '#32a852', '#fc6c85',
    '#3acce1', '#e15f41', '#2d3436', '#6ab04c', '#f0932b'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const getRandomTransform = () => {
  const translateX = Math.floor(Math.random() * 20) - 10
  const translateY = Math.floor(Math.random() * 20) - 10
  const rotate = Math.floor(Math.random() * 360)
  const scale = (Math.random() * 0.5) + 0.8
  return `translate(${translateX} ${translateY}) rotate(${rotate} 18 18) scale(${scale.toFixed(1)})`
}

const getRandomShape = () => {
  const shapes = ['rect', 'circle', 'polygon']
  return shapes[Math.floor(Math.random() * shapes.length)]
}

const getRandomRx = () => {
  const options = [6, 12, 18, 36, '36', '72']
  return options[Math.floor(Math.random() * options.length)]
}

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000)
}

const getFaceTypes = () => {
  return [
    'smile', // Standard smile
    'grin', // Wide grin
    'frown', // Sad face
    'neutral', // Straight line
    'surprised', // O shape
    'squiggle', // Wavy line
    'catSmile', // Cat-like smile
  ]
}

const getEyeTypes = () => {
  return [
    'rect', // Rectangle eyes
    'circle', // Circle eyes
    'dot', // Small dot eyes
    'oval', // Oval eyes
    'slash', // Angled slash eyes
    'starry', // Star shaped eyes
    'sleepy', // Half closed eyes
  ]
}

const getRandomFaceType = () => {
  const faceTypes = getFaceTypes()
  return faceTypes[Math.floor(Math.random() * faceTypes.length)]
}

const getRandomEyeType = () => {
  const eyeTypes = getEyeTypes()
  return eyeTypes[Math.floor(Math.random() * eyeTypes.length)]
}

const getRandomFacePosition = () => {
  // Randomize face position slightly but ensure facing right
  const translateX = Math.floor(Math.random() * 8) - 2 // Less horizontal variation, slight right bias
  const translateY = Math.floor(Math.random() * 6) - 3

  // Limit rotation to a narrower range that keeps face pointing rightward
  // Positive angles (0 to 15) will make face point slightly up-right
  // Negative angles (-15 to 0) will make face point slightly down-right
  const rotate = Math.floor(Math.random() * 30) - 15

  return `translate(${translateX} ${translateY}) rotate(${rotate} 18 18)`
}

// Update the face components in generateRandomAvatar to ensure right-facing orientation
const generateRandomAvatar = (): Avatar => {
  const bgColor = getRandomColor()
  const shapeColor = getRandomColor()
  const faceColor = Math.random() > 0.5 ? '#FFFFFF' : '#000000'
  const transform = getRandomTransform()
  const shapeType = getRandomShape()
  const rx = getRandomRx()
  const id = generateRandomId()
  const faceType = getRandomFaceType()
  const eyeType = getRandomEyeType()
  const facePosition = getRandomFacePosition()

  const svgId = `:r${id}:`

  const avatarData = {
    bgColor,
    shapeColor,
    faceColor,
    transform,
    shapeType,
    rx,
    faceType,
    eyeType,
    facePosition
  }

  return {
    id,
    svg: (
      <svg
        viewBox='0 0 36 36'
        fill='none'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
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
            {/* Different types of mouths based on faceType - adjusted for right-facing */}
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

            {/* Eye positioning - adjusted to be more balanced for right-facing */}
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
    ),
    alt: `Random Avatar ${id}`,
    avatarData
  }
}

// Add these animation variants at the top level
const mainAvatarVariants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const pickerVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  },
}

const selectedVariants = {
  initial: {
    opacity: 0,
    rotate: -180,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.2,
    },
  },
}

export default function AvatarPicker({ username, onAvatarChange }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0])
  const [rotationCount, setRotationCount] = useState(0)
  const [customAvatars, setCustomAvatars] = useState<Avatar[]>([])
  const [allAvatars, setAllAvatars] = useState<Avatar[]>(avatars)

  useEffect(() => {
    // Combine predefined and custom avatars
    setAllAvatars([...avatars, ...customAvatars])
  }, [customAvatars])

  const handleAvatarSelect = (avatar: Avatar) => {
    setRotationCount((prev) => prev + 1080) // Add 3 rotations each time
    setSelectedAvatar(avatar)

    if (onAvatarChange) {
      onAvatarChange(avatar)
    }
  }

  const handleRandomize = () => {
    const randomAvatar = generateRandomAvatar()
    setCustomAvatars((prev) => [randomAvatar, ...prev.slice(0, 4)]) // Keep only the latest 5 custom avatars
    setRotationCount((prev) => prev + 1080)
    setSelectedAvatar(randomAvatar)

    if (onAvatarChange) {
      onAvatarChange(randomAvatar)
    }
  }

  // This function could be used to save the avatar to the database
  const getAvatarData = () => {
    if (selectedAvatar.avatarData) {
      return {
        id: selectedAvatar.id,
        avatarData: selectedAvatar.avatarData,
      }
    }
    return {
      id: selectedAvatar.id,
    }
  }

  return (
    <motion.div initial='initial' animate='animate' className='w-full'>
      <Card className='w-full max-w-md mx-auto overflow-hidden bg-gradient-to-b from-slate-600 to-slate-800'>
        <CardContent className='p-0'>
          {/* Background header */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: '4rem',
              transition: {
                height: {
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                },
              },
            }}
            className='bg-gradient-to-r from-primary/20 to-primary/10 w-full'
          />

          <div className='px-4 -mt-16'>
            {/* Main avatar display */}
            <motion.div
              className='relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 bg-background flex items-center justify-center'
              variants={mainAvatarVariants}
              layoutId='selectedAvatar'
            >
              <motion.div
                className='w-full h-full flex items-center justify-center scale-[3]'
                animate={{
                  rotate: rotationCount,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1], // Custom easing for a nice acceleration and deceleration
                }}
              >
                {selectedAvatar.svg}
              </motion.div>
            </motion.div>

            {/* Username display */}
            <motion.div
              className='text-center mt-4'
              variants={pickerVariants.item}
            >
              <motion.h2
                className='text-2xl font-bold text-primary'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {username}
              </motion.h2>
              <motion.p
                className='text-muted text-sm'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Select your avatar
              </motion.p>
            </motion.div>

            {/* Avatar selection with randomizer button */}
            <motion.div className='mt-4' variants={pickerVariants.container}>
              <motion.div
                className='flex justify-center gap-4 flex-wrap'
                variants={pickerVariants.container}
              >
                {allAvatars.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    type='button'
                    onClick={() => handleAvatarSelect(avatar)}
                    className={cn(
                      'relative w-12 h-12 rounded-full overflow-hidden border-2',
                      'transition-all duration-300 cursor-pointer'
                    )}
                    variants={pickerVariants.item}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      y: 0,
                      transition: { duration: 0.2 },
                    }}
                    aria-label={`Select ${avatar.alt}`}
                    aria-pressed={selectedAvatar.id === avatar.id}
                  >
                    <div className='w-full h-full flex items-center justify-center'>
                      {avatar.svg}
                    </div>
                    {selectedAvatar.id === avatar.id && (
                      <motion.div
                        className='absolute inset-0 bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full'
                        variants={selectedVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        layoutId='selectedIndicator'
                      />
                    )}
                  </motion.button>
                ))}

                {/* Randomizer button */}
                <motion.button
                  type='button'
                  onClick={handleRandomize}
                  className={cn(
                    'relative w-12 h-12 rounded-full overflow-hidden border-2 border-dashed border-primary',
                    'transition-all duration-300 cursor-pointer bg-muted flex items-center justify-center'
                  )}
                  variants={pickerVariants.item}
                  whileHover={{
                    y: -2,
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    y: 0,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  aria-label="Generate random avatar"
                >
                  <RefreshCw className="w-6 h-6 text-primary" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Optional: Display JSON data for debugging or showing what would be saved */}
            {/* {selectedAvatar.avatarData && (
              <motion.div
                className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              >
                <p className="mb-1 font-semibold">Avatar Data (to be saved):</p>
                <pre className="overflow-x-auto">
                  {JSON.stringify(getAvatarData(), null, 2)}
                </pre>
              </motion.div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
