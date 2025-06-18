// DNA Animation System Based on CodePen
class DNAAnimation {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.options = {
      particleCount: 24,
      radius: 4,
      height: 10,
      color: 0x07beb8, // Cyan color
      opacity: options.opacity || 1,
      scale: options.scale || 1,
      speed: options.speed || 1,
      ...options,
    };

    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.createDNA();
    this.animate();
    this.setupResize();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.particleGroup = new THREE.Object3D();
    this.scene.add(this.particleGroup);
  }

  setupCamera() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 15 * this.options.scale;
    this.camera.position.y = 0;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent background
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x07beb8, 1, 100);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);
  }

  createDNA() {
    this.particles = [];
    this.lines = [];

    // Create sphere geometry for particles
    const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);

    // Create particles
    for (let i = 0; i < this.options.particleCount; i++) {
      // Left strand particle
      const leftMaterial = new THREE.MeshBasicMaterial({
        color: this.options.color,
        transparent: true,
        opacity: this.options.opacity,
      });
      const leftParticle = new THREE.Mesh(sphereGeometry, leftMaterial);

      // Right strand particle
      const rightMaterial = new THREE.MeshBasicMaterial({
        color: this.options.color,
        transparent: true,
        opacity: this.options.opacity,
      });
      const rightParticle = new THREE.Mesh(sphereGeometry, rightMaterial);

      this.particleGroup.add(leftParticle);
      this.particleGroup.add(rightParticle);

      this.particles.push({
        left: leftParticle,
        right: rightParticle,
        order: i / (this.options.particleCount - 1),
      });

      // Create connecting line
      const lineGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points * 3 coordinates
      lineGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const lineMaterial = new THREE.LineBasicMaterial({
        color: this.options.color,
        transparent: true,
        opacity: this.options.opacity * 0.5,
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.particleGroup.add(line);
      this.lines.push(line);
    }

    this.particleGroup.scale.set(
      this.options.scale,
      this.options.scale,
      this.options.scale
    );
  }

  updateParticles() {
    const elapsedTime = this.clock.getElapsedTime() * this.options.speed;

    this.particles.forEach((particle, index) => {
      // Calculate spiral positions
      const angle =
        Math.cos(0.002 * elapsedTime * 1000) * (1.5 * Math.PI) * particle.order;
      const oppositeAngle = angle + Math.PI;

      // Left strand
      const leftX = Math.cos(angle) * this.options.radius;
      const leftY = this.map(
        particle.order,
        0,
        1,
        -this.options.height,
        this.options.height
      );
      const leftZ = Math.sin(angle) * this.options.radius;

      particle.left.position.set(leftX, leftY, leftZ);

      // Right strand
      const rightX = Math.cos(oppositeAngle) * this.options.radius;
      const rightZ = Math.sin(oppositeAngle) * this.options.radius;

      particle.right.position.set(rightX, leftY, rightZ);

      // Oscillating scale
      const scaleOsc = 0.8 + 0.4 * Math.sin(elapsedTime * 3 + index * 0.5);
      particle.left.scale.setScalar(scaleOsc);
      particle.right.scale.setScalar(scaleOsc);

      // Update connecting line
      const line = this.lines[index];
      const positions = line.geometry.attributes.position.array;

      positions[0] = leftX;
      positions[1] = leftY;
      positions[2] = leftZ;
      positions[3] = rightX;
      positions[4] = leftY;
      positions[5] = rightZ;

      line.geometry.attributes.position.needsUpdate = true;
    });

    // Rotate the entire DNA structure
    this.particleGroup.rotation.z =
      Math.sin(0.002 * elapsedTime * 1000) * Math.PI * 0.25;
    this.particleGroup.rotation.y = elapsedTime * 0.2;
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  animate() {
    this.updateParticles();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  setupResize() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
    });

    resizeObserver.observe(this.canvas);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Initialize DNA animations when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Hero DNA Animation
  const heroDNA = new DNAAnimation("dna-canvas-hero", {
    opacity: 0.9,
    scale: 1.2,
    speed: 0.3,
  });

  // About DNA Animation
  const aboutDNA = new DNAAnimation("dna-canvas-about", {
    opacity: 0.6,
    scale: 0.8,
    speed: 0.25,
  });

  // Science DNA Animation
  const scienceDNA = new DNAAnimation("dna-canvas-science", {
    opacity: 1,
    scale: 1.5,
    speed: 0.35,
  });

  // Speakers DNA Animation
  const speakersDNA = new DNAAnimation("dna-canvas-speakers", {
    opacity: 0.4,
    scale: 0.6,
    speed: 0.2,
  });

  // CTA DNA Animation
  const ctaDNA = new DNAAnimation("dna-canvas-cta", {
    opacity: 0.7,
    scale: 0.9,
    speed: 0.28,
  });

  // Hide animations on mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const heroCanvas = document.getElementById("dna-canvas-hero");
    const aboutCanvas = document.getElementById("dna-canvas-about");
    const speakersCanvas = document.getElementById("dna-canvas-speakers");
    const ctaCanvas = document.getElementById("dna-canvas-cta");

    if (heroCanvas) heroCanvas.style.display = "none";
    if (aboutCanvas) aboutCanvas.style.display = "none";
    if (speakersCanvas) speakersCanvas.style.display = "none";
    if (ctaCanvas) ctaCanvas.style.display = "none";
  }
});

// Export for potential external use
window.DNAAnimation = DNAAnimation;
