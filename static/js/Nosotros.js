// Carrusel de imágenes en "Acerca de Nosotros"
const aboutCarouselImages = document.querySelector('.about-carousel-images');
const aboutImages = document.querySelectorAll('.about-carousel-images img');
let aboutIndex = 0;
const aboutIntervalTime = 5000; // Intervalo de tiempo para el cambio de imágenes
function showNextAboutImage() {
    aboutIndex = (aboutIndex + 1) % aboutImages.length;
    const offset = -aboutIndex * 100;
    aboutCarouselImages.style.transform = `translateX(${offset}%)`;
}
setInterval(showNextAboutImage, aboutIntervalTime);
// Título con efecto de "serpiente" en los colores en "Acerca de Nosotros"
const aboutTitle = document.getElementById('about-animated-title');
const aboutColors = ['#00FF00', '#FFFFFF']; // Colores verde y blanco
const aboutLetters = aboutTitle.innerText.split('');
aboutTitle.innerHTML = aboutLetters.map(letter => `<span>${letter}</span>`).join(''); // Envuelve cada letra en un <span>
const aboutSpans = aboutTitle.querySelectorAll('span');
let aboutColorIndex = 0;
function animateAboutTitle() {
    aboutSpans.forEach((span, i) => {
        const color = aboutColors[(aboutColorIndex + i) % aboutColors.length];
        span.style.color = color;
    });
    aboutColorIndex = (aboutColorIndex + 1) % aboutColors.length;
}
setInterval(animateAboutTitle, 200); // Cambia de color cada 200 ms

fetch('http://localhost:3000/api/nosotros')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Aquí puedes mostrar los productos en tu página
    })
    .catch(error => console.error('Error:', error));

    // Función para cargar productos desde un archivo JSON
async function cargarNosotros() {
    try {
        const response = await fetch('http://localhost:3000/api/nosotros'); // Asegúrate de que esta URL sea correcta
        if (!response.ok) {
            throw new Error('Error al cargar los nosotros');
        }
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}
