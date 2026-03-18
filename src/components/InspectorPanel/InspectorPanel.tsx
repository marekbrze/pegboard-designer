import type { AppState, Action } from '../../types';
import { HOLE_SPACING_PX } from '../../constants';
import styles from './InspectorPanel.module.css';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export default function InspectorPanel({ state, dispatch }: Props) {
  const item = state.placed.find(p => p.instanceId === state.selectedInstanceId);
  const def = item ? state.accessories.find(a => a.id === item.definitionId) : null;

  if (!item || !def) {
    return (
      <aside className={styles.root}>
        <h2 className={styles.heading}>Properties</h2>
        <p className={styles.empty}>Click an element on the board to see details</p>
      </aside>
    );
  }

  return (
    <aside className={styles.root}>
      <h2 className={styles.heading}>Properties</h2>

      <div className={styles.preview} style={{ background: def.color }} />

      <table className={styles.table}>
        <tbody>
          <tr><th>Name</th><td>{def.label}</td></tr>
          <tr><th>Position</th><td>col {item.col + 1}, row {item.row + 1}</td></tr>
          <tr><th>Size</th><td>{def.widthHoles} × {def.heightHoles} holes</td></tr>
          <tr><th>Dimensions</th><td>{def.widthHoles * HOLE_SPACING_PX} × {def.heightHoles * HOLE_SPACING_PX} mm</td></tr>
          <tr><th>Side</th><td>{item.side === 'front' ? 'Front' : 'Back'}</td></tr>
        </tbody>
      </table>

      <button
        className={styles.deleteBtn}
        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { instanceId: item.instanceId } })}
      >
        Remove element
      </button>
    </aside>
  );
}
