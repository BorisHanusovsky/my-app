import React, { useEffect, useRef, useState} from 'react';

export default function Navbar({
  onFilesSelected,
  onSaveButtonPressed,
  onImportButtonPressed,
  onExportButtonPressed,
  onTrainButtonPressed,
  onTestButtonPressed,
  onDatasetClicked,
  selectedDataset,
  accountImage,
  onLoginButtonPressed,
  onSettingsButtonPressed
}) {
  const fileInputRef = useRef(null);
  const modelInputRef = useRef(null);
  const [buttonText,setButtonText] = useState('Log in')

  useEffect(() =>{
    if (accountImage === undefined)  
      setButtonText('Log in')
    else
      setButtonText('Log out')}
    ,[accountImage])

  async function handleDatasetClicked() {
    onDatasetClicked()
  }

  function handleLoadModelClicked() {
    modelInputRef.current.click();
  }

  function handleInputChanged(event) {
    console.log('Selected files:', event.target.files);
    onFilesSelected(event.target.files);
  }

  function handleModelChanged(event) {
    console.log('Selected files:', event.target.files);
    onImportButtonPressed(event.target.files);
  }

  function handleSaveModel() {
    onSaveButtonPressed();
  }

  function handleImportModel() {
    //modelInputRef.current.click();
    onImportButtonPressed();
  }

  function handleExportModel() {
    //modelInputRef.current.click();
    onExportButtonPressed();
  }

  function handleTrainButtonPressed() {
    onTrainButtonPressed();
  }

  function handleSettingsButtonPressed(){
    onSettingsButtonPressed();
  }

  function handleTestButtonPressed() {
    onTestButtonPressed();
  }

  function handleLoginButtonPressed(){
    if (buttonText === 'Log in')
      onLoginButtonPressed(false);
    else
      onLoginButtonPressed(true);
  }

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
