export type CommandAction =
  | 'undo'
  | 'redo'
  | 'save'
  | 'export'
  | 'duplicate'
  | 'copy'
  | 'cut'
  | 'paste';

export interface CommandShortcut {
  action: CommandAction;
  key: string;
  shift?: boolean;
  label: string;
  display: string;
}

export const COMMAND_SHORTCUTS: CommandShortcut[] = [
  { action: 'undo', key: 'z', label: 'Undo', display: 'Cmd/Ctrl+Z' },
  { action: 'redo', key: 'z', shift: true, label: 'Redo', display: 'Cmd/Ctrl+Shift+Z' },
  { action: 'save', key: 's', label: 'Save', display: 'Cmd/Ctrl+S' },
  { action: 'export', key: 'e', label: 'Export', display: 'Cmd/Ctrl+E' },
  { action: 'duplicate', key: 'd', label: 'Duplicate', display: 'Cmd/Ctrl+D' },
  { action: 'copy', key: 'c', label: 'Copy', display: 'Cmd/Ctrl+C' },
  { action: 'cut', key: 'x', label: 'Cut', display: 'Cmd/Ctrl+X' },
  { action: 'paste', key: 'v', label: 'Paste', display: 'Cmd/Ctrl+V' },
];

export const GENERAL_SHORTCUTS = [
  ...COMMAND_SHORTCUTS.map((shortcut) => ({
    display: shortcut.display,
    label: shortcut.label,
  })),
  { display: 'Delete/Backspace', label: 'Delete' },
];

export const MODE_SHORTCUTS = [
  { display: 'D', label: 'Toggle Draw' },
  { display: 'C', label: 'Colors' },
  { display: 'Esc', label: 'Exit Mode' },
];
