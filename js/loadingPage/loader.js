
import { startAudio } from "../ui/music.js";

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
    //startButton.id = 'startButton';
    startButton.id = 'start';

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
