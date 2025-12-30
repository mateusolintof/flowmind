import { cn } from '@/lib/utils';

export const NODE_RESIZER_HANDLE_STYLE = { width: 8, height: 8, borderRadius: 2 };
export const NODE_RESIZER_LINE_STYLE = { border: 0 };

export const getBaseHandleClassName = (selected: boolean) =>
  cn(
    'w-3 h-3 bg-muted-foreground border-2 border-background transition-opacity',
    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
  );

export const getFlowHandleClassName = (selected: boolean) =>
  cn(
    '!w-3 !h-3 !bg-slate-400 !border-2 !border-white transition-opacity',
    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
  );
