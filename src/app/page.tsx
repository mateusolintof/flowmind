'use client';

import { DnDProvider } from '@/hooks/drawing/useDnD';
import { ResponsiveLayout } from '@/components/flow/ResponsiveLayout';
import FlowCanvas from '@/components/flow/FlowCanvas';

export default function Home() {
  return (
    <DnDProvider>
      <ResponsiveLayout>
        <FlowCanvas />
      </ResponsiveLayout>
    </DnDProvider>
  );
}
