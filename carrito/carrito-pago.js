// Selección de elementos

const listaProductos = document.querySelector('#lista-1');
const carrito = document.querySelector('#carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const comprarCarritoBtn = document.querySelector('#comprar-carrito');
const totalCarrito = document.querySelector('.total');
let articulosCarrito = [];

// Cargar eventos 

cargarEventListeners();
function cargarEventListeners() {
    // Cuando se agrega un producto
    listaProductos.addEventListener('click', agregarProducto);

    // Eliminar productos del carrito

    carrito.addEventListener('click', eliminarProducto);

    // Vaciar carrito

    vaciarCarritoBtn.addEventListener('click', e => {
        e.preventDefault();
        articulosCarrito = [];
        limpiarHTML();
        actualizarTotal();
    });

    // Comprar carrito

    comprarCarritoBtn.addEventListener('click', e => {
        e.preventDefault();
        if(articulosCarrito.length === 0){
            alert("Tu carrito está vacío.");
            return;
        }
        // Simulamos proceso de pago

        let formasPago = prompt("Elige forma de pago: \n1. Tarjeta\n2. Transferencia\n3. Efectivo");
        if(formasPago){
            alert("Compra realizada con éxito usando: " + formasPago);
            articulosCarrito = [];
            limpiarHTML();
            actualizarTotal();
        }
    });
}

// Función para agregar productos

function agregarProducto(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

// Lee los datos del producto

function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Ver si el producto ya existe

    const existe = articulosCarrito.some(prod => prod.id === infoProducto.id);
    if(existe) {

        // Actualizamos cantidad

        articulosCarrito = articulosCarrito.map(prod => {
            if(prod.id === infoProducto.id) {
                prod.cantidad++;
                return prod;
            } else {
                return prod;
            }
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoProducto];
    }
    carritoHTML();
}

// Eliminar producto

function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-producto')) {
        const productoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(prod => prod.id !== productoId);
        carritoHTML();
    }
}

// Muestra el carrito en el HTML

function carritoHTML() {
    limpiarHTML();
    articulosCarrito.forEach(prod => {
        const {imagen, titulo, precio, cantidad, id} = prod;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="50"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-producto" data-id="${id}">❌</a>
            </td>
        `;
        carrito.appendChild(row);
    });
    actualizarTotal();
}

// Limpia el carrito HTML

function limpiarHTML() {
    while(carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }
}

// Calcular total

function actualizarTotal() {
    let total = 0;
    articulosCarrito.forEach(prod => {
        let precio = parseFloat(prod.precio.replace('$',''));
        total += precio * prod.cantidad;
    });
    totalCarrito.innerHTML = `<i>Total: $${total}</i>`;
}

