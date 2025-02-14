import { Water } from "../../js/ocean/Water.module.js";

export let water;

export function iniWater(scene){
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    
    // Crear el objeto Water
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('models/water/waternormals.png', function (texture) {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping; //RepeatWrapping
                texture.repeat.set(1000, 1000); // Ajusta según lo necesites
            }),
            alpha: 0.9,
            //sunDirection: directionalLight.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0xFFFFFF,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = -Math.PI / 2;
    //water.position.set(0,0.4,0);
    water.receiveShadow = true;
    scene.add(water);
}

export function getWaveHeight(x, z, time) {
    // Calcula la posicion de las olas del mar    
    return Math.sin(x * 0.1 + time) * 0.08 + Math.cos(z * 0.1 + time) * 0.08;
}