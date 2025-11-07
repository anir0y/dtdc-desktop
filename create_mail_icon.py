#!/usr/bin/env python3
"""
Generate a mail icon for DTDC Desktop App
Creates a 1024x1024 PNG with a mail envelope design
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    print("✓ PIL (Pillow) is installed")
except ImportError:
    print("Installing Pillow...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont
    print("✓ Pillow installed successfully")

def create_mail_icon():
    # Icon dimensions
    size = 1024
    
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # DTDC Colors
    dtdc_red = (227, 24, 55)
    dtdc_orange = (255, 107, 53)
    white = (255, 255, 255)
    
    # Padding
    padding = size * 0.1
    
    # Draw circular background with gradient effect
    # Create a circular red background
    circle_bbox = [padding, padding, size - padding, size - padding]
    
    # Draw shadow
    shadow_offset = 20
    draw.ellipse(
        [circle_bbox[0] + shadow_offset, circle_bbox[1] + shadow_offset, 
         circle_bbox[2] + shadow_offset, circle_bbox[3] + shadow_offset],
        fill=(0, 0, 0, 50)
    )
    
    # Draw main circle (red to orange gradient simulation)
    draw.ellipse(circle_bbox, fill=dtdc_red)
    
    # Draw orange gradient overlay on bottom half
    for i in range(int(size/2), size):
        alpha = int((i - size/2) / (size/2) * 128)
        draw.ellipse(circle_bbox, outline=dtdc_orange + (alpha,))
    
    # Mail envelope dimensions
    envelope_width = size * 0.5
    envelope_height = size * 0.35
    envelope_left = (size - envelope_width) / 2
    envelope_top = (size - envelope_height) / 2
    envelope_right = envelope_left + envelope_width
    envelope_bottom = envelope_top + envelope_height
    
    # Draw envelope body (white rectangle)
    envelope_body = [
        envelope_left, envelope_top,
        envelope_right, envelope_bottom
    ]
    draw.rectangle(envelope_body, fill=white, outline=dtdc_red, width=4)
    
    # Draw envelope flap (triangle on top)
    flap_points = [
        (envelope_left, envelope_top),  # Left corner
        (size / 2, envelope_top + envelope_height * 0.4),  # Bottom point (center)
        (envelope_right, envelope_top),  # Right corner
    ]
    draw.polygon(flap_points, fill=white, outline=dtdc_red)
    draw.line(flap_points + [flap_points[0]], fill=dtdc_red, width=4)
    
    # Draw inner flap lines for detail
    draw.line([
        (envelope_left, envelope_top),
        (size / 2, envelope_top + envelope_height * 0.4)
    ], fill=dtdc_red, width=4)
    draw.line([
        (envelope_right, envelope_top),
        (size / 2, envelope_top + envelope_height * 0.4)
    ], fill=dtdc_red, width=4)
    
    # Add small detail lines on envelope (mail lines)
    line_padding = envelope_width * 0.15
    line_start_y = envelope_top + envelope_height * 0.55
    line_spacing = envelope_height * 0.12
    
    for i in range(3):
        y = line_start_y + (i * line_spacing)
        draw.line([
            (envelope_left + line_padding, y),
            (envelope_right - line_padding, y)
        ], fill=dtdc_red, width=3)
    
    # Save the icon
    output_path = '/Users/animeshroy/scripts/dtdc/dtdc-desktop/build/appicon.png'
    img.save(output_path, 'PNG')
    print(f"✓ Icon saved to: {output_path}")
    
    # Also save to common icon locations
    icon_locations = [
        '/Users/animeshroy/scripts/dtdc/dtdc-desktop/appicon.png',
        '/Users/animeshroy/scripts/dtdc/dtdc-desktop/build/darwin/appicon.png'
    ]
    
    for location in icon_locations:
        try:
            img.save(location, 'PNG')
            print(f"✓ Icon saved to: {location}")
        except Exception as e:
            print(f"⚠ Could not save to {location}: {e}")
    
    print("\n✓ Mail icon created successfully!")
    print(f"  Size: {size}x{size} pixels")
    print(f"  Format: PNG with transparency")
    print(f"  Style: DTDC Red mail envelope on circular background")
    
    return output_path

if __name__ == "__main__":
    create_mail_icon()
