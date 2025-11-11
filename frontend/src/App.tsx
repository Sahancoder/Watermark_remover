import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { applyWatermarkRemoval } from "./services/api";
import { Upload, Download, Lock, Globe, Cpu, Github, Languages, Sun, Moon, FileText, Image as ImageIcon } from "lucide-react";
import PDFViewer from "./components/PDFViewer";
import { useAppStore } from "./store/appStore";

export default function App() {
  const { pdfFile, setPdfFile } = useAppStore();
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<'en' | 'si'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Detect file type on upload
  useEffect(() => {
    if (pdfFile) {
      if (pdfFile.type === 'application/pdf') {
        setFileType('pdf');
      } else if (pdfFile.type.startsWith('image/')) {
        setFileType('image');
      }
    } else {
      setFileType(null);
    }
  }, [pdfFile]);

  const t = {
    en: {
      orgName: "EAECE",
      logoText: "AEOS",
      title: "PDF & Image Watermark Remover",
      subtitle: "Privacy-first, open-source watermark removal for documents and photos",
      chooseFile: "Choose File",
      dragDrop: "or drag and drop PDF, JPEG, PNG here",
      maxSize: "Maximum file size: 50MB",
      supportedFormats: "Supported: PDF, JPEG, PNG, WebP",
      noStorage: "No file storage - all processing in RAM",
      cleanDownload: "Clean & Download",
      noStorageTitle: "No File Storage",
      noStorageDesc: "Your files are never saved on the server. Processing happens entirely in memory, ensuring complete privacy.",
      openSourceTitle: "100% Open Source",
      openSourceDesc: "Entire codebase is publicly available on GitHub. Anyone can verify there is no hidden data collection.",
      ramOnlyTitle: "RAM Only Processing",
      ramOnlyDesc: "Files are processed temporarily in system memory, then deleted after download. No traces remain on disk.",
      footerNoStorage: "No Storage",
      footerOpenSource: "Open Source",
      footerRamOnly: "RAM Only",
      viewSource: "View Source Code",
      previewTitle: "Document Preview",
      imagePreviewTitle: "Image Preview",
      uploadFirst: "Upload a file to begin processing",
      pdfMode: "PDF Mode",
      imageMode: "Image Mode"
    },
    si: {
      orgName: "EAECE",
      logoText: "AEOS",
      title: "PDF සහ Image Watermark Remover",
      subtitle: "ලේඛන සහ ඡායාරූප සඳහා රහස්‍යතාව-ප්‍රථම ජල ලකුණු ඉවත් කිරීම",
      chooseFile: "ගොනුව තෝරන්න",
      dragDrop: "හෝ PDF, JPEG, PNG මෙහි ඇද දමන්න",
      maxSize: "උපරිම ගොනු ප්‍රමාණය: 50MB",
      supportedFormats: "සහාය දක්වන්නේ: PDF, JPEG, PNG, WebP",
      noStorage: "ගොනු ගබඩා කිරීමක් නැත - සියලු සැකසුම් RAM හි",
      cleanDownload: "පිරිසිදු කර බාගන්න",
      noStorageTitle: "ගොනු ගබඩා කිරීමක් නැත",
      noStorageDesc: "ඔබේ ගොනු කිසි විටෙකත් සේවාදායකයේ සුරකින්නේ නැත. සැකසුම් සම්පූර්ණයෙන්ම මතකයේ සිදු වේ.",
      openSourceTitle: "100% විවෘත මූලාශ්‍රය",
      openSourceDesc: "සම්පූර්ණ කේත පදනම GitHub හි ප්‍රසිද්ධියේ ලබා ගත හැකිය. සැඟවුණු දත්ත එකතු කිරීමක් නොමැති බව ඕනෑම කෙනෙකුට සත්‍යාපනය කළ හැකිය.",
      ramOnlyTitle: "RAM පමණක් සැකසීම",
      ramOnlyDesc: "ගොනු තාවකාලිකව පද්ධති මතකයේ සකසනු ලබන අතර, බාගත කිරීමෙන් පසු මකනු ලැබේ. තැටියේ කිසිදු හෝඩුවාවක් ඉතිරි නොවේ.",
      footerNoStorage: "ගබඩා කිරීමක් නැත",
      footerOpenSource: "විවෘත මූලාශ්‍රය",
      footerRamOnly: "RAM පමණි",
      viewSource: "මූල කේතය බලන්න",
      previewTitle: "ලේඛන පෙරදසුන",
      imagePreviewTitle: "ඡායාරූප පෙරදසුන",
      uploadFirst: "සැකසීම ආරම්භ කිරීමට ගොනුවක් උඩුගත කරන්න",
      pdfMode: "PDF ප්‍රකාරය",
      imageMode: "Image ප්‍රකාරය"
    }
  };

  const translations = t[language];

  return (
    <>
      {/* 1. Top Header Bar - Official branding */}
      <div style={{ 
        background: 'var(--surface)', 
        borderBottom: '1px solid var(--border)',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>
          {translations.orgName}
        </div>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: 800, 
          color: 'var(--primary-600)',
          letterSpacing: '1px'
        }}>
          {translations.logoText}
        </div>
      </div>

      {/* 2. Main Title + Subtitle */}
      <header style={{
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--tint) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ 
            margin: '0 0 12px', 
            fontSize: '36px', 
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.5px'
          }}>
            {translations.title}
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '16px', 
            color: 'var(--muted)',
            fontWeight: 500
          }}>
            {translations.subtitle}
          </p>
          
          {/* Controls Row */}
          <div style={{ 
            marginTop: '20px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
              className="btn"
              style={{ 
                padding: '8px 16px',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Languages size={16} />
              {language === 'en' ? 'සිංහල' : 'English'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn"
              style={{ 
                padding: '8px 16px',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        {/* 3. Upload Section */}
        <section className="card" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
          <DropBox 
            onFile={setPdfFile} 
            translations={translations}
            busy={busy}
          />
          
          {pdfFile && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              background: 'var(--tint)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {fileType === 'pdf' ? (
                    <FileText size={20} color="var(--primary-600)" />
                  ) : (
                    <ImageIcon size={20} color="var(--accent-600)" />
                  )}
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    {pdfFile.name}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '28px' }}>
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • {fileType === 'pdf' ? translations.pdfMode : translations.imageMode}
                </div>
              </div>
              
              <button
                className="btn primary"
                disabled={busy}
                onClick={async () => {
                  if (!pdfFile) return;
                  setBusy(true);
                  try {
                    // Process both PDF and images
                    const blob = await applyWatermarkRemoval(pdfFile, []);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    
                    // Set appropriate file extension
                    if (fileType === 'pdf') {
                      a.download = pdfFile.name.replace(/\.pdf$/i, ".cleaned.pdf");
                    } else {
                      // For images, always output as PNG
                      const baseName = pdfFile.name.replace(/\.(jpg|jpeg|png|webp)$/i, '');
                      a.download = `${baseName}.cleaned.png`;
                    }
                    
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error('Download failed:', err);
                    alert('Failed to process file. Please try again.');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Download size={18} />
                {busy ? 'Processing...' : translations.cleanDownload}
              </button>
            </div>
          )}
        </section>

        {/* PDF Preview (if uploaded) */}
        {pdfFile && (
          <section className="card" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
            <h2 className="section-title">
              {fileType === 'pdf' ? translations.previewTitle : translations.imagePreviewTitle}
            </h2>
            <div className="canvas-wrap">
              {fileType === 'pdf' ? (
                <PDFViewer language={language} />
              ) : (
                <ImagePreview file={pdfFile} />
              )}
            </div>
          </section>
        )}

        {/* 4. Feature Highlights Section */}
        <section style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Feature 1: No File Storage */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', 
              height: '56px',
              margin: '0 auto 16px',
              background: 'var(--success)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={28} strokeWidth={2} color="#0b3a2b" />
            </div>
            <h3 style={{ 
              margin: '0 0 8px', 
              fontSize: '18px', 
              fontWeight: 700,
              color: 'var(--text)'
            }}>
              {translations.noStorageTitle}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: 'var(--muted)',
              lineHeight: '1.6'
            }}>
              {translations.noStorageDesc}
            </p>
          </div>

          {/* Feature 2: Open Source */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', 
              height: '56px',
              margin: '0 auto 16px',
              background: 'var(--primary)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={28} strokeWidth={2} color="#07343B" />
            </div>
            <h3 style={{ 
              margin: '0 0 8px', 
              fontSize: '18px', 
              fontWeight: 700,
              color: 'var(--text)'
            }}>
              {translations.openSourceTitle}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: 'var(--muted)',
              lineHeight: '1.6'
            }}>
              {translations.openSourceDesc}
            </p>
          </div>

          {/* Feature 3: RAM Only */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', 
              height: '56px',
              margin: '0 auto 16px',
              background: 'var(--accent)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={28} strokeWidth={2} color="#6E3B00" />
            </div>
            <h3 style={{ 
              margin: '0 0 8px', 
              fontSize: '18px', 
              fontWeight: 700,
              color: 'var(--text)'
            }}>
              {translations.ramOnlyTitle}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: 'var(--muted)',
              lineHeight: '1.6'
            }}>
              {translations.ramOnlyDesc}
            </p>
          </div>
        </section>
      </main>

      {/* 5. Bottom Green Status Bar */}
      <footer style={{
        background: 'var(--success)',
        borderTop: '1px solid var(--border)',
        padding: '16px 20px'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Status badges */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0b3a2b'
            }}>
              <Lock size={16} />
              {translations.footerNoStorage}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0b3a2b'
            }}>
              <Globe size={16} />
              {translations.footerOpenSource}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0b3a2b'
            }}>
              <Cpu size={16} />
              {translations.footerRamOnly}
            </div>
          </div>

          {/* View Source button */}
          <a
            href="https://github.com/Sahancoder/Watermark_remover"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ 
              background: 'white',
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            <Github size={16} />
            {translations.viewSource}
          </a>
        </div>
      </footer>
    </>
  );
}

