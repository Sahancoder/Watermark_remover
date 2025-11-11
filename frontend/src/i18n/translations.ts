export const translations = {
  en: {
    appTitle: 'PDF Watermark Remover',
    appSubtitle: 'Privacy-first, open-source watermark removal',
    
    // Upload
    uploadTitle: 'Upload PDF',
    uploadSubtitle: 'Drag & drop or click to select',
    uploadHint: 'Maximum 50MB • No file storage • Processing in RAM only',
    uploadButton: 'Select PDF File',
    
    // Viewer
    pageOf: 'Page {current} of {total}',
    previousPage: 'Previous',
    nextPage: 'Next',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitWidth: 'Fit Width',
    
    // Actions
    actionTitle: 'Actions',
    drawSelection: 'Draw Selection',
    drawHint: 'Click and drag on the PDF to select watermark area',
    autoDetect: 'Auto-Detect',
    autoDetectHint: 'Find watermarks automatically (v2)',
    method: 'Removal Method',
    methodCover: 'Cover/Redact',
    methodDelete: 'Delete (v2)',
    methodInpaint: 'Inpaint (v3)',
    coverColor: 'Cover Color',
    applyToAll: 'Apply to all similar',
    
    // Selections
    selectionsTitle: 'Selections',
    noSelections: 'No watermark areas selected',
    removeSelection: 'Remove',
    
    // Process
    processButton: 'Clean & Download',
    processing: 'Processing PDF...',
    clearSession: 'Clear Session',
    startOver: 'Start Over',
    
    // Errors
    errorTitle: 'Error',
    errorInvalidPdf: 'Invalid PDF file',
    errorTooLarge: 'File too large (max 50MB)',
    errorEncrypted: 'PDF is password-protected',
    errorSigned: 'PDF is digitally signed (editing would invalidate signature)',
    errorProcessing: 'Processing failed',
    
    // Privacy
    privacyNote: 'All processing happens locally. No data is stored.',
    viewSource: 'View Source Code',
    
    // Success
    downloadSuccess: 'PDF cleaned successfully!',
    downloadReady: 'Your cleaned PDF is ready',
  },
  
  si: {
    appTitle: 'PDF ජලමුද්‍රා ඉවත් කිරීම',
    appSubtitle: 'රහස්‍යතාව-මුල්, විවෘත-මූලාශ්‍ර ජලමුද්‍රා ඉවත් කිරීම',
    
    // Upload
    uploadTitle: 'PDF උඩුගත කරන්න',
    uploadSubtitle: 'ඇදගෙන දමන්න හෝ තෝරන්න',
    uploadHint: 'උපරිම 50MB • ගොනු ගබඩා කිරීමක් නැත • මතකයේ පමණක් සැකසීම',
    uploadButton: 'PDF ගොනුව තෝරන්න',
    
    // Viewer
    pageOf: 'පිටුව {current} / {total}',
    previousPage: 'පෙර',
    nextPage: 'ඊළඟ',
    zoomIn: 'විශාලනය',
    zoomOut: 'කුඩා කරන්න',
    fitWidth: 'පළල ගැලපීම',
    
    // Actions
    actionTitle: 'ක්‍රියාමාර්ග',
    drawSelection: 'තේරීම අඳින්න',
    drawHint: 'ජලමුද්‍රා ප්‍රදේශය තේරීමට PDF මත ක්ලික් කර ඇදගෙන යන්න',
    autoDetect: 'ස්වයංක්‍රීය හඳුනාගැනීම',
    autoDetectHint: 'ජලමුද්‍රා ස්වයංක්‍රීයව සොයන්න (v2)',
    method: 'ඉවත් කිරීමේ ක්‍රමය',
    methodCover: 'ආවරණය/සංශෝධනය',
    methodDelete: 'මකන්න (v2)',
    methodInpaint: 'ඉන්පේන්ට් (v3)',
    coverColor: 'ආවරණ වර්ණය',
    applyToAll: 'සමාන සියල්ලට යොදන්න',
    
    // Selections
    selectionsTitle: 'තේරීම්',
    noSelections: 'ජලමුද්‍රා ප්‍රදේශ තෝරා නැත',
    removeSelection: 'ඉවත් කරන්න',
    
    // Process
    processButton: 'පිරිසිදු කර බාගන්න',
    processing: 'PDF සැකසෙමින්...',
    clearSession: 'සැසිය මකන්න',
    startOver: 'නැවත ආරම්භ කරන්න',
    
    // Errors
    errorTitle: 'දෝෂය',
    errorInvalidPdf: 'වලංගු නොවන PDF ගොනුවකි',
    errorTooLarge: 'ගොනුව ඉතා විශාලයි (උපරිම 50MB)',
    errorEncrypted: 'PDF මුරපදයෙන් ආරක්ෂා කර ඇත',
    errorSigned: 'PDF ඩිජිටල් අත්සන් කර ඇත (සංස්කරණය අත්සන අවලංගු කරයි)',
    errorProcessing: 'සැකසීම අසාර්ථක විය',
    
    // Privacy
    privacyNote: 'සියලු සැකසීම් දේශීයව සිදු වේ. දත්ත ගබඩා නොකෙරේ.',
    viewSource: 'මූලාශ්‍ර කේතය බලන්න',
    
    // Success
    downloadSuccess: 'PDF සාර්ථකව පිරිසිදු කරන ලදී!',
    downloadReady: 'ඔබේ පිරිසිදු PDF සූදානම්',
  }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
