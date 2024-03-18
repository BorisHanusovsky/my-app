import { LayerType } from "./components/layers/layerEnum";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import { getStorage,ref,getDownloadURL,uploadBytes } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const tf = require('@tensorflow/tfjs');

let model;
let trainingCompleted = false
const app = firebase.initializeApp({
    apiKey: "AIzaSyCUQIQ2L3LSV_5cPtSZ97pRWBzxdgvXWHY",
    authDomain: "borisssfirebase.firebaseapp.com",
    projectId: "borisssfirebase",
    storageBucket: "borisssfirebase.appspot.com",
    messagingSenderId: "468959726053",
    appId: "1:468959726053:web:aa97f1f9484cbaedb1470c"
  });

  export async function getModelNames() {
    try {
      const result = await firebase.storage().ref().listAll();
      let modelNames = [];
  
      result.prefixes.forEach(function (prefix) {
        console.log(prefix.name);
        modelNames.push(prefix.name);
      });
  
      return modelNames;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

export async function downloadModel(modelName) {
    const storageRef = firebase.storage().ref();
    
    //var modelRef = storageRef.child(`Convolucka/Convolucka.json`);
    var modelRef = storageRef.child(`${modelName.current}/${modelName.current}.json`);
    //var modelRef = storageRef.child(`tfjs_model/model.json`);
    console.log(modelRef);
    try {
      // Get the download URL
      const url = await modelRef.getDownloadURL();
      console.log(url);
  
      // Assuming `model` is declared in the outer scope
      //model = await tf.loadLayersModel('https://firebasestorage.googleapis.com/v0/b/borisssfirebase.appspot.com/o/modelik%2Fmodelik.json?alt=media&token=05dad239-a402-4d49-92e9-fad049ddc440');
      model = await tf.loadLayersModel(url);
      console.log(model)
  
      // Insert url into an <img> tag to "download"
      // var img = document.getElementById('myimg');
      // img.setAttribute('src', url);
    } catch (error) {
      // Handle errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
        default:
          // Handle other errors
      }
    }
  }

export function createModel() {
    model = tf.sequential();
}

export function compileModel(){
    console.log(model);
    try{
      model.compile({ optimizer: 'adam',loss: 'categoricalCrossentropy', metrics: ['accuracy']});
      return true;
    }
    catch(err){
      alert(`❌❌ Model compilation failed❌❌\n ${err}`);
      return false;
    }
}

async function uploadModelArtifacts(modelName, jsonFile, binFile) {
    // Upload JSON and binary files to Firebase Storage
    const blob1 = new Blob([jsonFile], { type: 'application/json' });
    const blob2 = new Blob([binFile], { type: 'application/octet-stream' });

    const storageRef = firebase.storage().ref();
    const jsonRef = storageRef.child(`${modelName}/${modelName}.json`);
    const task1 = jsonRef.put(blob1)
    task1.then(snapshot => {
      console.log(snapshot);
    })
    const binRef = storageRef.child(`${modelName}/${modelName}.weights.bin`);
    const task2 = binRef.put(blob2)
    task2.then(snapshot => {
      console.log(snapshot);
    })
}

export async function saveModel(modelName) {
  try{
      let jsonFile, binFile;
      const customSaveHandler = async (modelArtifacts) => {
          const { modelTopology, weightSpecs, weightData } = modelArtifacts;
          jsonFile = JSON.stringify({ modelTopology, weightSpecs });
          binFile = new Uint8Array(weightData);
          return { modelTopology, weightSpecs, weightData };
      };

      await model.save(tf.io.withSaveHandler(customSaveHandler));
      await uploadModelArtifacts(modelName, jsonFile, binFile)
      return Promise.resolve("✅ Model saved successfully! ✅");
  }
  catch(err){
    return Promise.reject(`❌❌ Failed saving model❌❌\n ${err}`);
  }
}

export async function preprocessData(rawData) {
  // Example preprocessing: normalize image data to [0, 1]
  return tf.div(tf.tensor4d(rawData), 255);
}

// export async function predictModel(model, data) {
//   const processedData = await preprocessData(data.images);
//   const predictions = model.predict(processedData);
//   // Optionally, process predictions here (e.g., decode the output)
//   return predictions;
// }

// export function getModelActivations(model, layerNames) {
//   // Create a new model that outputs activations from intermediate layers
//   const outputs = layerNames.map(name => model.getLayer(name).output);
//   const activationModel = tf.model({inputs: model.input, outputs});
//   return activationModel;
// }

// export async function generateActivationMaps(modelName, data) {
//   await downloadModel(modelName);
//   // Assuming 'model' is now the loaded model
  

//   const processedData = await preprocessData(data.images[0]); // Process a single image
//   const activations = activationModel.predict(processedData);

//   // 'activations' now contains the activation maps from the specified layers
//   // You can process or visualize these as needed
//   return activations;
// }

export async function testModel(modelName, data){
  await downloadModel(modelName);
  model.predict(tf.tensor4d(data.images[0]), data.labels[0] );
}

export async function trainAndFetchActivations(modelName) {
  try {
    if (!modelName) { // Assuming you meant to check modelName here
      alert("No model defined");
      return;
    }
    const training = await trainModel(modelName);
    if (training){
      // Make sure this function handles errors/exceptions appropriately
      await waitForTrainingToComplete(); // Ensure this waits or polls until training is actually complete
      const activations = await fetchActivations(); // This should correctly fetch or return null/undefined on failure
      return activations; // This could be null/undefined if fetching failed
    }
   
  } catch (error) {
    console.error("An error occurred during training or fetching weights:", error);
    // Handle the error, possibly by alerting the user or updating the state
    return null; // Ensure the caller knows an error occurred
  }
}
//const ip = '34.141.198.60'
const ip = process.env.IP

export async function trainModel(modelName) {
  try {
    await fetch(`http://${ip}:5000/train`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'dir': modelName})
    });
    return true;
  } catch (error) {
    alert('Server not running');
    return false;
  }
}

