# Watermark Remover - Development Roadmap

## ✅ v1: Manual Redaction (MVP) - CURRENT

**Goal**: Basic watermark removal via manual selection and cover/redact method

### Completed Features
- [x] Project structure (monorepo with frontend + backend)
- [x] React frontend with TypeScript + Vite
- [x] FastAPI backend with pikepdf
- [x] PDF upload component with drag & drop
- [x] PDF.js viewer with page navigation
- [x] Konva overlay canvas for drawing selections
- [x] Rectangle selection tool
- [x] Action panel with method selection
- [x] Cover/redact functionality (white or custom color rectangles)
- [x] Download cleaned PDF endpoint
- [x] Bilingual UI (English + Sinhala)
- [x] Basic privacy headers
- [x] Docker configuration
- [x] Deployment configs (Netlify + Render)

### Remaining Tasks
- [ ] Install dependencies and test locally
- [ ] Fix PDF coordinate system (top-left vs bottom-left)
- [ ] Test cover redaction with different colors
- [ ] Add page flattening to prevent text selection underneath
- [ ] Error handling improvements
- [ ] Add file size validation (client + server)
- [ ] Add loading states and progress indicators
- [ ] Write basic tests

**Target**: Working MVP with manual watermark removal

---

## 🚧 v2: Auto-Detection (Planned)

**Goal**: Intelligent watermark detection for text, logos, and patterns

### Planned Features
- [ ] **Text Watermark Detection**
  - Detect large rotated text (±45°)
  - Identify low-opacity overlays
  - Find repeated text across pages
  - Generate signature: `TX:CONTENT:ANGLE:OPACITY`

- [ ] **Logo/Image Detection**
  - Find repeated placed images
  - Compute image hashes for matching
  - Detect watermark logos in corners/center
  - Generate signature: `IMG:HASH`

- [ ] **Native Delete Method**
  - Integrate PyMuPDF for advanced manipulation
  - Actually remove text/vector objects (not just cover)
  - Handle different PDF structures

- [ ] **"Apply to All Similar"**
  - Match watermarks by signature
  - Batch process across all pages
  - UI for reviewing candidates

- [ ] **Detection UI**
  - Highlight detected candidates with colored boxes
  - Confidence scores
  - Accept/reject interface
  - Adjust detection sensitivity

### Technical Changes
- Add `analyzer.py` module
- Integrate PyMuPDF (AGPL license - optional)
- Enhance `/analyze` endpoint
- Add signature matching logic
- Create detection visualization component

**Target**: 80%+ auto-detection accuracy for common watermarks

---

## 🔮 v3: Scanned PDF Support (Future)

**Goal**: Content-aware cleanup for raster/scanned PDFs

### Planned Features
- [ ] **Scan Detection**
  - Identify raster vs vector pages
  - Detect diagonal watermark patterns in scans
  - Suggest inpaint areas

- [ ] **OpenCV Inpainting**
  - Render page region to image
  - Build watermark mask
  - Apply Telea or Navier-Stokes inpainting
  - Composite cleaned patch back to PDF

- [ ] **Re-OCR**
  - Integrate Tesseract OCR
  - Support English + Sinhala (`eng+sin`)
  - Restore searchable text layer
  - Optional: improve OCR quality

- [ ] **Quality Controls**
  - Aggressiveness slider (light → aggressive)
  - Preview before/after
  - File size optimization
  - Quality vs speed tradeoff

### Technical Changes
- Add `inpainter.py` module
- Integrate OpenCV (`opencv-python-headless`)
- Integrate Tesseract (`pytesseract`)
- Add Sinhala traineddata
- Handle raster rendering at appropriate DPI
- Optimize memory usage for large scans

**Target**: Clean scanned watermarks without visible artifacts

---

## 🌐 v4: Internationalization & Polish (Future)

### Planned Features
- [ ] Complete Sinhala translations
- [ ] RTL layout support (if needed)
- [ ] Multiple language selection
- [ ] Downloadable Sinhala OCR traineddata
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Keyboard shortcuts
- [ ] Mobile responsive design
- [ ] PWA capabilities (offline use)
- [ ] Advanced privacy features (session encryption)

---

## 🔒 Security & Privacy Enhancements (Ongoing)

- [ ] Rate limiting on API
- [ ] File type validation (magic bytes)
- [ ] Sanitize PDF inputs (prevent malicious PDFs)
- [ ] Add CSRF protection
- [ ] Implement request signing
- [ ] Memory limits per request
- [ ] Audit logging (without PII)
- [ ] Security headers (CSP, HSTS)

---

## 📊 Performance Optimizations (Ongoing)

- [ ] Stream large PDFs (chunk processing)
- [ ] Background workers for heavy processing
- [ ] Redis caching for repeated operations
- [ ] CDN for static assets
- [ ] Lazy loading for PDF pages
- [ ] Web Workers for client-side processing
- [ ] PDF linearization for fast web view
- [ ] Compression optimization

---

## 📝 Documentation & Testing (Ongoing)

- [ ] API documentation (OpenAPI/Swagger)
- [ ] User guide (with screenshots)
- [ ] Sinhala documentation
- [ ] Contributing guidelines
- [ ] Code comments and docstrings
- [ ] Unit tests (backend)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance benchmarks

---

## Versioning Strategy

- **v1.0**: Manual redaction MVP
- **v1.1**: Bug fixes, UX improvements
- **v2.0**: Auto-detection
- **v2.1**: Detection improvements
- **v3.0**: Scanned PDF support
- **v3.1**: OCR improvements
- **v4.0**: Full i18n and polish

---

**Current Status**: v1 (MVP) - Core functionality complete, testing in progress
