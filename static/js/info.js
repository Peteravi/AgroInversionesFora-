let currentIndex = 0;
let items = [];
async function fetchTeamData() {
    try {
        const response = await fetch("/server/info.json");
        const team = await response.json();
        populateCarousel(team);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}
function populateCarousel(team) {
    const carousel = document.querySelector(".carousel");
    team.forEach((member, index) => {
        const item = document.createElement("div");
        item.classList.add("carousel-item");
        if (index === 0) item.classList.add("active");

        item.innerHTML = `
            <img src="${member.image}" alt="${member.role}">
            <div class="intro-content">
                <h2>${member.name}</h2>
                <p>${member.position}</p>
                <button class="info-button" onclick="toggleDetails(${index})">Más información</button>
            </div>
            <div class="bio-details">
                <p><strong>Información Personal:</strong> ${member.personalInfo}</p>
                <p><strong>Educación:</strong> ${member.education}</p>
                <p><strong>Carrera Profesional:</strong> ${member.career}</p>
                <div class="contact-info">
                    <p><strong>Correo:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                    <div class="social-media">
                        ${member.socialMedia.map(social => `<a href="${social.link}" target="_blank"><i class="${social.icon}"></i></a>`).join('')}
                    </div>
                </div>
            </div>
        `;
        carousel.appendChild(item);
        items.push(item);
    });
    showSlide(currentIndex);
}
function showSlide(index) {
    items.forEach((item, i) => {
        item.classList.remove("active");
        if (i === index) item.classList.add("active");
    });
}
function changeSlide(step) {
    currentIndex = (currentIndex + step + items.length) % items.length;
    showSlide(currentIndex);
}
function toggleDetails(index) {
    const details = items[index].querySelector(".bio-details");
    details.style.display = details.style.display === "block" ? "none" : "block";
}
fetchTeamData();