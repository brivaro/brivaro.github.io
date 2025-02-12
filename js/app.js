import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { initPostprocessing, underwaterPass, composer } from "./ocean/under_water.js";
import { iniCamera, camera, cameraControls } from "../js/camera/camera.js";
import { iniRendererScene, renderer, scene } from "../js/rendererAndScene/rendererScene.js";
import { iniLights } from "../js/lights/lights.js";
import { iniWater, water, getWaveHeight } from "../js/ocean/water.js";
import { iniModels, mobile } from "./importedAssets/importModels.js";
import { iniSkies, updateSky } from "../js/importedAssets/importSky.js";
import { listener, oceanSound, diveSound, isMuted } from "./ui/music.js";
import { menuButton } from "../js/ui/menu.js";
import { EXRLoader } from "../lib/EXRLoader.js";
import { loadingManager } from "../js/loadingPage/loader.js";

// ⌛ Reloj para la animación ⌛
const clock = new THREE.Clock(); 

const loader = new GLTFLoader(loadingManager);
const exrLoader = new EXRLoader(loadingManager);

// Obtener el checkbox del modo
//const nightCheckbox = document.getElementById("input");
const nightCheckbox = document.getElementById("checkbox");
let isNight = nightCheckbox.checked;

// -------------------------
// Acciones
// -------------------------
init();
loadScene();
initPostprocessing(renderer, scene, camera);
render();

function init() {
    // Motor de render y escena
    iniRendererScene();
    
    // Camara
    iniCamera(renderer);

    // Música
    camera.add(listener);

    // Redimensionado
    window.addEventListener('resize', updateAspectRatio );
}

function loadScene() {
    // 💡 Iluminación 💡
    iniLights(scene);

    // 🌊 Mar 🌊
    iniWater(scene);

    // Modelo importado en el centro
    iniModels(scene, loader);

    // 🎆 Cargar cielos (día y noche) y actualizar 🎆
    iniSkies(renderer, exrLoader).then(() => {
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
    
    // Actualizar la animación del agua
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Se incrementa el valor del tiempo para animar el shader del agua
    water.material.uniforms['time'].value += delta * 0.5;
    
    // Si el modelo está cargado, ajustar su altura para que flote con las olas
    if (mobile) {
        // Usamos esas coordenadas para calcular la altura de la ola
        const waveOffset = getWaveHeight(mobile.position.x, mobile.position.z, elapsedTime * 0.5);
        // Sumamos el desplazamiento a la altura base guardada
        mobile.position.y = mobile.userData.baseY + waveOffset;
        
        // Actualizar el shader underwater según la posición de la cámara
        let underwaterFactor = 0.0;
        if (camera.position.y < waveOffset) {
            // Cuanto más baja la cámara, mayor el efecto; ajusta el factor de escala (5.0 en este ejemplo)
            underwaterFactor = Math.min(1.0, (waveOffset - camera.position.y) / 5.0);
        }
        underwaterPass.uniforms.underwaterFactor.value = underwaterFactor;
        underwaterPass.uniforms.time.value += delta;

        // 🎵 Transición entre sonidos según la posición de la cámara 🎵
        if (!isMuted) {
            const volumeAboveWater = Math.max(0, 1 - underwaterFactor);
            const volumeUnderwater = underwaterFactor;

            oceanSound.setVolume(volumeAboveWater * 0.2); // Ajusta según necesites
            diveSound.setVolume(volumeUnderwater * 0.5);    // Ajusta según necesites
        } else {
            oceanSound.setVolume(0);
            diveSound.setVolume(0);
        }
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
  
    // Agrega las luces de acuerdo al modo
    if (isNight) {
      // En modo noche: solo luz ambiental fuerte
      const light = new THREE.AmbientLight(0xffffff, 1.8);
      light.name = "ln";
      scene.add(light);
    } else {
      // En modo día: se configuran las luces habituales
      scene.remove(scene.getObjectByName('ln'));
      iniLights(scene);
    }

    // Actualiza el cielo según el modo
    updateSky(scene, isNight);
  }

// Escucha el cambio en el checkbox para actualizar la escena dinámicamente
nightCheckbox.addEventListener('change', updateSceneMode);

