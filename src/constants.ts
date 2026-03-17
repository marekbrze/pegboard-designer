import type { BoardSize } from './types';

export const HOLE_SPACING_PX = 40;
export const HOLE_RADIUS_PX = 5;
export const BOARD_PADDING_PX = 24;

export const BOARD_HOLES: Record<BoardSize, { cols: number; rows: number; label: string }> = {
  '36x56': { cols: 9,  rows: 14, label: '36 × 56 cm' },
  '56x56': { cols: 14, rows: 14, label: '56 × 56 cm' },
  '76x56': { cols: 19, rows: 14, label: '76 × 56 cm' },
};
