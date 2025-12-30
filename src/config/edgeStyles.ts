export type EdgeStyleType = 'bezier' | 'smoothstep' | 'straight';

export const EDGE_LABEL_PRESETS = {
  success: { bg: '#dcfce7', text: '#166534', label: 'Success' },
  warning: { bg: '#fef3c7', text: '#92400e', label: 'Warning' },
  error: { bg: '#fee2e2', text: '#991b1b', label: 'Error' },
  info: { bg: '#dbeafe', text: '#1e40af', label: 'Info' },
  neutral: { bg: '#f1f5f9', text: '#475569', label: 'Neutral' },
} as const;

export type EdgeLabelPreset = keyof typeof EDGE_LABEL_PRESETS;

export const EDGE_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Blue', value: 'hsl(217, 91%, 60%)' },
  { name: 'Green', value: 'hsl(142, 71%, 45%)' },
  { name: 'Red', value: 'hsl(0, 84%, 60%)' },
  { name: 'Orange', value: 'hsl(25, 95%, 53%)' },
  { name: 'Purple', value: 'hsl(263, 70%, 50%)' },
  { name: 'Cyan', value: 'hsl(186, 100%, 42%)' },
];
