/* ============================================================
   FUNCIONES DE TRANSICIÓN CON TWEEN.JS PARA CAMBIAR DE VISTA
   ============================================================ 
*/
import {TWEEN} from "../../lib/tween.module.min.js";
import { FirstPersonControls } from '../../lib/FirstPersonControls.js';
import { gui } from "../importedAssets/importModels.js";

export let isFirstPerson = false;
export let fpControls = null;

// Guardamos la posición y rotación originales para poder regresar de FP a la vista original
let thirdPersonState = {
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion()
};

export function updatePlayerView(event, camera, cameraControls, renderer){
    // Quitar el foco del botón para que no interfiera con otras acciones
    //event.target.blur();
    document.activeElement.blur();

    isFirstPerson = !isFirstPerson;
    
    if (isFirstPerson) {
        // Guardar el estado actual (vista original) para poder regresar luego
        thirdPersonState.position.copy(camera.position);
        thirdPersonState.quaternion.copy(camera.quaternion);
        
        // Desactivar controles de cámara
        cameraControls.enabled = false;
        
        // Reiniciar la rotación para liberar la orientación
        //camera.rotation.set(0, 0, 0);
        
        // Definir la posición y orientación de destino para la vista en primera persona.
        // Aquí se asume que la posición actual es adecuada; puedes ajustar un offset si lo deseas.
        const firstPersonPosition = camera.position.clone();
        const firstPersonQuaternion = camera.quaternion.clone();
        
        // Ejecutar la transición a primera persona (1 segundo de duración)
        transitionToFirstPerson(camera, cameraControls, firstPersonPosition, firstPersonQuaternion, 1000);
        
        // Tras finalizar la transición, inicializar FirstPersonControls para el control de la mirada
        setTimeout(() => {
        fpControls = new FirstPersonControls(camera, renderer.domElement);
        fpControls.lookSpeed = 0.2;
        fpControls.movementSpeed = 0; // Desactivamos el movimiento interno
        fpControls.noFly = true;
        fpControls.lookVertical = true;
        const controlsFolder = gui.addFolder("First Person Controls");
        controlsFolder.add(fpControls, "lookSpeed", 0.1, 1).name("Look Speed").step(0.05);
        }, 1000);
        
    } else {
        // Al volver a la vista original:
        if (fpControls) {
          fpControls.dispose();
          fpControls = null;
          // Cerrar/eliminar el folder de First Person Controls al salir de FPV
          gui.folders.forEach(folder => {
            if (folder._title === "First Person Controls") {
                folder.destroy();
            }
          });
        }
        
        // Utilizar el estado guardado para regresar a la vista original
        transitionToThirdPerson(camera, cameraControls, thirdPersonState.position, thirdPersonState.quaternion, 1000);
    }
}


/**
 * Interpola la posición y la rotación de la cámara para pasar a la vista en primera persona.
 * Durante la transición se desactivan los controles.
 */
function transitionToFirstPerson(camera, cameraControls, targetPosition, targetQuaternion, duration = 1000) {
    // Desactivar controles de cámara mientras se realiza la transición
    cameraControls.enabled = false;
    
    new TWEEN.Tween(camera.position)
      .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  
    const initialQuaternion = camera.quaternion.clone();
    const quaternionTween = { t: 0 };
  
    new TWEEN.Tween(quaternionTween)
      .to({ t: 1 }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.quaternion.slerpQuaternions(initialQuaternion, targetQuaternion, quaternionTween.t);
      })
      .onComplete(() => {
        // Aquí podrías reactivar o inicializar controles en primera persona
      })
      .start();
  }
  
/**
 * Interpola la posición y la rotación de la cámara para regresar a la vista original (tercera persona).
 */
function transitionToThirdPerson(camera, cameraControls, targetPosition, targetQuaternion, duration = 1000) {
    cameraControls.enabled = false;

    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

    const initialQuaternion = camera.quaternion.clone();
    const quaternionTween = { t: 0 };

    new TWEEN.Tween(quaternionTween)
        .to({ t: 1 }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
        camera.quaternion.slerpQuaternions(initialQuaternion, targetQuaternion, quaternionTween.t);
        })
        .onComplete(() => {
        cameraControls.enabled = true;
        })
        .start();
}
