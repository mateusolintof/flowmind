import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type DiscoveryPhase =
  | 'idle'
  | 'loading'
  | 'questioning'
  | 'summarizing'
  | 'generating'
  | 'complete'
  | 'error';

export interface QAItem {
  question: string;
  answer: string;
}

export interface DiscoverySummary {
  title: string;
  summary: string;
  components: string[];
  dataFlow: string;
}

export interface DiscoveryState {
  // UI state
  isOpen: boolean;
  phase: DiscoveryPhase;

  // Conversation data
  currentQuestion: string;
  qaHistory: QAItem[];
  summary: DiscoverySummary | null;

  // Error handling
  error: string | null;

  // Actions
  open: () => void;
  close: () => void;
  setPhase: (phase: DiscoveryPhase) => void;
  setCurrentQuestion: (question: string) => void;
  addQA: (question: string, answer: string) => void;
  setSummary: (summary: DiscoverySummary) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed
  getConversationText: () => string;
}

const initialState = {
  isOpen: false,
  phase: 'idle' as DiscoveryPhase,
  currentQuestion: '',
  qaHistory: [] as QAItem[],
  summary: null as DiscoverySummary | null,
  error: null as string | null,
};

export const useDiscoveryStore = create<DiscoveryState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      open: () =>
        set((state) => {
          state.isOpen = true;
          state.phase = 'loading';
        }),

      close: () =>
        set((state) => {
          state.isOpen = false;
        }),

      setPhase: (phase) =>
        set((state) => {
          state.phase = phase;
        }),

      setCurrentQuestion: (question) =>
        set((state) => {
          state.currentQuestion = question;
          state.phase = 'questioning';
        }),

      addQA: (question, answer) =>
        set((state) => {
          state.qaHistory.push({ question, answer });
        }),

      setSummary: (summary) =>
        set((state) => {
          state.summary = summary;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
          if (error) {
            state.phase = 'error';
          }
        }),

      reset: () => set(initialState),

      // Computed
      getConversationText: () => {
        const { qaHistory } = get();
        return qaHistory
          .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
          .join('\n\n');
      },
    })),
    { name: 'discovery-store' }
  )
);

// Selectors for performance
export const useDiscoveryOpen = () => useDiscoveryStore((s) => s.isOpen);
export const useDiscoveryPhase = () => useDiscoveryStore((s) => s.phase);
