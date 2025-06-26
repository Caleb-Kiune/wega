import { useState, useRef, useEffect, useCallback } from "react";

// Custom hook for better carousel scroll handling
export const useCarouselScroll = (carouselRef: React.RefObject<HTMLDivElement | null>) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!carouselRef.current) return;

    const { deltaX, deltaY } = e;
    const isVerticalScroll = Math.abs(deltaY) > Math.abs(deltaX);

    if (isVerticalScroll) {
      // Allow vertical scrolling to propagate to parent
      setIsScrolling(false);
      return;
    }

    // Handle horizontal scrolling within carousel
    e.preventDefault();
    setIsScrolling(true);
    
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += deltaX;
    }

    // Clear timeout and set new one
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [carouselRef]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (carouselRef.current) {
      (carouselRef.current as any).touchStartX = touch.clientX;
      (carouselRef.current as any).touchStartY = touch.clientY;
    }
  }, [carouselRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!carouselRef.current) return;
    
    const touch = e.touches[0];
    const startX = (carouselRef.current as any).touchStartX;
    const startY = (carouselRef.current as any).touchStartY;
    
    if (!startX || !startY) return;
    
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    
    // If vertical movement is greater, allow page scrolling
    if (deltaY > deltaX) {
      setIsScrolling(false);
      return;
    }
    
    // Handle horizontal scrolling
    e.preventDefault();
    setIsScrolling(true);
  }, [carouselRef]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [carouselRef, handleWheel, handleTouchStart, handleTouchMove]);

  return { isScrolling };
}; 