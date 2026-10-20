# Generador de CV

Aplicación estática para completar un perfil profesional, revisar el currículum y descargarlo como PDF con texto seleccionable. Desarrollada por [Jeison Rosario](https://github.com/Jeison-Rosario).

**Demo:** https://jeison-rosario.github.io/generador-de-cv/

## Qué permite hacer

- Introducir datos personales y un resumen profesional. Solo nombre, ocupación y correo son obligatorios.
- Agregar y eliminar habilidades, software, idiomas, experiencias, educación y certificaciones (hasta 20 entradas por sección).
- Dejar vacías las secciones opcionales; las filas parcialmente completadas muestran errores específicos.
- Marcar estudios o empleos «En curso», validar el orden de las fechas y aceptar teléfonos con prefijo internacional.
- Generar y actualizar una única vista previa sin borrar el formulario. Si hay cambios, actualizarla antes de exportar.
- Cargar un ejemplo ficticio, volver a editar y borrar todo con confirmación.
- Descargar un PDF A4 de texto con ajuste de líneas, saltos de página y numeración; o utilizar el diálogo nativo de impresión.

## Uso

Abrir `index.html` en un navegador moderno o acceder a la demo. No necesita Node.js, base de datos ni servidor de aplicaciones para funcionar.

1. Completar los datos o pulsar **Cargar ejemplo**.
2. Agregar las secciones necesarias y eliminar las entradas que no se usarán.
3. Pulsar **Generar / actualizar CV** y corregir los errores indicados.
4. Revisar el resultado y pulsar **Descargar PDF**. Para editar, cambiar el formulario y actualizar otra vez.
5. Para imprimir o guardar mediante el navegador, usar **Imprimir / guardar PDF**, seleccionar papel A4 y desactivar encabezados y pies automáticos si se desea.

Para desarrollo también se puede servir la carpeta con `python -m http.server 8000` y abrir http://localhost:8000/.

## Privacidad y límites

Los campos se procesan en el navegador: no se envían a una API ni se guardan en localStorage, cookies o bases de datos. Al recargar o cerrar la pestaña, la aplicación no recupera el borrador. Descargar el resultado antes de salir.

jsPDF **4.2.1** se carga desde jsDelivr con versión fija e integridad SRI; esa descarga necesita conexión. Si no carga, la aplicación ofrece el diálogo nativo de impresión. La interfaz y la vista previa no necesitan esa biblioteca.

El PDF descargado utiliza Helvetica y admite texto latino, incluidos acentos y ñ. Para otros alfabetos o emojis, se indica utilizar la impresión del navegador para evitar caracteres corruptos. El PDF de descarga tiene su propio diseño de una columna; no es una captura de pantalla ni una copia píxel a píxel de la vista previa. Los párrafos extensos pueden continuar en otra página, sin recortar una imagen. La impresión y la descarga pueden tener una distribución ligeramente diferente.

Límites de texto: nombre 100, ocupación 120, correo 160, enlace 300, resumen 3000, títulos/instituciones 140 y descripciones 2000 caracteres. Los datos introducidos se renderizan como texto, y los enlaces solo admiten HTTP/HTTPS sin credenciales.

## Estructura

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Formulario, controles accesibles e importaciones |
| `assets/css/site/site.css` | Ajustes mínimos sobre Bootstrap, vista del CV y estilos de impresión |
| `assets/js/site/data.js` | Validación y modelo compartido de secciones |
| `assets/js/site/index.js` | Entradas dinámicas, estado del formulario y vista previa |
| `assets/js/site/pdf.js` | PDF de texto y paginación, sin html2canvas |
| `test/cv.test.cjs` | Pruebas de reglas, interacción DOM y PDF real |

La interfaz conserva Bootstrap local, el encabezado azul, el formulario centrado y las tarjetas oscuras del CV original. Las habilidades, software e idiomas preceden al resumen y a la trayectoria, como en la versión inicial. Se añaden únicamente los controles de las funciones nuevas y ajustes de accesibilidad y móviles. No hay paso de compilación.

## Pruebas de desarrollo

Node.js 22 o superior. Estas dependencias solo se necesitan para desarrollar y comprobar el proyecto, no para publicarlo en GitHub Pages.

```sh
npm ci
npm test
```

Las pruebas comprueban campos opcionales, contactos y enlaces inválidos, fechas, niveles, eliminación de filas, IDs y etiquetas, conservación del formulario, regeneración, texto que parece HTML, ejemplo, limpieza, cambios pendientes y la alternativa si falla el CDN. También generan PDF reales corto y largo en `/tmp/cv-qa` (o el directorio definido por `CV_QA_DIR`).

Validación de esta revisión: 10 pruebas aprobadas; PDF de una y varias páginas renderizados con Poppler, comprobación del texto extraíble y acentos; archivo del CDN contrastado con la versión de jsPDF utilizada en las pruebas. La revisión visual del formulario en navegador y las pruebas en dispositivos reales quedan pendientes.

Antes de publicar una nueva versión, comprobar en escritorio y móvil:

- Completar solo los campos obligatorios y generar.
- Agregar y eliminar entradas, marcar «En curso» y rechazar una fecha final anterior al inicio.
- Editar después de generar, actualizar y comprobar que el PDF refleja los cambios.
- Exportar un CV corto y otro largo; comprobar las primeras y últimas líneas y los acentos.
- Probar el diálogo de impresión y la descarga desde el móvil.

## Publicación

GitHub Pages sirve los archivos estáticos del repositorio, sin consumir recursos de alwaysdata. Fusionar el PR hacia la rama configurada en Pages y esperar a que termine su despliegue. No subir `node_modules`.

## Dependencias

JavaScript, HTML y CSS nativos; [jsPDF](https://github.com/parallax/jsPDF) (licencia MIT) para la descarga. jsdom se utiliza únicamente para pruebas automatizadas del DOM. La vista de impresión utiliza el motor del navegador.
## Flujo de edición y recuperación

El formulario conserva las entradas editables; la vista previa representa la última versión validada. Tras modificar un dato, las exportaciones se deshabilitan hasta volver a generar. Una fila completamente vacía se omite; una fila empezada debe completarse o eliminarse.

Las fechas de trayectoria usan mes y año. Marcar **En curso / empleo actual** deshabilita la fecha final. La fecha de nacimiento es opcional. El ejemplo y el borrado piden confirmación si corresponde; no hay historial de versiones ni recuperación al recargar.

## Solución de problemas

| Situación | Acción |
| --- | --- |
| Descarga deshabilitada | Generar de nuevo y resolver los errores de campos |
| Fallo del CDN | Revisar conexión o usar impresión nativa |
| Otro alfabeto o emoji no exportable | Usar «Imprimir / guardar PDF» |
| PDF distinto a la vista previa | La descarga tiene un diseño propio de texto |
| Impresión con fecha o dirección web | Desactivar encabezados y pies automáticos del navegador |
| Borrador perdido al recargar | No existe almacenamiento persistente implementado |

## Desarrollo y contribución

Modificar `data.js` para reglas, `index.js` para controles y vista previa, y `pdf.js` para descarga y paginación. Conservar etiquetas asociadas, IDs únicos y `textContent` para datos introducidos por el usuario. Mantener la interfaz original de Bootstrap y verificar el caso afectado con documentos cortos y largos.

Como ampliaciones futuras: guardado de borradores con consentimiento y una fuente PDF con mayor cobertura de caracteres. No están implementadas actualmente. Esta ampliación documental no vuelve a ejecutar las pruebas ya descritas.
