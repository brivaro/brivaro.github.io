import { isNight } from "../app.js";

const preloadedImages = {};

export function showTransitionImage(isNight) {
    const overlay = document.createElement("div");
    overlay.id = "transitionOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
  
    const img = document.createElement("img");
    img.src = isNight ? "images/night.jpg" : "images/day.jpg";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.onload = () => {
        // Aplicamos la animación cuando la imagen se haya cargado
        img.style.animation = "transitionInOut 2.2s ease-out forwards";
    };

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Usamos el evento animationend para remover el overlay en lugar de setTimeout
    img.addEventListener("animationend", () => {
        if (overlay.parentNode) {
        document.body.removeChild(overlay);
        }
    });
}

function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        preloadedImages[url] = img;
        resolve();
      };
      img.onerror = reject;
    });
}

export function preloadTransitionImages() {
    return Promise.all([
      preloadImage("images/day.jpg"),
      preloadImage("images/night.jpg")
    ]);
}