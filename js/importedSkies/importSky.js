import { PMREMGenerator } from 'three';

// Ruta al archivo cielo
const exrPath = "../../skies/4.exr";  

export function iniSky(scene, renderer, exrLoader){
    exrLoader.load(exrPath, function (texture) {
        const pmremGenerator = new PMREMGenerator(renderer);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
        scene.background = envMap;  // Establecer como fondo
        scene.environment = envMap; // Usar para reflejos
        texture.dispose();  // Liberar memoria
        pmremGenerator.dispose();
    });
}