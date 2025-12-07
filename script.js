// TU LINK
const URL_GOOGLE_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCnsEBRlb2IX9k_mbHaLdR7j_G2oiA-eT4JcCCVgN1jnjekPiK8XRAb2DFn7c56N12zY4-Lav-e-vs/pub?output=csv";

const grid = document.getElementById('grid-productos');

grid.innerHTML = "<h3>🔄 Intentando conectar con Google...</h3>";

Papa.parse(URL_GOOGLE_SHEET, {
    download: true,
    header: true,
    complete: function(results) {
        console.log("Datos recibidos:", results.data); // Muestra datos en consola (F12)
        const data = results.data;
        grid.innerHTML = ""; 

        if (data.length === 0) {
            grid.innerHTML = "<h3>⚠️ El Excel parece vacío.</h3>";
            return;
        }

        let productosEncontrados = 0;

        data.forEach(producto => {
            // Imprimir cada fila para ver si hay errores de escritura
            // Busca columnas que se llamen "Nombre" (Mayúscula)
            if (producto.Nombre) {
                productosEncontrados++;
                const card = document.createElement('div');
                card.className = 'card';
                const img = (producto.Imagen && producto.Imagen.startsWith('http')) ? producto.Imagen : 'https://via.placeholder.com/300?text=Sin+Imagen';
                const precio = producto.Precio || "Consultar";

                card.innerHTML = `
                    <img src="${img}" alt="${producto.Nombre}">
                    <div class="info">
                        <h3>${producto.Nombre}</h3>
                        <p>${producto.Descripcion || ''}</p>
                        <span class="precio">$${precio}</span>
                        <a href="#" class="btn">COMPRAR</a>
                    </div>
                `;
                grid.appendChild(card);
            }
        });

        if (productosEncontrados === 0) {
            grid.innerHTML = "<h3>❌ Conecté al Excel, pero no encontré la columna 'Nombre'. <br>Revisa que la Fila 1 tenga la N mayúscula.</h3>";
        }
    },
    error: function(err) {
        console.error(err);
        grid.innerHTML = `<h3>❌ ERROR DE CONEXIÓN:</h3><p>${JSON.stringify(err)}</p><p>Asegúrate de entrar por <b>localhost:3000</b></p>`;
    }
});