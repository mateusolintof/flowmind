'use client';

import { createContext, useContext, useState, PropsWithChildren } from 'react';

type DnDContextType = {
    type: string | null;
    setType: (type: string | null) => void;
};

const DnDContext = createContext<DnDContextType>({
    type: null,
    setType: () => { },
});

export const useDnD = () => {
    return useContext(DnDContext);
};

export const DnDProvider = ({ children }: PropsWithChildren) => {
    const [type, setType] = useState<string | null>(null);

    return (
        <DnDContext.Provider value={{ type, setType }}>
            {children}
        </DnDContext.Provider>
    );
};
