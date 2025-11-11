# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          User's Browser                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           React Frontend (Port 5173 / Netlify)           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  • PDFUpload → Drag & drop interface                    │   │
│  │  • PDFViewer → PDF.js rendering                         │   │
│  │  • OverlayCanvas → Konva selection tool                 │   │
│  │  • ActionPanel → Controls + download                    │   │
│  │  • Zustand Store → State management                     │   │
│  │                                                           │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │                                          │
│                       │ HTTPS/CORS                               │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │   FastAPI Backend (Render)       │
         │   Port 8000 / Docker Container   │
         ├──────────────────────────────────┤
         │                                  │
         │  Endpoints:                      │
         │  • POST /analyze                 │
         │  • POST /apply-multipart         │
         │  • GET /health                   │
         │                                  │
         │  Processing:                     │
         │  • pikepdf → PDF manipulation    │
         │  • Cover/redact logic            │
         │  • Stream response               │
         │                                  │
         └──────────────────────────────────┘
```

---

## Data Flow: Upload to Download

### Step 1: PDF Upload
```
User drops PDF file
        ↓
PDFUpload.tsx handleFileSelect()
        ↓
Read file as ArrayBuffer
        ↓
useAppStore.setPdfFile(file, arrayBuffer)
        ↓
PDF.js loads from ArrayBuffer
        ↓
Render page 1 on canvas
```

### Step 2: Draw Selection
```
User clicks and drags on canvas
        ↓
OverlayCanvas.tsx handleMouseDown()
        ↓
Track mouse movement
        ↓
OverlayCanvas.tsx handleMouseUp()
        ↓
Calculate normalized bbox [x, y, w, h]
        ↓
useAppStore.addSelection({ page, bbox, method, color })
        ↓
Render rectangle on Konva canvas
        ↓
Display in ActionPanel selection list
```

### Step 3: Process & Download
```
User clicks "Clean & Download"
        ↓
ActionPanel.tsx handleProcess()
        ↓
Build actions array from selections
        ↓
api.ts applyWatermarkRemoval(file, actions)
        ↓
Axios POST multipart/form-data to /apply-multipart
        ↓
        
BACKEND PROCESSING:
        ↓
app.py receives file + actions JSON
        ↓
validate_pdf(pdf_bytes) - Check encryption, signatures
        ↓
redact.py apply_redactions()
        ↓
For each action:
    - Get page from pikepdf
    - Calculate PDF coordinates (bottom-left origin)
    - Draw filled rectangle with color
    - Append to page content stream
        ↓
Save PDF with linearization + compression
        ↓
Return as StreamingResponse (application/pdf)
        ↓
        
FRONTEND DOWNLOAD:
        ↓
Receive blob from Axios
        ↓
Create object URL from blob
        ↓
Create <a> element, set href, trigger click
        ↓
Browser downloads file
        ↓
Clean up object URL
```

---

## Component Architecture

### Frontend Components

```
App.tsx (Root)
├── Header
│   ├── Title
│   └── Language Toggle Button
│
├── Main Content
│   ├── PDFUpload (if no PDF)
│   │   ├── Drag & drop zone
│   │   ├── File picker input
│   │   └── Privacy badges
│   │
│   └── PDF Editor (if PDF loaded)
│       ├── PDFViewer (3 columns)
│       │   ├── Toolbar
│       │   │   ├── Page navigation
│       │   │   └── Zoom controls
│       │   │
│       │   └── Canvas Container
│       │       ├── <canvas> (PDF.js rendering)
│       │       └── OverlayCanvas (Konva)
│       │           ├── Existing rectangles
│       │           └── New rectangle being drawn
│       │
│       └── ActionPanel (1 column)
│           ├── Selection count
│           ├── Drawing hint
│           ├── Auto-detect button (disabled)
│           ├── Method selector
│           ├── Color picker (if cover method)
│           ├── Process button
│           ├── Action buttons (clear, start over)
│           └── Selections list
│
└── Footer
    ├── Privacy note
    └── GitHub link
