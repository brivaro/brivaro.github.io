export let camera, cameraControls;

export function iniCamera(renderer){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(50, 10, 40);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.05;
    cameraControls.screenSpacePanning = false;
    cameraControls.minDistance = 0.5;
    cameraControls.maxDistance = 500;
}