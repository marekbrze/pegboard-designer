import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { reducer, DEFAULT_STATE } from './reducer';
import { loadState, saveState } from './utils/storage';
import { pixelToHole, isValidPlacement } from './utils/grid';
import { BOARD_HOLES, HOLE_SPACING_PX, BOARD_PADDING_PX } from './constants';
import type { AccessoryDefinition } from './types';
import { useDrag } from './hooks/useDrag';
import BoardControls from './components/BoardControls/BoardControls';
import AccessoryPalette from './components/AccessoryPalette/AccessoryPalette';
import BoardCanvas from './components/BoardCanvas/BoardCanvas';
import InspectorPanel from './components/InspectorPanel/InspectorPanel';
import ExportBar from './components/ExportBar/ExportBar';
import styles from './App.module.css';

const initialState = loadState() ?? DEFAULT_STATE;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { drag, startDrag, moveDrag, endDrag } = useDrag();
  const boardRef = useRef<HTMLDivElement>(null);

  // Floating ghost element that follows the pointer globally
  const [ghostStyle, setGhostStyle] = useState<React.CSSProperties>({ display: 'none' });

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update floating ghost position on every drag move
  useEffect(() => {
    if (!drag) {
      setGhostStyle({ display: 'none' });
      return;
    }
    setGhostStyle({
      display: 'block',
      position: 'fixed',
      left: drag.x - drag.offsetX,
      top:  drag.y - drag.offsetY,
      width:  drag.def.widthHoles  * HOLE_SPACING_PX,
      height: drag.def.heightHoles * HOLE_SPACING_PX,
      background: drag.def.color,
      border: '2px solid rgba(0,0,0,0.3)',
      borderRadius: 5,
      opacity: 0.75,
      pointerEvents: 'none',
      zIndex: 9999,
    });
  }, [drag]);

  // Global pointer move & up listeners (catch events outside the originating element)
  useEffect(() => {
    const onMove = (e: PointerEvent) => moveDrag(e);
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [moveDrag]);

  useEffect(() => {
    const onUp = (e: PointerEvent) => {
      if (!drag || !boardRef.current) { endDrag(); return; }

      const rect = boardRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const { cols, rows } = BOARD_HOLES[state.boardSize];
      const { col, row } = pixelToHole(localX, localY, drag.def.widthHoles, drag.def.heightHoles);
      const sideItems = state.placed.filter(p => p.side === state.activeSide);

      // Check pointer is within board bounds (visually)
      const inBoard = localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height;

      if (inBoard) {
        if (drag.instanceId) {
          dispatch({ type: 'MOVE_ITEM', payload: { instanceId: drag.instanceId, col, row } });
        } else {
          dispatch({ type: 'PLACE_ITEM', payload: { definitionId: drag.def.id, col, row } });
        }
      }

      endDrag();
    };

    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [drag, state, endDrag]);

  const handlePalettePointerDown = useCallback((e: React.PointerEvent, def: AccessoryDefinition) => {
    e.preventDefault();
    startDrag(e, def);
  }, [startDrag]);

  const handleItemPointerDown = useCallback((
    e: React.PointerEvent,
    def: AccessoryDefinition,
    instanceId: string,
    itemTopLeft: { x: number; y: number },
  ) => {
    e.preventDefault();
    startDrag(e, def, instanceId, itemTopLeft);
  }, [startDrag]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Board Configurator</h1>
        <BoardControls state={state} dispatch={dispatch} />
      </header>

      <main className={styles.main}>
        <AccessoryPalette
          state={state}
          dispatch={dispatch}
          drag={drag}
          onPointerDown={handlePalettePointerDown}
        />

        <div className={styles.canvasArea}>
          <BoardCanvas
            state={state}
            dispatch={dispatch}
            drag={drag}
            onPointerDownItem={handleItemPointerDown}
            onPointerMove={moveDrag}
            onPointerUp={() => {}}
            ref={boardRef}
          />
        </div>

        <InspectorPanel state={state} dispatch={dispatch} />
      </main>

      <ExportBar state={state} dispatch={dispatch} />

      {/* Global floating ghost */}
      <div style={ghostStyle} />
    </div>
  );
}
