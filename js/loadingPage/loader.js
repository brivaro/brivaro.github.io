
import { startAudio } from "../ui/music.js";
import { camera } from "../camera/camera.js";
import { TWEEN } from "../../lib/tween.module.min.js";
import { FontLoader } from '../../lib/FontLoader.module.js';
import { TextGeometry } from '../../lib/TextGeometry.module.js';
import { scene } from "../rendererAndScene/rendererScene.js";

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

let textMaterial1, textGeometry1, textMaterial2, textGeometry2, textMesh1, textMesh2;

export const loadingManager = new THREE.LoadingManager(
  // onLoad: cuando todo se haya cargado
  () => {
    showIntroText3D();

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

        // Después de 2 segundos, eliminar ambos meshes de la escena
        setTimeout(() => {
          scene.remove(textMesh1);
          scene.remove(textMesh2);
          
          // Liberar recursos
          textGeometry1.dispose();
          textMaterial1.dispose();
          textGeometry2.dispose();
          textMaterial2.dispose();
        }, 4000);

        // Crear un tween que transicione la posición de la cámara
        new TWEEN.Tween(camera.position)
        .to({ x: -14, y: 11, z: 35 }, 7000) // Transición en 3 segundos
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => { dialog(); })
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
  dialog.id = 'intro';
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
  dialog.style.fontFamily = 'Arial, sans-serif';
  dialog.style.fontSize = '16px';
  // Usar 2/3 del ancho de la pantalla de forma responsiva
  dialog.style.width = (window.innerWidth / 2) + 'px';

  window.addEventListener("resize", () => {
    document.getElementById("intro");
    if (dialog) {
      dialog.style.width = (window.innerWidth / 2.5) + "px";
    }
  });

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

  // Aplicar fade in.
  dialog.style.transition = "opacity 0.5s ease";
  dialog.style.opacity = "0";
  requestAnimationFrame(() => {
    dialog.style.opacity = "1";
  });

  // Variable para el control del estado del diálogo
  let dialogState = 0;

  continueButton.addEventListener('click', () => {
      if (dialogState === 0) {
          // Actualizar el contenido del cuadro de diálogo
          title.textContent = "🗺️ Explore the Island";
          message.innerHTML = `Adventure awaits! 🌊 Take in the sights from a <strong>panoramic view</strong> or dive into <strong>first-person</strong> mode with <img src="/icons/fp.png" alt="First Person Icon" width="20">. <br> Need a hand <strong>to play</strong>? Click in <img src="/icons/question.png" alt="Help" width="18">. <br>Want a shortcut? The <strong>menu</strong> <img src="/icons/menu.png" alt="Menu Icon" width="15"> is your best friend! 😉`;
          dialogState = 1;
          continueButton.textContent = "LET'S GO!";
      } else {
          // Fade out antes de remover.
          dialog.style.transition = "opacity 0.5s ease";
          dialog.style.opacity = "0";
          dialog.addEventListener("transitionend", () => {
            dialog.remove();
          }, { once: true });
      }
  });
}

function showIntroText3D(){
  // Cargar la fuente para generar el texto 3D
  const loader = new FontLoader();
  loader.load('fonts/helvetiker_regular.typeface.json', function(font) {

    // Posición en la que se colocarán los textos
    const posX = 50, posY = 23.5, posZ = 13;

    // Obtener la dirección desde el texto hacia la cámara, proyectada en el plano XZ
    // Usamos un vector auxiliar para calcular el ángulo
    const getYRotation = (textPosition) => {
      // Vector que va desde la posición del texto hasta la cámara
      const vectorToCamera = new THREE.Vector3().subVectors(camera.position, textPosition);
      // Proyectar sobre el plano XZ (ignorar componente Y)
      vectorToCamera.y = 0;
      // Calcular el ángulo con respecto al eje Z positivo:
      // Math.atan2(diff.x, diff.z) devuelve el ángulo en radianes
      return Math.atan2(vectorToCamera.x, vectorToCamera.z) - 0.2 * Math.PI / 2;
    };

    // Crear el texto "Welcome to" (tamaño pequeño)
    textGeometry1 = new TextGeometry('Welcome to', {
      font: font,
      size: 1,        // Tamaño pequeño
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3
    });
    textMaterial1 = new THREE.MeshStandardMaterial({ color: 0xffffff });
    textMesh1 = new THREE.Mesh(textGeometry1, textMaterial1);
    textMesh1.position.set(posX, posY+3.5, posZ);
    textMesh1.rotation.y = getYRotation(textMesh1.position);
    scene.add(textMesh1);

    // Crear el texto "Brian's Island" (tamaño mayor)
    textGeometry2 = new TextGeometry("Brian's Island", {
      font: font,
      size: 2,        // Tamaño mayor
      height: 0.4,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 3
    });
    textMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff5f00 });
    textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
    textMesh2.position.set(posX, posY, posZ);
    textMesh2.rotation.y = getYRotation(textMesh2.position);
    scene.add(textMesh2);
    
  });
}
