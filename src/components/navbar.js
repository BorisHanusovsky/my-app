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
  onLoginButtonPressed
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
    <nav style={{padding : '5px'}}>
      <span style={{float: 'left'}}>
      <h1> <span style={{color: '#F2545B'}}>NN</span> visualizer</h1>
      <h2>Selected dataset: {selectedDataset}</h2>

      <span className="nav_left">
        <button onClick={handleImportModel}>Import model</button>
        <button onClick={handleExportModel}>Export model</button>
        <button onClick={handleSaveModel}>Save model</button>
      </span>
      <span className="nav_right">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(event) => handleInputChanged(event)}
          id="dataInput"
          name="dataInput"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        <input
          directory=""
          ref={modelInputRef}
          onChange={(event) => handleModelChanged(event)}
          webkitdirectory=""
          type="file"
          style={{ display: 'none' }}
        />
        <button id="loadDataButton" onClick={handleDatasetClicked}>Dataset</button>
        <button onClick={handleTrainButtonPressed}>Train</button>
        {/* <button onClick={handleTestButtonPressed}>Test</button> */}
      </span>
      </span>
      <span style={{float : 'right'}}>
        <button onClick={handleLoginButtonPressed}>{buttonText}</button>
        <img src={accountImage} style={{borderRadius : '50%', height:'40px'}}></img>
      </span>
      
    </nav>
  );
}
