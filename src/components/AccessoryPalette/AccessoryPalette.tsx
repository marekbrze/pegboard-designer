import type { AppState, Action, AccessoryDefinition } from '../../types';
import type { DragState } from '../../hooks/useDrag';
import PaletteItem from './PaletteItem';
import CustomElementForm from './CustomElementForm';
import styles from './AccessoryPalette.module.css';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  drag: DragState | null;
  onPointerDown: (e: React.PointerEvent, def: AccessoryDefinition) => void;
}

export default function AccessoryPalette({ state, dispatch, drag, onPointerDown }: Props) {
  const builtins = state.accessories.filter(a => !a.isCustom);
  const customs = state.accessories.filter(a => a.isCustom);

  return (
    <aside className={styles.root}>
      <h2 className={styles.heading}>Accessories</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Standard</h3>
        <div className={styles.list}>
          {builtins.map(def => (
            <PaletteItem
              key={def.id}
              def={def}
              onPointerDown={onPointerDown}
              isDragging={drag?.def.id === def.id && !drag.instanceId}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Custom elements</h3>
        <div className={styles.list}>
          {customs.map(def => (
            <PaletteItem
              key={def.id}
              def={def}
              onPointerDown={onPointerDown}
              isDragging={drag?.def.id === def.id && !drag.instanceId}
              onRemove={() => dispatch({ type: 'REMOVE_CUSTOM', payload: { id: def.id } })}
            />
          ))}
        </div>
        <CustomElementForm dispatch={dispatch} />
      </section>

      <div className={styles.hint}>
        Drag an element onto the board
      </div>
    </aside>
  );
}