async function waitForTrainingToComplete() {
  while (!trainingCompleted) {
    await checkTrainingStatus();
    if (!trainingCompleted) {
      // Wait for some time before checking again
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
    }
  }
  console.log("Training has completed2.");
  // Proceed to fetch weights or handle completion
}

async function checkTrainingStatus() {
  try {
    const response = await fetch(`http://${ip}:5000/status`);
    const statusData = await response.json();
    const train_acc = statusData.trainAccuracy;
    const val_acc = statusData.valAccuracy;
    if (statusData.status === 'completed') {
      console.log("Training completed1");
      trainingCompleted = true
      return true;
    } else {
      console.log("Training still in progress");
      return false;
    }
  } catch (error) {
    console.error('Error checking training status:', error);
    throw error;
  }
}

async function fetchActivations() {
  return new Promise((resolve, reject) => {
    fetch(`http://${ip}:5000/activations`)
      .then(response => response.json())
      .then(data => {
        console.log('Images:', data.images);
        console.log('Labels:', data.labels);
        console.log('Activations:', data.activations);
        console.log('History:', data.history);
        
        let firstImage = data.images[0];
        let firstLabel = data.labels[0];
        console.log('First image data:', firstImage);
        console.log('First label:', firstLabel);
        resolve(data); // Resolve the promise with the fetched data
      })
      .catch(error => {
        console.error('Error fetching or parsing the JSON file:', error);
        reject(error); // Reject the promise if an error occurs
      });
  });
}

export async function importModel(modelName) {
    try {
      await downloadModel(modelName);
      return model_to_layers();
    } catch (error) {
      console.error("Error importing model:", error);
      throw error; // Propagate the error to the caller
    }
  }

export function add_model_layer(layer) {
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let nlayer;
    try{
      switch (layer.type) {
        case LayerType.DENSE:
            nlayer = tf.layers.dense({ units: layer.numOfNeurons, activation: layer.activationType, batchInputShape: layer.inputShape});
            break;
        case LayerType.CONV:
            nlayer = tf.layers.conv2d({ filters: layer.numOfKernels, kernelSize: layer.kernelSize, strides : layer.strides, padding : layer.padding, activation: layer.activationType, batchInputShape: layer.inputShape});
            break;
        case LayerType.MAXP:
            nlayer = tf.layers.maxPool2d({poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding,batchInputShape: layer.inputShape});
            break;
        case LayerType.AVGP:
            nlayer = tf.layers.avgPool2d({poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, batchInputShape: layer.inputShape});
            break;
        case LayerType.DROP:
            nlayer = tf.layers.dropout({rate : layer.rate});
            break;
        case LayerType.FLATTEN:
            nlayer = tf.layers.flatten();
            break;
        default:
            console.log('Unknown layer type');
    }
    model.add(nlayer)
    }
    catch(err){
      alert(`❌❌ Layer could not be added to model❌❌\n ${err}`);
    }
}

function model_to_layers() {
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let layers = [];
    let i = 0;
    model.layers.forEach(layer => {
        let shape = i === 0 ? layer.batchInputShape : undefined
        switch(layer.constructor.className){
            case LayerType.DENSE:
                layers.push({ index : i, type : 'Dense', numOfNeurons : layer.units, activationType : layer.activation.constructor.className, inputShape : shape});
                i++;
                break;
            case LayerType.CONV:
                layers.push({index : i, type : LayerType.CONV, numOfKernels : layer.filters, kernelSize: layer.kernelSize, strides : layer.strides, padding : layer.padding, activationType: layer.activation.constructor.className, inputShape : shape})
                i++;
                break;
            case 'MaxPooling2D':
                layers.push({index : i, type : LayerType.MAXP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, inputShape : shape})
                i++;
                break;
            case 'AveragePooling2D':
                layers.push({index : i, type : LayerType.AVGP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, inputShape : shape})
                i++;
                break;
            case LayerType.DROP:
                layers.push({index : i, type : LayerType.DROP, rate : layer.rate})
                i++;
                break;
            case LayerType.FLATTEN:
                layers.push({index : i, type : LayerType.FLATTEN})
                i++;
                break;
        }
    })
    return layers
}

