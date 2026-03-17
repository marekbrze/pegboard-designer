import type { AccessoryDefinition } from './types';

export const BUILTIN_ACCESSORIES: AccessoryDefinition[] = [
  { id: 'hook-single',     label: 'Haczyk',           widthHoles: 1, heightHoles: 1, color: '#9e9e9e', isCustom: false },
  { id: 'hook-double',     label: 'Haczyk podwójny',  widthHoles: 1, heightHoles: 2, color: '#757575', isCustom: false },
  { id: 'hook-s',          label: 'Haczyk S',         widthHoles: 2, heightHoles: 1, color: '#bdbdbd', isCustom: false },
  { id: 'shelf-small',     label: 'Półka mała',       widthHoles: 4, heightHoles: 2, color: '#c8a96e', isCustom: false },
  { id: 'shelf-large',     label: 'Półka duża',       widthHoles: 6, heightHoles: 2, color: '#b8914a', isCustom: false },
  { id: 'container-small', label: 'Pojemnik mały',    widthHoles: 2, heightHoles: 2, color: '#e8e0d8', isCustom: false },
  { id: 'container-large', label: 'Pojemnik duży',    widthHoles: 3, heightHoles: 2, color: '#d8cfc7', isCustom: false },
  { id: 'cable-organizer', label: 'Organizer kabli',  widthHoles: 3, heightHoles: 1, color: '#78909c', isCustom: false },
  { id: 'memo-board',      label: 'Tablica memo',     widthHoles: 3, heightHoles: 3, color: '#fff9c4', isCustom: false },
  { id: 'bin',             label: 'Koszyk',           widthHoles: 3, heightHoles: 3, color: '#f5f5f5', isCustom: false },
];
