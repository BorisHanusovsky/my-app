import React, { useState,useEffect, useRef } from 'react';
import './App.css';
import './model.js';
import ModelPanel from './components/modelPanel.js';
import Navbar from './components/navbar.js';
import Footer from './components/footer/footer.js';
import {createModel, add_model_layer, saveModel, compileModel,importModel,exportModel, getModelNames, trainAndFetchActivations,testModel, logIn, logOut} from './model.js'
import ModalSavedModels from './components/modals/modalSavedModels.js';
import DisplayPanel from './components/DisplayPanel.js';
import GraphPanel from './components/graphPanel.js';
import ModalDatasetSelect from './components/modals/modalDatasetSelect.js';
import ModalLayerTypes from './components/modals/modalLayerTypes.js';
import { LayerType } from "./components/layers/layerEnum";
import ModalSettings from './components/modals/modalSettings.js';


function App() { // hlavny komponent aplikacie, su v nom ulozene ostatne komponenty. Ma funkcionality:
                      // vytvaranie vrstiev, 
                      // komunikaciu so suborom model.js kde prebieha vytvorenie tensorflow.js modelu, 
                      // preposielanie argumentov medzi komponentami
                      // logovanie 
  
  let [layerList, setLayerList] = useState([]); // zoznam vrstiev siete
  const [saveResultVis, setSaveResultVis] = useState(false); // viditelnost modalneho okna pre vyber ulozenych modelov
  const [datasetResultVis, setDatasetResultVis] = useState(false); // viditelnost modalneho okna pre vyber datasetov
  const [settings, setSettings] = useState(null) // konfiguracia nastaveni trenovania
  const [settingsResultVis, setSettingsResultVis] = useState(false); // viditelnost modalneho okna pre nastavenia trenovania
  const [layerTypesVis, setLayerTypesVis] = useState(false) // viditelnost modalneho okna pre vyber typu vrstvy
  const selectedModel = useRef(null); // vybrany model(nazov)
  const [modelNames, setModelNames] = useState([]); // nazvy modelov
  const [dataLoading, setDataLoading] = useState(false); // priebeh nacitavania - ak je True, zobrazuje sa animacia v Display panel
  const [activations, setActivations] = useState([]) // aktivacie 
  const [selectedIndex, setSelectedIndex] = useState(0) // index vybranej vrstvy
  const [selectedDataset, setSelectedDataset] = useState('MNIST') // vybrany dataset
  const [currentEpoch, setCurrentEpoch] = useState(null) // aktualna epocha
  const [account, setAccount] = useState(null) // ucet pouzivatela

  useEffect(() => {
    console.log(`Layers in app :`);
    console.log(layerList)
  },[layerList]);
  


  const onSaveButtonPressed = () =>{ // ulozenie modelui, funkcia vykonana po stlaceni tlacidla SAVE v navigacii
    if (!account){
      alert('You need to be logged in')
      return
    }
    if (layerList){
      console.log(layerList)
      if (layerList.length!== 0){
        createModel(); // vytvorenie instancie modelu
        try{
          for(var i = 0; i< layerList.length; i++) // pridanie vrstiev do modelu
            add_model_layer(layerList[i]);
          if (compileModel() === true){
            selectedModel.current =  window.prompt("Name your model",selectedModel.current === null? "MyModel" : selectedModel.current);
            if(selectedModel.current !== null){
              saveModel(selectedModel.current,account?.displayName) // ulozenie modelu
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

  async function onModalSavedModelClose(model){ // import modelu
    selectedModel.current = model;
    setSaveResultVis(false);
    if(model){
      const layers = await importModel(selectedModel,account?.displayName);
      console.log('Setting layerList state:', layers);
      setLayerList([...layers]); // modifikacia vrstiev
    }
  }



  const onDatasetImportStart = () =>{ //spustenie animacie nacitavania
    setDataLoading(true);
  }

  async function onTrainButtonPressed() { // trenovanie modelu
    if (!account){
      alert('You need to be logged in')
      return
    }
    setDataLoading(true);
    const act = await trainAndFetchActivations(selectedModel.current, selectedDataset,account?.displayName,settings);
    setDataLoading(false);
    if (act) { // Check if 'act' is not null/undefined
        setActivations(act);
    } else {
        // Handle the case where 'act' is null/undefined or invalid
        console.error("Failed to fetch activations.");
        // Optionally, set a state or alert the user
    }
  }

  const onDatasetClicked = () =>{ // obrazenie okna pre vyber datasetu
    setDatasetResultVis(true);
  }

  const onDatasetClose =(dataset)=>{ // vyber datasetu, upravava vstupneho tvaru dat do siete 
    setDatasetResultVis(false);
    if (dataset !== null){
      setSelectedDataset(dataset)
      if(layerList.length > 0){
        let l = layerList
        let temp = layerList[0]
        if(temp.inputShape){
          if(dataset === 'CIFAR10')
            temp.inputShape = [temp.inputShape[0],32,32,3]
          else
            temp.inputShape = [temp.inputShape[0],28,28,1]
          }
        l[0] = temp
        console.log(l[0])
        setLayerList(l)
      }
    }
  }

  const onModalLayerTypesClose = (layerType)=>{ // zatvorenie okna pre vyber vrstvy
    if (layerType !== null)
      addLayer(layerType)
    else 
      setLayerTypesVis(false)
  }

  const onButtonPlusClick = () =>{ // otvorenie okna pre vyber vrstvy
    setLayerTypesVis(true)
  }

  const onButtonMinusClick = () =>{ // odstranenie poslednej vrstvy siete
    if (layerList.length > 0) {
      setLayerList((prevLayers) => prevLayers.slice(0, -1));
      setSelectedIndex(layerList.length - 1)
    }
    else{
      setSelectedIndex(null)
    }
  }

  const onEpochNumChange = (epochNum) =>{ // zmena aktualnej epochy
    setCurrentEpoch(epochNum)
  }

  const addLayer = (layerType) => { // pridanie vrstvy
      let newLayer;
      switch (layerType) {
        case 'Dense':
          newLayer = {
            type: layerType,
            index: layerList.length,
            numOfNeurons: 10, 
            isActive: false,
            activationType: "linear",
            batchSize: 16,
            inputShape : [16, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 3 : 1]
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
              batchSize: 16,
              inputShape : [16, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 3 : 1]
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
              batchSize: 16,
              inputShape : [16, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 3 : 1]
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
              batchSize: 16,
              inputShape : [16, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 3 : 1]
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
              batchSize: 16,
              inputShape : [16, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 32 : 28, selectedDataset == 'CIFAR10' ? 3 : 1]
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
 
  const onTestButtonPressed = () =>{ // nepouzite
    if (!account){
      alert('You need to be logged in')
      return
    }
    testModel(selectedModel,activations,account?.displayName);
  }

  async function onLoginButtonPressed(isLoggedIn){ // prihlasenie/ odhlasenie
    if(isLoggedIn){
      await logOut();
      setAccount(null)
    }
    else{
      var acc = await logIn(account);
      setAccount(acc)
    }
  }

  const onImportButtonPressed = async () => { // import modelu
    try {
      if (!account){
        alert('You need to be logged in')
        return
      }
      const names = await getModelNames(account.displayName);
      console.log("back in app");
      if (names && names.length > 0) {
        setModelNames(names);
        setSaveResultVis(true);
      } 
      else {
        alert("💾 💾No saved models 💾 💾 \n")
      }
    } 
    catch (error) {
      console.error('Error fetching model names or importing model:', error);
    }
  };

  const onExportButtonPressed =()=>{ // export modelu
    if (!account){
      alert('You need to be logged in')
      return
    }
    exportModel(selectedModel.current,account.displayName)
  }

  const onSettingsButtonPressed =()=>{ // zobrazenie okna konfiguracie nastaveni trenovania
    setSettingsResultVis(true);
  }

  const onSettingsClose = (settings) =>{ // zatvorenie okna konfiguracie trenovania
    setSettingsResultVis(false);
    if(settings){
      setSettings(settings)
      alert(settings.optimizer)
    }
  }

function onIndexChange(index){ // zmena indexu vybranej vrstvy
  if(selectedIndex == null)
    setSelectedIndex(0)
  else setSelectedIndex(index)
}

  return (
    <div className="App">
      <Navbar selectedDataset = {selectedDataset} onDatasetClicked = {onDatasetClicked} onSaveButtonPressed={onSaveButtonPressed} onDatasetImportStart = {onDatasetImportStart} onImportButtonPressed={onImportButtonPressed} onExportButtonPressed={onExportButtonPressed} onTrainButtonPressed = {onTrainButtonPressed} onTestButtonPressed = {onTestButtonPressed} onSettingsButtonPressed={onSettingsButtonPressed} accountImage={account?.photoURL} onLoginButtonPressed={onLoginButtonPressed}/>
      <div className="content">
        <ModelPanel onButtonPlusClick= {onButtonPlusClick} onButtonMinusClick= {onButtonMinusClick} layers = {layerList} setLayerList ={setLayerList} onIndexChange ={onIndexChange}/>
        <div className="right_panel">                   
                                                           {/*  epocha(asi max 7), vrstva, obrazok(10)                  */}
          <DisplayPanel activations = {activations?.activations?.[currentEpoch !== null ? currentEpoch : 0][selectedIndex] } imgs = {activations.images}  load = {dataLoading} epoch ={currentEpoch} onEpochNumChange ={onEpochNumChange}/>
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
      <ModalSettings visibility={settingsResultVis} onSettingsClose={onSettingsClose}/>
    </div>
  );
}

export default App;
