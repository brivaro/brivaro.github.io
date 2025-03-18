import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { initPostprocessing, underwaterPass, composer } from "./ocean/under_water.js";
import { iniCamera, camera, cameraControls } from "../js/camera/camera.js";
import { iniRendererScene, renderer, scene } from "../js/rendererAndScene/rendererScene.js";
import { iniLights } from "../js/lights/lights.js";
import { iniWater, water, getWaveHeight } from "../js/ocean/water.js";
import { iniWuhuIsland, mobile, map_pointers, miiMixer, boat } from "./importedAssets/importModels.js";
import { preloadTransitionImages, showTransitionImage } from "./importedAssets/importImages.js";
import { showPointerDialog } from "./importedAssets/dialogs.js";
import { iniSkies, updateSky } from "../js/importedAssets/importSky.js";
import { listener, oceanSound, diveSound, isMuted, fireworkSound, dayNightSound, walkSound, melodySound } from "./ui/music.js";
import { iniMenu, playerIcon, setFirstPerson, menuOverlay, menuIcon, setMenu } from "../js/ui/menu.js";
import { EXRLoader } from "../lib/EXRLoader.js";
import { loadingManager } from "../js/loadingPage/loader.js";
import { FireworksManager } from '../js/lights/fireworks.js';
import { RGBELoader } from "../../lib/RGBELoader.js";
import { TWEEN } from "../lib/tween.module.min.js";
import { updatePlayerView, fpControls, isFirstPerson } from "../js/scene/cameraTransition.js";
import { updatePlayer, keybuttoms, updateJump, updatePlayerY } from "../js/scene/player.js";
import * as OrbitControls from "../../lib/OrbitControls.js";

// ⌛ Reloj para la animación ⌛
const clock = new THREE.Clock(); 
const loader = new GLTFLoader(loadingManager);
const exrLoader = new EXRLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

// Obtener elementos para cambiar los modos
const nightCheckbox = document.getElementById("checkbox");
const playerView = document.getElementById("fpButton");
const menuButton = document.getElementById('menuButton');
const helpButton = document.getElementById("helpButton");
export let isNight = nightCheckbox.checked;
let fireworksManager = null;
let randomMode = 0;
// Alternar luces según el modo
let ambientLight = null;
let directionalLight = null;
let ambientLightSky = null;
let directionalLightSun = null;
let ambientLightNight = null;
let direccionalLightNight = null;
// Posiciones de los pointers en el mapa
const pointerTargetPositions = {
    about: new THREE.Vector3(27, 2, -10),
    projects: new THREE.Vector3(-19, 5, -15),
    experience: new THREE.Vector3(-12, 2, 8),
    contact: new THREE.Vector3(26, 1, 27)
  };
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickedPointer = null;

// -------------------------
// ACCIONES INICIALES
// -------------------------
init();
loadScene();
initPostprocessing(renderer, scene, camera);
render();

// -------------------------
// FUNCIONES
// -------------------------
function init() {
    // 🐱‍🏍 Motor de render y escena 🐱‍🏍
    iniRendererScene();
    
    // 🎥 Camara 🎥
    iniCamera(renderer);

    // 🎷 Música 🎷 
    camera.add(listener);

    // ⏮ Redimensionado ⏮
    window.addEventListener('resize', updateAspectRatio );

    // 🌍 Actualiza el entorno 🌍
    playerView.addEventListener("click", (event) => updatePlayerView(event, camera, cameraControls, renderer));
    nightCheckbox.addEventListener('change', updateSceneMode);
    helpButton.addEventListener("click", () => showPointerDialog('help'));
    iniMenu(menuButton, playerView);
    preloadTransitionImages();
    keybuttoms(); //para el movimiento en primera persona
    window.addEventListener("mousemove", (event) => {
        // Normalizar la posición del mouse (-1 a 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    window.addEventListener('click', () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(map_pointers, true);
      
        if (intersects.length > 0) {
          let pointer = intersects[0].object;
          // Recorrer la jerarquía hasta obtener el objeto raíz (que está en map_pointers)
          while (pointer.parent && !map_pointers.includes(pointer)) {
            pointer = pointer.parent;
          }
          clickedPointer = pointer;
      
          if (isFirstPerson) {
            // Salir de modo primera persona
            updatePlayerView(null, camera, cameraControls, renderer);
            // Después de la transición de salida (1s), iniciar la transición al pointer
            setTimeout(() => {
              transitionToPointer(clickedPointer);
              clickedPointer = null;
            }, 1000);
            
            playerIcon.src = "icons/fp.png";
            setFirstPerson(false);

          } else {
            transitionToPointer(clickedPointer);
            clickedPointer = null;
          }
        }
    });    
    document.querySelectorAll('#menuOverlay ul li a').forEach(link => {
        link.addEventListener('click', event => {
        event.preventDefault(); // Evita la navegación por defecto
        // Extraer el ID quitando el "#" del href
        const pointerId = link.getAttribute('href').substring(1);
        const pointer = map_pointers.find(pointer => pointer.userData.id === pointerId);
        if (pointer) {
            if (isFirstPerson) {
                // Salir de modo primera persona
                updatePlayerView(null, camera, cameraControls, renderer);
                // Después de la transición de salida (1s), iniciar la transición al pointer
                setTimeout(() => {
                  transitionToPointer(pointer);
                  clickedPointer = null;
                }, 1000);
    
                playerIcon.src = "icons/fp.png";
                setFirstPerson(false);

            } else {
                transitionToPointer(pointer);
                clickedPointer = null;
            }
        } else {
            console.warn("No se encontró pointer con id:", pointerId);
        }
        menuIcon.src = "icons/menu.png";
        setMenu(false);
        menuOverlay.classList.remove('open');
        });
    });
}

