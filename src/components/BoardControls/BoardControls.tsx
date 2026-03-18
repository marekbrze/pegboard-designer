import { BOARD_HOLES } from '../../constants';
import type { AppState, Action, BoardSize } from '../../types';
import styles from './BoardControls.module.css';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const SIZES: BoardSize[] = ['36x56', '56x56', '76x56', '56x37'];

export default function BoardControls({ state, dispatch }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <span className={styles.label}>Board size</span>
        <div className={styles.sizeButtons}>
          {SIZES.map(size => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${state.boardSize === size ? styles.active : ''}`}
              onClick={() => dispatch({ type: 'SET_BOARD_SIZE', payload: size })}
            >
              {BOARD_HOLES[size].label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={state.doubleSided}
            onChange={e => dispatch({ type: 'SET_DOUBLE_SIDED', payload: e.target.checked })}
          />
          <span>Double-sided (standing)</span>
        </label>
      </div>

      {state.doubleSided && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${state.activeSide === 'front' ? styles.activeTab : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'front' })}
          >
            Front
          </button>
          <button
            className={`${styles.tab} ${state.activeSide === 'back' ? styles.activeTab : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' })}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
