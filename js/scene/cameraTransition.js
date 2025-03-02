/* ============================================================
   FUNCIONES DE TRANSICIÓN CON TWEEN.JS PARA CAMBIAR DE VISTA
   ============================================================ 
*/
import {TWEEN} from "../../lib/tween.module.min.js";
import { FirstPersonControls } from '../../lib/FirstPersonControls.js';
import { gui } from "../importedAssets/importModels.js";
import { keysPressed } from "../scene/player.js";

export let isFirstPerson = false;
export let fpControls = null;
let params = {};

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

        const controlsFolder = gui.addFolder("First Person");
        controlsFolder.add(fpControls, "lookSpeed", 0.1, 1).name("Look Speed").step(0.05);
        
        params = {
          activateControls: false
        };
        controlsFolder.add(params, "activateControls").name("Activate Mobile Controls").onChange(value => {
          if (value) {
            createButtons();
          } else {
            deleteButtons();
            // Asegurarse de reiniciar las banderas de las teclas
            keysPressed['KeyW'] = false;
            keysPressed['KeyA'] = false;
            keysPressed['KeyS'] = false;
            keysPressed['KeyD'] = false;
          }
        });
      
        }, 1000);

        } else {
          // Al volver a la vista original:
          if (fpControls) {
            fpControls.dispose();
            fpControls = null;
            
            // Cerrar/eliminar el folder de First Person Controls al salir de FPV
            gui.folders.forEach(folder => {
              if (folder._title === "First Person") {
                  folder.destroy();
              }
              deleteButtons();
            });
          }
        
        // Utilizar el estado guardado para regresar a la vista original
        transitionToThirdPerson(camera, cameraControls, thirdPersonState.position, thirdPersonState.quaternion, 1000);
    }
}


/**
 * Función para crear los botones móviles en pantalla que simulan las teclas.
 */
function createButtons() {
  if (document.getElementById("controles-movil")) return;
  
  // Contenedor de botones
  const contenedor = document.createElement("div");
  contenedor.id = "controles-movil";
  contenedor.style.position = "fixed";
  contenedor.style.bottom = "20px";
  contenedor.style.left = "50%";
  contenedor.style.transform = "translateX(-50%)";
  contenedor.style.display = "flex";
  contenedor.style.flexDirection = "column";
  contenedor.style.alignItems = "center";
  contenedor.style.zIndex = "1000";
  
  // Botones verticales: Arriba y Abajo
  const filaVertical = document.createElement("div");
  filaVertical.style.display = "flex";
  filaVertical.style.flexDirection = "column";
  filaVertical.style.alignItems = "center";
  
  // Botón ARRIBA (simula KeyW)
  const btnArriba = document.createElement("button");
  btnArriba.style.fontWeight = "bold";
  btnArriba.innerHTML = "⏫";
  btnArriba.style.width = "50px";
  btnArriba.style.height = "50px";
  btnArriba.style.margin = "1em";
  btnArriba.style.border = "none";
  btnArriba.style.borderRadius = "30px";
  btnArriba.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
  btnArriba.style.backgroundColor = "white";
  btnArriba.addEventListener("pointerdown", () => { keysPressed['KeyW'] = true; });
  btnArriba.addEventListener("pointerup", () => { keysPressed['KeyW'] = false; });
  btnArriba.addEventListener("pointerleave", () => { keysPressed['KeyW'] = false; });
  filaVertical.appendChild(btnArriba);
  
  // Botón ABAJO (simula KeyS)
  //const btnAbajo = document.createElement("button");
  //btnAbajo.style.fontWeight = "bold";
  //btnAbajo.innerHTML = "↓";
  //btnAbajo.style.width = "50px";
  //btnAbajo.style.height = "50px";
  //btnAbajo.style.border = "none";
  //btnAbajo.style.borderRadius = "30px";
  //btnAbajo.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
  //btnAbajo.style.backgroundColor = "white";
  //btnAbajo.addEventListener("pointerdown", () => { keysPressed['KeyS'] = true; });
  //btnAbajo.addEventListener("pointerup", () => { keysPressed['KeyS'] = false; });
  //btnAbajo.addEventListener("pointerleave", () => { keysPressed['KeyS'] = false; });
  //filaVertical.appendChild(btnAbajo);
  const btnSalto = document.createElement("button");
  btnSalto.style.fontWeight = "bold";
  btnSalto.innerHTML = "🦘";
  btnSalto.style.width = "50px";
  btnSalto.style.height = "50px";
  btnSalto.style.border = "none";
  btnSalto.style.borderRadius = "30px";
  btnSalto.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
  btnSalto.style.backgroundColor = "white";
  btnSalto.addEventListener("pointerdown", () => { keysPressed['Space'] = true; });
  btnSalto.addEventListener("pointerup", () => { keysPressed['Space'] = false; });
  btnSalto.addEventListener("pointerleave", () => { keysPressed['Space'] = false; });
  filaVertical.appendChild(btnSalto);
  
  // Botones horizontales: Izquierda y Derecha
  const filaHorizontal = document.createElement("div");
  filaHorizontal.style.display = "flex";
  
  // Botón IZQUIERDA (simula KeyA)
  const btnIzquierda = document.createElement("button");
  btnIzquierda.style.fontWeight = "bold";
  btnIzquierda.innerHTML = "⏪";
  btnIzquierda.style.width = "50px";
  btnIzquierda.style.height = "50px";
  btnIzquierda.style.margin = "4em";
  btnIzquierda.style.border = "none";
  btnIzquierda.style.borderRadius = "30px";
  btnIzquierda.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
  btnIzquierda.style.backgroundColor = "white";
  btnIzquierda.addEventListener("pointerdown", () => { keysPressed['KeyA'] = true; });
  btnIzquierda.addEventListener("pointerup", () => { keysPressed['KeyA'] = false; });
  btnIzquierda.addEventListener("pointerleave", () => { keysPressed['KeyA'] = false; });
  filaHorizontal.appendChild(btnIzquierda);
  
  // Botón DERECHA (simula KeyD)
  const btnDerecha = document.createElement("button");
  btnDerecha.style.fontWeight = "bold";
  btnDerecha.innerHTML = "⏩";
  btnDerecha.style.width = "50px";
  btnDerecha.style.height = "50px";
  btnDerecha.style.margin = "4em";
  btnDerecha.style.border = "none";
  btnDerecha.style.borderRadius = "30px";
  btnDerecha.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
  btnDerecha.style.backgroundColor = "white";
  btnDerecha.addEventListener("pointerdown", () => { keysPressed['KeyD'] = true; });
  btnDerecha.addEventListener("pointerup", () => { keysPressed['KeyD'] = false; });
  btnDerecha.addEventListener("pointerleave", () => { keysPressed['KeyD'] = false; });
  filaHorizontal.appendChild(btnDerecha);
  
  // Agregar filas al contenedor
  contenedor.appendChild(filaVertical);
  contenedor.appendChild(filaHorizontal);
  
  // Añadir el contenedor al body
  document.body.appendChild(contenedor);
}

/**
 * Función para eliminar los botones móviles de la pantalla.
 */
function deleteButtons() {
  const contenedor = document.getElementById("controles-movil");
  if (contenedor) {
    contenedor.parentNode.removeChild(contenedor);
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
