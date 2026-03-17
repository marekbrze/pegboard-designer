import { useRef } from 'react';
import type { AppState, Action } from '../../types';
import styles from './ExportBar.module.css';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export default function ExportBar({ state, dispatch }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skadis-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as AppState;
        if (parsed.boardSize && parsed.placed && parsed.accessories) {
          dispatch({ type: 'IMPORT_STATE', payload: parsed });
        } else {
          alert('Nieprawidłowy plik konfiguracji');
        }
      } catch {
        alert('Błąd odczytu pliku');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  const itemCount = state.placed.length;

  return (
    <div className={styles.root}>
      <span className={styles.count}>
        {itemCount} {itemCount === 1 ? 'element' : itemCount < 5 ? 'elementy' : 'elementów'} na tablicy
      </span>
      <div className={styles.actions}>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <button className={styles.btn} onClick={() => fileInputRef.current?.click()}>
          Importuj JSON
        </button>
        <button className={`${styles.btn} ${styles.primary}`} onClick={handleExport}>
          Eksportuj JSON
        </button>
      </div>
    </div>
  );
}
