export interface ColorSwatch {
  name: string;
  value: string;
}

const COLOR_VALUES = {
  Slate: '#64748b',
  Red: '#ef4444',
  Orange: '#f97316',
  Amber: '#f59e0b',
  Yellow: '#eab308',
  Lime: '#84cc16',
  Green: '#22c55e',
  Emerald: '#10b981',
  Teal: '#14b8a6',
  Cyan: '#06b6d4',
  Sky: '#0ea5e9',
  Blue: '#3b82f6',
  Indigo: '#6366f1',
  Violet: '#8b5cf6',
  Purple: '#a855f7',
  Fuchsia: '#d946ef',
  Pink: '#ec4899',
  Rose: '#f43f5e',
} as const;

const pickColors = (names: (keyof typeof COLOR_VALUES)[]): ColorSwatch[] =>
  names.map((name) => ({ name, value: COLOR_VALUES[name] }));

export const FLOWCHART_NODE_COLORS: ColorSwatch[] = [
  { name: 'Default', value: '' },
  ...pickColors([
    'Slate',
    'Red',
    'Orange',
    'Amber',
    'Green',
    'Emerald',
    'Cyan',
    'Blue',
    'Indigo',
    'Purple',
    'Pink',
  ]),
];

export const SHAPE_COLORS: ColorSwatch[] = pickColors([
  'Slate',
  'Red',
  'Orange',
  'Amber',
  'Green',
  'Emerald',
  'Cyan',
  'Blue',
  'Indigo',
  'Purple',
  'Pink',
  'Rose',
]);

export const GENERIC_NODE_COLORS: ColorSwatch[] = pickColors([
  'Slate',
  'Red',
  'Orange',
  'Amber',
  'Yellow',
  'Lime',
  'Green',
  'Emerald',
  'Teal',
  'Cyan',
  'Sky',
  'Blue',
  'Indigo',
  'Violet',
  'Purple',
  'Fuchsia',
  'Pink',
  'Rose',
]);
