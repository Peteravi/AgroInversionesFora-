document.addEventListener("DOMContentLoaded", () => {
    fetch("/server/blogPosts.json")
      .then(response => response.json())
      .then(data => {
        const blogSection = document.querySelector(".blog-section");
  
        data.forEach(post => {
          // Crear contenedor del artículo
          const article = document.createElement("article");
          article.classList.add("blog-post");
  
          // Título
          const title = document.createElement("h3");
          title.textContent = post.title;
          article.appendChild(title);
  
          // Si hay contenido de texto
          if (post.content) {
            post.content.forEach(paragraphText => {
              const paragraph = document.createElement("p");
              paragraph.textContent = paragraphText;
              article.appendChild(paragraph);
            });
          }
  
          // Imagen
          if (post.image) {
            const img = document.createElement("img");
            img.src = post.image;
            img.alt = post.title;
            article.appendChild(img);
          }
  
          // Video
          if (post.video) {
            const iframe = document.createElement("iframe");
            iframe.width = "560";
            iframe.height = "315";
            iframe.src = post.video;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            article.appendChild(iframe);
  
            const videoDescription = document.createElement("p");
            videoDescription.textContent = post.description;
            article.appendChild(videoDescription);
          }
  
          // Añadir artículo a la sección del blog
          blogSection.appendChild(article);
        });
      })
      .catch(error => console.error("Error al cargar los artículos del blog:", error));
  });
  