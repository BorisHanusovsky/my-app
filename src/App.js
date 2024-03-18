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


function App() {
  let [layerList, setLayerList] = useState([]);
  const [saveResultVis, setSaveResultVis] = useState(false);
  const selectedModel = useRef(null);
  const [modelNames, setModelNames] = useState([]);
  const [dataset, setDataset] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [activations, setActivations] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    console.log(`Layers in app : ${layerList}`);
  },[layerList]);
  
  const onFilesSelected = (files) =>{
    //displayImages(files)
    setDataset(files);
  }

  const onSaveButtonPressed = () =>{
    if (layerList){
      if (layerList.length!== 0){
        createModel();
        for(var i = 0; i< layerList.length; i++)
          add_model_layer(layerList[i]);
        if (compileModel() === true){
          selectedModel.current =  window.prompt("Name your model",selectedModel.current);
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
    const act = await trainAndFetchActivations(selectedModel.current);
    setDataLoading(false);
    if (act) { // Check if 'act' is not null/undefined
        setActivations(act);
    } else {
        // Handle the case where 'act' is null/undefined or invalid
        console.error("Failed to fetch activations.");
        // Optionally, set a state or alert the user
    }
  }
 
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

  function displayImages(files) {
    let imageContainer = document.getElementById("imageContainer")
    imageContainer.innerHTML = '';

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.createElement('img');
            img.classList.add('dataImage');
            img.src = e.target.result;
            imageContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

function onIndexChange(index){
  if(selectedIndex == null)
    setSelectedIndex(0)
  else setSelectedIndex(index)
}

  return (
    <div className="App">
      <Navbar onFilesSelected={onFilesSelected} onSaveButtonPressed={onSaveButtonPressed} onDatasetImportStart = {onDatasetImportStart} onImportButtonPressed={onImportButtonPressed} onTrainButtonPressed = {onTrainButtonPressed} onTestButtonPressed = {onTestButtonPressed}/>
      <div className="content">
        <ModelPanel layers = {layerList} setLayerList ={setLayerList} onIndexChange ={onIndexChange}/>
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
    </div>
  );
}

export default App;
