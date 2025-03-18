import { PMREMGenerator, EquirectangularReflectionMapping } from 'three';

let skyEnvironments = {
  day: null,
  night: null,
};

// Rutas de las texturas EXR
const paths = {
  day: "../../skies/day.hdr",
  night: "../../skies/night.exr",
};

export function iniSkies(renderer, exrLoader, rgbeLoader) {
  // PMREMGenerator para convertir las texturas EXR
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  return Promise.all([
    // HDR con RGBELoader y generar PMREM
    new Promise((resolve, reject) => {
      rgbeLoader.load( paths.day,
        (texture) => {
          texture.mapping = EquirectangularReflectionMapping;
          skyEnvironments.day = pmremGenerator.fromEquirectangular(texture).texture;
          texture.dispose();
          resolve();
        },
        undefined,
        reject
      );
    }),

    new Promise((resolve, reject) => {
      exrLoader.load(paths.night,
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
  scene.background = envMap;  // Fondos para el entorno
  scene.environment = envMap; // Reflejos para el entorno
}


// EXR
    //new Promise((resolve, reject) => {
    //  exrLoader.load(
    //    paths.day,
    //    (texture) => {
    //      skyEnvironments.day = pmremGenerator.fromEquirectangular(texture).texture;
    //      texture.dispose();
    //      resolve();
    //    },
    //    undefined,
    //    reject
    //  );
    //}),