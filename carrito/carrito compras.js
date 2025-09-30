let carrito = [];

// Agregar producto al carrito

function agregarAlCarrito(nombre, precio) {
  let producto = carrito.find(item => item.nombre === nombre);

  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

// Eliminar producto

function eliminarProducto(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  actualizarCarrito();
}

// Aumentar cantidad

function aumentarCantidad(nombre) {
  let producto = carrito.find(item => item.nombre === nombre);
  if (producto) producto.cantidad++;
  actualizarCarrito();
}

// Disminuir cantidad

function disminuirCantidad(nombre) {
  let producto = carrito.find(item => item.nombre === nombre);
  if (producto && producto.cantidad > 1) {
    producto.cantidad--;
  } else {
    eliminarProducto(nombre);
  }
  actualizarCarrito();
}

// Actualizar vista del carrito

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

// Finalizar compra

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // 1️⃣ Guardar en localStorage
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Carrito guardado en localStorage ✅");

  
  // 2️⃣ Enviar al backend (si hay un endpoint en Express)
  
  fetch("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carrito })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Compra procesada:", data);
    alert("Compra enviada al servidor ✅");
  })
  .catch(err => {
    console.error("Error al enviar la compra:", err);
    alert("No se pudo enviar la compra ❌");
  });
