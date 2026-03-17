import { BUILTIN_ACCESSORIES } from './accessories';
import { BOARD_HOLES } from './constants';
import { isValidPlacement } from './utils/grid';
import type { AppState, Action, PlacedItem } from './types';

export const DEFAULT_STATE: AppState = {
  boardSize: '56x56',
  doubleSided: false,
  activeSide: 'front',
  accessories: [...BUILTIN_ACCESSORIES],
  placed: [],
  selectedInstanceId: null,
};

function itemFitsBoard(item: PlacedItem, state: AppState): boolean {
  const { cols, rows } = BOARD_HOLES[state.boardSize];
  const def = state.accessories.find(d => d.id === item.definitionId);
  if (!def) return false;
  return item.col >= 0 && item.row >= 0 &&
    item.col + def.widthHoles <= cols &&
    item.row + def.heightHoles <= rows;
}

let instanceCounter = 0;
function newId(): string {
  return `item-${Date.now()}-${++instanceCounter}`;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_BOARD_SIZE': {
      const nextState = { ...state, boardSize: action.payload };
      return {
        ...nextState,
        placed: state.placed.filter(p => itemFitsBoard(p, nextState)),
        selectedInstanceId: null,
      };
    }

    case 'SET_DOUBLE_SIDED':
      return {
        ...state,
        doubleSided: action.payload,
        activeSide: 'front',
        placed: action.payload ? state.placed : state.placed.filter(p => p.side === 'front'),
      };

    case 'SET_ACTIVE_SIDE':
      return { ...state, activeSide: action.payload, selectedInstanceId: null };

    case 'PLACE_ITEM': {
      const { definitionId, col, row } = action.payload;
      const def = state.accessories.find(d => d.id === definitionId);
      if (!def) return state;
      const { cols, rows } = BOARD_HOLES[state.boardSize];
      const sideItems = state.placed.filter(p => p.side === state.activeSide);
      if (!isValidPlacement(col, row, def, cols, rows, sideItems, state.accessories)) {
        return state;
      }
      const newItem: PlacedItem = {
        instanceId: newId(),
        definitionId,
        col,
        row,
        side: state.activeSide,
      };
      return { ...state, placed: [...state.placed, newItem], selectedInstanceId: newItem.instanceId };
    }

    case 'MOVE_ITEM': {
      const { instanceId, col, row } = action.payload;
      const item = state.placed.find(p => p.instanceId === instanceId);
      if (!item) return state;
      const def = state.accessories.find(d => d.id === item.definitionId);
      if (!def) return state;
      const { cols, rows } = BOARD_HOLES[state.boardSize];
      const sideItems = state.placed.filter(p => p.side === item.side);
      if (!isValidPlacement(col, row, def, cols, rows, sideItems, state.accessories, instanceId)) {
        return state;
      }
      return {
        ...state,
        placed: state.placed.map(p =>
          p.instanceId === instanceId ? { ...p, col, row } : p
        ),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        placed: state.placed.filter(p => p.instanceId !== action.payload.instanceId),
        selectedInstanceId: state.selectedInstanceId === action.payload.instanceId
          ? null : state.selectedInstanceId,
      };

    case 'SELECT_ITEM':
      return { ...state, selectedInstanceId: action.payload.instanceId };

    case 'ADD_CUSTOM': {
      const id = `custom-${Date.now()}`;
      return {
        ...state,
        accessories: [...state.accessories, { ...action.payload, id, isCustom: true }],
      };
    }

    case 'REMOVE_CUSTOM':
      return {
        ...state,
        accessories: state.accessories.filter(a => a.id !== action.payload.id),
        placed: state.placed.filter(p => p.definitionId !== action.payload.id),
        selectedInstanceId: state.placed.find(
          p => p.definitionId === action.payload.id && p.instanceId === state.selectedInstanceId
        ) ? null : state.selectedInstanceId,
      };

    case 'IMPORT_STATE':
      return action.payload;

    default:
      return state;
  }
}
