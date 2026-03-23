import os
import json
import re
import html
from pathlib import Path

# Configuration: Paths relative to the project root
PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_PATH = PROJECT_ROOT / "content" / "blog"
PUBLIC_PATH = PROJECT_ROOT / "public" / "blog"

def extract_key_points(content):
    """
    Extracts key headers, bold terms, and bullets from the blog content 
    to create a 'Cheat Sheet' style list for the image.
    """
    headers = re.findall(r'###? (.*)', content)
    bullets = re.findall(r'- (.*)', content)
    bold_terms = re.findall(r'\*\*(.*?)\*\*', content)
    
    points = []
    seen = set()
    
    # Priority 1: Headers
    for p in headers:
        p = p.replace('**', '').replace('*', '').strip()
        if p and p.lower() not in seen and len(p) < 45:
            points.append(p)
            seen.add(p.lower())
            
    # Priority 2: Bold terms
    for p in bold_terms:
        if p and p.lower() not in seen and len(p) < 30:
            points.append(p)
            seen.add(p.lower())

    # Priority 3: Bullets
    for p in bullets:
        p = re.sub(r'\[.*\]\(.*\)', '', p)
        p = p.replace('**', '').replace('*', '').strip()
        if p and p.lower() not in seen and len(p) < 40:
            points.append(p)
            seen.add(p.lower())
            
    return points[:6]

def generate_svg(title, tags, points, color_start, color_end):
    """
    Generates a 1200x630 premium SVG with dynamic font scaling and a clean layout.
    """
    # Escape special characters for XML/SVG safety
    title_esc = html.escape(title)
    tags_esc = [html.escape(t) for t in tags]
    points_esc = [html.escape(p) for p in points]

    # Dynamic font size based on title length
    font_size = 76
    if len(title) > 30: font_size = 64
    if len(title) > 50: font_size = 54
    if len(title) > 70: font_size = 46
    if len(title) > 90: font_size = 40
        
    return f"""<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg_grad" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#020617"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="blur">
        <feGaussianBlur stdDeviation="100" />
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg_grad)"/>
  
  <circle cx="1100" cy="50" r="300" fill="{color_start}" fill-opacity="0.15" filter="url(#blur)"/>
  <circle cx="50" cy="580" r="250" fill="{color_end}" fill-opacity="0.12" filter="url(#blur)"/>

  <rect x="50" y="50" width="1100" height="530" rx="48" fill="white" fill-opacity="0.02" stroke="white" stroke-opacity="0.08" stroke-width="2"/>
  
  <foreignObject x="100" y="90" width="1000" height="450">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; flex-direction: column; justify-content: flex-start; gap: 24px; font-family: 'Inter', system-ui, sans-serif;">
        <div style="color: #ffffff; font-size: {font_size}px; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;">{title_esc}</div>
        <div style="width: 100px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, {color_start} 0%, {color_end} 100%);"></div>
        <div style="display: flex; flex-direction: column; gap: 32px;">
            <div>
                <div style="color: rgba(255,255,255,0.4); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 16px;">Key Concepts &amp; Summary</div>
                <div style="display: flex; flex-wrap: wrap; gap: 12px 14px;">
                    {"".join([f'<div style="background: rgba(255,255,255,0.06); padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); font-size: 15px; font-weight: 600; color: #fff;">{p}</div>' for p in points_esc])}
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                {"".join([f'<div style="color: {color_end}; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">#{t.lower().replace(" ", "-")}</div>' for t in tags_esc[:5]])}
            </div>
        </div>
    </div>
  </foreignObject>

  <text x="1100" y="550" text-anchor="end" fill="white" fill-opacity="0.3" font-family="system-ui, sans-serif" font-size="24" font-weight="800" letter-spacing="0.05em">dailycoder.in</text>
</svg>"""

def main():
    palettes = [
        ("#3b82f6", "#2563eb"), ("#6366f1", "#4f46e5"), ("#8b5cf6", "#7c3aed"),
        ("#ec4899", "#db2777"), ("#f97316", "#ea580c"), ("#10b981", "#059669"),
        ("#14b8a6", "#0d9488")
    ]

    blogs = [d for d in os.listdir(CONTENT_PATH) if os.path.isdir(CONTENT_PATH / d)]
    
    for i, slug in enumerate(sorted(blogs)):
        meta_path = CONTENT_PATH / slug / "meta.json"
        content_path = CONTENT_PATH / slug / "content.md"
        
        if not meta_path.exists() or not content_path.exists():
            continue
            
        with open(meta_path, 'r', encoding='utf-8') as f:
            meta = json.load(f)
        with open(content_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        title = meta.get("title", slug)
        tags = meta.get("tags", [])
        points = extract_key_points(content)
        
        target_dir = PUBLIC_PATH / slug
        target_dir.mkdir(parents=True, exist_ok=True)
        
        hero_path = target_dir / "hero.svg"
        color_start, color_end = palettes[i % len(palettes)]
        
        svg_content = generate_svg(title, tags, points, color_start, color_end)
        
        with open(hero_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f"Generated: {hero_path}")

if __name__ == "__main__":
    main()
