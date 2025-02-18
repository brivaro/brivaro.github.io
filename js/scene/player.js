import { wuhu_island } from "../importedAssets/importModels.js";

// ------------------------------
// Variables para el salto y la gravedad
// ------------------------------
let verticalVelocity = 0;
let isOnGround = false;
const gravity = -30;   // Aceleración de la gravedad
const jumpSpeed = 10;   // Velocidad inicial del salto
let headBlocked = false;  // Indicar si hay algo encima que impida el salto

const keysPressed = {};
export function keybuttoms(){
    window.addEventListener('keydown', (event) => {
        keysPressed[event.code] = true;
      });
    window.addEventListener('keyup', (event) => {
    keysPressed[event.code] = false;
    });
}

/**
 * Función que lanza un raycast hacia arriba para comprobar si hay un obstáculo
 * sobre el jugador. Actualiza la variable global 'headBlocked'.
 */
function checkHeadCollision(camera) {
    const raycaster = new THREE.Raycaster();
    const up = new THREE.Vector3(0, 1, 0);
    
    // Usamos la posición de la cámara y la elevamos un poco para evitar colisiones con el propio jugador
    const origin = camera.position.clone();
    origin.y += 0.1;
    
    // Establecemos el raycast hacia arriba
    raycaster.set(origin, up);
    
    // Distancia a comprobar (ajústala según el tamaño del "techo" o el obstáculo que esperas)
    const maxDistance = 1;
    
    const intersections = raycaster.intersectObject(wuhu_island, true);
    
    headBlocked = intersections.length > 0 && intersections[0].distance < maxDistance;
    
    return headBlocked;
}

/**
 * Función para actualizar el movimiento horizontal del jugador.
 * Se calcula la posición "propuesta" y se lanza un raycast para detectar colisiones con wuhu_island.
 * Se ha ampliado el buffer de colisión para que se detenga antes de llegar a la pared.
 */
export function updatePlayer(delta, camera) {
    const speed = 3; // Velocidad de movimiento
    let moveX = 0, moveZ = 0;
    if (keysPressed['KeyW']) moveZ -= 1;
    if (keysPressed['KeyS']) moveZ += 1;
    if (keysPressed['KeyA']) moveX -= 1;
    if (keysPressed['KeyD']) moveX += 1;
    
    const direction = new THREE.Vector3(moveX, 0, moveZ);
    if (direction.lengthSq() > 0) {
      direction.normalize();
      // Rotar la dirección según la orientación de la cámara
      direction.applyQuaternion(camera.quaternion);
      
      // Calcular la posición propuesta
      const proposedPosition = camera.position.clone().addScaledVector(direction, speed * delta);
      
      // Detección de colisiones con wuhu_island:
      // Se lanza un ray desde la posición actual en la dirección del movimiento
      const raycaster = new THREE.Raycaster();
      raycaster.set(camera.position, direction);
      
      const intersections = raycaster.intersectObject(wuhu_island, true);
      
      // Aumentamos el "buffer" de colisión para detener el movimiento antes de llegar a la pared
      const collisionBuffer = 0.2;
      
      if (intersections.length > 0 && intersections[0].distance < speed * delta + collisionBuffer) {
        // Si hay colisión, se detiene el avance un poco antes del impacto.
        const adjustedPosition = intersections[0].point.clone().addScaledVector(direction, -collisionBuffer);
        camera.position.copy(adjustedPosition);
      } else {
        // Si no hay colisión, se actualiza la posición normalmente.
        camera.position.copy(proposedPosition);
      }
    }
}


/**
 * Función para comprobar y ejecutar el salto.
 * Si se presiona la tecla espacio y el jugador está en el suelo,
 * se asigna una velocidad vertical positiva para iniciar el salto.
 */
export function updateJump(camera) {
    // Actualizamos si hay algo bloqueando el salto (por ejemplo, un techo bajo)
    checkHeadCollision(camera);
    
    if (keysPressed['Space'] && isOnGround && !headBlocked) {
        verticalVelocity = jumpSpeed;
        isOnGround = false;
        // Consumir la pulsación para evitar saltos continuos al mantener presionada la tecla
        keysPressed['Space'] = false;
    }
  }
  
/**
 * Función para actualizar la posición vertical del jugador.
 * Se lanza un ray hacia abajo para detectar el suelo (wuhu_island) y,
 * aplicando gravedad, se actualiza la velocidad y posición vertical.
 */
export function updatePlayerY(delta, camera) {
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    const origin = camera.position.clone();
    origin.y += 0.05; // Se inicia el raycast desde un poco arriba de la cámara
    raycaster.set(origin, down);
    const intersects = raycaster.intersectObject(wuhu_island, true);
    let targetGroundY = null;
    if (intersects.length > 0) {
      const offset = 0.3; // Offset para que el jugador quede justo encima del suelo
      targetGroundY = intersects[0].point.y + offset;
    }
    
    // Aplicar gravedad a la velocidad vertical
    verticalVelocity += gravity * delta;
    
    // Actualizar la posición Y según la velocidad vertical
    camera.position.y += verticalVelocity * delta;
    
    // Si el jugador cae por debajo del suelo, se corrige su posición y se resetea la velocidad
    if (targetGroundY !== null && camera.position.y < targetGroundY) {
      camera.position.y = targetGroundY;
      verticalVelocity = 0;
      isOnGround = true;
    } else {
      isOnGround = false;
    }
}
