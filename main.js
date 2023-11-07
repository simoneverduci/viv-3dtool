import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let gui;

// SETTINGS
let debug = true;
const params = {
  materialColor: "#ffeded",
  specularColor: '#808080', // Default grey specular
  shininess: 30,
  reflectivity: 0.5,
  opacity : 1,
  // Light properties
  ambientLightColor: 0xd86148,
  ambientLightIntensity: 1.44,
  directionalLightColor: 0x60d15d,
  directionalLight2Color: 0xff0000,
  directionalLightIntensity: 3,
  directionalLight2Intensity: 3,
  directionalLightX: 1,
  directionalLightY: 1,
  directionalLightZ: 1,
  directionalLight2X: 1,
  directionalLight2Y: 1,
  directionalLight2Z: -5,
  
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// SCENE
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // for softer shadows


document.querySelector("#app").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, sizes.width / sizes.height, 1, 1100 );
camera.position.z = 4;

// controls
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.enableZoom = false;
// controls.enableRotate = false;

// LIGHT
const ambientLight = new THREE.AmbientLight(params.ambientLightColor, params.ambientLightIntensity);
const directionalLight = new THREE.DirectionalLight(params.directionalLightColor, params.directionalLightIntensity);
directionalLight.position.set(params.directionalLightX, params.directionalLightY, params.directionalLightZ);
directionalLight.castShadow = true;
const directionalLight2 = new THREE.DirectionalLight(params.directionalLight2Color, params.directionalLightIntensity2);
directionalLight2.position.set(params.directionalLight2X, params.directionalLight2Y, params.directionalLight2Z);
directionalLight2.castShadow = true;

scene.add(ambientLight, directionalLight, directionalLight2);

// GLTF
let model0, model1, model2;
const loader = new GLTFLoader();

// toon mat
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("./texture3.jpg");
const normalTexture = textureLoader.load('./download.jpeg'); // Replace with your normal map file
normalTexture.wrapS = THREE.RepeatWrapping;
normalTexture.wrapT = THREE.RepeatWrapping;
normalTexture.repeat.set(75, 75); // Repeat the texture 4 times on each axis

gradientTexture.magFilter = THREE.NearestFilter;
const mainMat = new THREE.MeshPhongMaterial({
  color: new THREE.Color(params.materialColor),
  transparent:true,
  gradientMap: gradientTexture,
  normalMap: normalTexture,
  specular: new THREE.Color(params.specularColor),
  shininess: params.shininess,
  reflectivity: params.reflectivity,
  opacity: params.opacity,
});
const objDistance = 4;
const meshes = [];

// model 0
loader.load(
  "./0.glb",
  (gltf) => {
    model0 = gltf.scene;
    model0.scale.set(6, 6, 6);
    model0.position.y = -objDistance * 0;
    model0.children[0].material = mainMat;
    model0.traverse((child) => {
      if (child.isMesh) {
        child.material = mainMat;
      }
    });
    meshes.push(model0);
    scene.add(model0);
    addMeshFolder(model0, 0);

  },
  (progress) => console.log("loading model..."),
  (error) => console.log(error)
);

// model 1
loader.load(
  "./1.glb",
  (gltf) => {
    model1 = gltf.scene;
    model1.scale.set(6, 6, 6);
    model1.position.y = -objDistance * 1;
    model1.children[0].material = mainMat;
    model1.traverse((child) => {
      if (child.isMesh) {
        child.material = mainMat;
      }
    });
    meshes.push(model1);
    scene.add(model1);
    addMeshFolder(model1, 1);
  },
  (progress) => console.log("loading model..."),
  (error) => console.log(error)
);

// model 2
loader.load(
  "./2.glb",
  (gltf) => {
    model2 = gltf.scene;
    model2.scale.set(6, 6, 6);
    model2.position.y = -objDistance * 2;
    model2.children[0].material = mainMat;
    model2.traverse((child) => {
      if (child.isMesh) {
        child.material = mainMat;
      }
    });
    meshes.push(model2);
    scene.add(model2);
    addMeshFolder(model2, 2);
  },
  (progress) => console.log("loading model..."),
  (error) => console.log(error)
);

// SCROLL
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

