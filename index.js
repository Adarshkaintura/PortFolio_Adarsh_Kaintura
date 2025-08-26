// Three.js Black Hole Animation
let scene, camera, renderer, blackHole, stars;

function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create black hole
  const blackHoleGeometry = new THREE.SphereGeometry(2, 32, 32);
  const blackHoleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
    },
    vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
    fragmentShader: `
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        vec2 center = vec2(0.5, 0.5);
                        float dist = distance(vUv, center);
                        float angle = atan(vUv.y - center.y, vUv.x - center.x);
                        float spiral = sin(angle * 8.0 + time * 2.0 - dist * 20.0);
                        float intensity = (1.0 - dist) * (0.5 + 0.5 * spiral);
                        gl_FragColor = vec4(0.2, 0.4, intensity, 1.0);
                    }
                `,
  });
  blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
  scene.add(blackHole);

  // Create stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 10000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const starsMaterial = new THREE.PointsMaterial({ color: 0x4a90e2, size: 2 });
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  camera.position.z = 10;
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate black hole
  blackHole.rotation.z += 0.01;
  blackHole.material.uniforms.time.value += 0.05;

  // Rotate stars
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.001;

  renderer.render(scene, camera);
}

// Initialize Three.js
initThreeJS();
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Form submission
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  alert(
    `Message transmitted successfully!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nReason: ${data.reason}\n\nI'll establish connection soon!`
  );
  event.target.reset();
}

// Resume download
function downloadResume() {
  alert(
    "Resume download initiated! 🚀\n\nIn a real implementation, this would download your actual resume PDF file."
  );
}

// Smooth scrolling for links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Add scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe project cards
document.querySelectorAll(".project-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(50px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});
