import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { initPostprocessing, underwaterPass, composer } from "./ocean/under_water.js";
import { iniCamera, camera, cameraControls } from "../js/camera/camera.js";
import { iniRendererScene, renderer, scene } from "../js/rendererAndScene/rendererScene.js";
import { iniLights } from "../js/lights/lights.js";
import { iniWater, water, getWaveHeight } from "../js/ocean/water.js";
import { iniModels, modeloImportado } from "../js/importedModels/importModels.js";
import { listener, oceanSound, diveSound, isMuted } from "../js/music/music.js";
import { EXRLoader } from "../lib/EXRLoader.js";
import { iniSky } from "../js/importedSkies/importSky.js";
import { loadingManager } from "../js/loadingPage/loader.js";

// ⌛ Reloj para la animación ⌛
const clock = new THREE.Clock(); 

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

    // Geometría del mar: un plano extenso
    iniWater(scene);

    // Modelo importado en el centro
    const loader = new GLTFLoader(loadingManager);
    iniModels(scene, loader);

    // 🎆 Cargar cielo EXR 🎆
    const exrLoader = new EXRLoader(loadingManager);
    iniSky(scene, renderer, exrLoader);

    // Ejes
    //scene.add(new THREE.AxesHelper(3));
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(width.innerWidth, height.innerHeight);  // Actualiza el tamaño del composer
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
    if (modeloImportado) {
        // Usamos esas coordenadas para calcular la altura de la ola
        const waveOffset = getWaveHeight(modeloImportado.position.x, modeloImportado.position.z, elapsedTime * 0.5);
        // Sumamos el desplazamiento a la altura base guardada
        modeloImportado.position.y = modeloImportado.userData.baseY + waveOffset;
        
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