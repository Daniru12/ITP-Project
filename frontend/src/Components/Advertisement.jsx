import React, { useState, useEffect, useCallback } from 'react'
import { MdAddCircleOutline } from "react-icons/md";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react'

// Advertisement data
const advertisements = [
  {
    id: 1,
    title: 'Adopt Me',
    description: 'Adopt a pet today, give love, save a life forever.',
    image:
      'https://i.postimg.cc/654fVsH7/Blue-and-Black-Modern-Business-Card-1.png',
    ctaText: 'Adopt now',
    //ctaUrl: '#home-decor',
  },
  {
    id: 2,
    title: 'Get Best Service',
    description: 'Get up to 50% off on all pet Services.',
    image:
      'https://i.postimg.cc/154KbZQW/Black-and-Gold-Elegant-Card-Background-2.png',
    ctaText: 'Book Now',
    //ctaUrl: '#summer-sale',
  },
  {
    id: 3,
    title: 'Get Pet Products',
    description: 'Premium pet products for health, happiness, comfort, and overall well-being.',
    image:
      'https://i.postimg.cc/sgzFRRPR/Red-Modern-Business-Card-2.png',
    ctaText: 'Buy Now',
    //ctaUrl: '#tech-gadgets',
  },
  
  
]

export const AdvertisementSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
  }, [])

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + advertisements.length) % advertisements.length
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  // Auto-rotation effect
  useEffect(() => {
    let interval
    if (isPlaying && !isHovering) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, isHovering, nextSlide])

  return (
    <div
      className="relative w-full mx-auto overflow-hidden rounded-lg shadow-lg bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides container */}
      <div className="relative h-[2000px] sm:h-[700px]">
        {advertisements.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={ad.image}
                alt={ad.title}
                className="absolute w-full h-full object-cover my-1 rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white z-20">
                <h2 className="text-3xl font-bold mb-2">{ad.title}</h2>
                <p className="text-lg mb-4 max-w-lg">{ad.description}</p>
                <a
                  href={ad.ctaUrl}
                  className="inline-block px-6 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors"
                >
                  {ad.ctaText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
      className="absolute top-4 right-4 z-20 p-4 rounded-full text-blue-500 bg-blue-300/50 hover:bg-white/45 text-4xl backdrop-blur-sm transition-colors"
      >
        <MdAddCircleOutline/>
      </button>
    </div>
  )
}
