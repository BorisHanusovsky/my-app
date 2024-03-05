import { LayerType } from "./components/layers/layerEnum";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import { getStorage,ref,getDownloadURL,uploadBytes } from "firebase/storage";
const tf = require('@tensorflow/tfjs');

let model;
let layers;
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
    var modelRef = storageRef.child(`${modelName.current}/${modelName.current}.json`);
  
    try {
      // Get the download URL
      const url = await modelRef.getDownloadURL();
      console.log(url);
  
      // Assuming `model` is declared in the outer scope
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

export async function saveModel(modelName) {
  try{
    let jsonFile, binFile;
    // Custom save handler
    const customSaveHandler = async (modelArtifacts) => {
      // Access the model artifacts before saving
      console.log('Model Artifacts:', modelArtifacts);

      // Extract the JSON and binary data
      const { modelTopology, weightSpecs, weightData } = modelArtifacts;

      // Convert the JSON and binary data to strings
      jsonFile = JSON.stringify({ modelTopology, weightSpecs });
      binFile = new Uint8Array(weightData);

      // You can perform additional processing or return the artifacts
      // Return the modified modelArtifacts to continue with the default saving process
      return { modelTopology, weightSpecs, weightData };
    };

    // Use withSaveHandler to apply the custom save handler
    const saveResult = await model.save(tf.io.withSaveHandler(customSaveHandler));
    const blob1 = new Blob([jsonFile], { type: 'application/json' });
    const blob2 = new Blob([binFile], { type: 'application/octet-stream' });

    // The jsonFile and binFile variables now contain the model artifacts
    console.log('JSON File:', jsonFile);
    console.log('Binary File:', binFile);

    const storageRef = firebase.storage().ref();
    const horseRef1 = storageRef.child(`${modelName}/${modelName}.json`);
    const task1 = horseRef1.put(blob1)
    task1.then(snapshot => {
      console.log(snapshot);
    })
    const horseRef2 = storageRef.child(`${modelName}/${modelName}.weights.bin`);
    const task2 = horseRef2.put(blob2)
    task2.then(snapshot => {
      console.log(snapshot);
    })
    return Promise.resolve("✅ Model saved successfully! ✅");
  }
  catch(err){
    return Promise.reject(`❌❌ Failed saving model❌❌\n ${err}`);
  }
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
            nlayer = tf.layers.conv2d({ filters: layer.numOfKernels, kernelSize: layer.kernelSize, strides : layer.strides, padding : layer.padding, activation: layer.activationType,batchInputShape: layer.inputShape});
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
   
    console.log(model);
}

function model_to_layers() {
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let layers = [];
    let i = 0;
    model.layers.forEach(layer => {
        switch(layer.constructor.className){
            case LayerType.DENSE:
                layers.push({ index : i, type : 'Dense', numOfNeurons : layer.units, activationType : layer.activation.constructor.className, inputShape : layer.batchInputShape});
                break;
            case LayerType.CONV:
                layers.push({index : i, type : LayerType.CONV, numOfKernels : layer.filters, kernelSize: layer.kernelSize, strides : layer.strides, padding : layer.padding, activationType: layer.activation.constructor.className, inputShape : layer.batchInputShape})
                break;
            case 'MaxPooling2D':
                layers.push({index : i, type : LayerType.MAXP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, inputShape : layer.batchInputShape})
                break;
            case 'AveragePooling2D':
                layers.push({index : i, type : LayerType.AVGP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, inputShape : layer.batchInputShape})
                break;
            case LayerType.DROP:
                layers.push({index : i, type : LayerType.DROP, rate : layer.rate})
                break;
            case LayerType.FLATTEN:
                layers.push({index : i, type : LayerType.FLATTEN})
                break;
        }
        i++;
    })
    return layers
}

