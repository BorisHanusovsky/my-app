import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";
import { string } from "@tensorflow/tfjs";

export default class LayerOptionsDense extends React.Component{
  activationTypes = ["linear", "sigmoid", "tanh", "relu", "softmax"]

  state = {
    numOfNeurons: this.props.numOfNeurons || 1,
    visibility : this.props.vis,
    type : this.props.type,
    onClose: this.props.onClose,
    activationType: this.props.activationType,
    index: this.props.index,
    inputShape:this.props.inputShape,
  };

  selectedImage = require('./../../images/linear.png');

  componentDidUpdate(prevProps) {
    // Check if the numOfNeurons prop has changed
    if (prevProps.numOfNeurons !== this.props.numOfNeurons) {
      this.setState({
        numOfNeurons: this.props.numOfNeurons || 1
      });
    }
  }

  handleClose = () => {
    if(this.state.numOfNeurons != ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(); // Notify the parent component about the close event
    }
  };

  handleSubmit = () => {
    if (this.state.numOfNeurons !== "") {
      this.setState({
        visibility: false
      });
      if (this.state.inputShape != undefined){
        if (this.state.inputShape === "") {
          this.setState({
            inputShape: [32, 32]
          }, () => {
            this.props.onClose(this.state); // Notify the parent component about the close event after state update
          });
        } 
        else {
            const val = this.state.inputShape.split(',');
            let arr = val.map(element => parseInt(element, 10));
            this.setState({
              inputShape: arr
            }, () => {
              this.props.onClose(this.state); // Notify the parent component about the close event after state update
          });
          }
      }
      else{
        this.props.onClose(this.state);
      }
      
    }
  };

  handleInputShapeChange = (event) => {
    if(event.target.value === "")
      this.setState({
        inputShape: [32,32]
      });
    else{
      const val = event.target.value.split(',');
      let arr = []
      val.forEach((element) => arr.push(parseInt(element,10)));
      this.setState({
        inputShape: arr
      });
    }
   
    this.setState({
      inputShape: event.target.value
    });
  }

  handleLayerNumChange = (event) => {
    if(event.target.value === "")
    this.setState({
      numOfNeurons: 1
    });
    let value = parseInt(event.target.value,10)

    if (value>= 0 && value <= 256)
      this.setState({
        numOfNeurons: value
      });
  };

  handleLayerActivationTypeChange = (event) =>{
    this.selectedImage = require('./../../images/' + event.target.value.toLowerCase() + '.png')
    this.setState({
      activationType: event.target.value
    });
  }

  render(){
    if (this.props.vis) {
      let shapeEditor;
      if (this.props.index === 0){
        shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                          <label className = "layerOptionsLabel" htmlFor="layerCount" >Input shape:</label>
                          <input id="layerCountTextbox" type="text" className="textik" value={this.state.inputShape} onChange={(event) => this.handleInputShapeChange(event)}/>
                      </div>
                      }
      return (

        <div className="layerOptions" >
          {shapeEditor}
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>
         
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}> 
            <label className = "layerOptionsLabel" htmlFor="layerCount" >Layer count:</label>
            <input id="layerCountSlider" type="range" name="layerCount" min={1} max={256}  step={1} value={String(this.state.numOfNeurons)} onChange={(event) => this.handleLayerNumChange(event)}></input>
            <input id="layerCountTextbox" type="number" className="textik" value={this.state.numOfNeurons} onChange={(event) => this.handleLayerNumChange(event)}/>
          </div>
         
          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel" htmlFor="activationTypeCombobox">Activation function:</label>
            <select className="combobox" defaultValue={this.state.activationType} onChange = {(event) => {this.handleLayerActivationTypeChange(event)}}>
              {this.activationTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
            <img id = "activationImage" src={this.selectedImage}/>
          </div>
  
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null; // Don't render anything if visibility is false
    }
  }
}
