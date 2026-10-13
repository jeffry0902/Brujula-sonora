# Brújula Sonora

App web accesible que convierte la brújula del celular en sonido y voz, para "escuchar" el campo magnético de la Tierra y de los imanes. Pensada para estudiantes con discapacidad visual que usan TalkBack (Android) o VoiceOver (iPhone).

**Enlace:** https://jeffry0902.github.io/Brujula-sonora/

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Toda la app: textos, estilos y programa. |
| `manifest.webmanifest` | Nombre e ícono para agregarla a la pantalla de inicio. |
| `sw.js` | Guarda la app para que funcione sin internet. |
| `icons/` | Íconos de la app. |

No usa librerías externas, no pide cuenta y no envía datos a ningún lado. Solo guarda en el celular dos preferencias: si la voz de la app está encendida y el volumen.

## Cómo hacer cambios (desde el navegador, sin instalar nada)

1. Entra a https://github.com/jeffry0902/Brujula-sonora y abre `index.html`.
2. Toca el ícono del lápiz (✏️ "Edit this file").
3. Busca el texto que quieres cambiar. Por ejemplo:
   - Explicaciones del modo Aprender: busca `const TEMAS`.
   - Textos hablados de cada modo: busca `const INSTRUCCIONES`.
   - Umbrales del detector (20° y 60°): busca `revisarDetector`.
   - Margen del norte (10°): busca `revisarNorte`.
4. Toca **Commit changes…** y confirma.
5. Abre `sw.js`, cambia `brujula-sonora-v1` por `brujula-sonora-v2` (v3, v4… cada vez) y guarda igual. Así los celulares descargan la versión nueva.
6. Espera 1 o 2 minutos y recarga la app (ciérrala y ábrela de nuevo).
