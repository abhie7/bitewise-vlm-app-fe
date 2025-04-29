'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useState } from 'react'

// Ollie's storyline divided into 4 slides
const ITEMS = [
  {
    id: 1,
    image: '/ollie1.jpeg',
    title: 'Meet Ollie!',
    description: 'Your friendly orange llama nutrition guide who believes knowledge turns every bite into a wise choice.',
  },
  {
    id: 2,
    image: '/ollie2.jpeg',
    title: 'Ollie\'s Origin',
    description: 'Born in the magical Nutrivale, Ollie was special - a rare orange llama who studied every bite, learning which foods gave the most strength and energy.',
  },
  {
    id: 3,
    image: '/ollie3.jpeg',
    title: 'On a Mission',
    description: 'Seeing our fast-paced world of mindless eating, Ollie became the first Nutrition Llama Ambassador to help people understand their food better.',
  },
  {
    id: 4,
    image: '/ollie4.png',
    title: 'What Ollie Means',
    description: 'Orange for energy, a llama for endurance, bright eyes for awareness, and a slight smile because Ollie never scolds - he guides!',
  },
]

export default function MeetOllieCarousel() {
  const [index, setIndex] = useState(0)

  return (
    <div className='relative w-full'>
      <Carousel index={index} onIndexChange={setIndex}>
        <CarouselContent className='relative'>
          {ITEMS.map((item) => {
            return (
              <CarouselItem key={item.id} className='p-0'>
                <div className='relative w-full aspect-[16/11] overflow-hidden rounded-lg'>
                  {/* Background image */}
                  <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{ backgroundImage: `url(${item.image})` }}
                  />

                  {/* Gradient overlay - black to transparent from bottom to top */}
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-800/70 to-transparent' />

                  {/* Text content */}
                  <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                    <h3 className='text-xl font-bold'>{item.title}</h3>
                    <p className='mt-2'>{item.description}</p>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Navigation buttons */}
      <div className='flex w-full justify-center space-x-3 mt-4'>
        {ITEMS.map((item) => {
          return (
            <button
              key={item.id}
              type='button'
              aria-label={`Go to slide ${item.id}`}
              onClick={() => setIndex(item.id - 1)}
              className={`h-10 w-10 border flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                ${index === item.id - 1
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-zinc-200 dark:border-zinc-800'}`}
            >
              {item.id}
            </button>
          )
        })}
      </div>
    </div>
  )
}
