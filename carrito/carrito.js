// Inicializar carrito desde localStorage   

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Referencias al DOM

const divCarrito = document.getElementById("carrito");
const botonAgregar = document.getElementById("agregar");
const botonVaciar = document.getElementById("vaciar");

// ---------------------- FUNCIONES ----------------------

// Guardar carrito en localStorage

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar productos en el carrito

function mostrarCarrito() {
  divCarrito.innerHTML = "";
  if (carrito.length === 0) {
    divCarrito.innerHTML = "<p>Carrito vacío</p>";
  } else {
    carrito.forEach((producto, index) => {
      divCarrito.innerHTML += `
        <p>${producto.nombre} - $${producto.precio.toFixed(2)}
          <button onclick="eliminar(${index})">❌</button>
        </p>`;
    });
  }
}

// Agregar un producto

botonAgregar.addEventListener("click", () => {
  const nombre = prompt("Ingrese el nombre del producto:");
  if (!nombre) return alert("Debe ingresar un nombre");

  const precio = parseFloat(prompt("Ingrese el precio del producto:"));
  if (isNaN(precio)) return alert("Precio inválido");

  // Revisar si el producto ya existe en el carrito
  
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarrito();
  mostrarCarrito();
});

// Eliminar un producto

function eliminar(indice) {
  carrito.splice(indice, 1);
  guardarCarrito();
  mostrarCarrito();
}

// Vaciar todo el carrito

botonVaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});

// ---------INICIALIZAR-------
mostrarCarrito();

