let carrito = [];

// --- Funciones de carrito ---

function agregarAlCarrito(nombre, precio) {
  let producto = carrito.find(item => item.nombre === nombre);

  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

function eliminarProducto(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  actualizarCarrito();
}

function aumentarCantidad(nombre) {
  let producto = carrito.find(item => item.nombre === nombre);
  if (producto) producto.cantidad++;
  actualizarCarrito();
}

function disminuirCantidad(nombre) {
  let producto = carrito.find(item => item.nombre === nombre);
  if (producto && producto.cantidad > 1) {
    producto.cantidad--;
  } else {
    eliminarProducto(nombre);
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total");

  lista.innerHTML = "";
  let montoTotal = 0;

  carrito.forEach(item => {
    montoTotal += item.precio * item.cantidad;

    let li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio} x ${item.cantidad}
      <button onclick="aumentarCantidad('${item.nombre}')">+</button>
      <button onclick="disminuirCantidad('${item.nombre}')">-</button>
      <button onclick="eliminarProducto('${item.nombre}')">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  total.textContent = montoTotal;
}

// --- Finalizar compra ---

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Guardar en localStorage
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Carrito guardado en localStorage ✅");

  // Enviar al backend
  
  fetch("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carrito })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Compra procesada:", data);
  })
  .catch(err => console.error("Error al enviar la compra:", err));
}

// --- Métodos de pago ---

function pagarConMercadoPago() {
  if (carrito.length === 0) {
    alert("Agregá productos antes de pagar.");
    return;
  }
  alert("Redirigiendo a Mercado Pago... (simulación)");
  // Aca va la integración oficial con Mercado Pago
  // Ejemplo real: window.location.href = "URL_de_preferencia_de_pago";
}

function pagarConTarjeta(tipo) {
  if (carrito.length === 0) {
    alert("Agregá productos antes de pagar.");
    return;
  }
  alert(`Pago con tarjeta de ${tipo} en proceso... (simulación)`);
  // Aquí podes abrir un formulario para ingresar los datos de la tarjeta
}
