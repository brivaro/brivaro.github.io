import { GUI } from "../../lib/lil-gui.module.min.js";
import { camera } from "../camera/camera.js";

export let mobile, wuhu_island, gui;
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
  loader.load('models/wuhu_island/scene.glb', function (gltf) {
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

    Object.keys(map_pointer_lib).forEach((key) => {
      loader.load('models/map_pointer/places_of_interest.gltf', function (gltf) {
        const pointerModel = gltf.scene;
        // Asignamos la posición usando copy para clonar el vector
        pointerModel.userData.id = key;
        pointerModel.position.copy(map_pointer_lib[key]);
        pointerModel.scale.set(2, 2, 2);
        // Guardar la posición inicial en Y para la oscilación vertical
        pointerModel.userData.initialY = pointerModel.position.y;
        
        pointerModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        map_pointers.push(pointerModel);

        // Agregamos el punto de interés a la isla
        wuhu_island.add(pointerModel);
      });
    });
    
    scene.add(wuhu_island);
    
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
          
          // Recalcula las normales de la geometría
          child.geometry.computeVertexNormals();
      
          // Prueba forzar doble cara para verificar si desaparece el problema
          child.material.side = THREE.FrontAndBackSide;
        }
      });
      //console.log(miiModel.scale); 
  
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