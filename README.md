# Generador de CV

Aplicación web para completar información profesional, construir una vista de currículum y exportarla a PDF desde el navegador.

## Tecnologías

HTML, CSS, JavaScript y Bootstrap. La exportación utiliza html2canvas 1.4.1 y jsPDF 2.5.1 cargados desde CDN.

## Funcionalidades implementadas

- Datos personales, ocupación, contacto y enlace a LinkedIn.
- Secciones dinámicas de habilidades, software e idiomas con niveles.
- Experiencia laboral, educación y certificaciones con fechas.
- Vista de currículum construida con JavaScript.
- Descarga del CV como PDF a partir de una captura de la vista.

## Uso local

No requiere base de datos ni instalación de paquetes.

1. Clonar o descargar el repositorio.
2. Abrir `index.html` en un navegador moderno.
3. Completar los campos y agregar los elementos de cada sección.
4. Generar el currículum y utilizar el botón de descarga.

También puede servirse la carpeta con un servidor estático, por ejemplo `python -m http.server 8000`, si Python está instalado. Abrir entonces http://localhost:8000. La exportación requiere acceso a las librerías del CDN.

## Organización

- `index.html`: formulario e importaciones.
- `assets/js/site/index.js`: validación, secciones dinámicas, generación y exportación.
- `assets/css/site/site.css`: estilos propios.
- `assets/`: también contiene las dependencias locales de Bootstrap.

## Consideraciones actuales

- El formulario se limpia después de generar el CV; no hay guardado persistente implementado en el JavaScript revisado.
- El PDF se genera como imagen: comprobar legibilidad, selección de texto y cortes con documentos extensos.
- El HTML declara idioma inglés aunque la interfaz está en español.
- El campo de ocupación tiene tipo email y el de correo tipo texto: corregir su semántica y validación.
- El encabezado de certificaciones se construye como “Educación”: corregir esa etiqueta.

## Próximas mejoras

Guardar borradores con consentimiento del usuario, permitir editar el CV generado, separar captura de datos y presentación, ofrecer plantillas y mejorar la exportación con texto seleccionable y saltos de página controlados. Añadir pruebas para campos vacíos, fechas, enlaces y currículos de varias páginas.

## Validación

README basado en lectura del HTML y JavaScript. No se ejecutó una sesión de navegador ni se validó un PDF exportado.

## Autor

[Jeison Rosario](https://github.com/Jeison-Rosario)
