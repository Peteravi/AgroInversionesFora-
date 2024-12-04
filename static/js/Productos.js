// Función para cargar productos desde un archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('/server/Productos.json');
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}
// Función para mostrar productos en el contenedor
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto', producto.categoria);
        productoDiv.setAttribute('data-nombre', producto.nombre);

        productoDiv.innerHTML = `
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <img src="${producto.imagen}" alt="${producto.nombre} 1" class="imagen-activa">
            <p>Precio: $${producto.precio}</p>
            <button onclick="window.location.href='Informacion.html?Id=${producto.Id}'">Más Información</button>
        `;
        container.appendChild(productoDiv);
    });
}

// Cargar los productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);
// Función para filtrar productos por categoría
function filtrarProductos(categoria) {
    // Seleccionar todos los elementos de productos
    const productos = document.querySelectorAll('.producto');

    // Mostrar solo los productos que coinciden con la categoría seleccionada
    productos.forEach(producto => {
        if (categoria === 'todos' || producto.classList.contains(categoria)) {
            producto.style.display = 'block';  // Mostrar el producto
        } else {
            producto.style.display = 'none';   // Ocultar el producto
        }
    });
}
// Función para cargar productos desde un archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3000/api/productos'); // Asegúrate de que esta URL sea correcta
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para mostrar productos en el contenedor
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto', producto.categoria);
        productoDiv.setAttribute('data-nombre', producto.nombre);
        productoDiv.setAttribute('data-precio', producto.precio);

        productoDiv.innerHTML = `
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <img src="${producto.imagen}" alt="${producto.nombre} 1" class="imagen-activa">
            <p>Precio: $${producto.precio}</p>
            <button onclick="window.location.href='Informacion.html?Id=${producto.Id}'">Más Información</button>
        `;
        container.appendChild(productoDiv);
    });
}

// Cargar los productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);

// Función para buscar productos por nombre
function buscarProducto() {
    const query = document.getElementById('buscar-producto').value.toLowerCase(); // Obtener el texto del input
    const resultadosContainer = document.getElementById('resultados-container');
    resultadosContainer.innerHTML = ''; // Limpiar resultados anteriores

    if (query.trim() === '') {
        resultadosContainer.style.display = 'none'; // Ocultar resultados si no hay búsqueda
        return;
    }

    fetch('/server/Productos.json') // Cargar productos desde el JSON
        .then(response => response.json())
        .then(productos => {
            const productosFiltrados = productos.filter(p =>
                p.nombre.toLowerCase().includes(query)
            );

            if (productosFiltrados.length > 0) {
                resultadosContainer.style.display = 'block'; // Mostrar contenedor de resultados

                productosFiltrados.forEach(producto => {
                    const item = document.createElement('div');
                    item.className = 'resultado-item';

                    item.innerHTML = `
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                        <div class="producto-info">
                            <h3>${producto.nombre}</h3>
                            <span class="producto-categoria">${producto.categoria}</span>
                        </div>
                    `;

                    // Redirigir al hacer clic
                    item.onclick = () => {
                        window.location.href = `Informacion.html?Id=${producto.Id}`;
                    };

                    resultadosContainer.appendChild(item);
                });
            } else {
                resultadosContainer.innerHTML = '<p class="no-resultados">No se encontraron productos.</p>';
            }
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

fetch('http://localhost:3000/api/productos')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Aquí puedes mostrar los productos en tu página
    })
    .catch(error => console.error('Error:', error));