export function iniLights(scene){
    // Luz ambiental para iluminar toda la escena
    const light = new THREE.AmbientLight(0xffffff, 0.05);
    light.name = "ld";
    scene.add(light);

    // Luz direccional para dar sombras y profundidad
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2); //antes de usar el skybox 2.5
    directionalLight.position.set(1000, 500, 1000);
    directionalLight.target.position.set(0, 1, 0); // Apunta a (0,1,0)
    directionalLight.name = "l1";
    /*directionalLight.castShadow = true;
    // Configuración de la cámara de sombras (cámara ortográfica de la luz)
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    // Resolucion mapa sombras
    directionalLight.shadow.mapSize.width = 1024; //2048 era de mas resolucion pero más costoso
    directionalLight.shadow.mapSize.height = 1024;
    // Define a partir de que margen crea sombra
    directionalLight.shadow.camera.far = 4000;
    directionalLight.shadow.camera.near = 0.5;
    // Si es negativo, corrige artefactos en sombras, muy positivo reduce mucho la sombra
    directionalLight.shadow.bias = -0.01;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.shadow.radius = 5;*/
    scene.add(directionalLight);

    const lightSky = new THREE.DirectionalLight(0x87CEFA, 0.1); // Azul claro como el cielo //antes de usar el skybox 2
    lightSky.position.set(1000, 500, 1000);
    lightSky.name = "l2";
    /*lightSky.castShadow = true;
    // Configuración de la cámara de sombras
    lightSky.shadow.camera.left = -50;
    lightSky.shadow.camera.right = 50;
    lightSky.shadow.camera.top = 50;
    lightSky.shadow.camera.bottom = -50;
    // Resolucion mapa sombras
    lightSky.shadow.mapSize.width = 2048;
    lightSky.shadow.mapSize.height = 2048;
    // Define a partir de que margen crea sombra
    lightSky.shadow.camera.far = 4000;
    lightSky.shadow.camera.near = 0.5;
    // Si es negativo, corrige artefactos en sombras, muy positivo reduce mucho la sombra
    lightSky.shadow.bias = -0.0001;
    lightSky.shadow.normalBias = 0.05;
    lightSky.shadow.radius = 5;
    */
    scene.add(lightSky);

    const sunLight1 = new THREE.DirectionalLight(0xFFAA55, 0.6); // Luz cálida anaranjada //antes de usar el skybox 2
    sunLight1.position.set(1000, 500, 1000);
    sunLight1.name = "l3";
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

    /*const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10,10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);*/

}