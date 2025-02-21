
import { startAudio } from "../ui/music.js";
import { camera } from "../camera/camera.js";
import { TWEEN } from "../../lib/tween.module.min.js";

// -------------------------
// Configuración del LoadingManager
// -------------------------
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText    = document.getElementById('loadingText');
const loadingCircle  = document.getElementById('loadingCircle');
const listener = new THREE.AudioListener();
const introSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('../sounds/intro.mp3', function(buffer) {
  introSound.setBuffer(buffer);
  introSound.setLoop(false);
  introSound.setVolume(0.4);
});

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
        introSound.play();
        startAudio();  // Inicia la reproducción de los sonidos
        loadingOverlay.style.display = 'none';
        // Crear un tween que transicione la posición de la cámara
        new TWEEN.Tween(camera.position)
        .to({ x: -14, y: 11, z: 35 }, 3000) // Transición en 3 segundos
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {dialog()})
      .start();
    });
  },
  // onProgress: se llama para cada recurso cargado
  (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    loadingText.innerText = Math.floor(progress) + '%';
  }
);


function dialog(){
  // Al finalizar la transición, mostrar un cuadro de diálogo
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '10px';
  dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  dialog.style.textAlign = 'center';
  dialog.style.zIndex = '1000';
  // Usar 1/3 del ancho de la pantalla de forma responsiva
  dialog.style.width = (window.innerWidth / 3) + 'px';

  // Crear elementos internos del diálogo
  const title = document.createElement('h2');
  title.textContent = "🏝️ Brian's Island";
  title.style.marginBottom = "20px"; // Separa el título del párrafo

  const message = document.createElement('p');
  message.innerHTML = "Welcome aboard! 🚀 I'm Brian, a passionate <strong>AI Computer Engineer</strong>. Explore my world, discover my <strong>projects</strong>, dive into my <strong>experience</strong>, and feel free to <strong>contact</strong> me. 🌍💡";

  // Botón para continuar
  const continueButton = document.createElement('button');
  continueButton.textContent = "OK!";
  continueButton.style.backgroundColor = "#a8e6cf"; // Verde claro pastel
  continueButton.style.border = "none";
  continueButton.style.padding = "10px 20px";
  continueButton.style.borderRadius = "5px";
  continueButton.style.cursor = "pointer";
  continueButton.style.marginTop = "20px";

  // Agregar los elementos al diálogo
  dialog.appendChild(title);
  dialog.appendChild(message);
  dialog.appendChild(continueButton);

  document.body.appendChild(dialog);

  // Variable para el control del estado del diálogo
  let dialogState = 0;

  continueButton.addEventListener('click', () => {
      if (dialogState === 0) {
          // Actualizar el contenido del cuadro de diálogo
          title.textContent = "🗺️ Explore the Island";
            message.innerHTML = `Adventure awaits! 🌊 Take in the sights from a <strong>panoramic view</strong> or dive into <strong>first-person</strong> mode with <img src="/icons/fp.png" alt="First Person Icon" width="20">. Want a shortcut? The <strong>menu</strong> <img src="/icons/menu.png" alt="Menu Icon" width="15"> is your best friend! 😉`;
            dialogState = 1;
      } else {
          // Eliminar el cuadro de diálogo
          dialog.remove();
      }
  });
}