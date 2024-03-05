// App.js
import React, { useState,useEffect, useRef } from 'react';
import './App.css';
import './model.js';
import ModelPanel from './components/modelPanel.js';
import Navbar from './components/navbar.js';
import Footer from './components/footer/footer.js';
import {createModel, add_model_layer, saveModel, compileModel,importModel, getModelNames} from './model.js'
import * as tf from '@tensorflow/tfjs'
import ModalSavedModels from './components/modals/modalSavedModels.js';
import DisplayPanel from './components/DisplayPanel.js';


function App() {
  let [layerList, setLayerList] = useState([]);
  const [saveResultVis, setSaveResultVis] = useState(false);
  const selectedModel = useRef(null);
  const [modelNames, setModelNames] = useState([]);
  const [dataset, setDataset] = useState(null);


  useEffect(() => {
    console.log(`Layers in app : ${layerList}`);
  });
  
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
          const modelName = window.prompt("Name your model","MyModel");
          if(modelName !== null){
            saveModel(modelName)
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

  // const onImportButtonPressed = () => {
  //   getModelNames()
  //     .then((names) => {
  //       modelNames.current = names;
  //       setSaveResultVis(true);
  //       importModel()
  //       .then((layers) => {
  //         console.log("Setting layerList state:", layers);
  //         setLayerList([...layers]);
  //       })
  //       .catch((error) => {
  //         console.error("Error importing model:", error);
  //       });
  //     })
  // };

  // const onImportButtonPressed = () => {
  //   getModelNames()
  //     .then((names) => {
  //       setModelNames(names);
  //       setSaveResultVis(true);
  //       importModel()
  //         .then((layers) => {
  //           console.log('Setting layerList state:', layers);
  //           setLayerList([...layers]);
  //         })
  //         .catch((error) => {
  //           console.error('Error importing model:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching model names:', error);
  //     });
  // };

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

  return (
    <div className="App">
      <Navbar onFilesSelected={onFilesSelected} onSaveButtonPressed={onSaveButtonPressed} onImportButtonPressed={onImportButtonPressed}/>
      <div className="content">
        <ModelPanel layers = {layerList} setLayerList ={setLayerList}/>
        <div className="right_panel">
          {/* <div className="kernel_panel" id="imageContainer">
            <h2>Display panel</h2>
            <h3 id="title_selected_layer"></h3>
          </div> */}
          <DisplayPanel dataset ={dataset}/>
          <div className="graph_panel">
            <h2>Graph panel</h2>
          </div>
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
