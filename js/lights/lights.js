export function iniLights(scene){
    // Luz ambiental para iluminar toda la escena
    const light = new THREE.AmbientLight(0xffffff, 0.1);
    light.name = "ld";
    scene.add(light);

    // Luz direccional para dar sombras y profundidad
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1); //antes de usar el skybox 2.5
    directionalLight.position.set(1000, 2000, 1000);
    directionalLight.target.position.set(0, 1, 0); // Apunta a (0,1,0)
    directionalLight.name = "l1";
    scene.add(directionalLight);

    const lightSky = new THREE.DirectionalLight(0x87CEFA, 0.2); // Azul claro como el cielo //antes de usar el skybox 2
    lightSky.position.set(1000, 1500, 1000);
    lightSky.name = "l2";
    scene.add(lightSky);

    const sunLight1 = new THREE.DirectionalLight(0xFFAA55, 0.6); // Luz cálida anaranjada //antes de usar el skybox 2
    sunLight1.position.set(1000, 1500, 1000);
    sunLight1.name = "l3";
    scene.add(sunLight1);

    /*var sunLight = new THREE.SpotLight(0xffffff, 0.3, 0, Math.PI / 2);
    sunLight.position.set(1000, 2000, 1000);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.0002;
    sunLight.shadow.camera.far = 4000;
    sunLight.shadow.camera.near = 750;
    sunLight.shadow.camera.fov = 30;
    scene.add(sunLight);*/

    /*const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10,10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);*/

}