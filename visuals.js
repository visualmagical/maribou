let container;
let camera, scene, renderer, group;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  // create environment
  container = document.querySelector('.container');
  document.body.appendChild(container);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.z = 1000;
  scene.add(camera);

  // add renderer
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMapEnabled = true;
  container.appendChild(renderer.domElement);

  // let in the light
  const ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xaaaaaa);
  spotLight.position.set(2000, 2000, 2000);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const spotLight2 = new THREE.SpotLight(0xcccccc);
  spotLight2.position.set(1000, 1000, 1000);
  scene.add(spotLight2);

  // let lead characters get together in a group
  group = new THREE.Group();
  scene.add(group);
  // create our guys
  for (let i = 0; i < amount; i++) {
    addAtom();
  }

  // let user participate in the show
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

// create each atom
function addAtom() {
  const atomSize = 1;
  const texture = new THREE.TextureLoader().load("./img/sand1.jpg");
  const atomGeometry = new THREE.SphereGeometry(atomSize, 32, 32);
  const atomMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, map: texture});
  const atom = new THREE.Mesh(atomGeometry, atomMaterial);
  atom.rotation.x = atom.rotation.y = atom.rotation.z = Math.random()*Math.PI;
  atom.castShadow = true;
  atom.name = "atom-" + scene.children.length;

  // position the atom randomly in the scene
  atom.position.x = Math.random() * 1000 - 500;
  atom.position.y = Math.random() * 1000 - 500;
  atom.position.z = Math.random() * 1000 - 500;

  // add the atom to the scene
  group.add(atom);
}

// magic starts here
function animate() {
  analyser.getByteFrequencyData(fData);
  const children = group.children;

  for (let i = 0; i < amount; i++) {
    // our people
    const child = children[i];

    // scale them according to frequency and prevent zero scaling
    if (fData[i] < 3) {
      child.scale.x = child.scale.y = child.scale.z = 3;
    } else {
      child.scale.x = child.scale.y = child.scale.z = fData[i] / 5;
    }

    // don't let these guys go though each other
    const colliders = children.filter((item, j) => (j !== i));
    colliders.forEach(item => {
      if (child.position.distanceTo(item.position) < 70) {
        child.position.x += 100;
        child.position.y += 50;
        child.position.z += 50;
      }
    })

    // play with colours
    if (!audioElement.paused) {
      // if (audioElement.currentTime < 150) {
        child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
      // }
      // if (audioElement.currentTime >= 150 && audioElement.currentTime < 210.09) {
      //   let clearCol = renderer.getClearColor();
      //   renderer.setClearColor(new THREE.Color(clearCol.r + 0.00002, clearCol.g + 0.00002, clearCol.b + 0.00002));
      // }
      // if (audioElement.currentTime >= 158.1 && audioElement.currentTime < 210.09) {
      //   child.material.color = new THREE.Color('hsl(0, 50%, 50%)');
      //   // child.material.color = new THREE.Color(`hsl(0, 0%, 70%)`);
      //   renderer.setClearColor(new THREE.Color(0xffffff));
      // }
      // if (audioElement.currentTime >= 210.09) {
      //   renderer.setClearColor(new THREE.Color(0x000000));
      //   child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
      // }
      // if (audioElement.currentTime >= 211) {
      //   child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
      // }
    }
  }
  requestAnimationFrame(animate);
  render();
}

// draw our piece
function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  group.rotation.x += 0.005;
  renderer.render(scene, camera);
}

// actions for interactions
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    // event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
