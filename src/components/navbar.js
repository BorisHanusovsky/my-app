import React, { useEffect, useState} from 'react';

export default function Navbar({ // komponent navigácie obsahujúci viacero tlačidiel pre ovládanie aplikácie
  onSaveButtonPressed, // funkcia vykonana po stlaceni tlacidla SAVE
  onImportButtonPressed, // funkcia vykonana po stlaceni tlacidla IMPORT MODEL
  onExportButtonPressed, // funkcia vykonana po stlaceni tlacidla EXPORT MODEL
  onTrainButtonPressed, // funkcia vykonana po stlaceni tlacidla TRAIN
  onDatasetClicked, // funkcia vykonana po stlaceni tlacidla DATASET
  selectedDataset, // vybrany dataset, meni obsah navigacie
  accountImage, // obrazok uctu pouzovatela
  onLoginButtonPressed, // funkcia vykonana po stlaceni tlacidla LOG IN
  onSettingsButtonPressed // funkcia vykonana po stlaceni tlacidla SETTINGS
}) {
  const [buttonText,setButtonText] = useState('Log in') // text tlacidla pre prihlasenie/odhlasenie

  useEffect(() =>{ // zmena textu prihlasenia/odhlasenia
    if (accountImage === undefined)  
      setButtonText('Log in')
    else
      setButtonText('Log out')}
    ,[accountImage])

  // VOLANIE FUNKCII V APP.JS
  //-------------------------------------------- 
  async function handleDatasetClicked() {
    onDatasetClicked()
  }

  function handleSaveModel() {
    onSaveButtonPressed();
  }

  function handleImportModel() {
    onImportButtonPressed();
  }

  function handleExportModel() {
    onExportButtonPressed();
  }

  function handleTrainButtonPressed() {
    onTrainButtonPressed();
  }

  function handleSettingsButtonPressed(){
    onSettingsButtonPressed();
  }

  function handleLoginButtonPressed(){
    if (buttonText === 'Log in')
      onLoginButtonPressed(false);
    else
      onLoginButtonPressed(true);
  }
  //-------------------------------------------- 

  return (
    <nav style={{padding : '5px', display : 'inline-block', minHeight : '300px'}}>
      <span style={{display : 'block'}}>
        <h1 > <span style={{color: '#F2545B'}}>NN</span> visualizer</h1>
        <h2>Selected dataset: {selectedDataset}</h2>
        <span style={{position : 'absolute', width: '95%'}}>
          <button onClick={handleImportModel}>Import model</button>
          <button onClick={handleExportModel}>Export model</button>
          <button onClick={handleSaveModel}>Save model</button>
          <button id="loadDataButton" onClick={handleDatasetClicked}>Dataset</button>
          <button onClick={handleSettingsButtonPressed}>Settings</button>
          <button onClick={handleTrainButtonPressed}>Train</button>
        </span>
        <span style={{ position: 'absolute', right: '20px', top : '0px'}}>
        <button onClick={handleLoginButtonPressed}>{buttonText}</button>
        <img src={accountImage} style={{borderRadius : '50%', height:'40px'}}></img>
      </span>
      </span>
     
      
    </nav>
  );
}
