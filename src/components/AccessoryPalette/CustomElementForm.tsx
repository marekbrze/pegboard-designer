import { useState } from 'react';
import type { Action } from '../../types';
import styles from './CustomElementForm.module.css';

const HOLE_SPACING_MM = 40;

interface Props {
  dispatch: React.Dispatch<Action>;
}

const PRESET_COLORS = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ce93d8', '#4db6ac', '#90a4ae', '#f06292'];

function mmToHoles(mm: number): number {
  return Math.max(1, Math.round(mm / HOLE_SPACING_MM));
}

export default function CustomElementForm({ dispatch }: Props) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [wMm, setWMm] = useState(80);
  const [hMm, setHMm] = useState(80);
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const wHoles = mmToHoles(wMm);
  const hHoles = mmToHoles(hMm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    dispatch({ type: 'ADD_CUSTOM', payload: { label: label.trim(), widthHoles: wHoles, heightHoles: hHoles, color } });
    setLabel('');
    setWMm(80);
    setHMm(80);
    setOpen(false);
  }

  if (!open) {
    return (
      <button className={styles.addBtn} onClick={() => setOpen(true)}>
        + Add custom element
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Element name"
        value={label}
        onChange={e => setLabel(e.target.value)}
        autoFocus
      />
      <div className={styles.dims}>
        <label className={styles.dimLabel}>
          Width
          <input
            type="number" min={1} step={1} value={wMm}
            onChange={e => setWMm(Math.max(1, +e.target.value))}
            className={styles.numInput}
          />
          <span className={styles.dimUnit}>mm</span>
        </label>
        <label className={styles.dimLabel}>
          Height
          <input
            type="number" min={1} step={1} value={hMm}
            onChange={e => setHMm(Math.max(1, +e.target.value))}
            className={styles.numInput}
          />
          <span className={styles.dimUnit}>mm</span>
        </label>
      </div>
      <div className={styles.holesInfo}>
        = {wHoles} × {hHoles} holes
      </div>
      <div className={styles.colorRow}>
        <span className={styles.colorLabel}>Color</span>
        <div className={styles.colorSwatches}>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`${styles.swatch} ${color === c ? styles.activeSwatch : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className={styles.colorPicker}
            title="Custom color"
          />
        </div>
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={!label.trim()}>
          Add
        </button>
        <button type="button" className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