function loadScene() {

    randomMode = Math.floor(Math.random() * 2);

    // 💡 Iluminación 💡
    iniLights(scene);
    setLights(scene);

    // 🌊 Mar 🌊
    iniWater(scene);

    // 📱 Modelo importado en el centro 📱
    iniWuhuIsland(scene, loader);

    // 🎆 Cargar cielos (día y noche) y actualizar 🎆
    iniSkies(renderer, exrLoader, rgbeLoader).then(() => {
        if (randomMode == 1){
            isNight = true;
            nightCheckbox.checked = true;
        }
        // Instanciar el FireworksManager si aún no existe
        if (!fireworksManager) {
            fireworksManager = new FireworksManager(scene);
        }
        // Lo desactivamos inicialmente si no es modo noche
        fireworksManager.setEnabled(isNight);

        activateNightOrDayLights(isNight);
        updateSky(scene, isNight);
    });

    // Ejes
    //scene.add(new THREE.AxesHelper(3));
}

function updateAspectRatio() 
{
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (composer) {
        composer.setSize(width, height);
    }
}

function update()
{
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    let waveOffset = 0.0;

    if (miiMixer) {
        miiMixer.update(delta);
    }

    if (isFirstPerson) {
        // Actualizamos movimiento horizontal
        updatePlayer(delta, camera);
        // Actualizamos el salto (si se presiona espacio)
        updateJump(camera);
        // Actualizamos la posición vertical (gravedad y colisión con el suelo)
        updatePlayerY(delta, camera);
        // Actualizamos el efecto de head bobbing
        //updateHeadBobbing(delta, camera);
        
        if (fpControls) {
            fpControls.update(delta); // Solo para la rotación (mirada)
        }
    } else {
        cameraControls.update();
        walkSound.pause();
    }

    if (camera.position.y < -1.1) {
        camera.position.y = -1.1;
    }
    
    if (water){
        waveOffset = getWaveHeight(water.position.x, water.position.z, elapsedTime * 0.5); // calcular la altura de la ola
        // Se incrementa el valor del tiempo para animar el shader del agua
        water.material.uniforms['time'].value += delta * 0.5;
    }
    
    if (mobile) {
        mobile.position.y = mobile.userData.baseY + waveOffset;
    }

    if (boat) {
        boat.position.y = boat.userData.baseY + waveOffset;
    }

    map_pointers.forEach((pointer) => {
        pointer.rotation.y += 0.7 * delta;

        const frequency = 2.0;  // controla la velocidad de oscilación
        const amplitude = 0.2;  // controla la amplitud del movimiento vertical
        pointer.position.y = pointer.userData.initialY + Math.sin(elapsedTime * frequency) * amplitude;
    });

    // ------------------------------
    // 🎯 DETECTAR COLISIÓN CON EL MOUSE (RAYCASTER)
    // ------------------------------
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(map_pointers, true); // true para que revise los children

    let hoveredPointer = null;

    if (intersects.length > 0) {
        hoveredPointer = intersects[0].object;
        while (hoveredPointer.parent && !map_pointers.includes(hoveredPointer)) {
            hoveredPointer = hoveredPointer.parent; // Buscar el objeto raíz en map_pointers
        }

        if (!hoveredPointer.userData.isHovered) {
            hoveredPointer.userData.isHovered = true; // Marcar como activo
            document.body.style.cursor = 'pointer'; // Cambiar el cursor
            new TWEEN.Tween(hoveredPointer.scale)
                .to({ x: 5.5, y: 5.5, z: 5.5 }, 300) // Escala más grande en 300ms
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    }

    // ------------------------------
    // 🔽 RESTAURAR ESCALA SI NO ESTÁ HOVERED
    // ------------------------------
    map_pointers.forEach((pointer) => {
        if (pointer !== hoveredPointer && pointer.userData.isHovered) {
            pointer.userData.isHovered = false; // Desmarcar
            document.body.style.cursor = 'default'; // Cambiar el cursor
            new TWEEN.Tween(pointer.scale)
                .to({ x: 2, y: 2, z: 2 }, 300) // Volver a la escala normal en 300ms
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    });

    // Actualizar el shader underwater según la posición de la cámara
    let underwaterFactor = 0.0; // si camara esta arriba
    if (camera.position.y < waveOffset) { // si te metes el factor cambia
        underwaterFactor = Math.min(4.0, (waveOffset - camera.position.y)); // baja la cámara, mayor el efecto;
    }
    underwaterPass.uniforms.underwaterFactor.value = underwaterFactor;
    underwaterPass.uniforms.time.value += delta;

    // 🎵 Transición entre sonidos según la posición de la cámara 🎵
    if (!isMuted) {
        const volumeAboveWater = Math.max(0, 1 - underwaterFactor);
        const volumeUnderwater = underwaterFactor;
        oceanSound.setVolume(volumeAboveWater * 0.2);
        diveSound.setVolume(volumeUnderwater * 0.5);
        if (isNight){
            oceanSound.setVolume(volumeAboveWater * 0.2 * 0.2);
            fireworkSound.setVolume(volumeAboveWater * 0.3);
        }
    } else {
        melodySound.setVolume(0);
        oceanSound.setVolume(0);
        diveSound.setVolume(0);
        fireworkSound.setVolume(0);
    }

    if (fireworksManager) {
        fireworksManager.update(delta);
    }
    
}

function render() {
    requestAnimationFrame(render);
    TWEEN.update(); // actualizar animaciones
    update();
    //renderer.render(scene, camera);
    composer.render() // con el postprocesado
}

// -------------------------
// DIA y NOCHE
// -------------------------
function updateSceneMode() {
    isNight = nightCheckbox.checked;
    dayNightSound.play();
    // Mostrar la animación de transición
    showTransitionImage(isNight);
    setTimeout(() => {
        activateNightOrDayLights(isNight);
        updateSky(scene, isNight);
        // Activa o desactiva los fuegos artificiales
        if (fireworksManager) {
            fireworksManager.setEnabled(isNight);
    }
    }, 600);
    
}

function activateNightOrDayLights(isNight) {
    if (isNight) {
        // En modo noche
        fireworkSound.setVolume(1);
        // Activar las luces de la noche
        if (ambientLightNight) ambientLightNight.visible = true;
        if (direccionalLightNight) direccionalLightNight.visible = true;
        // Desactivar las luces del día
        if (ambientLight) ambientLight.visible = false;
        if (directionalLight) directionalLight.visible = false;
        if (ambientLightSky) ambientLightSky.visible = false;
        if (directionalLightSun) directionalLightSun.visible = false;
        
        // Si es de noche, activamos los fuegos artificiales
        if (!fireworksManager) {
          fireworksManager = new FireworksManager(scene);
        }
    } else {
        // En modo día
        fireworkSound.setVolume(0);
        // Activar las luces del día
        if (ambientLight) ambientLight.visible = true;
        if (directionalLight) directionalLight.visible = true;
        if (ambientLightSky) ambientLightSky.visible = true;
        if (directionalLightSun) directionalLightSun.visible = true;
        // Desactivar las luces de la noche
        if (ambientLightNight) ambientLightNight.visible = false;
        if (direccionalLightNight) direccionalLightNight.visible = false;
    }
}

function setLights(scene) {
    ambientLight = scene.getObjectByName("AmbientLight");
    directionalLight = scene.getObjectByName("DirectionalLight");
    ambientLightSky = scene.getObjectByName("DirectionalLightSky");
    directionalLightSun = scene.getObjectByName("DirectionalLightSun");
    ambientLightNight = scene.getObjectByName("AmbientLightNight");
    direccionalLightNight = scene.getObjectByName("DirectionalLightNight");
}

function transitionToPointer(pointer) {
    // Comprobamos que el pointer tenga un ID definido en userData
    const pointerId = pointer.userData.id;
    if (!pointerId) {
      console.warn("El pointer no tiene definido 'userData.id'");
      return;
    }
    
    // Buscar la posición destino en la biblioteca
    const targetPos = pointerTargetPositions[pointerId];
    if (!targetPos) {
      console.warn("No se encontró una posición destino para el pointer:", pointerId);
      return;
    }
    
    // Realizar la animación con Tween.js para mover la cámara a la posición destino
    new TWEEN.Tween(camera.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1000) // Duración de 1 segundo (1000ms)
      .easing(TWEEN.Easing.Quadratic.Out)
      .chain(
        // Una vez terminada la animación de la cámara, encadenamos otro tween para restablecer el target de cameraControls
        new TWEEN.Tween(cameraControls.target)
          .to({ x: 0, y: 0, z: 0 }, 500) // Duración de 500ms (ajustable)
          .easing(TWEEN.Easing.Quadratic.Out)
      ).onComplete(()=> {
        showPointerDialog(pointerId);
        }
      ).start();
}