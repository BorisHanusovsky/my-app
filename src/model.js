import { LayerType } from "./components/layers/layerEnum";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut,setPersistence,browserLocalPersistence} from "firebase/auth";
import { getStorage,ref,getDownloadURL,uploadBytes } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const tf = require('@tensorflow/tfjs'); // kniznica pre pracu s tensorflow.js


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

  const auth = getAuth(app)
  setPersistence(auth,browserLocalPersistence)

export async function logIn() { // prihlasenie pouzivatela
  try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      return userCredential.user;
  } catch (error) {
      console.error("Login failed:", error);
      throw error;
  }
}

export async function logOut() { // odhlasenie pouzivatela
  try {
      await signOut(auth);
      console.log("Logout successful");
  } catch (error) {
      console.error("Logout failed:", error);
      throw error;
  }
}

  export async function getModelNames(accountName) { // ziskanie vsetkych nazvov modelov v priecinku pouzivatela
    try {
      const result = await firebase.storage().ref(accountName).listAll();
      let modelNames = [];
  
      result.prefixes.forEach(function (prefix) {
        console.log(prefix.name);
        modelNames.push(prefix.name);
      });
  
      return modelNames;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

export async function downloadModel(modelName, accountName) { // stiahnutie vybraneho modelu z priecinku pozuzivatela
    const storageRef = firebase.storage().ref();
    var modelRef = storageRef.child(`${accountName}/${modelName.current}/model.json`); // cesta k suborom v priecinku s menom pouzivatela/ menom modelu
    console.log(modelRef);
    try {
      const url = await modelRef.getDownloadURL();
      console.log(url);
      model = await tf.loadLayersModel(url);
      console.log(model)
    } catch (error) {
      switch (error.code) {
        case 'storage/object-not-found':
          break;
        case 'storage/unauthorized':
          break;
        case 'storage/canceled':
          break;
        case 'storage/unknown':
          break;
        default:
      }
    }
  }

export function createModel() { // vytvorenie instancie prazdneho sekvencneho modelu
    model = tf.sequential();
}

export function compileModel(){ // kompilacia modelu
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

async function uploadModelArtifacts(modelName, accountName, jsonFile, binFile) { // odoslanie JSON a binarneho suboru na Firebase ulozisko
    const blob1 = new Blob([jsonFile], { type: 'application/json' });
    const blob2 = new Blob([binFile], { type: 'application/octet-stream' });

    const storageRef = firebase.storage().ref();
    const jsonRef = storageRef.child(`${accountName}/${modelName}/model.json`);
    const task1 = jsonRef.put(blob1)
    task1.then(snapshot => {
      console.log(snapshot);
    })
    const binRef = storageRef.child(`${accountName}/${modelName}/model.weights.bin`);
    const task2 = binRef.put(blob2)
    task2.then(snapshot => {
      console.log(snapshot);
    })
}

export async function saveModel(modelName, accountName) { // ulozenie vytvoreneho modelu
  try{
      let jsonFile, binFile;
      const customSaveHandler = async (modelArtifacts) => {
          const { modelTopology, weightSpecs, weightData } = modelArtifacts;
          jsonFile = JSON.stringify({ modelTopology, weightSpecs });
          binFile = new Uint8Array(weightData);
          return { modelTopology, weightSpecs, weightData };
      };

      await model.save(tf.io.withSaveHandler(customSaveHandler));
      await uploadModelArtifacts(modelName, accountName, jsonFile, binFile)
      return Promise.resolve("✅ Model saved successfully! ✅");
  }
  catch(err){
    return Promise.reject(`❌❌ Failed saving model❌❌\n ${err}`);
  }
}

export async function preprocessData(rawData) { // nepouzite
  return tf.div(tf.tensor4d(rawData), 255);
}

export async function testModel(modelName, data,accountName){ // nepouzite
  await downloadModel(modelName,accountName);
  model.predict(tf.tensor4d(data.images[0]), data.labels[0] );
}

export async function trainAndFetchActivations(modelName, dataset,accountName,settings) { // trenovnie modelu a prijatie aktivacii
  try {
    if (!modelName) { 
      alert("Save the model first");
      return;
    }
    if (!dataset) { 
      alert("No dataset defined");
      return;
    }
    if(!accountName){
      alert("You need to be logged in");
      return;
    }
    trainingCompleted = false
    const training = await trainModel(modelName,dataset,accountName,settings); // trenovanie
    if (training){
      await waitForTrainingToComplete(); // dopytovanie sa na stav trenovanie
      const activations = await fetchActivations(); // ziskanie aktivacii
      return activations;
    }
   
  } catch (error) {
    console.error("An error occurred during training or fetching weights:", error);
    return null;
  }
}
const ip = '34.141.150.2' // ip adresa servera(stale sa meni)

export async function trainModel(modelName,dataset,accountName,settings) { // trenovanie modelu
  try {
    await fetch(`http://${ip}:5000/train`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      // telo POST poziadavky s nazvom modelu, typom datasetu, meno pouzivatela, optimizer, uciaci parameter, pocet epoch
      body: JSON.stringify({'dir': modelName, 'dataset' : dataset, 'account' : accountName, 'optimizer' : settings.optimizer, 'learningRate' : settings.learningRate, 'epochs' : settings.epochs})
    });
    return true;
  } catch (error) {
    console.log(error)
    alert('Server not running');
    return false;
  }
}

async function waitForTrainingToComplete() { // vysielanie dopytov na trenovaci server o stave trenovania
  while (!trainingCompleted) {
    await checkTrainingStatus();
    if (!trainingCompleted) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // kazdych 5 sekund
    }
  }
  console.log("Training has completed2.");
}

async function checkTrainingStatus() { // dopyt na stav trenovania
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

async function fetchActivations() { // ziskanie aktivacii, vstupnych dat, oznaceni a metrik pre grafy
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

export async function importModel(modelName, accountName) { // import modelu
    try {
      await downloadModel(modelName,accountName);
      return model_to_layers();
    } catch (error) {
      console.error("Error importing model:", error);
      throw error;
    }
  }

export async function exportModel(modelName, accountName){ // exporrt modelu
  if(!accountName){
    alert("You need to be logged in");
    return;
  }
  if (!modelName) { 
    alert("Save the model first");
    return;
  }
  if(model){
    await downloadModel(modelName,accountName);
    model.save('downloads://my-model')
  }
}

export function add_model_layer(layer) { // pridanie vrstvy, so vsetkymi jej hyperparametrami, do modelu podla jej typu
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let nlayer;
    alert(layer.inputShape)
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
            nlayer = tf.layers.flatten( {batchInputShape: layer.inputShape});
            break;
        default:
            console.log('Unknown layer type');
    }
    model.add(nlayer)
    }
    

function model_to_layers() { // extrakcia informacii z tensorlow.js vrstvy do vrstvy pre aplikaciu
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let layers = [];
    let i = 0;
    let batch = model.layers[0].batchInputShape[0]
    model.layers.forEach(layer => {
        let shape = i === 0 ? layer.batchInputShape : undefined
        switch(layer.constructor.className){
            case LayerType.DENSE:
                layers.push({ index : i, type : 'Dense', numOfNeurons : layer.units, activationType : layer.activation.constructor.className, batchSize : batch, inputShape : shape});
                i++;
                break;
            case LayerType.CONV:
                layers.push({index : i, type : LayerType.CONV, numOfKernels : layer.filters, kernelSize: layer.kernelSize, strides : layer.strides, padding : layer.padding, activationType: layer.activation.constructor.className, batchSize : batch, inputShape : shape})
                i++;
                break;
            case 'MaxPooling2D':
                layers.push({index : i, type : LayerType.MAXP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, batchSize : batch, inputShape : shape})
                i++;
                break;
            case 'AveragePooling2D':
                layers.push({index : i, type : LayerType.AVGP, poolSize : layer.poolSize, strides : layer.strides, padding : layer.padding, batchSize : batch, inputShape : shape})
                i++;
                break;
            case LayerType.DROP:
                layers.push({index : i, type : LayerType.DROP, rate : layer.rate})
                i++;
                break;
            case LayerType.FLATTEN:
                layers.push({index : i, type : LayerType.FLATTEN, batchSize : batch, inputShape : shape})
                i++;
                break;
        }
    })
    return layers
}

