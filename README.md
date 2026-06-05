# La industria del videojuego en cifras

Proyecto de visualización de datos en formato storytelling para la práctica final de la asignatura de Visualización de Datos.

## Contenido

- `index.html`: landing principal.
- `assets/styles.css`: estilos visuales.
- `assets/app.js`: lógica de interacción y gráficos Chart.js.
- `assets/data.js`: datos agregados ya calculados a partir del CSV `vgsales.csv`.
- `LICENSE`: licencia MIT.

## Fuente de datos

Dataset utilizado: Video Game Sales Dataset.

Columnas originales:
- Rank
- Name
- Platform
- Year
- Genre
- Publisher
- NA_Sales
- EU_Sales
- JP_Sales
- Other_Sales
- Global_Sales

## Decisiones de preparación

La web no carga el CSV original en tiempo real. Para hacer la visualización más estable y rápida en GitHub Pages, los datos se han agregado previamente por:

- plataforma
- género
- publisher
- año
- región
- videojuegos más vendidos

Además, se ha creado una variable derivada llamada `Family` para agrupar plataformas por grandes familias: Nintendo, PlayStation, Xbox, PC, Sega, Atari y Other.

## Cómo ejecutar en local

Solo hay que abrir `index.html` en el navegador.

No necesita servidor, backend ni instalación de dependencias.

## Cómo publicar en GitHub Pages

1. Crear un repositorio público en GitHub.
2. Subir todos estos archivos.
3. Ir a Settings > Pages.
4. Seleccionar la rama `main` y carpeta `/root`.
5. Guardar.
6. GitHub generará una URL pública.

## Vídeo

En el archivo `index.html`, buscar:

`REEMPLAZA_ESTE_ID`

y sustituirlo por el ID de un vídeo de YouTube subido como oculto.

Ejemplo:

Si el enlace es:

`https://www.youtube.com/watch?v=abc123`

dejar:

`https://www.youtube.com/embed/abc123`
