import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { initPostprocessing, underwaterPass, composer } from "./ocean/under_water.js";
import { iniCamera, camera, cameraControls } from "../js/camera/camera.js";
import { iniRendererScene, renderer, scene } from "../js/rendererAndScene/rendererScene.js";
import { iniLights } from "../js/lights/lights.js";
import { iniWater, water, getWaveHeight } from "../js/ocean/water.js";
import { iniMobile, iniWuhuIsland, mobile, wuhu_island } from "./importedAssets/importModels.js";
import { iniSkies, updateSky } from "../js/importedAssets/importSky.js";
import { listener, oceanSound, diveSound, isMuted, fireworkSound } from "./ui/music.js";
import { menuButton } from "../js/ui/menu.js";
import { EXRLoader } from "../lib/EXRLoader.js";
import { loadingManager } from "../js/loadingPage/loader.js";
import { FireworksManager } from '../js/lights/fireworks.js';
import { RGBELoader } from "../../lib/RGBELoader.js";

// ⌛ Reloj para la animación ⌛
const clock = new THREE.Clock(); 

const loader = new GLTFLoader(loadingManager);
const exrLoader = new EXRLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

// Obtener el checkbox del modo
//const nightCheckbox = document.getElementById("input");
const nightCheckbox = document.getElementById("checkbox");
let isNight = nightCheckbox.checked;
let fireworksManager = null;

// -------------------------
// Acciones
// -------------------------
init();
loadScene();
initPostprocessing(renderer, scene, camera);
render();

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
    nightCheckbox.addEventListener('change', updateSceneMode);
}

function loadScene() {
    // 💡 Iluminación 💡
    iniLights(scene);

    // 🌊 Mar 🌊
    iniWater(scene);

    // 📱 Modelo importado en el centro 📱
    iniMobile(scene, loader);
    iniWuhuIsland(scene, loader);

    // 🎆 Cargar cielos (día y noche) y actualizar 🎆
    iniSkies(renderer, exrLoader, rgbeLoader).then(() => {
        updateSky(scene, isNight);
    });

    // Ejes
    //scene.add(new THREE.AxesHelper(3));
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
    // Cambios para actualizar la camara segun mvto del raton
    cameraControls.update();

    // Comprueba que la cámara no baje por debajo de y = -0.5
    if (camera.position.y < -1.1) {
        camera.position.y = -1.1;
    }
    
    // Actualizar la animación del agua
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    let waveOffset = 0.0;
    
    if (water){
        waveOffset = getWaveHeight(water.position.x, water.position.z, elapsedTime * 0.5); // calcular la altura de la ola
        // Se incrementa el valor del tiempo para animar el shader del agua
        water.material.uniforms['time'].value += delta * 0.5;
    }
    
    // Si modelo cargado, ajustar su altura para que flote con las olas
    if (mobile) {
        // Sumamos el desplazamiento a la altura base guardada
        mobile.position.y = mobile.userData.baseY + waveOffset;
    }

    // Actualizar el shader underwater según la posición de la cámara
    let underwaterFactor = 0.0; // si camara esta arriba
    if (camera.position.y < waveOffset) { // si te metes el factor cambia
        underwaterFactor = Math.min(1.0, (waveOffset - camera.position.y) / 5.0); // baja la cámara, mayor el efecto;
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
    update();
    //renderer.render(scene, camera);
    composer.render() // con el postprocesado
}



// -------------------------
// DIA y NOCHE
// -------------------------
function updateSceneMode() {
    isNight = nightCheckbox.checked;

    // Elimina las luces existentes:
    scene.remove(scene.getObjectByName('ld'));
    scene.remove(scene.getObjectByName('l1'));
    scene.remove(scene.getObjectByName('l2'));
    scene.remove(scene.getObjectByName('l3'));
  
    if (isNight) {
      // En modo noche
      fireworkSound.setVolume(1);
      let light = new THREE.AmbientLight(0xffffff, 0.3);
      light.name = "ln";
      scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1000, 2000, 1000);
      light.target.position.set(0, 1, 0); // Apunta a (0,1,0)
      light.name = "ln1";
      scene.add(light);
      // Si es de noche, activamos los fuegos artificiales
      if (!fireworksManager) {
        fireworksManager = new FireworksManager(scene);
      }
    } else {
      // En modo día
      fireworkSound.setVolume(0);
      scene.remove(scene.getObjectByName('ln'));
      scene.remove(scene.getObjectByName('ln1'));
      iniLights(scene);
      // Si pasa a día, eliminamos los fuegos (si lo deseas)
      if (fireworksManager) {
        fireworksManager.fireworks.forEach(fw => fw.dispose());
        fireworksManager = null;
      }
    }

    // Actualiza el cielo según el modo
    updateSky(scene, isNight);
  }