```

### Backend Modules

```
app.py (FastAPI)
├── CORS Middleware
├── Route: GET /
├── Route: GET /health
├── Route: POST /analyze (v2 feature)
└── Route: POST /apply-multipart
    └── Calls redact.py

redact.py
├── validate_pdf()
│   └── Check encrypted, count pages
│
├── apply_redactions()
│   ├── Open PDF with pikepdf
│   ├── Group actions by page
│   └── For each page with actions:
│       └── _apply_cover_redaction()
│
├── _apply_cover_redaction()
│   ├── Convert hex color to RGB
│   ├── Build PDF drawing commands
│   └── Append to page content stream
│
└── _hex_to_rgb()
    └── Parse hex string to (r, g, b)
```

---

## State Management (Zustand)

```typescript
AppState {
  // PDF Data
  pdfFile: File | null
  pdfData: ArrayBuffer | null
  currentPage: number
  totalPages: number
  
  // Selections
  selections: Selection[] {
    id: string
    page: number
    bbox: [x, y, width, height]
    method: 'cover' | 'delete' | 'inpaint'
    color?: string
  }
  
  // UI State
  isProcessing: boolean
  error: string | null
  
  // Actions
  setPdfFile()
  clearPdf()
  setCurrentPage()
  addSelection()
  removeSelection()
  updateSelection()
  clearSelections()
  setProcessing()
  setError()
}
```

---

## API Contract

### Request: POST /apply-multipart

```http
POST /apply-multipart HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

<PDF binary data>
------WebKitFormBoundary
Content-Disposition: form-data; name="actions"

[
  {
    "page": 0,
    "bbox": [100, 200, 300, 50],
    "method": "cover",
    "color": "#FFFFFF"
  }
]
------WebKitFormBoundary
Content-Disposition: form-data; name="re_ocr"

false
------WebKitFormBoundary--
```

### Response: PDF Stream

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.cleaned.pdf"
Cache-Control: no-store, no-cache, must-revalidate, max-age=0
Pragma: no-cache

<PDF binary stream>
```

---

## Security Flow

```
Request from browser
        ↓
CORS check (ALLOWED_ORIGINS)
        ↓
File size check (max 50MB)
        ↓
MIME type validation
        ↓
PDF structure validation (pikepdf.open)
        ↓
Check for encryption
        ↓
Check for digital signatures (basic)
        ↓
Process in RAM (no disk writes)
        ↓
Return with no-store headers
        ↓
Memory cleanup (Python GC)
```

---

## Deployment Architecture

### Development
```
localhost:5173 (Vite Dev Server)
        ↓
     Proxy to
        ↓
localhost:8000 (Uvicorn Dev Server)
```

### Production
```
https://your-app.netlify.app
        ↓
    Netlify CDN
        ↓
   Static Files (React build)
        ↓
     API calls to
        ↓
https://your-api.onrender.com
        ↓
   Render Docker Container
        ↓
  FastAPI + Uvicorn Workers
```

---

## Error Handling Flow

```
Error occurs (anywhere)
        ↓
Backend: raise HTTPException → FastAPI → JSON response
Frontend: Axios interceptor → Error object → useAppStore.setError()
        ↓
App.tsx renders error message (if needed)
ActionPanel shows error in UI
        ↓
User can retry or start over
```

---

## Performance Considerations

### Frontend
- **PDF.js** renders one page at a time (lazy loading)
- **Zustand** provides efficient re-renders (only affected components)
- **Vite** uses HMR for fast development
- **Code splitting** separates PDF.js and Konva into chunks

### Backend
- **pikepdf** is fast (written in C++)
- **StreamingResponse** prevents memory buildup
- **Uvicorn** handles concurrent requests
- **Docker** isolates resources

### Optimizations
- Linearized PDFs for fast web view
- Compressed PDF streams
- Client-side file validation (fail fast)
- Response gzip compression

---

This architecture supports the v1 manual redaction flow and is designed to scale for v2 (auto-detection) and v3 (inpainting) features!
