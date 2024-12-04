document.addEventListener('DOMContentLoaded', () => {
    const carouselContent = document.getElementById('carousel-content');
    const callToActionSection = document.getElementById('call-to-action');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    let currentIndex = 0;
    let sections = [];

    // Cargar datos desde el JSON
    fetch('/server/nosotros.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then(data => {
        sections = data.sections; // Guardar las secciones
        updateCarousel(); // Mostrar la primera sección

        // Generar contenido para el Call to Action
        callToActionSection.innerHTML = `
            <p>${data.callToAction.message}</p>
            <a href="${data.callToAction.linkUrl}">${data.callToAction.linkText}</a>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        carouselContent.innerHTML = `<p>Error al cargar la información. Intenta nuevamente más tarde.</p>`;
    });
    // Actualizar el contenido del carrusel
    function updateCarousel() {
        if (sections.length > 0) {
            const { title, description, imagen } = sections[currentIndex];
            carouselContent.innerHTML = `
                <h2>${title}</h2>
                <p>${description}</p>
                <img src="${imagen}" alt="${title}" class="carousel-image" />
            `;
        }
    }

    // Navegar entre secciones
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % sections.length;
        updateCarousel();
    });
});