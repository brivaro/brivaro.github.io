export let modeloImportado;

export function iniModels(scene, loader){
    loader.load('models/app_island/scene.gltf', function (gltf) {
        modeloImportado = gltf.scene;
        modeloImportado.position.set(0, 0, 0);
        modeloImportado.scale.set(50, 50, 50);
        // Guardamos la posición base en Y para la flotación
        modeloImportado.userData.baseY = modeloImportado.position.y + 0.20;
        scene.add(modeloImportado);
    });    
}