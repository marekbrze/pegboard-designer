import { forwardRef } from 'react';
import { HOLE_SPACING_PX, BOARD_PADDING_PX, BOARD_HOLES } from '../../constants';
import { pixelToHole, isValidPlacement } from '../../utils/grid';
import type { AppState, Action, AccessoryDefinition } from '../../types';
import type { DragState } from '../../hooks/useDrag';
import BoardGrid from './BoardGrid';
import PlacedAccessory from './PlacedAccessory';
import styles from './BoardCanvas.module.css';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  drag: DragState | null;
  onPointerDownItem: (e: React.PointerEvent, def: AccessoryDefinition, instanceId: string, itemTopLeft: { x: number; y: number }) => void;
  // unused but kept for API compat
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}

const BoardCanvas = forwardRef<HTMLDivElement, Props>(function BoardCanvas(
  { state, dispatch, drag, onPointerDownItem },
  ref,
) {
  const { cols, rows } = BOARD_HOLES[state.boardSize];
  const boardW = cols * HOLE_SPACING_PX + BOARD_PADDING_PX * 2;
  const boardH = rows * HOLE_SPACING_PX + BOARD_PADDING_PX * 2;
  const isBack = state.activeSide === 'back';
  const sideItems = state.placed.filter(p => p.side === state.activeSide);

  // Compute snap ghost — needs board rect, read from ref
  let ghost: { col: number; row: number; valid: boolean } | null = null;
  if (drag && ref && 'current' in ref && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const localX = drag.x - rect.left;
    const localY = drag.y - rect.top;
    const inBounds = localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height;
    if (inBounds) {
      const { col, row } = pixelToHole(localX, localY, drag.def.widthHoles, drag.def.heightHoles);
      const valid = isValidPlacement(col, row, drag.def, cols, rows, sideItems, state.accessories, drag.instanceId);
      ghost = { col, row, valid };
    }
  }

  return (
    <div className={styles.wrapper}>
      {isBack && (
        <div className={styles.backBadge}>Back (same layout as front — not mirrored)</div>
      )}
      <div
        ref={ref}
        className={styles.board}
        style={{ width: boardW, height: boardH }}
        onClick={() => dispatch({ type: 'SELECT_ITEM', payload: { instanceId: null } })}
      >
        <BoardGrid cols={cols} rows={rows} isBack={isBack} />

        {sideItems.map(item => {
          const def = state.accessories.find(a => a.id === item.definitionId);
          if (!def) return null;
          return (
            <PlacedAccessory
              key={item.instanceId}
              item={item}
              def={def}
              isSelected={state.selectedInstanceId === item.instanceId}
              isDragging={drag?.instanceId === item.instanceId}
              onSelect={() => dispatch({ type: 'SELECT_ITEM', payload: { instanceId: item.instanceId } })}
              onPointerDown={onPointerDownItem}
            />
          );
        })}

        {ghost && drag && (
          <div
            className={`${styles.ghost} ${ghost.valid ? styles.ghostValid : styles.ghostInvalid}`}
            style={{
              left:   BOARD_PADDING_PX + ghost.col * HOLE_SPACING_PX,
              top:    BOARD_PADDING_PX + ghost.row * HOLE_SPACING_PX,
              width:  drag.def.widthHoles  * HOLE_SPACING_PX,
              height: drag.def.heightHoles * HOLE_SPACING_PX,
            }}
          />
        )}
      </div>
    </div>
  );
});

export default BoardCanvas;
