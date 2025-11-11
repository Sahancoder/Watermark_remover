"""
PDF Watermark Remover - FastAPI Backend
Main application entry point with v1 manual redaction support
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import json
from typing import List, Dict, Any
import logging

from redact import apply_redactions, validate_pdf
from image_process import process_image_watermark_removal, is_valid_image, get_image_info

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="PDF Watermark Remover API",
    description="Privacy-first PDF watermark removal with auto-detection and inpainting",
    version="1.0.0"
)

# CORS configuration for Netlify frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "https://*.netlify.app",  # Production Netlify
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "PDF Watermark Remover API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /analyze - Auto-detect watermarks",
            "apply": "POST /apply-multipart - Apply watermark removal"
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "dependencies": {
            "pikepdf": True,  # Check if libraries are available
            "PIL": True,
        }
    }


@app.post("/analyze")
async def analyze_watermarks(file: UploadFile = File(...)):
    """
    v2 Feature: Auto-detect watermark candidates in PDF
    
    Currently returns empty candidates (v1 only supports manual selection).
    Will be implemented in v2 with text/logo/scan detection.
    """
    try:
        # Read PDF file
        pdf_bytes = await file.read()
        
        # Validate PDF
        validation_result = validate_pdf(pdf_bytes)
        if not validation_result["valid"]:
            raise HTTPException(
                status_code=400,
                detail=validation_result["error"]
            )
        
        # v1: Return empty candidates (manual selection only)
        # v2: Will implement detection logic in analyzer.py
        return {
            "pages": validation_result.get("page_count", 0),
            "candidates": [],
            "message": "v1: Manual selection only. Auto-detection coming in v2."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/apply-multipart")
async def apply_watermark_removal(
    file: UploadFile = File(...),
    actions: str = Form(...),
    re_ocr: str = Form("false")
):
    """
    Apply watermark removal actions to PDF or Image
    
    Args:
        file: Original PDF or Image file
        actions: JSON string with removal actions
        re_ocr: Whether to re-OCR after inpainting (v3 feature)
    
    Returns:
        StreamingResponse with cleaned file
    """
    try:
        # Read file
        file_bytes = await file.read()
        content_type = file.content_type or ""
        
        # Determine file type
        is_pdf = content_type == "application/pdf" or file.filename.lower().endswith('.pdf')
        is_image = content_type.startswith("image/") or any(
            file.filename.lower().endswith(ext) 
            for ext in ['.jpg', '.jpeg', '.png', '.webp']
        )
        
        if is_pdf:
            # Handle PDF
            validation_result = validate_pdf(file_bytes)
            if not validation_result["valid"]:
                raise HTTPException(
                    status_code=400,
                    detail=validation_result["error"]
                )
            
            # Parse actions JSON
            try:
                actions_list = json.loads(actions)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid actions JSON")
            
            if not isinstance(actions_list, list):
                raise HTTPException(status_code=400, detail="Actions must be an array")
            
            # Apply PDF redactions
            logger.info(f"Processing PDF with {len(actions_list)} redaction actions")
            cleaned_bytes = apply_redactions(
                pdf_bytes=file_bytes,
                actions=actions_list,
                re_ocr=(re_ocr.lower() == "true")
            )
            
            # Generate filename
            original_name = file.filename or "document.pdf"
            base_name = original_name.rsplit('.', 1)[0]
            cleaned_filename = f"{base_name}.cleaned.pdf"
            media_type = "application/pdf"
            
        elif is_image:
            # Handle Image
            if not is_valid_image(file_bytes):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid or corrupted image file"
                )
            
            # Parse actions JSON for regions
            try:
                actions_list = json.loads(actions)
            except json.JSONDecodeError:
                actions_list = []
            
            # Convert actions to regions (x, y, width, height)
            regions = []
            for action in actions_list:
                if 'bbox' in action:
                    bbox = action['bbox']
                    if len(bbox) == 4:
                        regions.append(tuple(bbox))
            
            # Process image
            logger.info(f"Processing image with {len(regions)} regions")
            method = 'inpaint' if regions else 'auto'
            cleaned_bytes, output_format = process_image_watermark_removal(
                image_bytes=file_bytes,
                method=method,
                regions=regions if regions else None,
                auto_detect=(len(regions) == 0)
            )
            
            # Generate filename
            original_name = file.filename or "image.png"
            base_name = original_name.rsplit('.', 1)[0]
            cleaned_filename = f"{base_name}.cleaned.png"
            media_type = "image/png"
            
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, JPEG, PNG, or WebP."
            )
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(cleaned_bytes),
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{cleaned_filename}"',
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.post("/clear-session")
async def clear_session():
    """
    Privacy endpoint: Clear any cached data
    
    v1: No caching implemented (all processing in RAM)
    This endpoint exists for future-proofing and user confidence
    """
    return {
        "status": "success",
        "message": "No session data stored. All processing is ephemeral."
    }


# Error handlers
@app.exception_handler(413)
async def payload_too_large_handler(request, exc):
    """Handle file too large errors"""
    return {
        "error": "File too large",
        "detail": "PDF exceeds maximum size limit (50MB)",
        "status_code": 413
    }


if __name__ == "__main__":
    import uvicorn
    
    # Development server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
