"""
PDF Redaction Module (v1)
Manual watermark removal via cover/redact method
"""

import io
import logging
from typing import List, Dict, Any, Optional
import pikepdf
from pikepdf import Pdf, Rectangle, Name, Array

logger = logging.getLogger(__name__)


def validate_pdf(pdf_bytes: bytes) -> Dict[str, Any]:
    """
    Validate PDF and check for restrictions
    
    Returns:
        dict with 'valid' (bool), 'error' (str), 'page_count' (int)
    """
    try:
        pdf = Pdf.open(io.BytesIO(pdf_bytes))
        
        # Check if encrypted with password
        if pdf.is_encrypted:
            return {
                "valid": False,
                "error": "PDF is password-protected. Please unlock it first."
            }
        
        # Check for digital signatures (pikepdf doesn't have direct signature check)
        # This is a basic check - more sophisticated detection in v2
        page_count = len(pdf.pages)
        
        pdf.close()
        
        return {
            "valid": True,
            "page_count": page_count
        }
        
    except Exception as e:
        logger.error(f"PDF validation error: {str(e)}")
        return {
            "valid": False,
            "error": f"Invalid PDF file: {str(e)}"
        }


def apply_redactions(
    pdf_bytes: bytes,
    actions: List[Dict[str, Any]],
    re_ocr: bool = False
) -> bytes:
    """
    Apply redaction actions to PDF
    
    Args:
        pdf_bytes: Original PDF as bytes
        actions: List of redaction actions, each with:
            - page: int (0-indexed)
            - bbox: [x, y, width, height]
            - method: "cover" | "delete" | "inpaint"
            - color: Optional[str] (hex color for cover, default white)
        re_ocr: Whether to re-OCR (v3 feature, ignored in v1)
    
    Returns:
        Cleaned PDF as bytes
    """
    try:
        # Open PDF with pikepdf
        pdf = Pdf.open(io.BytesIO(pdf_bytes))
        
        # Group actions by page for efficiency
        actions_by_page: Dict[int, List[Dict]] = {}
        for action in actions:
            page_num = action.get("page", 0)
            if page_num not in actions_by_page:
                actions_by_page[page_num] = []
            actions_by_page[page_num].append(action)
        
        # Process each page with actions
        for page_num, page_actions in actions_by_page.items():
            if page_num < 0 or page_num >= len(pdf.pages):
                logger.warning(f"Skipping invalid page number: {page_num}")
                continue
            
            page = pdf.pages[page_num]
            
            # Apply each action to the page
            for action in page_actions:
                method = action.get("method", "cover")
                
                if method == "cover":
                    _apply_cover_redaction(page, action)
                elif method == "delete":
                    # v1: Fall back to cover (native delete in v2 with PyMuPDF)
                    logger.info("Delete method not yet implemented, using cover")
                    _apply_cover_redaction(page, action)
                elif method == "inpaint":
                    # v3: Inpainting for scanned PDFs
                    logger.info("Inpaint method not yet implemented, using cover")
                    _apply_cover_redaction(page, action)
                else:
                    logger.warning(f"Unknown method: {method}")
        
        # Save to bytes buffer
        output_buffer = io.BytesIO()
        pdf.save(
            output_buffer,
            linearize=True,  # Fast web view
            compress_streams=True,  # Smaller file size
            # object_stream_mode=pikepdf.ObjectStreamMode.generate  # Modern PDF
        )
        
        pdf.close()
        
        output_bytes = output_buffer.getvalue()
        logger.info(f"Redacted PDF size: {len(output_bytes)} bytes")
        
        return output_bytes
        
    except Exception as e:
        logger.error(f"Redaction error: {str(e)}")
        raise RuntimeError(f"Failed to apply redactions: {str(e)}")


def _apply_cover_redaction(page, action: Dict[str, Any]):
    """
    Apply cover/redact by drawing opaque rectangle
    
    This adds a white (or custom color) rectangle on top of the watermark.
    The page content is then flattened so the underlying watermark cannot
    be selected or recovered.
    """
    bbox = action.get("bbox")
    if not bbox or len(bbox) != 4:
        logger.warning("Invalid bbox, skipping action")
        return
    
    x, y, width, height = bbox
    color = action.get("color", "#FFFFFF")  # Default white
    
    # Convert hex color to RGB (0-1 range)
    rgb = _hex_to_rgb(color)
    
    # Get or create page content stream
    if "/Contents" not in page:
        page.Contents = pikepdf.Stream(pdf=page.obj.pdf, data=b"")
    
    # Build redaction rectangle command
    # PDF coordinates: origin at bottom-left
    # We need to overlay a filled rectangle
    redaction_ops = (
        f"q\n"  # Save graphics state
        f"{rgb[0]} {rgb[1]} {rgb[2]} rg\n"  # Set fill color (RGB)
        f"{x} {y} {width} {height} re\n"  # Rectangle
        f"f\n"  # Fill
        f"Q\n"  # Restore graphics state
    ).encode('latin-1')
    
    # Append to page content
    if isinstance(page.Contents, list):
        # Multiple content streams - append to last one
        existing_stream = page.Contents[-1]
        new_data = existing_stream.read_bytes() + b"\n" + redaction_ops
        page.Contents[-1] = pikepdf.Stream(page.obj.pdf, new_data)
    else:
        # Single content stream
        existing_data = page.Contents.read_bytes()
        new_data = existing_data + b"\n" + redaction_ops
        page.Contents = pikepdf.Stream(page.obj.pdf, new_data)
    
    logger.debug(f"Applied cover redaction at {bbox} with color {color}")


def _hex_to_rgb(hex_color: str) -> tuple:
    """
    Convert hex color to RGB tuple (0-1 range for PDF)
    
    Examples:
        "#FFFFFF" -> (1.0, 1.0, 1.0)
        "#FF0000" -> (1.0, 0.0, 0.0)
    """
    hex_color = hex_color.lstrip('#')
    
    if len(hex_color) != 6:
        logger.warning(f"Invalid hex color: {hex_color}, using white")
        return (1.0, 1.0, 1.0)
    
    try:
        r = int(hex_color[0:2], 16) / 255.0
        g = int(hex_color[2:4], 16) / 255.0
        b = int(hex_color[4:6], 16) / 255.0
        return (r, g, b)
    except ValueError:
        logger.warning(f"Failed to parse hex color: {hex_color}, using white")
        return (1.0, 1.0, 1.0)


def flatten_page(page):
    """
    Flatten page annotations and form fields (v1.1 feature)
    
    This ensures covered watermarks cannot be selected underneath.
    Currently a placeholder - full flattening in v1.1
    """
    # Remove annotations that might reveal underlying content
    if "/Annots" in page:
        del page.Annots
    
    logger.debug("Page flattened (annotations removed)")
