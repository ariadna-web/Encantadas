// Variables

const carrito = document.querySelector('#lista-carrito tbody');
const listaProductos = document.querySelector('#lista-1');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Cargar eventos

cargarEventos();
function cargarEventos() {
  // Cuando se presiona "Agregar"
  listaProductos.addEventListener('click', agregarProducto);

  // Eliminar productos del carrito
  
  carrito.addEventListener('click', eliminarProducto);

  // Vaciar todo el carrito
  
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];
    limpiarCarrito();
  });
}

// Funciones

function agregarProducto(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    const producto = e.target.parentElement.parentElement;
    leerDatosProducto(producto);
  }
}

function eliminarProducto(e) {
  if (e.target.classList.contains('borrar-producto')) {
    const productoId = e.target.getAttribute('data-id');
    articulosCarrito = articulosCarrito.filter(prod => prod.id !== productoId);
    carritoHTML();
  }
}

function leerDatosProducto(producto) {
  const infoProducto = {
    imagen: producto.querySelector('img').src,
    titulo: producto.querySelector('h3').textContent,
    precio: producto.querySelector('.precio').textContent,
    id: producto.querySelector('a').getAttribute('data-id'),
    cantidad: 1
  };

  // Revisar si existe en el carrito
  
  const existe = articulosCarrito.some(prod => prod.id === infoProducto.id);
  if (existe) {
    articulosCarrito = articulosCarrito.map(prod => {
      if (prod.id === infoProducto.id) {
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

function carritoHTML() {
  limpiarCarrito();

  articulosCarrito.forEach(prod => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${prod.imagen}" width="50"></td>
      <td>${prod.titulo}</td>
      <td>${prod.precio}</td>
      <td>${prod.cantidad}</td>
      <td><a href="#" class="borrar-producto" data-id="${prod.id}">❌</a></td>
    `;
    carrito.appendChild(row);
  });
}

function limpiarCarrito() {
  while (carrito.firstChild) {
    carrito.removeChild(carrito.firstChild);
  }
}
 /* agregar un forEach para contar el precio total del carrito*/