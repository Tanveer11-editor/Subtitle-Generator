import { create } from 'zustand';

export interface WordData {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface Caption {
  id: string;
  text: string;
  start: number;
  end: number;
  words: WordData[];
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: string;
  scope: 'character' | 'word' | 'line' | 'caption';
  duration: number;
  easing: string;
  properties: any;
}

export interface ProjectState {
  id: string;
  name: string;
  mediaUrl: string | null;
  mediaType: 'video' | 'audio' | null;
  duration: number;
  captions: Caption[];
  activeCaptionId: string | null;
  currentTime: number;
  isPlaying: boolean;
  
  // Style and animations
  activeStyleId: string | null;
  activeAnimationId: string | null;
  
  // Actions
  setMedia: (url: string, type: 'video' | 'audio', duration: number) => void;
  setCaptions: (captions: Caption[]) => void;
  updateCaption: (id: string, newText: string) => void;
  setActiveCaption: (id: string | null) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  reset: () => void;
}

const initialState = {
  id: '',
  name: 'New Project',
  mediaUrl: null,
  mediaType: null,
  duration: 0,
  captions: [],
  activeCaptionId: null,
  currentTime: 0,
  isPlaying: false,
  activeStyleId: null,
  activeAnimationId: null,
};

export const useEditorStore = create<ProjectState>((set) => ({
  ...initialState,

  setMedia: (url, type, duration) => set({ mediaUrl: url, mediaType: type, duration }),
  setCaptions: (captions) => set({ captions }),
  updateCaption: (id, text) => set((state) => ({
    captions: state.captions.map(c => c.id === id ? { ...c, text } : c)
  })),
  setActiveCaption: (id) => set({ activeCaptionId: id }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  reset: () => set(initialState),
}));
