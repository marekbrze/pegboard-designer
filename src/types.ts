export type BoardSize = '36x56' | '56x56' | '76x56' | '56x37';
export type Side = 'front' | 'back';

export interface AccessoryDefinition {
  id: string;
  label: string;
  widthHoles: number;
  heightHoles: number;
  color: string;
  isCustom: boolean;
}

export interface PlacedItem {
  instanceId: string;
  definitionId: string;
  col: number;
  row: number;
  side: Side;
}

export interface AppState {
  boardSize: BoardSize;
  doubleSided: boolean;
  activeSide: Side;
  accessories: AccessoryDefinition[];
  placed: PlacedItem[];
  selectedInstanceId: string | null;
}

export type Action =
  | { type: 'SET_BOARD_SIZE'; payload: BoardSize }
  | { type: 'SET_DOUBLE_SIDED'; payload: boolean }
  | { type: 'SET_ACTIVE_SIDE'; payload: Side }
  | { type: 'PLACE_ITEM'; payload: { definitionId: string; col: number; row: number } }
  | { type: 'MOVE_ITEM'; payload: { instanceId: string; col: number; row: number } }
  | { type: 'REMOVE_ITEM'; payload: { instanceId: string } }
  | { type: 'SELECT_ITEM'; payload: { instanceId: string | null } }
  | { type: 'ADD_CUSTOM'; payload: Omit<AccessoryDefinition, 'id' | 'isCustom'> }
  | { type: 'REMOVE_CUSTOM'; payload: { id: string } }
  | { type: 'IMPORT_STATE'; payload: AppState };
