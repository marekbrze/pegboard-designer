import { HOLE_SPACING_PX, BOARD_PADDING_PX } from '../../constants';
import type { PlacedItem, AccessoryDefinition } from '../../types';
import styles from './PlacedAccessory.module.css';

interface Props {
  item: PlacedItem;
  def: AccessoryDefinition;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onPointerDown: (e: React.PointerEvent, def: AccessoryDefinition, instanceId: string, itemTopLeft: { x: number; y: number }) => void;
}

export default function PlacedAccessory({ item, def, isSelected, isDragging, onSelect, onPointerDown }: Props) {
  const left = BOARD_PADDING_PX + item.col * HOLE_SPACING_PX;
  const top  = BOARD_PADDING_PX + item.row * HOLE_SPACING_PX;
  const w    = def.widthHoles  * HOLE_SPACING_PX;
  const h    = def.heightHoles * HOLE_SPACING_PX;

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onPointerDown={e => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onPointerDown(e, def, item.instanceId, { x: rect.left, y: rect.top });
      }}
      onClick={e => { e.stopPropagation(); onSelect(); }}
      style={{ left, top, width: w, height: h, background: def.color }}
      title={def.label}
    >
      <span className={styles.label}>{def.label}</span>
    </div>
  );
}
