import { useState } from 'react';

interface DragScrollXProps {
  onDrag: (distance: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const useDragScrollX = ({ onDrag, onStart, onEnd }: DragScrollXProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    onStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const diffX = e.clientX - startX;
      onDrag(diffX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onEnd?.();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    onStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const diffX = e.touches[0].clientX - startX;
      onDrag(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    onEnd?.();
  };

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};
