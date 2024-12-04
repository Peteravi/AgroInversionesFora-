// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = parseInt(urlParams.get('Id')); // Convertir el ID de la URL a número
// Cargar el archivo Productos.json y buscar el producto
fetch('/server/Productos.json')
    .then(response => response.json())  // Parsear el archivo JSON
    .then(productos => {
        // Buscar el producto cuyo Id coincida con el productoId de la URL
        const producto = productos.find(p => p.Id === productoId);
        if (producto) {
            // Mostrar los detalles del producto
            document.getElementById('producto-nombre').textContent = producto.nombre;
            document.getElementById('producto-precio').textContent = `Precio: S/. ${producto.precio}`;
            document.getElementById('producto-descripcion').textContent = producto.descripcion1;
            document.getElementById('producto-imagen').src = producto.imagen; 
            document.getElementById('producto-imagen').alt = producto.nombre;
        } else {
            alert('Producto no encontrado.');
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));