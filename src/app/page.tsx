'use client';

import { DnDProvider } from '@/hooks/useDnD';
import Sidebar from '@/components/flow/Sidebar';
import FlowCanvas from '@/components/flow/FlowCanvas';

export default function Home() {
  return (
    <DnDProvider>
      <main className="h-screen w-screen overflow-hidden bg-background flex">
        <Sidebar />
        <FlowCanvas />
      </main>
    </DnDProvider>
  );
}
