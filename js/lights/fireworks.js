// fireworks.js
import * as THREE from 'three';

class Firework {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    // Posición de partida: se generan con un ligero offset en X y Z para dar variedad
    const spawnX = (Math.random() - 0.5) * 100;
    const spawnZ = (Math.random() - 0.5) * 100;
    this.group.position.set(spawnX, 0, spawnZ);

    // Creamos el cubo que ascenderá
    const size = 0.3;
    const geometry = new THREE.BoxGeometry(size, size, size);
    // Color aleatorio para el fuego artificial
    // Color vibrante aleatorio utilizando HSL (saturación al 100% y luminosidad media)
    const hue = Math.random();
    this.color = new THREE.Color();
    this.color.setHSL(hue, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
        color: this.color,
        emissive: this.color,       // El mismo color para emitir luz
        emissiveIntensity: 5,        // Ajusta este valor según lo brillante que quieras
      });
    this.cube = new THREE.Mesh(geometry, material);
    this.group.add(this.cube);

    // Rotaciones aleatorias para mayor dinamismo
    this.cube.rotateX((Math.random() - 0.5) * 100);
    this.cube.rotateY((Math.random() - 0.5) * 100);
    this.cube.rotateZ((Math.random() - 0.5) * 100);

    // Estado y parámetros de la animación
    this.state = 'ascending'; // estados: ascending, exploded, finished
    this.speed = 5 + Math.random() * 5; // velocidad de ascenso
    this.explosionHeight = 20 + Math.random() * 5; // altura a la que explota
    this.explosionStarted = false;
    this.explosionStartTime = 0;
    this.explosionDuration = 2.0; // duración de la explosión (segundos)
    this.explosionPieces = []; // para almacenar las piezas de la explosión

    // Propiedades para el rastro (trail)
    this.trailParticles = [];
    this.lastTrailSpawnTime = 0;
    this.trailSpawnInterval = 0.08; // segundos entre partículas

    // Luz puntual para iluminar la escena con el color del fuego
    this.light = new THREE.PointLight(this.color, 5, 50);
    this.light.position.set(0, 0, 0);
    this.group.add(this.light);

    // Agregamos el grupo a la escena
    this.scene.add(this.group);
  }

  update(delta, timeNow) {
    if (this.state === 'ascending') {
      // Subida vertical
      this.group.position.y += this.speed * delta;
      if (this.group.position.y >= this.explosionHeight) {
        this.triggerExplosion(timeNow);
      }
      // Genera partículas del rastro en intervalos regulares
      if (timeNow - this.lastTrailSpawnTime > this.trailSpawnInterval) {
        this.spawnTrailParticle(timeNow);
        this.lastTrailSpawnTime = timeNow;
      }
    } else if (this.state === 'exploded') {
      // Actualizamos la explosión
      const elapsed = timeNow - this.explosionStartTime;
      
      // Cada pieza se aleja, se reduce y se desvanece
      for (let piece of this.explosionPieces) {
        // Movimiento en dirección asignada
        piece.mesh.position.addScaledVector(piece.direction, delta * 2);
        // Reducimos la escala
        piece.mesh.scale.multiplyScalar(1 - delta);
        // Si el material es transparente, reducimos la opacidad
        if (piece.mesh.material.transparent) {
          piece.mesh.material.opacity = Math.max(0, piece.mesh.material.opacity - delta);
        }
      }
      // La intensidad de la luz también disminuye
      this.light.intensity = Math.max(0, 10 * (1 - elapsed / this.explosionDuration));

      // Una vez transcurrida la duración, marcamos este fuego como terminado
      if (elapsed >= this.explosionDuration) {
        this.dispose();
        this.state = 'finished';
      }
    }
    // Actualiza las partículas del rastro (trail)
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const particle = this.trailParticles[i];
      const age = timeNow - particle.creationTime;
      const lifetime = 0.5; // duración de la partícula
      if (age > lifetime) {
        this.scene.remove(particle.mesh);
        if (particle.mesh.geometry) particle.mesh.geometry.dispose();
        if (particle.mesh.material) particle.mesh.material.dispose();
        this.trailParticles.splice(i, 1);
      } else {
        // Se desvanece progresivamente
        particle.mesh.material.opacity = 1 - (age / lifetime);
      }
    }
  }

  spawnTrailParticle(timeNow) {
    // Creamos una pequeña esfera que simula la partícula del rastro
    const geometry = new THREE.SphereGeometry(0.4, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleMesh = new THREE.Mesh(geometry, material);
    // La partícula se posiciona donde está el cubo en ese momento
    particleMesh.position.copy(this.group.position);
    // Se añade directamente a la escena para que quede fija en su posición de creación
    this.scene.add(particleMesh);
    this.trailParticles.push({ mesh: particleMesh, creationTime: timeNow });
  }

  triggerExplosion(timeNow) {
    if (this.explosionStarted) return;
    this.explosionStarted = true;
    // Eliminamos el cubo ascendente
    this.group.remove(this.cube);
    if (this.cube.geometry) this.cube.geometry.dispose();
    if (this.cube.material) this.cube.material.dispose();

    // Direcciones para cada cara del cubo
    const directions = [
      new THREE.Vector3(1, 0, 0),   // derecha
      new THREE.Vector3(-1, 0, 0),  // izquierda
      new THREE.Vector3(0, 1, 0),   // arriba
      new THREE.Vector3(0, -1, 0),  // abajo
      new THREE.Vector3(0, 0, 1),   // frente
      new THREE.Vector3(0, 0, -1),  // atrás
    ];

    const size = 0.5;
    // Para cada dirección, creamos una “pieza” de explosión (una cara)
    for (let dir of directions) {
      const geometry = new THREE.PlaneGeometry(size, size);
      // Usamos material básico transparente para poder desvanecerlo
      const material = new THREE.MeshStandardMaterial({
        color: this.color,
        emissive: this.color,
        emissiveIntensity: 5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      });
      const faceMesh = new THREE.Mesh(geometry, material);
      // Orientamos la cara para que “mire” hacia la dirección de la explosión
      faceMesh.lookAt(dir);
      faceMesh.position.set(0, 0, 0);
      this.group.add(faceMesh);
      // Guardamos la pieza junto con su dirección (con un pequeño factor aleatorio)
      this.explosionPieces.push({
        mesh: faceMesh,
        direction: dir.clone().normalize().multiplyScalar(1 + Math.random())
      });
    }
    // Guardamos el momento en que comenzó la explosión
    this.explosionStartTime = timeNow;
    this.state = 'exploded';
  }

  dispose() {
    // Limpiamos las piezas de la explosión
    for (let piece of this.explosionPieces) {
      this.group.remove(piece.mesh);
      if (piece.mesh.geometry) piece.mesh.geometry.dispose();
      if (piece.mesh.material) piece.mesh.material.dispose();
    }
    
    // Eliminamos las partículas del rastro (trail)
    for (let particle of this.trailParticles) {
      this.scene.remove(particle.mesh);
      if (particle.mesh.geometry) particle.mesh.geometry.dispose();
      if (particle.mesh.material) particle.mesh.material.dispose();
    }
    
    // Eliminamos la luz
    this.group.remove(this.light);
    
    // Quitamos el grupo de la escena
    this.scene.remove(this.group);
  }
}

class FireworksManager {
  constructor(scene) {
    this.scene = scene;
    this.fireworks = [];
    this.spawnInterval = 3; // Intervalo de creación (en segundos)
    this.elapsedTime = 0.5;
  }

  update(delta) {
    const timeNow = performance.now() / 1000; // tiempo actual en segundos

    // Actualizamos cada fuego artificial
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.update(delta, timeNow);
      if (fw.state === 'finished') {
        this.fireworks.splice(i, 1);
      }
    }

    // Generamos nuevos fuegos artificiales periódicamente
    this.elapsedTime += delta;
    if (this.elapsedTime >= this.spawnInterval) {
      this.spawnFirework();
      this.elapsedTime = 0;
    }
  }

  spawnFirework() {
    const fw = new Firework(this.scene);
    this.fireworks.push(fw);
  }
}

export { FireworksManager };
