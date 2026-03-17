import type { AccessoryDefinition } from '../../types';
import type { DragState } from '../../hooks/useDrag';
import styles from './PaletteItem.module.css';

interface Props {
  def: AccessoryDefinition;
  onRemove?: () => void;
  onPointerDown: (e: React.PointerEvent, def: AccessoryDefinition) => void;
  isDragging: boolean;
}

export default function PaletteItem({ def, onRemove, onPointerDown, isDragging }: Props) {
  const previewW = Math.min(def.widthHoles, 4) * 20;
  const previewH = Math.min(def.heightHoles, 4) * 20;

  return (
    <div
      className={`${styles.item} ${isDragging ? styles.dragging : ''}`}
      onPointerDown={e => onPointerDown(e, def)}
      title={`${def.label} (${def.widthHoles}×${def.heightHoles})`}
    >
      <div
        className={styles.preview}
        style={{ width: previewW, height: previewH, background: def.color }}
      />
      <div className={styles.info}>
        <span className={styles.name}>{def.label}</span>
        <span className={styles.size}>{def.widthHoles}×{def.heightHoles} otw.</span>
      </div>
      {onRemove && (
        <button
          className={styles.removeBtn}
          onPointerDown={e => e.stopPropagation()}
          onClick={onRemove}
          title="Usuń typ"
        >×</button>
      )}
    </div>
  );
}

// re-export for use in AccessoryPalette
export type { DragState };
