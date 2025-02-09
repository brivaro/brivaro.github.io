import { EffectComposer } from "../../lib/EffectComposer.js";
import { RenderPass } from "../../lib/RenderPass.js";
import { ShaderPass } from "../../lib/ShaderPass.js";

// Variables para postprocesado
export let composer;
export let underwaterPass;

export function initPostprocessing(renderer, scene, camera){
    // Crear el compositor de postprocesado
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const UnderwaterShader = {
        uniforms: {
           'tDiffuse': { value: null },
           'time': { value: 0.0 },
           'underwaterFactor': { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            uniform float underwaterFactor;
            varying vec2 vUv;

            // Función para simular gotas de agua cayendo
            float waterDroplets(vec2 uv, float time) {
                float drops = 0.0;
                
                // Agregar múltiples gotas en diferentes posiciones y velocidades
                for (int i = 0; i < 5; i++) {
                    float speed = 0.1 + float(i) * 0.05; // Variar la velocidad de las gotas
                    vec2 pos = vec2(mod(time * speed + float(i) * 0.3, 1.0), mod(time * speed * 0.5 + float(i) * 0.2, 1.0));
                    
                    float dist = distance(uv, pos);  // Distancia del pixel a la gota
                    drops += smoothstep(0.05, 0.01, dist); // Suavizar la gota
                }

                return drops;
            }

            void main() {
                vec2 uv = vUv;
                
                // Distorsión de las gotas de agua
                float droplets = waterDroplets(uv, time);
                uv += vec2(droplets * 0.01 * underwaterFactor, droplets * 0.02 * underwaterFactor);

                // Distorsión tipo ondas por el agua
                uv.y += sin(uv.x * 20.0 + time * 5.0) * 0.005 * underwaterFactor;
                uv.x += cos(uv.y * 20.0 + time * 5.0) * 0.005 * underwaterFactor;

                // Tomar el color de la imagen original
                vec4 color = texture2D(tDiffuse, uv);

                // Mezclar con un tinte azul: cuanto mayor underwaterFactor, mayor el tinte
                vec3 blueTint = vec3(0.0, 0.4, 3.0);
                color.rgb = mix(color.rgb, blueTint, underwaterFactor * 0.5);
                
                // Añadir las gotas de agua con efecto de distorsión
                color.rgb += droplets * 0.1 * underwaterFactor;

                gl_FragColor = color;
            }
        `
    };

    // Crear el shader pass para el efecto underwater
    underwaterPass = new ShaderPass(UnderwaterShader);
    underwaterPass.renderToScreen = true;
    composer.addPass(underwaterPass);
}
