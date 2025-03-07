export function iniLights(scene){
    // Luz ambiental para iluminar toda la escena
    const light = new THREE.AmbientLight(0xffffff, 0.05);
    light.name = "AmbientLight";
    light.visible = false;
    scene.add(light);

    // Luz direccional para dar sombras y profundidad
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2); //antes de usar el skybox 2.5
    directionalLight.position.set(1000, 500, 1000);
    directionalLight.target.position.set(0, 1, 0); // Apunta a (0,1,0)
    directionalLight.name = "DirectionalLight";
    directionalLight.visible = false;
    scene.add(directionalLight);

    const lightSky = new THREE.DirectionalLight(0x87CEFA, 0.1); // Azul claro como el cielo //antes de usar el skybox 2
    lightSky.position.set(1000, 500, 1000);
    lightSky.name = "DirectionalLightSky";
    lightSky.visible = false;
    scene.add(lightSky);

    const sunLight1 = new THREE.DirectionalLight(0xFFAA55, 0.6); // Luz cálida anaranjada //antes de usar el skybox 2
    sunLight1.position.set(1000, 500, 1000);
    sunLight1.name = "DirectionalLightSun";
    sunLight1.visible = false;
    sunLight1.castShadow = true;
    // Configuración de la cámara de sombras
    sunLight1.shadow.camera.left = -50;
    sunLight1.shadow.camera.right = 50;
    sunLight1.shadow.camera.top = 50;
    sunLight1.shadow.camera.bottom = -50;
    // Resolucion mapa sombras
    sunLight1.shadow.mapSize.width = 5096;
    sunLight1.shadow.mapSize.height = 5096;
    // Define a partir de que margen crea sombra
    sunLight1.shadow.camera.far = 4000;
    sunLight1.shadow.camera.near = 0.5;
    // Si es negativo, corrige artefactos en sombras, muy positivo reduce mucho la sombra
    sunLight1.shadow.bias = -0.0001;
    sunLight1.shadow.normalBias = 0.05;
    //sunLight1.shadow.radius = 50;
    scene.add(sunLight1);

    //--------------------------------------
    // Luz de la luna
    const lightnight = new THREE.AmbientLight(0xffffff, 0.3);
    lightnight.name = "AmbientLightNight";
    lightnight.visible = false;
    scene.add(lightnight);
    const lightnight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    lightnight2.position.set(1000, 2000, 1000);
    lightnight2.target.position.set(0, 1, 0); // Apunta a (0,1,0)
    lightnight2.name = "DirectionalLightNight";
    lightnight2.visible = false;
    lightnight2.castShadow = true;
    // Configuración de la cámara de sombras
    lightnight2.shadow.camera.left = -50;
    lightnight2.shadow.camera.right = 50;
    lightnight2.shadow.camera.top = 50;
    lightnight2.shadow.camera.bottom = -50;
    // Resolucion mapa sombras
    lightnight2.shadow.mapSize.width = 4096;
    lightnight2.shadow.mapSize.height = 4096;
    // Define a partir de que margen crea sombra
    lightnight2.shadow.camera.far = 4000;
    lightnight2.shadow.camera.near = 0.5;
    // Si es negativo, corrige artefactos en sombras, muy positivo reduce mucho la sombra
    lightnight2.shadow.bias = -0.0001;
    lightnight2.shadow.normalBias = 0.05;
    scene.add(lightnight2);

}