export let mobile;

export function iniModels(scene, loader){
    loader.load('models/app_island/scene.gltf', function (gltf) {
      mobile = gltf.scene;
      mobile.position.set(0, 0, 0);
      mobile.scale.set(50, 50, 50);
      // Guardamos la posición base en Y para la flotación
      mobile.userData.baseY = mobile.position.y + 0.20;
      scene.add(mobile);
    });    
}