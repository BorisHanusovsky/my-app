import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default class LayerOptionsConv2D extends React.Component{
  activationTypes = ["linear", "sigmoid", "tanh", "relu"]
  paddingTypes = ["valid", "same"]

  state = {
    numOfKernels: this.props.numOfKernels || 1,
    visibility : this.props.vis,
    type : this.props.type,
    onClose: this.props.onClose,
    activationType: this.props.activationType || this.activationTypes[0],
    kernelSize: this.props.kernelSize || [3,3],
    strides: this.props.strides || [1,1],
    padding: this.props.padding || this.paddingTypes[0],
    index: this.props.index,
    batchSize: this.props.batchSize,
    inputShape : this.props.inputShape || []
  };
  
  selectedImage = require(`./../../images/${this.state.activationType}.png`);
  stringShape = String(this.state.inputShape)

  handleKernelSize1Change = (event) =>{
    this.setState({
      kernelSize: [parseInt(event.target.value,10), this.state.kernelSize[1]]
    });
  }

  handleKernelSize2Change = (event) =>{
    this.setState({
      kernelSize: [this.state.kernelSize[0], parseInt(event.target.value,10)]
    });
  }

  handleStrideChange1 = (event) =>{
    this.setState({
      strides: [parseInt(event.target.value,10),this.state.strides[1]]
    });
  }

  handleStrideChange2 = (event) =>{
    this.setState({
      stride: [this.state.strides[0],parseInt(event.target.value,10)]
    });
  }

  componentDidUpdate(prevProps) {
    // Check if the numOfKernels prop has changed
    if (prevProps.numOfKernels !== this.props.numOfKernels) {
      this.setState({
        numOfKernels: this.props.numOfKernels || 1,
      })
    }
    if (prevProps.inputShape !== this.props.inputShape) {
      this.setState({
        inputShape: this.props.inputShape
      })
    }
    if(this.props.batchSize !== this.state.inputShape[0]){
      const updatedInputShape = [...this.state.inputShape];
      updatedInputShape[0] = this.props.batchSize; // Update the batch size dimension
      this.setState({
        inputShape: updatedInputShape
      })
    }
  }

  handleClose = () => {
    this.props.onClose();
  };

  // handleInputShapeChange = (event) => {
  //   const inputShapeString = event.target.value;
  //   // Split the string into an array and convert each element to an integer.
  //   // Filter out any non-numeric values to avoid NaN issues.
  //   const inputShapeArray = inputShapeString.split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  //   this.setState({
  //     inputShape: inputShapeArray.length > 0 ? inputShapeArray : [32, 32] // Default value if input is invalid
  //   });
  // };
  
  // handleSubmit = () => {
  //   if (this.state.numOfKernels !== "") {
  //     this.setState({
  //       visibility: false
  //     }, () => {
  //       // State has been updated, now call onClose with the current state.
  //       this.props.onClose(this.state);
  //     });
  //   }
  // };

  handleSubmit = () => {
    this.props.onClose(this.state);
  };

  handleLayerNumChange = (event) => {
    if(event.target.value === "")
    this.setState({
      numOfKernels: 1
    });
    let value = parseInt(event.target.value,10)

    if (value>= 0 && value <= 256)
      this.setState({
        numOfKernels: value
      });
  };

  handleLayerActivationTypeChange = (event) =>{
    this.selectedImage = require('./../../images/' + event.target.value.toLowerCase() + '.png')
    this.setState({
      activationType: event.target.value
    });
  }

  handlePaddingTypeChange = (event) =>{
    this.setState({
      padding: event.target.value
    });
  }

  // handleInputShapeChange = (event) => {
  //   if(event.target.value === "")
  //     this.setState({
  //       inputShape: [32,32]
  //     });
  //   else{
  //    
  //     this.setState({
  //       inputShape: arr
  //     });
  //   }
   
  //   this.setState({
  //     inputShape: event.target.value
  //   });
  // }

  // handleBatchSizeChange = (event) =>{
  //   this.setState({
  //     batchSize : event.target.value,
  //     inputShape : [parseInt(event.target.value), this.props.inputShape[1], this.props.inputShape[2], this.props.inputShape[3]]
  //   })
  // }

  handleBatchSizeChange = (event) => {
    this.setState({
      batchSize: event.target.value,
    });
  }

  render(){
    if (this.props.vis) {
      let shapeEditor;
      if (this.props.index === 0){
        shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                          <label className = "layerOptionsLabel">Batch size:</label>
                          <input id="layerCountTextbox" type="number" className="textik" min={1} max={512} value={this.state.batchSize} onChange={(event) => this.handleBatchSizeChange(event)}/>
                          <p>Input shape: {String([this.state.batchSize, this.state.inputShape.slice(1)])}</p>
                      </div> 
                      }
      // if (this.props.index === 0){
      //   shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
      //                     <label className = "layerOptionsLabel">Input shape:</label>
      //                     <input title="batch size , height, width, chanels" id="layerCountTextbox" type="text" className="textik" value={this.state.inputShape} onChange={(event) => this.handleInputShapeChange(event)}/>
      //                 </div>
      //                 }
      return (
        <div className="layerOptions" style={{ visibility: this.props.vis }}>
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>
          {shapeEditor}
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}> 
            <label className = "layerOptionsLabel">Kernel count:</label>
            <input id="layerCountSlider" type="range" name="layerCount" min={1} max={256}  step={1} value={this.state.numOfKernels} onChange={(event) => this.handleLayerNumChange(event)}></input>
            <input id="layerCountTextbox" type="number" className="textik" value={this.state.numOfKernels} onChange={(event) => this.handleLayerNumChange(event)}/>
          </div>
         
          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Activation function:</label>
            <select className="combobox" defaultValue={this.state.activationType} onChange = {(event) => {this.handleLayerActivationTypeChange(event)}}>
              {this.activationTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
            <img id = "activationImage" src={this.selectedImage}/>
          </div>
  
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Kernel size:</label>
            <input className="numberEditor" type="number" value={this.state.kernelSize[0]} onChange={(event) => this.handleKernelSize1Change(event)}/>
            <input className="numberEditor" type="number" value={this.state.kernelSize[1]} onChange={(event) => this.handleKernelSize2Change(event)}/>
          </div>
  
          <div className ="layerOptionsRow" style={{gridRow:6, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Strides:</label>
            <input className="numberEditor" type="number" value={this.state.strides[0]} onChange={(event) => this.handleStrideChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.strides[1]} onChange={(event) => this.handleStrideChange2(event)}/>
          </div>
  
          <div className ="layerOptionsRow" style={{gridRow:7, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Padding:</label>
            <select className="combobox" defaultValue={this.state.padding} onChange = {(event) => {this.handlePaddingTypeChange(event)}}>
                  {this.paddingTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
          </div>

          <div className ="layerOptionsRow" style={{gridRow:8, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null; // Don't render anything if visibility is false
    }
  }
}
