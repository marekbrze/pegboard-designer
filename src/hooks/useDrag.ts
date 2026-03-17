import { useCallback, useRef, useState } from 'react';
import { HOLE_SPACING_PX } from '../constants';
import type { AccessoryDefinition } from '../types';

export interface DragState {
  def: AccessoryDefinition;
  instanceId?: string;   // set when moving an existing placed item
  x: number;             // current pointer position (page coords)
  y: number;
  offsetX: number;       // pointer offset from item top-left
  offsetY: number;
}

export function useDrag() {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const startDrag = useCallback((
    e: React.PointerEvent,
    def: AccessoryDefinition,
    instanceId?: string,
    itemTopLeft?: { x: number; y: number },
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    const offsetX = itemTopLeft
      ? e.clientX - itemTopLeft.x
      : (def.widthHoles * HOLE_SPACING_PX) / 2;
    const offsetY = itemTopLeft
      ? e.clientY - itemTopLeft.y
      : (def.heightHoles * HOLE_SPACING_PX) / 2;

    const state: DragState = { def, instanceId, x: e.clientX, y: e.clientY, offsetX, offsetY };
    dragRef.current = state;
    setDrag(state);
  }, []);

  const moveDrag = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (!dragRef.current) return;
    const next = { ...dragRef.current, x: e.clientX, y: e.clientY };
    dragRef.current = next;
    setDrag(next);
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDrag(null);
  }, []);

  return { drag, startDrag, moveDrag, endDrag };
}
