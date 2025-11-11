"""
Quick test script for image watermark removal
Run this to verify OpenCV and PIL are working correctly
"""

import sys

print("🧪 Testing Image Processing Dependencies...\n")

# Test 1: Import libraries
print("1️⃣  Testing imports...")
try:
    import cv2
    print("   ✅ OpenCV imported successfully")
    print(f"   📦 Version: {cv2.__version__}")
except ImportError as e:
    print(f"   ❌ OpenCV import failed: {e}")
    sys.exit(1)

try:
    import numpy as np
    print("   ✅ NumPy imported successfully")
    print(f"   📦 Version: {np.__version__}")
except ImportError as e:
    print(f"   ❌ NumPy import failed: {e}")
    sys.exit(1)

try:
    from PIL import Image
    print("   ✅ PIL imported successfully")
    print(f"   📦 Version: {Image.__version__}")
except ImportError as e:
    print(f"   ❌ PIL import failed: {e}")
    sys.exit(1)

# Test 2: Import our module
print("\n2️⃣  Testing image_process module...")
try:
    from image_process import (
        process_image_watermark_removal,
        is_valid_image,
        get_image_info,
        auto_detect_watermark_regions
    )
    print("   ✅ image_process module imported successfully")
except ImportError as e:
    print(f"   ❌ image_process import failed: {e}")
    sys.exit(1)

# Test 3: Create test image
print("\n3️⃣  Creating test image...")
try:
    # Create a simple test image with NumPy
    test_img = np.ones((300, 400, 3), dtype=np.uint8) * 255  # White image
    
    # Add a "watermark" (black rectangle)
    cv2.rectangle(test_img, (150, 100), (250, 200), (0, 0, 0), -1)
    cv2.putText(test_img, "WATERMARK", (160, 155), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    # Encode to bytes
    _, buffer = cv2.imencode('.png', test_img)
    test_bytes = buffer.tobytes()
    
    print("   ✅ Test image created (400x300 with watermark)")
    print(f"   📊 Size: {len(test_bytes)} bytes")
except Exception as e:
    print(f"   ❌ Test image creation failed: {e}")
    sys.exit(1)

# Test 4: Validate image
print("\n4️⃣  Testing image validation...")
try:
    is_valid = is_valid_image(test_bytes)
    if is_valid:
        print("   ✅ Image validation works")
    else:
        print("   ❌ Image validation failed")
        sys.exit(1)
except Exception as e:
    print(f"   ❌ Validation error: {e}")
    sys.exit(1)

# Test 5: Get image info
print("\n5️⃣  Testing image info...")
try:
    info = get_image_info(test_bytes)
    print(f"   ✅ Image info retrieved")
    print(f"   📐 Format: {info['format']}")
    print(f"   📐 Size: {info['width']}x{info['height']}")
    print(f"   🎨 Mode: {info['mode']}")
except Exception as e:
    print(f"   ❌ Info retrieval failed: {e}")
    sys.exit(1)

# Test 6: Auto-detect watermarks
print("\n6️⃣  Testing auto-detection...")
try:
    regions = auto_detect_watermark_regions(test_bytes)
    print(f"   ✅ Auto-detection works")
    print(f"   🎯 Found {len(regions)} potential watermark regions")
    if regions:
        for i, (x, y, w, h) in enumerate(regions[:3], 1):
            print(f"      Region {i}: x={x}, y={y}, w={w}, h={h}")
except Exception as e:
    print(f"   ❌ Auto-detection failed: {e}")
    sys.exit(1)

# Test 7: Process image (inpainting)
print("\n7️⃣  Testing inpainting...")
try:
    result_bytes, output_format = process_image_watermark_removal(
        test_bytes,
        method='auto',
        auto_detect=True
    )
    print(f"   ✅ Inpainting works")
    print(f"   📦 Output format: {output_format}")
    print(f"   📊 Output size: {len(result_bytes)} bytes")
    
    # Optionally save result
    with open('test_output.png', 'wb') as f:
        f.write(result_bytes)
    print(f"   💾 Saved test output to: test_output.png")
    
except Exception as e:
    print(f"   ❌ Inpainting failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Success!
print("\n" + "="*50)
print("✅ ALL TESTS PASSED!")
print("="*50)
print("\n🎉 Image watermark removal is ready to use!")
print("\nNext steps:")
print("1. Start backend: uvicorn app:app --reload --port 8000")
print("2. Start frontend: npm run dev")
print("3. Open browser: http://localhost:5173")
print("4. Upload an image and test!")
