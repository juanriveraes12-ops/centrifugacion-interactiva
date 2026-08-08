# Centrifugacion interactiva

Recurso didactico para explorar la sedimentacion radial en una centrifuga tubular mediante el modelo de Stokes.

## Desarrollo local

Requisitos: Node.js 24 LTS y Git.

```bash
npm install
npm run dev
```

Comandos disponibles:

- `npm run dev`: servidor local con recarga automatica.
- `npm test`: pruebas de los calculos cientificos.
- `npm run build`: genera el sitio de produccion en `dist/`.
- `npm run preview`: previsualiza la compilacion.

## Publicacion

El workflow de GitHub Actions publica la rama `main` en GitHub Pages. En el repositorio de GitHub, seleccione **Settings > Pages > Source > GitHub Actions** una sola vez.

Cada `git push` posterior ejecutara pruebas, compilara y publicara la nueva version.

## Estructura

- `index.html`: contenido y estructura de la pagina.
- `src/styles.css`: presentacion y diseno adaptable.
- `src/calculations.js`: constantes y modelo matematico.
- `src/main.js`: interacciones, graficas y animacion.
- `src/calculations.test.js`: validacion automatizada de resultados.
- `docs/compilacion_chat_centrifugacion.md`: memoria del desarrollo original.
