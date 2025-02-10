export let renderer, scene;

export function iniRendererScene(){
    renderer = new THREE.WebGLRenderer({ antialias: true }); //reduce los dientes de sierra, puede afectar al rendimiento
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0xFFFFFF) );
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.style.position = 'relative';
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);
}