function DropBox({ 
  onFile, 
  translations, 
  busy 
}: { 
  onFile: (f: File, data: ArrayBuffer) => void; 
  translations: any;
  busy: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: busy,
    onDrop: async (files) => {
      if (files[0]) {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        onFile(file, arrayBuffer);
      }
    }
  });

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Choose File Button */}
      <div {...getRootProps({ 
        className: `dropzone ${isDragActive ? 'dragover' : ''}`,
        style: { cursor: busy ? 'not-allowed' : 'pointer' }
      })}>
        <input {...getInputProps()} />
        
        <div style={{ 
          width: '64px', 
          height: '64px',
          margin: '0 auto 16px',
          background: isDragActive ? 'var(--primary)' : 'var(--tint)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <Upload 
            size={32} 
            strokeWidth={2} 
            color={isDragActive ? '#07343B' : 'var(--primary-600)'} 
          />
        </div>

        <button 
          className="btn primary" 
          style={{ 
            pointerEvents: 'none',
            marginBottom: '12px',
            fontSize: '15px',
            padding: '12px 24px'
          }}
        >
          {translations.chooseFile}
        </button>
        
        <p style={{ 
          margin: '8px 0 0', 
          fontSize: '14px', 
          color: 'var(--muted)',
          fontWeight: 500
        }}>
          {translations.dragDrop}
        </p>
      </div>

      {/* Upload info */}
      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: 'var(--tint)',
        borderRadius: '10px',
        fontSize: '13px'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          {translations.supportedFormats}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
          {translations.maxSize}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
          {translations.noStorage}
        </div>
      </div>
    </div>
  );
}

// Image Preview Component
function ImagePreview({ file }: { file: File }) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div style={{ 
      textAlign: 'center',
      padding: '20px',
      background: 'var(--bg)',
      borderRadius: '8px'
    }}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Preview" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '70vh',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }} 
        />
      )}
    </div>
  );
}
