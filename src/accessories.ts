import type { AccessoryDefinition } from './types';

export const BUILTIN_ACCESSORIES: AccessoryDefinition[] = [
  { id: 'hook-single',     label: 'Hook',              widthHoles: 1, heightHoles: 1, color: '#9e9e9e', isCustom: false },
  { id: 'hook-double',     label: 'Double hook',       widthHoles: 1, heightHoles: 2, color: '#757575', isCustom: false },
  { id: 'hook-s',          label: 'S-hook',            widthHoles: 2, heightHoles: 1, color: '#bdbdbd', isCustom: false },
  { id: 'shelf-small',     label: 'Small shelf',       widthHoles: 4, heightHoles: 2, color: '#c8a96e', isCustom: false },
  { id: 'shelf-large',     label: 'Large shelf',       widthHoles: 6, heightHoles: 2, color: '#b8914a', isCustom: false },
  { id: 'container-small', label: 'Small container',   widthHoles: 2, heightHoles: 2, color: '#e8e0d8', isCustom: false },
  { id: 'container-large', label: 'Large container',   widthHoles: 3, heightHoles: 2, color: '#d8cfc7', isCustom: false },
  { id: 'cable-organizer', label: 'Cable organizer',   widthHoles: 3, heightHoles: 1, color: '#78909c', isCustom: false },
  { id: 'memo-board',      label: 'Memo board',        widthHoles: 3, heightHoles: 3, color: '#fff9c4', isCustom: false },
  { id: 'bin',             label: 'Basket',            widthHoles: 3, heightHoles: 3, color: '#f5f5f5', isCustom: false },
];
