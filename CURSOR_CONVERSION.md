# Cursor Conversion Instructions

## Convert .cur files to PNG format

The Etherlords 2 cursor files need to be converted from .cur format to PNG for web use.

### Option 1: Online Conversion
1. Go to an online .cur to PNG converter (like convertio.co or online-convert.com)
2. Upload each .cur file from the `cursors/` directory
3. Download the converted PNG files
4. Place them in `cursors/web/` with these names:

### Required Conversions:
- `Cross.cur` → `cursors/web/cross.png`
- `DiagBD.cur` → `cursors/web/diagbr.png`
- `DiagTR.cur` → `cursors/web/diagtr.png`
- `Hand.cur` → `cursors/web/hand.png`
- `Hor.cur` → `cursors/web/hor.png`
- `Precise.cur` → `cursors/web/precise.png`
- `Up.cur` → `cursors/web/up.png`
- `Ver.cur` → `cursors/web/ver.png`

### Option 2: ImageMagick (if available)
```bash
# Install ImageMagick first, then:
convert cursors/Hand.cur cursors/web/hand.png
convert cursors/Cross.cur cursors/web/cross.png
convert cursors/Precise.cur cursors/web/precise.png
convert cursors/Hor.cur cursors/web/hor.png
convert cursors/Ver.cur cursors/web/ver.png
convert cursors/DiagBD.cur cursors/web/diagbr.png
convert cursors/DiagTR.cur cursors/web/diagtr.png
convert cursors/Up.cur cursors/web/up.png
```

### Option 3: GIMP
1. Open GIMP
2. File → Open → Select .cur file
3. File → Export As → Save as PNG
4. Repeat for each cursor

## After Conversion

Once PNG files are in `cursors/web/`, the custom cursors will automatically work throughout the website:

- **Portfolio images**: Crosshair cursor
- **Buttons/Links**: Hand cursor
- **Text inputs**: Precise cursor
- **Admin interface**: Themed cursors throughout

## Hotspot Positioning

The CSS includes hotspot coordinates for proper cursor alignment:
- Hand cursor: `12 12` (center-ish)
- Cross cursor: `16 16` (center)
- Precise cursor: `2 2` (tip)

Adjust these coordinates in `css/cursors.css` if cursors don't align properly.

## Testing

After conversion, test cursors by:
1. Hovering over portfolio images (should show crosshair)
2. Hovering over buttons (should show hand)
3. Clicking in text fields (should show precise cursor)
4. Checking admin interface interactions