# PDF Watermark Remover
### 📸 Preview

<p align="center">
  <img src="https://raw.githubusercontent.com/Sahancoder/Watermark_remover/main/Screenshot%202025-11-11%20235808.png" alt="PDF Watermark Remover UI Screenshot 1" width="85%">
  <br><br>
  <img src="https://raw.githubusercontent.com/Sahancoder/Watermark_remover/main/Screenshot%202025-11-11%20235817.png" alt="PDF Watermark Remover UI Screenshot 2" width="85%">
</p>

---

A privacy-first, open-source web application for removing watermarks from PDFs. Supports native text/vector watermarks, logos, and scanned documents with intelligent detection and content-aware cleanup.

## 🌟 Features

- **Drag & Drop Interface** - Upload PDFs directly in your browser
- **Auto-Detection** - Intelligent watermark detection (text, logos, scanned marks)
- **Manual Selection** - Draw precise selection boxes with visual preview
- **Apply to All** - Automatically apply removal to similar watermarks across all pages
- **Multiple Methods**:
  - **Delete** - Remove native text/vector watermarks
  - **Cover/Redact** - Draw opaque overlays (flattened for security)
  - **Inpaint** - Content-aware cleanup for scanned PDFs (OpenCV)
- **Bilingual** - English & Sinhala UI support
- **Privacy-First** - No file storage, no analytics, all processing in RAM

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │ ──────► │  FastAPI Backend │
│  (Netlify)      │ ◄────── │  (Render/Docker) │
└─────────────────┘         └──────────────────┘
    Static Files              Stateless Processing
    PDF.js Preview            pikepdf + OpenCV
    react-konva               No file storage
```

### How It Works

1. **Browser**: Drag PDFs → Preview with PDF.js → Draw selections with react-konva
2. **POST /analyze**: Auto-detect watermarks (text patterns, logos, scan areas)
3. **UI**: Review candidates, adjust manually, choose action & scope
4. **POST /apply-multipart**: Process PDF → Stream cleaned result
5. **Download**: Cleaned PDF with watermarks removed/covered

## 📁 Project Structure

```
watermark-remover/
├── frontend/               # React app (deployed to Netlify)
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFUpload.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   ├── OverlayCanvas.tsx
│   │   │   └── ActionPanel.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── i18n/
│   │   │   └── translations.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # FastAPI app (deployed to Render)
│   ├── app.py             # Main FastAPI server
│   ├── redact.py          # v1: Manual redaction logic
│   ├── analyzer.py        # v2: Auto-detection engine
│   ├── inpainter.py       # v3: Scanned PDF cleanup
│   ├── requirements.txt
│   └── Dockerfile
│
├── scripts/
│   ├── dev-frontend.ps1   # Run React dev server
│   ├── dev-backend.ps1    # Run FastAPI dev server
│   └── build.ps1          # Build both frontend & backend
│
├── netlify.toml           # Netlify config
├── render.yaml            # Render config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **PowerShell** (for running scripts on Windows)

### Local Development

1. **Clone and navigate**:
   ```powershell
   cd "e:\My Projects\Watermark remover"
   ```

2. **Install frontend dependencies**:
   ```powershell
   cd frontend
   npm install
   ```

3. **Install backend dependencies**:
   ```powershell
   cd ..\backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

4. **Run development servers**:
   
   **Terminal 1** (Backend):
   ```powershell
   .\scripts\dev-backend.ps1
   ```
   
   **Terminal 2** (Frontend):
   ```powershell
   .\scripts\dev-frontend.ps1
   ```

5. **Open browser**: http://localhost:5173

### Production Deployment

**Frontend (Netlify)**:
1. Connect GitHub repo to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Environment variables:
   - `VITE_API_URL=https://your-api.onrender.com`

**Backend (Render)**:
1. Connect GitHub repo to Render
2. Select "Web Service"
3. Docker deployment (uses `backend/Dockerfile`)
4. Environment variables:
   - `ALLOWED_ORIGINS=https://your-app.netlify.app`

## 📋 Development Roadmap

