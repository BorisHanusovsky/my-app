// App.js
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './model.js';
import ModelPanel from './components/modelPanel.js';
import Navbar from './components/navbar.js';
import Footer from './components/footer/footer.js';
import {createModel, add_model_layer, saveModel, compileModel,importModel} from './model.js'
import * as tf from '@tensorflow/tfjs'

function App() {
  const [layerList, setLayerList] = useState([/*{type: 'Input', index: 0, shape : (32,32), batchShape: null}*/]);
  
  const onFilesSelected = (files) =>{
    displayImages(files)
  }

  const onSaveButtonPressed = () =>{
    if (layerList){
      createModel();
      for(var i = 0; i< layerList.length; i++)
        add_model_layer(layerList[i])
      compileModel()
      saveModel();
    }
  }

  const onImportButtonPressed = (files) =>{
    console.log(files);
    alert("kokot")
    importModel(files)

  }

  const onLayerListUpdate = (layers) => {
    setLayerList(layers);
    console.log(layers)
  }

  // function loadTensorFlow() {
  //   const script = document.createElement("script");
  //   script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js";
  //   script.onload = window.onTfLoaded;
  //   document.head.appendChild(script);

  // loadTensorFlow();


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
        <ModelPanel layers = {layerList} onSaveButtonPressed={onSaveButtonPressed} onLayerListUpdate= {onLayerListUpdate}/>
        <div className="right_panel">
          <div className="kernel_panel" id="imageContainer">
            <h2>Display panel</h2>
            <h3 id="title_selected_layer"></h3>
          </div>
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
    </div>
  );
}

export default App;
