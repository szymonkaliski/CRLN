const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
const glslify = require("glslify");

global.THREE = THREE;
const GPUComputationRender = require("./lib/gpu-computation-renderer");

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x222222);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

// cam
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

camera.position.z = -300;

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enableZoom = true;

// scene
const scene = new THREE.Scene();

// gpu compute
const gpuSize = 1024;
const gpuCompute = new GPUComputationRender(gpuSize, gpuSize, renderer);

const randomSpherePoint = (r = 100) => {
  const randomDirection = new THREE.Vector3(
    Math.random() - 1 / 2,
    Math.random() - 1 / 2,
    Math.random() - 1 / 2
  ).normalize();

  const randomR = Math.random() * (1 + r);

  return randomDirection.multiplyScalar(randomR);
};

const fillTexture = (texture, callback) => {
  var array = texture.image.data;

  for (var k = 0, kl = array.length; k < kl; k += 4) {
    callback(array, k);
  }
};

const positionTexture = gpuCompute.createTexture();
const orgPositionTexture = gpuCompute.createTexture();
const velocityTexture = gpuCompute.createTexture();

fillTexture(positionTexture, (arr, i) => {
  const randomPoint = randomSpherePoint(30);

  arr[i + 0] = randomPoint.x;
  arr[i + 1] = randomPoint.y;
  arr[i + 2] = randomPoint.z;
  arr[i + 3] = 1;
});

fillTexture(orgPositionTexture, (arr, i) => {
  arr[i + 0] = positionTexture.image.data[i + 0]
  arr[i + 1] = positionTexture.image.data[i + 1]
  arr[i + 2] = positionTexture.image.data[i + 2]
  arr[i + 3] = positionTexture.image.data[i + 3]
});

fillTexture(velocityTexture, (arr, i) => {
  arr[i + 0] = (Math.random() - 1 / 2) * 2.0;
  arr[i + 1] = (Math.random() - 1 / 2) * 2.0;
  arr[i + 2] = (Math.random() - 1 / 2) * 2.0;
  arr[i + 3] = 1;
});

const positionVar = gpuCompute.addVariable(
  "texturePositions",
  glslify("./glsl/simulation-position.frag"),
  positionTexture
);

const velocityVar = gpuCompute.addVariable(
  "textureVelocities",
  glslify("./glsl/simulation-velocity.frag"),
  velocityTexture
);

velocityVar.material.uniforms.t = { value: 0 };
positionVar.material.uniforms.orgPositions = { value: orgPositionTexture };

gpuCompute.setVariableDependencies(velocityVar, [velocityVar, positionVar]);
gpuCompute.setVariableDependencies(positionVar, [velocityVar, positionVar]);

const error = gpuCompute.init();
if (error !== null) {
  console.error(error);
}

// particles
const renderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    texturePositions: { value: null }
  },
  vertexShader: glslify("./glsl/render.vert"),
  fragmentShader: glslify("./glsl/render.frag"),
  transparent: true,
  side: THREE.DoubleSide
});

// particles geometry
const geometry = new THREE.BufferGeometry();
const len = gpuSize * gpuSize;
let vertices = new Float32Array(len * 3);

for (let i = 0; i < len; i++) {
  const i3 = i * 3;

  vertices[i3] = (i % gpuSize) / gpuSize;
  vertices[i3 + 1] = i / gpuSize / gpuSize;
}

geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));

// render the particles
const particles = new THREE.Points(geometry, renderMaterial);
scene.add(particles);

const loop = () => {
  requestAnimationFrame(loop);

  const currentT = performance.now();

  gpuCompute.compute();

  renderMaterial.uniforms.texturePositions.value = gpuCompute.getCurrentRenderTarget(
    positionVar
  ).texture;

  velocityVar.material.uniforms.t = { value: currentT };

  renderer.render(scene, camera);
};

loop();

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onWindowResize, false);