### ✅ v1: Manual Redaction (MVP)
- [x] PDF upload & preview (PDF.js)
- [x] Rectangle selection tool (react-konva)
- [x] Cover/redact action with flattening
- [x] Download cleaned PDF
- [ ] Privacy headers (no-store, CORS)
- [ ] Basic error handling

### 🚧 v2: Auto-Detection
- [ ] Text watermark detection (rotation, opacity, repetition)
- [ ] Logo/image detection (hash matching)
- [ ] Candidate highlighting in UI
- [ ] "Apply to all similar" functionality
- [ ] Native delete action (PyMuPDF)

### 🔮 v3: Scanned PDF Support
- [ ] Scan detection
- [ ] OpenCV inpainting (Telea/NS)
- [ ] Re-OCR with Tesseract (eng+sin)
- [ ] Aggressiveness slider
- [ ] Quality/filesize optimization

### 🌐 v4: Internationalization
- [ ] Sinhala UI translations
- [ ] Language toggle component
- [ ] Sinhala OCR traineddata
- [ ] RTL layout support

## 🔒 Privacy & Security

- **No File Storage**: All PDFs processed in RAM only
- **No Analytics**: No tracking, cookies, or external scripts
- **Client-Side Preview**: PDF.js runs entirely in browser
- **HTTPS Only**: Enforced in production
- **Cache-Control**: `no-store` headers on all responses
- **Session Clear**: Manual buffer wipe button
- **Open Source**: Full transparency, self-hostable

### Limitations

- **Digitally Signed PDFs**: Refused (editing invalidates signature)
- **DRM/Encrypted**: Refused with user-friendly message
- **File Size**: 50MB limit (configurable)
- **Timeout**: 120s processing limit

## 🛠️ Technology Stack

### Frontend
- **React** 18 + **TypeScript**
- **Vite** - Build tool
- **PDF.js** - PDF rendering
- **react-konva** - Canvas overlay for selections
- **Axios** - API communication
- **Tailwind CSS** - Styling

### Backend
- **FastAPI** - API framework
- **pikepdf** - PDF manipulation (Apache license)
- **PyMuPDF** (optional) - Advanced features (AGPL)
- **OpenCV** - Inpainting for scanned PDFs
- **Tesseract** - OCR (optional)
- **NumPy** / **Pillow** - Image processing

## 📝 API Endpoints

### `POST /analyze`
Auto-detect watermark candidates.

**Request**:
```
Content-Type: multipart/form-data
file: <PDF binary>
```

**Response**:
```json
{
  "pages": 10,
  "candidates": [
    {
      "page": 1,
      "bbox": [x, y, width, height],
      "kind": "text",
      "angle": 45,
      "alpha": 0.25,
      "confidence": 0.92,
      "signature": "TX:CONFIDENTIAL:45:0.25"
    }
  ]
}
```

### `POST /apply-multipart`
Apply watermark removal actions.

**Request**:
```
Content-Type: multipart/form-data
file: <PDF binary>
actions: <JSON string>
re_ocr: "false" | "true"
```

**Response**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.cleaned.pdf"
<PDF binary stream>
```

## 🌍 Sinhala Summary (සිංහල සාරාංශය)

**කාර්ය පටිපාටිය:**
1. URL විවෘත කිරීම
2. PDF Drag & Drop
3. ස්වයංක්‍රීය හඳුනාගැනීම
4. අතින් තේරීම්
5. "සමාන සියල්ලට යොදන්න"
6. බාගත කිරීම

**ජලමුද්‍රා වර්ග:**
- අකුරු/වක්තර (Text/Vector)
- ලොගෝ (පින්තූර)
- ස්කෑන් කළ ලේඛන

**රහස්‍යතාවය:**
- ගොනු තාවකාලික මතකයේ පමණි
- ගබඩා කිරීම් නැත
- ලොග් නැත

**සීමාවන්:**
- අත්සන් කළ PDF ප්‍රතික්ෂේප කරයි
- DRM PDF ප්‍රතික්ෂේප කරයි

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - Free for personal and commercial use

## 🆘 Support

- **Issues**: GitHub Issues
- **Docs**: See `/docs` folder
- **Email**: [Your contact]

---

**Built with privacy, transparency, and user control in mind.**
