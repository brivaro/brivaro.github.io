export let mobile, wuhu_island;

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
  });   
}