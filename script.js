// TU LINK DEL EXCEL (CSV)
const URL_GOOGLE_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCnsEBRlb2IX9k_mbHaLdR7j_G2oiA-eT4JcCCVgN1jnjekPiK8XRAb2DFn7c56N12zY4-Lav-e-vs/pub?output=csv";

// TU NÚMERO
const TELEFONO_VENTAS = "5491162302758"; 

const grid = document.getElementById('grid-productos');

Papa.parse(URL_GOOGLE_SHEET, {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        grid.innerHTML = ""; // Limpiar loader

        if (data.length === 0) {
            grid.innerHTML = "<p style='text-align:center; width:100%'>No hay productos disponibles aún.</p>";
            return;
        }

        // Variable para controlar el retraso de la animación (efecto cascada)
        let delay = 0;

        data.forEach(producto => {
            if (producto.Nombre && producto.Precio) {
                
                // --- PREPARAR DATOS ---
                const imagen = (producto.Imagen && producto.Imagen.startsWith('http')) 
                    ? producto.Imagen 
                    : 'https://via.placeholder.com/400x500?text=Sin+Imagen'; // Imagen más alta

                const precioTexto = producto.Precio.includes('$') ? producto.Precio : `$${producto.Precio}`;
                
                // MENSAJE PERSONALIZADO
                // "Hola quiero el producto [Nombre]"
                const mensajeWa = `Hola! Quiero el producto ${producto.Nombre}`;
                const linkWa = `https://wa.me/${TELEFONO_VENTAS}?text=${encodeURIComponent(mensajeWa)}`;

                // --- CREAR TARJETA ---
                const card = document.createElement('div');
                card.className = 'card';
                card.style.animationDelay = `${delay}s`; // Cada una aparece un poquito después de la otra

                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${imagen}" alt="${producto.Nombre}">
                    </div>
                    <div class="info">
                        <h3>${producto.Nombre}</h3>
                        <p class="desc">${producto.Descripcion || ''}</p>
                        <span class="precio">${precioTexto}</span>
                        <a href="${linkWa}" class="btn-comprar" target="_blank">
                            <i class="fab fa-whatsapp"></i> COMPRAR
                        </a>
                    </div>
                `;
                
                grid.appendChild(card);
                delay += 0.1; // Aumentar retraso para la siguiente tarjeta
            }
        });
    },
    error: function(err) {
        console.error(err);
        grid.innerHTML = "<p>Error al cargar el catálogo.</p>";
    }
});