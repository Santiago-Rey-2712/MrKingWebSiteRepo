# Mr. King — Personal Website

A single-page portfolio site for a programmer / designer / game developer, built
from scratch (not a template) using your color palette:

- `#2C5EAD`, `#1591DC`, `#4BB8FA`, `#C4E2F5` (+ a dark navy `#0E1B2C` and light
  paper `#F7FAFD` added for contrast/readability).

## Files

```
index.html
assets/css/style.css
assets/js/script.js
```

Just open `index.html` in a browser — no build step, no dependencies besides
Google Fonts (Space Grotesk + Inter), loaded from a CDN.

## How editing works ("Activar modo edición")

Click the **"Activar modo edición"** button in the top bar. While it's on:

- **Any text** (headline, paragraphs, project titles/descriptions, contact
  info) becomes clickable and editable directly on the page — no code needed.
- **Every image/video box** shows an **"Subir imagen o video"** button. Click
  it, pick a file, and it replaces the placeholder instantly.
- **"+ Añadir proyecto"** adds a new project card (with its own upload slot,
  title, tag and description) — use this for anything beyond the five
  starter projects (2D game, 3D game, website, catalog, interior design).
- **"+ Añadir imagen o video"** in the Gallery section adds a free media slot
  for anything else you want to show (renders, screenshots, gameplay clips).
- **"Eliminar proyecto"** / the little **×** on gallery items removes them.
- **"Pegar enlace de WhatsApp"** lets you paste your `wa.me/...` link once you
  have it.

Everything saves automatically to your browser's local storage as you edit
(there's also a manual **"Guardar cambios"** button, and a **"Restablecer
todo"** button that wipes your edits and brings back the lorem-ipsum
starter content).

## Important limitation: this is a static site

Local storage only lives **in the browser you edited it in** — it's perfect
for filling in your content once and then exporting/deploying the final
version, but:

- If you open the site in a different browser or device, you'll see the
  original placeholders again, not your edits.
- If you publish this to a host (GitHub Pages, Netlify, etc.) as-is, visitors
  will always see the *last version you saved to the HTML files*, not live
  edits from your own browser.

**Recommended workflow:** fill everything in using edit mode on your machine,
then re-export the final HTML (I can help generate a "frozen" version of the
page with your content baked in, or wire it up to a small backend/CMS if you
want edits to persist for real, across devices/visitors).

## Content already filled in

- Skills: Python, HTML, CSS, JavaScript (Programming) · Blender, Photopea,
  Adobe Illustrator (Design) · Unity (Game Dev).
- Five starter project cards: 2D game, 3D game, website, catalog, interior
  design — all with lorem ipsum text ready to replace.
- Contact section with phone/email placeholders and a WhatsApp button ready
  for your link.
