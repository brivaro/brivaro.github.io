// fireworks.js
import * as THREE from 'three';

// Pool para las partículas del trail
class ParticlePool {
  constructor(scene, maxSize = 100) {
    this.scene = scene;
    this.maxSize = maxSize;
    this.pool = [];
    // Pre-creamos algunas partículas
    for (let i = 0; i < this.maxSize; i++) {
      const geometry = new THREE.SphereGeometry(0.4, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      this.pool.push(mesh);
    }
  }

  // Obtiene una partícula del pool o crea una nueva si es necesario
  getParticle(color) {
    let particle;
    if (this.pool.length > 0) {
      particle = this.pool.pop();
    } else {
      const geometry = new THREE.SphereGeometry(0.4, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      particle = new THREE.Mesh(geometry, material);
    }
    particle.material.color.copy(color);
    particle.material.opacity = 1;
    particle.visible = true;
    this.scene.add(particle);
    return particle;
  }

  // Devuelve la partícula al pool
  releaseParticle(particle) {
    particle.visible = false;
    this.scene.remove(particle);
    this.pool.push(particle);
  }
}

class Firework {
  constructor(scene, particlePool) {
    this.scene = scene;
    this.particlePool = particlePool;
    this.group = new THREE.Group();

    // Posición de partida: con ligero offset para variedad
    const spawnX = (Math.random() - 0.5) * 100;
    const spawnZ = (Math.random() - 0.5) * 100;
    this.group.position.set(spawnX, 0, spawnZ);

    // Creamos el cubo que ascenderá
    const size = 0.3;
    this.geometry = new THREE.BoxGeometry(size, size, size);
    // Color vibrante aleatorio en HSL
    const hue = Math.random();
    this.color = new THREE.Color();
    this.color.setHSL(hue, 0.5, 0.5);
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.color,
      emissiveIntensity: 5,
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.cube);

    // Rotaciones aleatorias para mayor dinamismo
    this.cube.rotation.set(
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 1
    );

    // Estado y parámetros de la animación
    this.state = 'ascending'; // estados: ascending, exploded, finished
    this.speed = 5 + Math.random() * 5; // velocidad de ascenso
    this.explosionHeight = 20 + Math.random() * 5; // altura a la que explota
    this.explosionStarted = false;
    this.explosionStartTime = 0;
    this.explosionDuration = 2.0; // duración de la explosión en segundos
    this.explosionPieces = []; // piezas de la explosión

    // Para el rastro (trail) se guarda la información de la partícula y el tiempo de creación
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
      
      for (let piece of this.explosionPieces) {
        // Movimiento en su dirección asignada
        piece.mesh.position.addScaledVector(piece.direction, delta * 2);
        // Reducimos la escala de forma gradual
        piece.mesh.scale.multiplyScalar(1 - delta);
        // Desvanece la opacidad si es transparente
        if (piece.mesh.material.transparent) {
          piece.mesh.material.opacity = Math.max(0, piece.mesh.material.opacity - delta);
        }
      }
      // Disminuye la intensidad de la luz
      this.light.intensity = Math.max(0, 10 * (1 - elapsed / this.explosionDuration));

      // Una vez transcurrida la duración, se marca como terminado
      if (elapsed >= this.explosionDuration) {
        this.dispose();
        this.state = 'finished';
      }
    }
    // Actualiza las partículas del rastro (trail)
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const particleInfo = this.trailParticles[i];
      const age = timeNow - particleInfo.creationTime;
      const lifetime = 0.5; // duración de la partícula
      if (age > lifetime) {
        // Se libera la partícula al pool
        this.particlePool.releaseParticle(particleInfo.mesh);
        this.trailParticles.splice(i, 1);
      } else {
        // Desvanece progresivamente
        particleInfo.mesh.material.opacity = 1 - (age / lifetime);
      }
    }
  }

  spawnTrailParticle(timeNow) {
    // Se obtiene una partícula del pool
    const particleMesh = this.particlePool.getParticle(this.color);
    // Se posiciona donde está el cubo en ese momento
    particleMesh.position.copy(this.group.position);
    // Se guarda la información de la partícula y su tiempo de creación
    this.trailParticles.push({ mesh: particleMesh, creationTime: timeNow });
  }

  triggerExplosion(timeNow) {
    if (this.explosionStarted) return;
    this.explosionStarted = true;
    // Se elimina el cubo ascendente y se liberan recursos
    this.group.remove(this.cube);
    this.geometry.dispose();
    this.material.dispose();

    // Direcciones para cada cara del cubo (se usan para la explosión)
    const directions = [
      new THREE.Vector3(1, 0, 0),   // derecha
      new THREE.Vector3(-1, 0, 0),  // izquierda
      new THREE.Vector3(0, 1, 0),   // arriba
      new THREE.Vector3(0, -1, 0),  // abajo
      new THREE.Vector3(0, 0, 1),   // frente
      new THREE.Vector3(0, 0, -1),  // atrás
    ];

    const size = 0.5;
    for (let dir of directions) {
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshStandardMaterial({
        color: this.color,
        emissive: this.color,
        emissiveIntensity: 5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      });
      const faceMesh = new THREE.Mesh(geometry, material);
      // Orientamos la cara para que mire en la dirección de la explosión
      faceMesh.lookAt(dir);
      faceMesh.position.set(0, 0, 0);
      this.group.add(faceMesh);
      this.explosionPieces.push({
        mesh: faceMesh,
        direction: dir.clone().normalize().multiplyScalar(1 + Math.random())
      });
    }
    this.explosionStartTime = timeNow;
    this.state = 'exploded';
  }

  dispose() {
    // Limpiar las piezas de la explosión
    for (let piece of this.explosionPieces) {
      this.group.remove(piece.mesh);
      if (piece.mesh.geometry) piece.mesh.geometry.dispose();
      if (piece.mesh.material) piece.mesh.material.dispose();
    }
    this.explosionPieces = [];

    // Liberar las partículas restantes del rastro
    for (let particleInfo of this.trailParticles) {
      this.particlePool.releaseParticle(particleInfo.mesh);
    }
    this.trailParticles = [];

    // Remover la luz y el grupo de la escena
    this.group.remove(this.light);
    this.scene.remove(this.group);
  }
}

class FireworksManager {
  constructor(scene) {
    this.scene = scene;
    // Se crea un pool compartido para las partículas
    this.particlePool = new ParticlePool(scene, 200);
    this.fireworks = [];
    this.spawnInterval = 4; // Intervalo de creación (segundos)
    this.elapsedTime = 0.5;
    // Límite de fuegos artificiales activos para evitar saturar la escena
    this.maxFireworks = 10;
  }

  update(delta) {
    const timeNow = performance.now() / 1000; // tiempo actual en segundos

    // Actualizar cada fuego artificial
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.update(delta, timeNow);
      if (fw.state === 'finished') {
        this.fireworks.splice(i, 1);
      }
    }

    // Generar nuevos fuegos artificiales si no se supera el límite
    this.elapsedTime += delta;
    if (this.elapsedTime >= this.spawnInterval && this.fireworks.length < this.maxFireworks) {
      this.spawnFirework();
      this.elapsedTime = 0;
    }
  }

  spawnFirework() {
    const fw = new Firework(this.scene, this.particlePool);
    this.fireworks.push(fw);
  }
}

export { FireworksManager };
