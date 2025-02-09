
import { startAudio } from "../music/music.js";

// -------------------------
// Configuración del LoadingManager
// -------------------------
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText    = document.getElementById('loadingText');
const loadingCircle  = document.getElementById('loadingCircle');

export const loadingManager = new THREE.LoadingManager(
  // onLoad: cuando todo se haya cargado
  () => {
    // Actualiza el texto a 100%
    loadingText.innerText = '100%';

    loadingText.style.display = 'none'; 
    loadingCircle.style.display = 'none'; 
    
    // Crear botón "Comenzar"
    const startButton = document.createElement('button');
    startButton.innerText = 'READY';
    startButton.id = 'startButton2';
    /*startButton.className = 'animated-button';
    startButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="arr-2" viewBox="0 0 24 24">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
      <span class="text">R E A D Y</span>
      <span class="circle"></span>
      <svg xmlns="http://www.w3.org/2000/svg" class="arr-1" viewBox="0 0 24 24">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
    `;*/

    // Agregar el botón a la pantalla de carga
    const loadingContent = document.querySelector('.loadingContent');
    loadingContent.appendChild(startButton);

    // Al hacer clic en "Comenzar", reanuda el AudioContext, inicia la música y oculta la pantalla de carga
    startButton.addEventListener('click', () => {
        startAudio();  // Inicia la reproducción de los sonidos
        loadingOverlay.style.display = 'none';
    });
  },
  // onProgress: se llama para cada recurso cargado
  (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    loadingText.innerText = Math.floor(progress) + '%';
  }
);
