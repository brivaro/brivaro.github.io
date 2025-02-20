// Water.module.js
import * as THREE from 'three';

// Shader de vértices: Desplaza la posición de los vértices utilizando una función seno para simular ondulaciones.
const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    
    // Desplazamiento simple en la dirección Z (puedes ajustar la intensidad y frecuencia)
    vec3 pos = position;
    pos.z += sin(pos.x * 0.1 + time) * 0.1;
    pos.z += cos(pos.y * 0.1 + time) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D waterNormals;
  uniform vec3 waterColor;
  uniform float alpha;
  uniform float time;
  varying vec2 vUv;

  void main() {
    // Desplazamientos para simular flujo de agua
    vec2 uv1 = vUv + vec2(time * 0.002, time * 0.001);
    vec2 uv2 = vUv - vec2(time * 0.0015, time * 0.002);

    // Se muestrean dos versiones desplazadas de la textura de normales
    vec3 normalColor1 = texture2D(waterNormals, uv1 * 10.0).rgb;
    vec3 normalColor2 = texture2D(waterNormals, uv2 * 10.0).rgb;

    // Se combinan ambas muestras para un efecto más realista
    vec3 normalColor = mix(normalColor1, normalColor2, 0.5);
    
    // Aplicamos la textura animada sobre el color base del agua
    vec3 color = waterColor * normalColor;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

class Water extends THREE.Mesh {
  /**
   * @param {THREE.PlaneGeometry} geometry - Geometría sobre la que se aplica el efecto de agua.
   * @param {Object} options - Opciones para configurar el agua.
   * @param {number} [options.textureWidth=512] - Ancho de la textura interna.
   * @param {number} [options.textureHeight=512] - Altura de la textura interna.
   * @param {THREE.Texture} options.waterNormals - Textura de normales para simular las ondulaciones.
   * @param {THREE.Vector3} [options.sunDirection=new THREE.Vector3(0.70707, 0.70707, 0)] - Dirección de la luz del sol.
   * @param {number} [options.sunColor=0xffffff] - Color de la luz del sol.
   * @param {number} [options.waterColor=0x001e0f] - Color base del agua.
   * @param {number} [options.distortionScale=3.7] - Escala de distorsión (no utilizada en este shader básico).
   * @param {number} [options.alpha=1.0] - Transparencia del agua.
   * @param {number} [options.time=0] - Valor inicial de tiempo para la animación.
   */
  constructor(geometry, options = {}) {
    options = Object.assign({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: null, // mi png waternormals
      sunDirection: new THREE.Vector3(0.70707, 0.70707, 0),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      alpha: 1.0,
      time: 0
    }, options);

    // Definir los uniformes que usará el shader.
    const uniforms = {
      time: { value: options.time },
      waterNormals: { value: options.waterNormals },
      sunDirection: { value: options.sunDirection },
      sunColor: { value: new THREE.Color(options.sunColor) },
      waterColor: { value: new THREE.Color(options.waterColor) },
      distortionScale: { value: options.distortionScale },
      alpha: { value: options.alpha }
    };

    // Crear el material con los shaders personalizados.
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,    // Para renderizar ambos lados
      depthWrite: false          // Para permitir ver objetos detrás
    });

    // Llamar al constructor de THREE.Mesh
    super(geometry, material);

    // Si se proporcionó una textura de normales, configurar que se repita.
    if (options.waterNormals) {
      options.waterNormals.wrapS = options.waterNormals.wrapT = THREE.RepeatWrapping;
    }
  }
}

export { Water };
