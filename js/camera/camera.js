export let camera, cameraControls;

export function iniCamera(renderer){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(62, 36, -5); // quiero una transicion hasta la pos -14,11,35
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.05;
    cameraControls.screenSpacePanning = false;
    cameraControls.minDistance = 0.5;
    cameraControls.maxDistance = 400;

    //cameraControls.minPolarAngle = -0.5;            // Permite mirar directamente hacia arriba
    //cameraControls.maxPolarAngle = Math.PI / 2;    // Limita la rotación para que nunca apunte hacia abajo
}