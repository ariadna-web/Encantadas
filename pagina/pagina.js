const carritoElemento = document.querySelector('#lista-carrito tbody')
const listaProductos = document.querySelector('#lista-1')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
let articulosCarrito = []

//localstoage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
    actualizarTotal()
}

function cargarCarritoInicial() {

    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || []
    carritoHTML();
}

// eventos
cargarEventos();
function cargarEventos() {
    document.addEventListener('DOMContentLoaded', cargarCarritoInicial)
    listaProductos.addEventListener('click', agregarProducto)
    carritoElemento.addEventListener('click', eliminarProducto)
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        articulosCarrito = []
        limpiarCarrito()
        sincronizarStorage()
    })
};

function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement
        leerDatosProducto(producto)
    }
};

function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: parseFloat(producto.querySelector('.precio').textContent.replace('$', '')), 
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Revisar
    const existe = articulosCarrito.some(prod => prod.id === infoProducto.id)
    if (existe) {
        articulosCarrito = articulosCarrito.map(prod => {
            if (prod.id === infoProducto.id) {
                prod.cantidad++
                return prod
            } else {
                return prod
            }
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoProducto]
    }

    carritoHTML();
    sincronizarStorage();
}

function eliminarProducto(e) {
    if (e.target.classList.contains('borrar-producto')) {
        const productoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter(prod => prod.id !== productoId)
        carritoHTML();
        sincronizarStorage();
    }
}


function carritoHTML() {
    limpiarCarrito();


 articulosCarrito.forEach(prod => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><img src="${prod.imagen}" width="50"></td>
            <td>${prod.titulo}</td>
            <td>$${prod.precio.toFixed(2)}</td> 
            <td>
                <button class="sumar" data-id="${prod.id}">+</button>
                ${prod.cantidad}
                <button class="restar" data-id="${prod.id}">-</button>
            </td>
            <td><a href="#" class="borrar-producto" data-id="${prod.id}">❌</a></td>
        `;
        carritoElemento.appendChild(row)
    })

    // botones
    document.querySelectorAll('.sumar').forEach(btn => {
        btn.addEventListener('click', () => {
            aumentarCantidad(btn.dataset.id);
        });
    });
    document.querySelectorAll('.restar').forEach(btn => {
        btn.addEventListener('click', () => {
            disminuirCantidad(btn.dataset.id);
        });
    });

    actualizarTotal();
    sincronizarStorage();
}

function aumentarCantidad(id) {
    articulosCarrito = articulosCarrito.map(prod => {
        if (prod.id === id) prod.cantidad++;
        return prod;
    });
    carritoHTML();
}

function disminuirCantidad(id) {
    articulosCarrito = articulosCarrito.map(prod => {
        if (prod.id === id) {
            prod.cantidad--;
        }
        return prod;
    }).filter(prod => prod.cantidad > 0);
    carritoHTML();

};

function limpiarCarrito() {
    while (carritoElemento.firstChild) {
        carritoElemento.removeChild(carritoElemento.firstChild)
    }
};

function actualizarTotal() {
    let total = articulosCarrito.reduce((acc, prod) => {
        return acc + (prod.precio * prod.cantidad);
    }, 0); 
    
    const totalElemento = document.querySelector('.total');
    totalElemento.innerHTML = `<i>Total: $${total.toFixed(2)}</i>`;
}

const form = document.querySelector('.contact form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Tu opinión ha sido enviada!');
});