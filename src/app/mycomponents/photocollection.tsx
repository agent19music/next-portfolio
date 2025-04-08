"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

interface StackedPhotoCollectionProps {
  photos: Photo[];
  stackSpacing?: number; // Controls how much photos are offset in the stack
  growScale?: number; // Controls how much photos grow on hover
  size?: 'small' | 'medium' | 'large'; // Controls size of the component
}

const StackedPhotoCollection: React.FC<StackedPhotoCollectionProps> = ({ 
  photos, 
  stackSpacing = 4, 
  size = 'medium'
}) => {
  // State to track order of photos
  const [photoStack, setPhotoStack] = useState<Photo[]>(photos);
  // State to track current position in the sequence
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to track hovered photo
  const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null);
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  // State to track if user has interacted with the component
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Container for the entire component
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to move the next photo to the back of the stack sequentially
  const shuffleNext = () => {
    // Set hasInteracted to true on first shuffle
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    // Reset hover state when shuffling
    setHoveredPhotoId(null);
    
    setPhotoStack(prev => {
      // Get the photo at the current index
      const nextIndex = currentIndex % photos.length;
      const nextPhotoId = photos[nextIndex].id;
      
      // Find the photo to move
      const item = prev.find(photo => photo.id === nextPhotoId);
      if (!item) return prev;
      
      // Remove it from the stack and add to the end
      const filteredStack = prev.filter(photo => photo.id !== nextPhotoId);
      
      // Increment the index for next shuffle
      setCurrentIndex(currentIndex + 1);
      
      return [...filteredStack, item];
    });
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Apply a small random offset to each photo in the stack
  const getRandomOffset = () => {
    const randomSign = Math.random() > 0.5 ? 1 : -1;
    return Math.random() * 2 * randomSign;
  };

  // Calculate initial position offsets for photos
  const initialPhotoOffsets = useRef(
    photos.map(() => ({
      x: getRandomOffset(),
      y: getRandomOffset(),
      rotate: getRandomOffset() * 3
    }))
  );

  // Set size based on prop
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return { width: '14rem', height: '14rem' };
      case 'large':
        return { width: '22rem', height: '22rem' };
      case 'medium':
      default:
        return { width: '18rem', height: '18rem' };
    }
  };

  return (
    <div 
      className="w-full flex justify-center items-center  relative select-none"
      ref={containerRef}
    >
      <div 
        className="relative perspective-1000"
        style={getSizeStyles()}
      >
        <AnimatePresence>
          {photoStack.map((photo, index) => {
            // Calculate stack position (top photos have higher zIndex)
            const zIndex = photoStack.length - index;
            // Get initial offset from our ref
            const offset = initialPhotoOffsets.current[photos.findIndex(p => p.id === photo.id)];
            // Check if this photo is hovered
            const isHovered = hoveredPhotoId === photo.id;
            
            return (
              <motion.div
                key={photo.id}
                className="absolute top-0 left-0 w-full h-full cursor-pointer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  x: offset.x * stackSpacing,
                  y: offset.y * stackSpacing,
                  rotate: offset.rotate,
                  zIndex
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
                style={{ 
                  transformOrigin: 'center center',
                }}
                onClick={(e) => {
                  // Prevent hover state from persisting
                  e.stopPropagation();
                  
                  // Shuffle to the next photo when clicked
                  shuffleNext();
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    shuffleNext();
                  }
                }}
              >
                {/* Actual photo */}
                <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden ">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    draggable="false" // Prevent native image dragging
                  />
                </div>
                
                {/* Caption if provided */}
                {/* {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                  </div>
                )} */}
                
                {/* "Click me" bubble - shown on all cards when hovered, but only if user hasn't interacted yet */}
                {!hasInteracted && (
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                      {isMobile ? 'Tap to shuffle' : 'Click to shuffle'}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          <span className="md:hidden">Tap to explore</span>
        </p>
      </div>
      
      {/* Add custom styling for backface visibility and perspective */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default StackedPhotoCollection;