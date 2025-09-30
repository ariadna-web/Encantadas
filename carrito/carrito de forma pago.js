//  Inicializar carrito 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const carritoTabla = document.querySelector('#lista-carrito tbody');
const totalElemento = document.querySelector('#total-carrito');

// se supone que lo actualiza
function actualizarCarrito() {
    carritoTabla.innerHTML = ''; 
    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${producto.imagen}" width="50"/></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <button class="disminuir" data-index="${index}">-</button>
                ${producto.cantidad}
                <button class="aumentar" data-index="${index}">+</button>
            </td>
            <td><button class="eliminar" data-index="${index}">X</button></td>
        `;
        carritoTabla.appendChild(fila);
    });

    totalElemento.textContent = total.toFixed(2);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// botones (a ver si van)
carritoTabla.addEventListener('click', (e) => {
    const index = e.target.dataset.index;

    if(e.target.classList.contains('aumentar')){
        carrito[index].cantidad++;
        actualizarCarrito();
    }

    if(e.target.classList.contains('disminuir')){
        if(carrito[index].cantidad > 1){
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
        actualizarCarrito();
    }

    if(e.target.classList.contains('eliminar')){
        carrito.splice(index, 1);
        actualizarCarrito();
    }
});

actualizarCarrito();


function finalizarCompra() {
    if(carrito.length === 0){
        alert("No hay productos en el carrito");
        return;
    }
    alert(`Compra finalizada. Total: $${totalElemento.textContent}`);
    carrito = [];
    actualizarCarrito();
}

function pagarConMercadoPago() {
    alert("Redirigiendo a Mercado Pago...");
}

function pagarConTarjeta(tipo) {
    alert(`Pagando con tarjeta de ${tipo}`);
}