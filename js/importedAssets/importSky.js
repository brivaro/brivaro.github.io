import { PMREMGenerator } from 'three';

let skyEnvironments = {
  day: null,
  night: null,
};

// Rutas de las texturas EXR
const paths = {
  day: "../../skies/day.exr",
  night: "../../skies/night.exr",
};

export function iniSkies(renderer, exrLoader) {
  // Se crea el PMREMGenerator para convertir las texturas EXR
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Cargar ambas texturas en paralelo
  return Promise.all([
    new Promise((resolve, reject) => {
      exrLoader.load(
        paths.day,
        (texture) => {
          skyEnvironments.day = pmremGenerator.fromEquirectangular(texture).texture;
          texture.dispose();
          resolve();
        },
        undefined,
        reject
      );
    }),
    new Promise((resolve, reject) => {
      exrLoader.load(
        paths.night,
        (texture) => {
          skyEnvironments.night = pmremGenerator.fromEquirectangular(texture).texture;
          texture.dispose();
          resolve();
        },
        undefined,
        reject
      );
    })
  ]).then(() => {
    // Una vez generados ambos entornos, liberamos el PMREMGenerator
    pmremGenerator.dispose();
  });
}


export function updateSky(scene, isNight) {
  const envMap = isNight ? skyEnvironments.night : skyEnvironments.day;
  scene.background = envMap;  // Actualiza el fondo
  scene.environment = envMap; // Actualiza el entorno para reflejos
}