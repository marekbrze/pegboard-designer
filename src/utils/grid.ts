import { HOLE_SPACING_PX, BOARD_PADDING_PX } from '../constants';
import type { PlacedItem, AccessoryDefinition } from '../types';

export function pixelToHole(
  localX: number,
  localY: number,
  widthHoles: number,
  heightHoles: number,
): { col: number; row: number } {
  const col = Math.round((localX - BOARD_PADDING_PX - (widthHoles * HOLE_SPACING_PX) / 2) / HOLE_SPACING_PX);
  const row = Math.round((localY - BOARD_PADDING_PX - (heightHoles * HOLE_SPACING_PX) / 2) / HOLE_SPACING_PX);
  return { col, row };
}

export function getOccupiedCells(item: PlacedItem, def: AccessoryDefinition): string[] {
  const cells: string[] = [];
  for (let c = item.col; c < item.col + def.widthHoles; c++) {
    for (let r = item.row; r < item.row + def.heightHoles; r++) {
      cells.push(`${c},${r}`);
    }
  }
  return cells;
}

export function isValidPlacement(
  col: number,
  row: number,
  def: AccessoryDefinition,
  cols: number,
  rows: number,
  placed: PlacedItem[],
  defs: AccessoryDefinition[],
  excludeInstanceId?: string,
): boolean {
  if (col < 0 || row < 0) return false;
  if (col + def.widthHoles > cols) return false;
  if (row + def.heightHoles > rows) return false;

  const occupied = new Set<string>();
  for (const p of placed) {
    if (p.instanceId === excludeInstanceId) continue;
    const pDef = defs.find(d => d.id === p.definitionId);
    if (!pDef) continue;
    for (const cell of getOccupiedCells(p, pDef)) {
      occupied.add(cell);
    }
  }

  for (let c = col; c < col + def.widthHoles; c++) {
    for (let r = row; r < row + def.heightHoles; r++) {
      if (occupied.has(`${c},${r}`)) return false;
    }
  }
  return true;
}
