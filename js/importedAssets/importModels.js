import { GUI } from "../../lib/lil-gui.module.min.js";
import { camera } from "../camera/camera.js";
import * as SkeletonUtils from "../../lib/SkeletonUtils.js";
import * as THREE from "../../lib/three.module.js";

export let mobile, wuhu_island, gui, beach_kit, boat;
export let map_pointers = [];
let cube;
export let miiModel, miiMixer;

export const map_pointer_lib = {
  about: new THREE.Vector3(48.78, 2.9, -18.91),
  experience: new THREE.Vector3(-20.27, 2.8, 11.5),
  projects: new THREE.Vector3(-33, 9.7, -30), 
  contact: new THREE.Vector3(47, 1, 50),
}

export function iniWuhuIsland(scene, loader){
  loader.load('models/wuhu_island/ISLA.glb', function (gltf) {
    wuhu_island = gltf.scene;
    //wuhu_island.position.set(0, 0.4, 0);
    wuhu_island.scale.set(0.5, 0.5, 0.5);
    // Guardamos la posición base en Y para la flotación
    wuhu_island.userData.baseY = wuhu_island.position.y + 0.20;

    wuhu_island.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    initCubeWithGUI();

    loader.load('models/map_pointer/places_of_interest.gltf', function (gltf) {
      // Guardamos la escena original
      let map_pointer = SkeletonUtils.clone(gltf.scene);
      
      // Una vez cargado, ya podemos iterar sobre "map_pointer_lib"
      Object.keys(map_pointer_lib).forEach((key) => {
        // Clonamos el modelo usando SkeletonUtils
        const pointerClone = map_pointer.clone();

        // Asignamos el ID y posición
        pointerClone.userData.id = key;
        pointerClone.position.copy(map_pointer_lib[key]);
        pointerClone.scale.set(2, 2, 2);
        pointerClone.userData.initialY = pointerClone.position.y;

        // Activamos sombras en cada clon
        pointerClone.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Guardamos en el array y añadimos a la escena
        map_pointers.push(pointerClone);
        wuhu_island.add(pointerClone);
      });
    });
    
    scene.add(wuhu_island);

    loader.load('models/tugboat.glb', function (gltf) {
      boat = gltf.scene;
      boat.position.set(3.6, 0.2, 56);
      boat.scale.set(3, 3, 3);
      // Guardamos la posición base en Y para la flotación
      boat.userData.baseY = boat.position.y;

      boat.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      wuhu_island.add(boat);
    });
    
    loader.load('models/app_island/scene.gltf', function (gltf) {
      mobile = gltf.scene;
      mobile.position.set(50, 0.1, 50);
      mobile.scale.set(50, 50, 50);
      // Guardamos la posición base en Y para la flotación
      mobile.userData.baseY = mobile.position.y + 0.1;

      mobile.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      wuhu_island.add(mobile);
    });

    loader.load('models/mii_animation.glb', function (gltf) {
      // El modelo 3D
      miiModel = gltf.scene;
      miiModel.position.set(80, 0.65, 35); //(84, 0.6, 70); 
      miiModel.scale.set(0.008, 0.008, 0.008);

      miiModel.traverse((child) => {
        if (child.isMesh && child.geometry) {
          child.castShadow = true;
        }
      });
  
      wuhu_island.add(miiModel);
  
      // Crear un AnimationMixer para reproducir la animación
      miiMixer = new THREE.AnimationMixer(miiModel);
  
      // Tomar la primera animación (si tu archivo GLB tiene varias, ajusta el índice)
      const clip = gltf.animations[0];
      if (clip) {
        const action = miiMixer.clipAction(clip);
        action.play();
      }
    });

    loader.load('models/beach_kit.glb', function (gltf) {
      // El modelo 3D
      beach_kit = gltf.scene;
      beach_kit.position.set(85, 0.6, 35); //(84, 0.6, 70); 
      beach_kit.rotation.set(0, 5, 0);
      beach_kit.scale.set(0.8, 0.8, 0.8);

      beach_kit.traverse((child) => {
        if (child.isMesh && child.geometry) {
          if (child.geometry.attributes.uv2) {
            child.geometry.setAttribute('uv1', child.geometry.attributes.uv); // Forzar uso del UV principal
          }
      
          if (child.material && child.material.normalMap) {
            child.material.normalMap.channel = 0; // Asegurar que usa el primer UV
          }

          child.castShadow = true;
        }
      });

      wuhu_island.add(beach_kit);
    });
  });   
}

// Función para crear el cubo y añadirle la interfaz de control
function initCubeWithGUI() {
    // Crear la geometría y material del cubo
    /*
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  
    // Posición inicial relativa a la isla
    cube.position.set(0, 1, 0);
  
    // Agregar el cubo al nodo de la isla (mobile)
    if (wuhu_island) {
      wuhu_island.add(cube);
      console.log("Cubo agregado a la isla");
    } else {
      console.error("El nodo de la isla aún no está disponible.");
    }

    // Objeto auxiliar que refleja la posición del cubo
    const cubePos = {
      x: cube.position.x,
      y: cube.position.y,
      z: cube.position.z
    };*/
    const cameraPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    };

    // Crear la GUI y agregar los controles para la posición
    gui = new GUI();
    /*const cubeFolder = gui.addFolder("Posición del Cubo (Relativa a la Isla)");
    // Control para el eje X
    cubeFolder.add(cubePos, "x", -1000, 1000)
    .name("X")
    .step(0.01)
    .onChange((value) => {
      cube.position.x = value;
    })
    .listen();
    cubeFolder.add( cubePos, 'x' ).onChange((value) => {
      cube.position.x = value;
    })
    .listen();   // Number Field

    // Control para el eje Y
    cubeFolder.add(cubePos, "y", -5, 30)
    .name("Y")
    .step(0.1)
    .onChange((value) => {
      cube.position.y = value;
    })
    .listen();
    cubeFolder.add( cubePos, 'y' ).onChange((value) => {
      cube.position.y = value;
    })
    .listen();   // Number Field

    // Control para el eje Z
    cubeFolder.add(cubePos, "z", -1000, 1000)
    .name("Z")
    .step(0.01)
    .onChange((value) => {
      cube.position.z = value;
    })
    .listen();
    cubeFolder.add( cubePos, 'z' ).onChange((value) => {
      cube.position.z = value;
    })
    .listen();   // Number Field
    cubeFolder.open();
    */
    // Folder para la posición de la cámara
    const cameraFolder = gui.addFolder("Camera Position");
    cameraFolder.add(cameraPos, "x").name("X").onChange((value) => {
      camera.position.x = value;
    }).listen();
    cameraFolder.add(cameraPos, "y").name("Y").onChange((value) => {
      camera.position.y = value;
    }).listen();
    cameraFolder.add(cameraPos, "z").name("Z").onChange((value) => {
      camera.position.z = value;
    }).listen();
    
    // Mover la GUI a la esquina inferior
    const guiContainer = document.querySelector(".lil-gui");
    if (guiContainer) {
    guiContainer.style.position = "absolute";
    guiContainer.style.bottom = "10px";
    guiContainer.style.right = "10px";
    guiContainer.style.top = "auto";
    guiContainer.style.width = "200px";
    }

    gui.close();

    // Actualizar valores de la GUI en cada frame
    function updateGUI() {
      cameraPos.x = Math.round(camera.position.x);
      cameraPos.y = Math.round(camera.position.y);
      cameraPos.z = Math.round(camera.position.z);
      requestAnimationFrame(updateGUI);
    }
    updateGUI();
}