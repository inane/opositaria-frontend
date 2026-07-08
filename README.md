# Opositaría Frontend

Opositaría es un producto en fase inicial orientado a ayudar a personas que preparan oposiciones a vincular, organizar y trabajar con fuentes de información relacionadas con su temario.

La primera aproximación del MVP plantea una experiencia similar a un clon focalizado de NotebookLM para oposiciones: permitir que la persona usuaria incorpore manualmente fuentes de información, inicialmente mediante la subida de archivos PDF, para poder construir una base de conocimiento útil alrededor de su oposición.

## Propósito Del Proyecto

El objetivo del proyecto es crear una herramienta que ayude a preparar oposiciones con foco en tres ejes principales:

- Metodología: apoyar una forma de estudio estructurada, progresiva y accionable.
- UX: cuidar la experiencia para que trabajar con temarios extensos, documentos y sesiones de estudio sea claro y fluido.
- Métricas: medir progreso, actividad, cobertura y resultados para convertir el estudio en un proceso observable.

La inteligencia artificial será una pieza importante del producto, pero no como una capa genérica, sino como una ayuda integrada en flujos concretos: análisis de fuentes, asistencia al estudio, generación de materiales, recuperación de información y seguimiento inteligente del avance.

## Enfoque De Desarrollo

Este documento es vivo y representa una primera iteración del MVP. La dirección del producto se irá refinando a medida que se validen necesidades, flujos y funcionalidades.

El desarrollo se hará de forma incremental, generando funcionalidades poco a poco mediante OpenSpec y SSD, para mantener una relación clara entre intención de producto, especificación, implementación y validación.

## Estado Actual

El proyecto está todavía cerca de la plantilla inicial de Angular. Las funcionalidades principales se irán incorporando progresivamente a partir de cambios especificados.

## Flujo Funcional Del Frontend

El frontend Angular v22 es la capa desde la que la persona usuaria interactúa con el sistema: sube documentos, consulta el estado de procesamiento y accede a las funcionalidades de estudio cuando las fuentes están listas.

![Flujo del sistema Opositaria](docs/workflow.png)

Desde el punto de vista del frontend, el flujo inicial del MVP será:

- La persona usuaria sube un documento, inicialmente PDF.
- La aplicación envía el archivo a la API.
- La API responde rápidamente con un identificador de trabajo.
- La UI muestra el estado de ingesta sin bloquear la pantalla.
- El estado se actualizará mediante polling, WebSocket o SSE.
- Cuando el documento esté listo, se habilitarán funcionalidades de estudio sobre esa fuente.

Estados relevantes para la interfaz:

- `PENDING`: el documento ha sido recibido y está pendiente de procesamiento.
- `PROCESSING`: el sistema está extrayendo, limpiando, fragmentando e indexando el contenido.
- `DONE`: la fuente está lista para ser usada.
- `ERROR`: ha ocurrido un problema durante la ingesta.

El frontend no procesa PDFs, no genera embeddings y no indexa información. Su foco es ofrecer una experiencia clara, trazable y accionable sobre el estado del sistema.

Responsabilidades principales del frontend:

- Subida manual de fuentes de información.
- Feedback visual del estado de ingesta.
- Gestión de errores comprensible para la persona usuaria.
- Acceso al chat cuando la fuente esté lista.
- Visualización de respuestas con fuentes.
- Presentación de resúmenes, tests, planes y recomendaciones.
- Métricas de progreso y actividad cuando el producto avance.

## Desarrollo Local

Instala las dependencias con:

```bash
npm install
```

Arranca el servidor de desarrollo con:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`.

## Build Y Tests

Para generar una build de producción:

```bash
npm run build
```

Para ejecutar los tests unitarios:

```bash
npm run test
```
