"""
Image watermark removal using OpenCV and PIL
Supports: JPEG, PNG, WebP
"""

import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from typing import List, Tuple, Optional


def remove_watermark_inpaint(
    image_bytes: bytes,
    mask_regions: Optional[List[Tuple[int, int, int, int]]] = None,
    method: str = 'telea'
) -> bytes:
    """
    Remove watermark using inpainting technique
    
    Args:
        image_bytes: Input image as bytes
        mask_regions: List of (x, y, width, height) regions to remove
        method: 'telea' or 'ns' (Navier-Stokes)
    
    Returns:
        Processed image as bytes
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Failed to decode image")
    
    # Create mask
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    
    if mask_regions:
        # Manual regions specified
        for x, y, w, h in mask_regions:
            cv2.rectangle(mask, (x, y), (x + w, y + h), 255, -1)
    else:
        # Auto-detect watermark (simple approach: detect very light or very dark areas)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect light watermarks (common case)
        _, light_mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
        
        # Detect dark watermarks
        _, dark_mask = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY_INV)
        
        # Combine masks
        mask = cv2.bitwise_or(light_mask, dark_mask)
        
        # Clean up noise
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Apply inpainting
    if method == 'ns':
        result = cv2.inpaint(img, mask, 3, cv2.INPAINT_NS)
    else:  # telea (faster, better for small regions)
        result = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)
    
    # Convert back to bytes
    _, buffer = cv2.imencode('.png', result)
    return buffer.tobytes()


def remove_watermark_simple(
    image_bytes: bytes,
    regions: List[Tuple[int, int, int, int]],
    fill_color: Tuple[int, int, int] = (255, 255, 255)
) -> bytes:
    """
    Simple watermark removal by filling regions with solid color
    
    Args:
        image_bytes: Input image as bytes
        regions: List of (x, y, width, height) regions to cover
        fill_color: RGB color to fill with (default: white)
    
    Returns:
        Processed image as bytes
    """
    # Open image with PIL
    img = Image.open(BytesIO(image_bytes))
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Convert to numpy for OpenCV processing
    img_array = np.array(img)
    img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    # Fill each region
    for x, y, w, h in regions:
        cv2.rectangle(
            img_cv, 
            (x, y), 
            (x + w, y + h), 
            fill_color[::-1],  # BGR format
            -1  # Fill
        )
    
    # Convert back to PIL and save
    result_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
    result_img = Image.fromarray(result_rgb)
    
    # Save to bytes
    output = BytesIO()
    result_img.save(output, format='PNG', optimize=True)
    return output.getvalue()


def auto_detect_watermark_regions(
    image_bytes: bytes,
    sensitivity: float = 0.8
) -> List[Tuple[int, int, int, int]]:
    """
    Automatically detect watermark regions using edge detection and contours
    
    Args:
        image_bytes: Input image as bytes
        sensitivity: Detection sensitivity (0.0 - 1.0)
    
    Returns:
        List of (x, y, width, height) bounding boxes
    """
    # Decode image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Failed to decode image")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Edge detection
    edges = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    regions = []
    min_area = (img.shape[0] * img.shape[1]) * 0.001  # Minimum 0.1% of image
    max_area = (img.shape[0] * img.shape[1]) * 0.3    # Maximum 30% of image
    
    for contour in contours:
        area = cv2.contourArea(contour)
        
        if min_area < area < max_area:
            x, y, w, h = cv2.boundingRect(contour)
            regions.append((x, y, w, h))
    
    return regions


def process_image_watermark_removal(
    image_bytes: bytes,
    method: str = 'inpaint',
    regions: Optional[List[Tuple[int, int, int, int]]] = None,
    auto_detect: bool = False
) -> Tuple[bytes, str]:
    """
    Main function to remove watermarks from images
    
    Args:
        image_bytes: Input image as bytes
        method: 'inpaint', 'cover', or 'auto'
        regions: Manual regions to remove (x, y, width, height)
        auto_detect: Automatically detect watermark regions
    
    Returns:
        (processed_image_bytes, output_format)
    """
    try:
        if auto_detect and not regions:
            regions = auto_detect_watermark_regions(image_bytes)
        
        if method == 'inpaint':
            result = remove_watermark_inpaint(image_bytes, regions)
            return result, 'PNG'
        
        elif method == 'cover':
            if not regions:
                raise ValueError("Regions required for cover method")
            result = remove_watermark_simple(image_bytes, regions)
            return result, 'PNG'
        
        else:  # auto
            # Try inpainting first
            result = remove_watermark_inpaint(image_bytes, regions, method='telea')
            return result, 'PNG'
    
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")


# Utility function to validate image format
def is_valid_image(image_bytes: bytes) -> bool:
    """Check if bytes represent a valid image"""
    try:
        img = Image.open(BytesIO(image_bytes))
        img.verify()
        return True
    except:
        return False


def get_image_info(image_bytes: bytes) -> dict:
    """Get image metadata"""
    try:
        img = Image.open(BytesIO(image_bytes))
        return {
            'format': img.format,
            'mode': img.mode,
            'size': img.size,
            'width': img.width,
            'height': img.height
        }
    except Exception as e:
        raise ValueError(f"Failed to read image info: {str(e)}")