// CONTROLS
if (debug) {
  
  gui = new dat.GUI();
  
  gui.add({saveSettings}, 'saveSettings').name('Save Settings');
  gui.add({loadSettings}, 'loadSettings').name('Load Settings');
  gui.add(camera, "fov", 0, 200).onChange((value) => {
    camera.fov = value;
    camera.updateProjectionMatrix();
  });

  // Add material color control
  gui.addColor(params, "materialColor").onChange((value) => {
    mainMat.color.set(value);
  });

  // Add specular color control
  gui.addColor(params, "specularColor").onChange((value) => {
    mainMat.specular.set(value);
  });

  // Add shininess control
  gui.add(params, "shininess", 0, 100).onChange((value) => {
    mainMat.shininess = value;
  });

  // Add reflectivity control
  gui.add(params, "reflectivity", 0, 1).onChange((value) => {
    mainMat.reflectivity = value;
  });
   // Add reflectivity control
   gui.add(params, "opacity", 0, 1).onChange((value) => {
    mainMat.opacity = value;
  });
 // Ambient Light Controls
 gui.addColor(params, 'ambientLightColor').onChange(value => {
  ambientLight.color.set(value);
});
gui.add(params, 'ambientLightIntensity', 0, 10).onChange(value => {
  ambientLight.intensity = value;
});

// Directional Light Controls
gui.addColor(params, 'directionalLightColor').onChange(value => {
  
  directionalLight.color.set(value); // Assuming both directional lights should have the same color
});gui.addColor(params, 'directionalLight2Color').onChange(value => {
  
  directionalLight2.color.set(value); // Assuming both directional lights should have the same color
});
gui.add(params, 'directionalLightIntensity', 0, 10).onChange(value => {
  directionalLight.intensity = value;
});
gui.add(params, 'directionalLight2Intensity', 0, 10).onChange(value => {
 
  directionalLight2.intensity = value;
});

// Directional Light Position Controls
const dirLightFolder = gui.addFolder('Directional Light 1 Position');
dirLightFolder.add(params, 'directionalLightX', -10, 10).onChange(value => {
  directionalLight.position.x = value;
});
dirLightFolder.add(params, 'directionalLightY', -10, 10).onChange(value => {
  directionalLight.position.y = value;
});
dirLightFolder.add(params, 'directionalLightZ', -10, 10).onChange(value => {
  directionalLight.position.z = value;
});
dirLightFolder.open(); // Open the folder by default

// Directional Light 2 Position Controls
const dirLight2Folder = gui.addFolder('Directional Light 2 Position');
dirLight2Folder.add(params, 'directionalLight2X', -10, 10).onChange(value => {
  directionalLight2.position.x = value;
});
dirLight2Folder.add(params, 'directionalLight2Y', -10, 10).onChange(value => {
  directionalLight2.position.y = value;
});
dirLight2Folder.add(params, 'directionalLight2Z', -10, 10).onChange(value => {
  directionalLight2.position.z = value;
});
dirLight2Folder.open(); // Open the folder by default
  // Add controls for any other material properties here

}

// Function to load

// Function to load the settings
function loadSettings() {
  // Create a file input element
  const fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.click(); // Click the input to open file explorer

  // Listen for file selection
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      // Read the file
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          // Parse the file content as JSON
          const loadedSettings = JSON.parse(e.target.result);

          // Update params and GUI controls
          for (const key in loadedSettings) {
            if (params.hasOwnProperty(key)) {
              params[key] = loadedSettings[key];
              if (gui.__controllers) { // Check if the gui controller exists
                gui.__controllers.forEach((controller) => {
                  if (controller.property === key) {
                    controller.setValue(loadedSettings[key]);
                  }
                });
              }
            }
          }
          if (loadedSettings.models) {
            loadedSettings.models.forEach((modelSettings, index) => {
              if (meshes[index]) {
                meshes[index].position.fromArray(modelSettings.position);
                meshes[index].rotation.fromArray(modelSettings.rotation);
                meshes[index].scale.fromArray(modelSettings.scale);
              }
            });
          }
      
          // Update lights with new settings
          if (loadedSettings.lights) {
            const [light1Settings, light2Settings] = loadedSettings.lights;
            directionalLight.position.fromArray(light1Settings.position);
            directionalLight2.position.fromArray(light2Settings.position);
          }
          // Update materials and lights with new settings
          // ... (your code to update materials and lights)

        } catch (err) {
          console.error('An error occurred while loading settings:', err);
        }
      };
      reader.readAsText(file);
    }
  });
}

function saveSettings() {
  const settings = {
    materialColor: params.materialColor,
    specularColor: params.specularColor,
    shininess: params.shininess,
    reflectivity: params.reflectivity,
    opacity: params.opacity,
    ambientLightColor: params.ambientLightColor,
    ambientLightIntensity: params.ambientLightIntensity,
    directionalLightColor: params.directionalLightColor,
    directional2LightColor: params.directional2LightColor,
    directionalLightIntensity: params.directionalLightIntensity,
    directionalLightIntensity2: params.directionalLightIntensity2,
    directionalLightX: params.directionalLightX,
    directionalLightY: params.directionalLightY,
    directionalLightZ: params.directionalLightZ,
    directionalLight2X: params.directionalLight2X,
    directionalLight2Y: params.directionalLight2Y,
    directionalLight2Z: params.directionalLight2Z,
    lights: [
      {
        position: directionalLight.position.toArray(),
      },
      {
        position: directionalLight2.position.toArray(),
      },
    ],
    models: meshes.map(mesh => ({
      position: mesh.position.toArray(), // Convert Vector3 to array
      rotation: mesh.rotation.toArray(),
      scale: mesh.scale.toArray(),
    })),
    // ... any other settings you want to save
  };

  // Convert settings object to a string
  const json = JSON.stringify(settings, null, 2);

  // Create a blob with the json data
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'settings.json');

  // Append to the body (required for Firefox)
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
// RESIZE
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ANIMATE
const clock = new THREE.Clock();
const animate = () => {

  // animate camera
  //camera.position.y = (-scrollY / sizes.height) * objDistance;

  // animate meshes
  // const elapsedTime = clock.getElapsedTime()
  // for (const mesh of meshes) {
  //   mesh.rotation.x = elapsedTime * 0.1;
  //   mesh.rotation.y = elapsedTime * 0.12;
  // }

  // controls.update();
  renderer.render(scene, camera);
  camera.updateProjectionMatrix();
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
function addMeshFolder(mesh, index) {
  const folder = gui.addFolder(`Mesh ${index}`);
  folder.add(mesh.position, 'x', -10, 10).name('Position X');
  folder.add(mesh.position, 'y', -10, 10).name('Position Y');
  folder.add(mesh.position, 'z', -10, 10).name('Position Z');
  
  folder.add(mesh.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
  folder.add(mesh.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
  folder.add(mesh.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z');
  
  folder.add(mesh.scale, 'x', 0, 10).name('Scale X');
  folder.add(mesh.scale, 'y', 0, 10).name('Scale Y');
  folder.add(mesh.scale, 'z', 0, 10).name('Scale Z');
  folder.open(); // Open the folder by default
}
