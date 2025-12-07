// LINK DEL EXCEL
const URL_GOOGLE_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCnsEBRlb2IX9k_mbHaLdR7j_G2oiA-eT4JcCCVgN1jnjekPiK8XRAb2DFn7c56N12zY4-Lav-e-vs/pub?output=csv";

// TU NÚMERO (Usamos el que pediste: 1162302758)
const TELEFONO_VENTAS = "5491162302758"; 

// VARIABLES DEL CARRITO
let carrito = [];
const grid = document.getElementById('grid-productos');

// CARGAR PRODUCTOS DESDE EXCEL
Papa.parse(URL_GOOGLE_SHEET, {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        grid.innerHTML = ""; 

        if (data.length === 0) {
            grid.innerHTML = "<p style='text-align:center; width:100%'>Cargando...</p>";
            return;
        }

        data.forEach(producto => {
            if (producto.Nombre && producto.Precio) {
                // Limpiar precio de símbolos
                let precioNumerico = parseInt(producto.Precio.replace(/[^0-9]/g, ''));
                if(isNaN(precioNumerico)) precioNumerico = 0;

                const imagen = (producto.Imagen && producto.Imagen.startsWith('http')) 
                    ? producto.Imagen 
                    : 'https://via.placeholder.com/400x500?text=Sin+Imagen';

                // Crear Tarjeta
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${imagen}" alt="${producto.Nombre}">
                    <div class="info">
                        <h3>${producto.Nombre}</h3>
                        <p class="desc">${producto.Descripcion || ''}</p>
                        <span class="precio">$${precioNumerico}</span>
                        <button class="btn-add" onclick="agregarAlCarrito('${producto.Nombre}', ${precioNumerico})">
                            Agregar al Carrito
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            }
        });
    }
});

// --- FUNCIONES DEL CARRITO ---

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarritoUI();
    toggleCart(); // Abrir carrito para mostrar que se agregó
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Actualizar contador
    cartCount.innerText = carrito.length;

    // Limpiar lista visual
    cartItems.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        cartItems.innerHTML = "<p class='empty-msg'>Tu carrito está vacío.</p>";
    } else {
        carrito.forEach((item, index) => {
            total += item.precio;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <span>$${item.precio}</span>
                </div>
                <span class="remove-item" onclick="eliminarDelCarrito(${index})">&times;</span>
            `;
            cartItems.appendChild(itemElement);
        });
    }

    cartTotal.innerText = `$${total}`;
}

// ABRIR / CERRAR SIDEBAR
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

// FINALIZAR COMPRA (ENVIAR A WHATSAPP)
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Agrega productos primero.");
        return;
    }

    let mensaje = "Hola! Quiero realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} ($${item.precio})\n`;
        total += item.precio;
    });

    mensaje += `\n*Total a pagar: $${total}*`;
    
    // Abrir WhatsApp con el mensaje
    const link = `https://wa.me/${TELEFONO_VENTAS}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
}