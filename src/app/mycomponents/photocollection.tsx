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
  stackSpacing = 3, 
  growScale = 1.08,
  size = 'medium'
}) => {
  // State to track order of photos
  const [photoStack, setPhotoStack] = useState<Photo[]>(photos);
  // State to track if currently dragging
  const [isDragging, setIsDragging] = useState(false);
  // State to track hovered photo
  const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null);
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Container for the entire component
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to move a photo to the back of the stack
  const moveToBack = (id: number) => {
    setPhotoStack(prev => {
      const item = prev.find(photo => photo.id === id);
      if (!item) return prev;
      
      const filteredStack = prev.filter(photo => photo.id !== id);
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
      className="w-full flex justify-center items-center py-12 relative select-none"
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
                  scale: isHovered ? growScale : 1,
                  opacity: 1,
                  x: offset.x * stackSpacing,
                  y: offset.y * stackSpacing,
                  rotate: offset.rotate,
                  zIndex,
                  boxShadow: isHovered 
                    ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.1)'
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
                drag={!isMobile}
                dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                dragElastic={0.05}
                onDragStart={() => setIsDragging(true)}
                onDrag={(e, info) => {
                  // If dragged more than minimal threshold, immediately send to back
                  const dragDistance = Math.sqrt(
                    Math.pow(info.offset.x, 2) + 
                    Math.pow(info.offset.y, 2)
                  );
                  
                  if (dragDistance > 15 && !isMobile) {
                    // Only move it once during a drag
                    if (isDragging) {
                      moveToBack(photo.id);
                      // Temporarily disable further dragging effects for this action
                      setIsDragging(false);
                    }
                  }
                }}
                onDragEnd={() => {
                  setIsDragging(false);
                }}
                onClick={() => {
                  // Always move to back on mobile tap
                  // On desktop, only process click if not dragging
                  if (isMobile || !isDragging) {
                    moveToBack(photo.id);
                  }
                }}
                whileHover={{ 
                  scale: growScale,
                  zIndex: 100
                }}
                onHoverStart={() => setHoveredPhotoId(photo.id)}
                onHoverEnd={() => setHoveredPhotoId(null)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    moveToBack(photo.id);
                  }
                }}
              >
                {/* Actual photo */}
                <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    draggable="false" // Prevent native image dragging
                  />
                </div>
                
                {/* Caption if provided */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                  </div>
                )}
                
                {/* "Drag me" bubble - shown on all cards when hovered */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                    {isMobile ? 'Tap to shuffle' : 'Drag to shuffle'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          <span className="hidden md:inline">Shuffle through my work</span>
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