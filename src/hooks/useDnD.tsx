'use client';

import { createContext, useContext, useState, useMemo, PropsWithChildren } from 'react';

type DnDContextType = {
  type: string | null;
  setType: (type: string | null) => void;
};

const DnDContext = createContext<DnDContextType | null>(null);

export const useDnD = () => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within DnDProvider');
  }
  return context;
};

export const DnDProvider = ({ children }: PropsWithChildren) => {
  const [type, setType] = useState<string | null>(null);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({ type, setType }), [type]);

  return (
    <DnDContext.Provider value={value}>
      {children}
    </DnDContext.Provider>
  );
};
