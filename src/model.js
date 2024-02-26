// model.js
import { LayerType } from "./components/layers/layerEnum";
//import * as tf from '@tensorflow/tfjs'
const tf = require('@tensorflow/tfjs');
//const storage = require('@google-cloud/storage');
//const {Storage} = require('@google-cloud/storage');
// Load the binding
//const tf = require('@tensorflow/tfjs');

// Or if running with GPU:
//const tf = require('@tensorflow/tfjs-node-gpu');
//require('@tensorflow/tfjs-node');
//import "@tensorflow/tfjs-node"
let model;

export function createModel() {
    // Your model creation logic here
    model = tf.sequential();
    
    //model.add(tf.layers.input({shape : (32,32)}));
    //console.log(model)
}

export function compileModel(){
    console.log(model);
    model.compile({ optimizer: 'adam',loss: 'categoricalCrossentropy', metrics: ['accuracy']});
}

export function saveModel(){
    model.save('downloads://my-model');
}

export async function importModel(files){
    // //const loadedModel = tf.loadLayersModel('downloads://my-model');
    // const model = await tf.loadLayersModel(
    //     tf.io.browserFiles([files[0], files[1]]));
    // //model.loadLayersModel(path);
    model = await tf.loadLayersModel('https://storage.googleapis.com/model_borisss/model/my-model.json')

    //model = await tf.loadLayersModel('https://storage.googleapis.com/model_borisss/model/my-model.json');


    // const [jsonFile, weightsFile] = files;

    // // Read the files as buffers
    // const jsonBuffer = await jsonFile.arrayBuffer();
    // const weightsBuffer = await weightsFile.arrayBuffer();

    // // Create IO handlers
    // const modelJson = new TextDecoder().decode(jsonBuffer);
    // const modelWeights = new Uint8Array(weightsBuffer);

    // const model = await tf.loadLayersModel(
    //     tf.io.fromMemory(modelJson, modelWeights)
    // );

    console.log(model);
}

export function add_model_layer(layer) {
    // Check if TensorFlow.js is loaded
    if (typeof tf === 'undefined') {
        console.error('TensorFlow.js is not loaded. Please make sure it is loaded before calling add_model_layer.');
        return;
    }
    let nlayer;

    // Your layer adding logic here
    switch (layer.type) {
        case LayerType.DENSE:
            nlayer = tf.layers.dense({ units: layer.numOfNeurons, activation: layer.activationType, batchInputShape: layer.inputShape});
            break;
        case LayerType.CONV:
            nlayer = tf.layers.conv2d({ filters: layer.numOfKernels, kernelSize: layer.kernelSize, strides : layer.stride, padding : layer.padding, activation: layer.activationType,batchInputShape: layer.inputShape});
            break;
        case LayerType.MAXP:
            nlayer = tf.layers.maxPool2d({poolSize : layer.poolSize, strides : layer.stride, padding : layer.padding,batchInputShape: layer.inputShape});
            break;
        case LayerType.AVGP:
            nlayer = tf.layers.avgPool2d({poolSize : layer.poolSize, strides : layer.stride, padding : layer.padding, batchInputShape: layer.inputShape});
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
    console.log(model);
}


