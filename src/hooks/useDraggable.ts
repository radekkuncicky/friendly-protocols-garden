
import { useState, useCallback } from 'react';

export const useDraggable = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);

  const handleDragStart = useCallback((e: DragEvent) => {
    setIsDragging(true);
    setDraggedElement(e.target as HTMLElement);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedElement(null);
  }, []);

  return {
    isDragging,
    draggedElement,
    handleDragStart,
    handleDragEnd
  };
};
