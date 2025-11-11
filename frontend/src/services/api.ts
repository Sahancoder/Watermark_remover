import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export interface WatermarkAction {
  page: number
  bbox: [number, number, number, number]
  method: 'cover' | 'delete' | 'inpaint'
  color?: string
}

export interface AnalyzeResponse {
  pages: number
  candidates: Array<{
    page: number
    bbox: [number, number, number, number]
    kind: 'text' | 'logo' | 'scan'
    angle?: number
    alpha?: number
    confidence: number
    signature: string
  }>
  message?: string
}

/**
 * Analyze PDF for watermark candidates (v2 feature)
 */
export async function analyzePDF(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<AnalyzeResponse>('/analyze', formData)
  return response.data
}

/**
 * Apply watermark removal actions
 */
export async function applyWatermarkRemoval(
  file: File,
  actions: WatermarkAction[],
  reOcr: boolean = false
): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('actions', JSON.stringify(actions))
  formData.append('re_ocr', reOcr ? 'true' : 'false')

  const response = await api.post('/apply-multipart', formData, {
    responseType: 'blob'
  })

  return response.data
}

/**
 * Clear session (privacy feature)
 */
export async function clearSession(): Promise<void> {
  await api.post('/clear-session')
}

// Error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.detail || error.response.data?.error || 'Server error'
      throw new Error(message)
    } else if (error.request) {
      // No response received
      throw new Error('No response from server. Please check your connection.')
    } else {
      // Request setup error
      throw new Error(error.message)
    }
  }
)

export default api
