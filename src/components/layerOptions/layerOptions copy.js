import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default function LayerOptions({ type, vis, onClose}) {
  const [visibility, setVisibility] = useState(vis);
  const [numOfLayers, setNumOfLayers] = useState(10);
  const [kernelSize, setKernelSize] = useState(3);
  const [stride, setStride] = useState(1);
  const activationTypes = ["linear", "sigmoid", "tanh", "relu"]
  const paddingTypes = ["valid", "same"]
  const selectedActivation = useRef(activationTypes[0]);

  const handleClose = () => {
    if(numOfLayers != ""){
      setVisibility(false);
      onClose(); // Notify the parent component about the close event
    }
  };

  const handleSubmit = () => {
    if(numOfLayers != ""){
      setVisibility(false);
      onClose(selectedActivation.current,numOfLayers); // Notify the parent component about the close event
    }
  };

  const  handleLayerNumChange = (event) => {
    if(event.target.value === "")
      setNumOfLayers(1);
    if (event.target.value >= 0 && event.target.value <= 256)
      setNumOfLayers(event.target.value);
  };

  const  handleKernelSizeChange = (event) => {
    setKernelSize(event.target.value);
  };
  const  handleStrideChange = (event) => {
    setStride(event.target.value);
  };

  const handleLayerActivationTypeChange =(event) =>{
    selectedActivation.current = event.target.value;
  }

  useEffect(() => {
    // Update the visibility state when the prop changes
    setVisibility(vis);
  }, [vis]);

  if (visibility) {
    let isConv2d = type == "Conv2D"? true : false;
    let kernely;
    let strides;
    let padding;
    if (isConv2d) kernely =  
      <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
        <label class = "layerOptionsLabel" htmlFor="kernelSize">Kernel size:</label>
        <input id="kernelSize" type="number" value={kernelSize} onChange={(event) => handleKernelSizeChange(event)}/>
        <input id="kernelSize" type="number" value={kernelSize} onChange={(event) => handleKernelSizeChange(event)}/>
      </div>
    if (isConv2d) strides =  
      <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
        <label class = "layerOptionsLabel" htmlFor="strides">Strides:</label>
        <input id="stride" type="number" value={stride} onChange={(event) => handleStrideChange(event)}/>
        <input id="stride" type="number" value={stride} onChange={(event) => handleStrideChange(event)}/>
    </div>
    if (isConv2d) padding =  
    <div className ="layerOptionsRow" style={{gridRow:6, gridColumn:1/3}}>
      <label class = "layerOptionsLabel" htmlFor="strides">Padding:</label>
      <select id ="activationTypeCombobox" onChange = {(event) => {handleLayerActivationTypeChange(event)}}>
            {paddingTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
      </select>
    </div>

    
    return (
      <div className="layerOptions" style={{ visibility: vis }}>
        <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
          <span id = "layerOptionsClose" className="close" onClick={handleClose}>
            &times;
          </span>
          <h1 id = "layerOptionsTitle">{type}</h1>
        </div>
       
        <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
          <label className = "layerOptionsLabel" htmlFor="layerCount" >Layer count:</label>
          <input id="layerCountSlider" type="range" name="layerCount" min={1} max={256}  step={1} value={numOfLayers} onChange={(event) => handleLayerNumChange(event)}></input>
          <input id="layerCountTextbox" type="number" className="textik" value={numOfLayers} onChange={(event) => handleLayerNumChange(event)}/>
        </div>
       
        <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}>
          <label class = "layerOptionsLabel" htmlFor="activationTypeCombobox">Activation function:</label>
          <select id ="activationTypeCombobox" onChange = {(event) => {handleLayerActivationTypeChange(event)}}>
            {activationTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
          </select>
        </div>
        
          {kernely}
          {strides}
          {padding}

        <div className ="layerOptionsRow" style={{gridRow:7, gridColumn:1/3}}>
          <button id ="okButton" onClick={handleSubmit}>OK</button>
        </div>
      </div>
    );
  } else {
    return null; // Don't render anything if visibility is false
  }
}
