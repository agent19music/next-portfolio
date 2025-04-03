"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
  link?: string;
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
  // State to track focused photo (for keyboard navigation)
  const [focusedPhotoId, setFocusedPhotoId] = useState<number | null>(null);
  // Track cursor type
  const [cursor, setCursor] = useState('grab');
  
  // Container for the entire component
  const containerRef = useRef<HTMLDivElement>(null);
  // Track mouse position for more natural drag
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Function to move a photo to the back of the stack
  const moveToBack = (id: number) => {
    setPhotoStack(prev => {
      const item = prev.find(photo => photo.id === id);
      if (!item) return prev;
      
      const filteredStack = prev.filter(photo => photo.id !== id);
      return [...filteredStack, item];
    });
  };

  // Function to move a photo to the front of the stack
  const moveToFront = (id: number) => {
    setPhotoStack(prev => {
      const item = prev.find(photo => photo.id === id);
      if (!item) return prev;
      
      const filteredStack = prev.filter(photo => photo.id !== id);
      return [item, ...filteredStack];
    });
  };

  // Function to handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, photoId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveToBack(photoId);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
               e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = photoStack.findIndex(p => p.id === photoId);
      let newIndex;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = (currentIndex - 1 + photoStack.length) % photoStack.length;
      } else {
        newIndex = (currentIndex + 1) % photoStack.length;
      }
      
      setFocusedPhotoId(photoStack[newIndex].id);
    }
  };

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

  // Update mouse position for better drag experience
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

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

  // Handle cursor style for the entire container based on state
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = cursor;
    }
  }, [cursor]);

  return (
    <div 
      className="w-full flex justify-center items-center py-12 relative select-none"
      ref={containerRef}
      onMouseDown={() => setCursor('grabbing')}
      onMouseUp={() => setCursor('grab')}
      onMouseLeave={() => setCursor('grab')}
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
            // Track if this card is currently focused
            const isFocused = focusedPhotoId === photo.id;
            
            return (
              <motion.div
                key={photo.id}
                className={`absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus:outline-none ${isFocused ? 'z-50' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isFocused ? growScale : 1,
                  opacity: 1,
                  x: offset.x * stackSpacing,
                  y: offset.y * stackSpacing,
                  rotate: offset.rotate,
                  zIndex: isFocused ? 100 : zIndex,
                  boxShadow: isFocused 
                    ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  duration: 0.4 
                }}
                style={{ 
                  transformOrigin: 'center center',
                }}
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                dragElastic={0.1}
                dragTransition={{ 
                  bounceStiffness: 500, 
                  bounceDamping: 40 
                }}
                whileDrag={{ 
                  scale: 1.05, 
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                  zIndex: 100 
                }}
                whileHover={{ 
                  scale: growScale, 
                  zIndex: 100,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)'
                }}
                onDragStart={() => {
                  setIsDragging(true);
                  setCursor('grabbing');
                }}
                onDragEnd={(e, info) => {
                  // If dragged a significant distance, move to back of stack
                  const dragDistance = Math.sqrt(
                    Math.pow(info.offset.x, 2) + 
                    Math.pow(info.offset.y, 2)
                  );
                  
                  if (dragDistance > 50) {
                    moveToBack(photo.id);
                  }
                  
                  setIsDragging(false);
                  setCursor('grab');
                }}
                onClick={(e) => {
                  // Only handle click if not dragging
                  if (!isDragging) {
                    // Double click to bring to front, single click to send to back
                    if (e.detail === 2) {
                      moveToFront(photo.id);
                    } else {
                      moveToBack(photo.id);
                    }
                  }
                }}
                onMouseEnter={() => setFocusedPhotoId(photo.id)}
                onMouseLeave={() => setFocusedPhotoId(null)}
                onFocus={() => setFocusedPhotoId(photo.id)}
                onBlur={() => setFocusedPhotoId(null)}
                onKeyDown={(e) => handleKeyDown(e, photo.id)}
                tabIndex={0}
              >
                <img 
                  src={photo.src} 
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  draggable="false" // Prevent native image dragging
                />
                
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 transform transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                  </div>
                )}
                
                {/* Add subtle overlay with instructions on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                    {index === 0 ? 'Drag me!' : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          <span className="hidden md:inline">Drag photos, click to shuffle, double-click to bring forward</span>
          <span className="md:hidden">Drag or tap photos to shuffle</span>
        </p>
      </div>
    </div>
  );
};

export default StackedPhotoCollection;