import { create } from 'zustand'

export interface Selection {
  id: string
  page: number
  bbox: [number, number, number, number] // [x, y, width, height]
  method: 'cover' | 'delete' | 'inpaint'
  color?: string
}

interface AppState {
  pdfFile: File | null
  pdfData: ArrayBuffer | null
  currentPage: number
  totalPages: number
  selections: Selection[]
  isProcessing: boolean
  error: string | null
  
  // Actions
  setPdfFile: (file: File, data: ArrayBuffer) => void
  clearPdf: () => void
  setCurrentPage: (page: number) => void
  addSelection: (selection: Omit<Selection, 'id'>) => void
  removeSelection: (id: string) => void
  updateSelection: (id: string, updates: Partial<Selection>) => void
  clearSelections: () => void
  setProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  pdfFile: null,
  pdfData: null,
  currentPage: 0,
  totalPages: 0,
  selections: [],
  isProcessing: false,
  error: null,

  setPdfFile: (file, data) => set({ 
    pdfFile: file, 
    pdfData: data,
    currentPage: 0,
    selections: [],
    error: null
  }),

  clearPdf: () => set({ 
    pdfFile: null, 
    pdfData: null,
    currentPage: 0,
    totalPages: 0,
    selections: [],
    error: null
  }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addSelection: (selection) => set((state) => ({
    selections: [
      ...state.selections,
      { ...selection, id: `sel-${Date.now()}-${Math.random()}` }
    ]
  })),

  removeSelection: (id) => set((state) => ({
    selections: state.selections.filter(s => s.id !== id)
  })),

  updateSelection: (id, updates) => set((state) => ({
    selections: state.selections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),

  clearSelections: () => set({ selections: [] }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setError: (error) => set({ error }),
}))
