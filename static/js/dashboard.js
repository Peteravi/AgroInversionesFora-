const API_URLS = {
  productos: 'http://localhost:3000/api/productos',
  blogPosts: 'http://localhost:3000/api/blogPosts',
  info: 'http://localhost:3000/api/info',
  chatbotResponses: 'http://localhost:3000/api/chatbotResponses',
  nosotros: 'http://localhost:3000/api/nosotros',
  typoCorrections: 'http://localhost:3000/api/typoCorrections'
};

 // Función para cargar los productos
 function cargarProductos() {
  fetch('/api/productos')
    .then(response => response.json())
    .then(data => {
      const listaProductos = document.getElementById('listaProductos');
      listaProductos.innerHTML = ''; // Limpiar la lista antes de agregar nuevos productos
      data.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto');
        productoElement.innerHTML = `
      <h5>${producto.nombre}</h5>
      <p>${producto.descripcion}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <button class="btn btn-info" onclick="editarProducto(${producto.id})">Editar</button>
      <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
    `;
        listaProductos.appendChild(productoElement);
      });
    })
    .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para editar un producto
function editarProducto(productoId) {
  fetch(`/api/productos/${productoId}`)
    .then(response => response.json())
    .then(data => {
      // Rellenar los campos del formulario con los datos del producto
      document.getElementById('editarProductoId').value = data.id;
      document.getElementById('editarNombre').value = data.nombre;
      document.getElementById('editarCategoria').value = data.categoria;
      document.getElementById('editarPrecio').value = data.precio;
      document.getElementById('editarDescripcion').value = data.descripcion;
      document.getElementById('editarDescripcion1').value = data.descripcion1;

      // Mostrar el modal de edición
      $('#modalEditarProducto').modal('show');
    })
    .catch(error => console.error('Error al cargar los datos del producto:', error));
}


// Función para eliminar un producto
function eliminarProducto(productoId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    fetch(`/api/productos/${productoId}`, {
      method: 'DELETE'
    })
      .then(() => {
        cargarProductos(); // Recargar los productos después de eliminar
      })
      .catch(error => console.error('Error al eliminar el producto:', error));
  }
}

// Función para agregar o editar un producto
document.getElementById('productoForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const productoId = document.getElementById('productoId').value;
  const nombre = event.target.nombre.value;
  const categoria = event.target.categoria.value;
  const precio = event.target.precio.value;
  const descripcion = event.target.descripcion.value;
  const descripcion1 = event.target.descripcion1.value;
  const imagen = event.target.imagen.files[0];

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('categoria', categoria);
  formData.append('precio', precio);
  formData.append('descripcion', descripcion);
  formData.append('descripcion1', descripcion1);
  if (imagen) formData.append('imagen', imagen);

  const url = productoId ? `/api/productos/${productoId}` : '/api/productos';
  const method = productoId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      cargarProductos(); // Recargar los productos después de agregar o editar
      $('#modalProducto').modal('hide'); // Cerrar el modal
    })
    .catch(error => console.error('Error al agregar o editar el producto:', error));
});

// Evento cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  cargarProductos(); // Cargar los productos cuando la página esté lista
});

// Cargar productos al cargar la página
window.onload = cargarProductos;

// Función para verificar productos cercanos al vencimiento
function verificarProductosVencimiento() {
  fetch('/api/productos_vencimiento')
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        // Crear mensaje de alerta si hay productos con fechas cercanas al vencimiento
        let alerta = "Los siguientes productos están por vencer en los próximos días:\n\n";
        data.forEach(producto => {
          alerta += `Producto ID: ${producto.ProductoID} (Fecha de vencimiento: ${producto['Fecha de Vencimiento']})\n`;
        });

        // Mostrar la alerta
        alert(alerta);
      } else {
        alert("No hay productos cercanos al vencimiento.");
      }
    })
    .catch(error => console.error('Error al obtener productos cercanos al vencimiento:', error));
}

// Llamar a la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', function () {
  verificarProductosVencimiento();
});
