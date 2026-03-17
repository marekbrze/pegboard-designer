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
        <h2 className={styles.heading}>Właściwości</h2>
        <p className={styles.empty}>Kliknij element na tablicy, aby zobaczyć szczegóły</p>
      </aside>
    );
  }

  return (
    <aside className={styles.root}>
      <h2 className={styles.heading}>Właściwości</h2>

      <div className={styles.preview} style={{ background: def.color }} />

      <table className={styles.table}>
        <tbody>
          <tr><th>Nazwa</th><td>{def.label}</td></tr>
          <tr><th>Pozycja</th><td>kol {item.col + 1}, wiersz {item.row + 1}</td></tr>
          <tr><th>Rozmiar</th><td>{def.widthHoles} × {def.heightHoles} otw.</td></tr>
          <tr><th>Wymiary</th><td>{def.widthHoles * HOLE_SPACING_PX} × {def.heightHoles * HOLE_SPACING_PX} mm</td></tr>
          <tr><th>Strona</th><td>{item.side === 'front' ? 'Przód' : 'Tył'}</td></tr>
        </tbody>
      </table>

      <button
        className={styles.deleteBtn}
        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { instanceId: item.instanceId } })}
      >
        Usuń element
      </button>
    </aside>
  );
}
