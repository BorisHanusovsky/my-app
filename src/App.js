// App.js
import React, { useState,useEffect, useRef } from 'react';
import './App.css';
import './model.js';
import ModelPanel from './components/modelPanel.js';
import Navbar from './components/navbar.js';
import Footer from './components/footer/footer.js';
import {createModel, add_model_layer, saveModel, compileModel,importModel, getModelNames, trainAndFetchActivations,testModel} from './model.js'
import * as tf from '@tensorflow/tfjs'
import ModalSavedModels from './components/modals/modalSavedModels.js';
import DisplayPanel from './components/DisplayPanel.js';
import GraphPanel from './components/graphPanel.js';
import ModalDatasetSelect from './components/modals/modalDatasetSelect.js';
import ModalLayerTypes from './components/modals/modalLayerTypes.js';
import { LayerType } from "./components/layers/layerEnum";


function App() {
  let [layerList, setLayerList] = useState([]);
  const [saveResultVis, setSaveResultVis] = useState(false);
  const [datasetResultVis, setDatasetResultVis] = useState(false);
  const [layerTypesVis, setLayerTypesVis] = useState(false)
  const selectedModel = useRef(null);
  const [modelNames, setModelNames] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activations, setActivations] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedDataset, setSelectedDataset] = useState('MNIST')

  useEffect(() => {
    console.log(`Layers in app :`);
    console.log(layerList)
  },[layerList]);
  


  const onSaveButtonPressed = () =>{
    if (layerList){
      if (layerList.length!== 0){
        createModel();
        try{
          for(var i = 0; i< layerList.length; i++)
            add_model_layer(layerList[i]);
          if (compileModel() === true){
            selectedModel.current =  window.prompt("Name your model",selectedModel.current === null? "MyModel" : selectedModel.current);
            if(selectedModel.current !== null){
              saveModel(selectedModel.current)
              .then((successMessage) => {
                alert(successMessage);
              })
              .catch((errorMessage) => {
                alert(errorMessage);
              });
            }
          }
        }
        catch(err){
          alert(`❌❌ Error occured while creating model❌❌\n ${err}`);
        }
        
      }
      else{
        alert("❌❌ Failed saving model, model does not have layers defined ❌❌");
      }
    }
  }

  async function onModalSavedModelClose(model){
    selectedModel.current = model;
    setSaveResultVis(false);
    if(model){
      const layers = await importModel(selectedModel);
      console.log('Setting layerList state:', layers);
      setLayerList([...layers]);
    }
  }



  const onDatasetImportStart = () =>{
    setDataLoading(true);
  }

  async function onTrainButtonPressed() {
    setDataLoading(true);
    const act = await trainAndFetchActivations(selectedModel.current, selectedDataset);
    setDataLoading(false);
    if (act) { // Check if 'act' is not null/undefined
        setActivations(act);
    } else {
        // Handle the case where 'act' is null/undefined or invalid
        console.error("Failed to fetch activations.");
        // Optionally, set a state or alert the user
    }
  }

  const onDatasetClicked = () =>{
    setDatasetResultVis(true);
  }

  const onDatasetClose =(dataset)=>{
    setDatasetResultVis(false);
    if (dataset !== null)
      setSelectedDataset(dataset)
  }

  const onModalLayerTypesClose = (layerType)=>{
    if (layerType !== null)
      addLayer(layerType)
    else 
      setLayerTypesVis(false)
  }

  const onButtonPlusClick = () =>{
    setLayerTypesVis(true)
  }

  const onButtonMinusClick = () =>{
    if (layerList.length > 0) {
      setLayerList((prevLayers) => prevLayers.slice(0, -1));
      setSelectedIndex(layerList.length - 1)
    }
    else{
      setSelectedIndex(null)
    }
  }

  const addLayer = (layerType) => {
      let newLayer;
      switch (layerType) {
        case 'Dense':
          newLayer = {
            type: layerType,
            index: layerList.length,
            numOfNeurons: 16, 
            isActive: false,
            activationType: "linear",
            inputShape : null
          };
          break;
        case 'Conv2D':
            newLayer = {
              type: layerType,
              index: layerList.length,
              numOfKernels: 16,
              kernelSize: [3,3],
              strides: [1,1],
              padding: "valid",
              isActive: false,
              activationType: "linear",
              inputShape : null
            };
            break;
        case 'MaxPool2D':
            newLayer = {
              type: layerType,
              index: layerList.length,
              poolSize: [2,2],
              strides: [2,2],
              padding: "valid",
              isActive: false,
              inputShape : null
            };
            break;  
        case 'AvgPool2D':
            newLayer = {
              type: layerType,
              index: layerList.length,
              poolSize: [2,2],
              strides: [2,2],
              padding: "valid",
              isActive: false,
              inputShape : null
            };
            break;  
        case 'Dropout':
            newLayer = {
              type: layerType,
              index: layerList.length,
              isActive: false,
              rate: 0.5,
            };
            break;  
        case 'Flatten':
            newLayer = {
              type: layerType,
              index: layerList.length,
              isActive: false,
            };
            break;  
        default:
          newLayer = {
            type: layerType,
            index: layerList.length,
          };
      }
      setLayerList(prevLayers => [...prevLayers, newLayer])
      setSelectedIndex(layerList.length > 0 ? layerList.length - 1 : null)
      };
 
  const onTestButtonPressed = () =>{
    testModel(selectedModel,activations);
  }

  const onImportButtonPressed = async () => {
    try {
      const names = await getModelNames();
      console.log("back in app");
      if (names && names.length > 0) {
        setModelNames(names);
        setSaveResultVis(true);
        
      } 
      else {
        alert("💾 💾No saved models 💾 💾 \n")
      }
    } catch (error) {
      console.error('Error fetching model names or importing model:', error);
    }
  };

function onIndexChange(index){
  if(selectedIndex == null)
    setSelectedIndex(0)
  else setSelectedIndex(index)
}

  return (
    <div className="App">
      <Navbar selectedDataset = {selectedDataset} onDatasetClicked = {onDatasetClicked} onSaveButtonPressed={onSaveButtonPressed} onDatasetImportStart = {onDatasetImportStart} onImportButtonPressed={onImportButtonPressed} onTrainButtonPressed = {onTrainButtonPressed} onTestButtonPressed = {onTestButtonPressed}/>
      <div className="content">
        <ModelPanel onButtonPlusClick= {onButtonPlusClick} onButtonMinusClick= {onButtonMinusClick} layers = {layerList} setLayerList ={setLayerList} onIndexChange ={onIndexChange}/>
        <div className="right_panel">                   
                                                           {/*  epocha(asi max 7), vrstva, obrazok(10)                  */}
          <DisplayPanel activations = {activations?.activations?.[0][selectedIndex] } position = {0} imgs = {activations.images}  load = {dataLoading}/>
          <GraphPanel history ={activations.history}></GraphPanel>
        </div>
      </div>
      <Footer/>

      <div id="myModal" className="modal">
        <div id="modal_content">
          <span className="close">&times;</span>
          <div id="modal_layers"></div>
        </div>
      </div>

      <ModalSavedModels visibility = {saveResultVis} onModalSavedModelClose = {onModalSavedModelClose} modelNames = {modelNames}/>
      <ModalDatasetSelect visibility = {datasetResultVis} onDatasetClose = {onDatasetClose}/>
      <ModalLayerTypes visibility={layerTypesVis} onModalLayerTypesClose = {onModalLayerTypesClose} layerTypes = {Object.values(LayerType)}/>
    </div>
  );
}

export default App;
