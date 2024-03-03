import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default class LayerOptionsMaxPool2D extends React.Component{
  paddingTypes = ["valid", "same"]

  state = {
    visibility : this.props.vis,
    type : this.props.type,
    onClose: this.props.onClose,
    poolSize : this.props.poolSize || [2,2],
    strides: this.props.strides || [1,1],
    padding: this.props.padding || this.paddingTypes[0],
    index: this.props.index,
    inputShape : this.props.inputShape || null
  };

  componentDidUpdate(prevProps) {
    // Check if the numOfKernels prop has changed
    if (prevProps.numOfKernels !== this.props.numOfKernels) {
      this.setState({
        numOfKernels: this.props.numOfKernels || 1
      });
    }
  }

  handleClose = () => {
    if(this.state.numOfKernels != ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(); // Notify the parent component about the close event
    }
  };

  handleSubmit = () => {
    if(this.state.numOfKernels!= ""){
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

  handlePaddingTypeChange = (event) =>{
    this.setState({
      padding: event.target.value
    });
  }

  handlestridesChange1 = (event) =>{
    this.setState({
      strides: [parseInt(event.target.value,10),this.state.strides[1]]
    });
  }

  handlestridesChange2 = (event) =>{
    this.setState({
      strides: [this.state.strides[0], parseInt(event.target.value,10)]
    });
  }

  handlePoolSizeChange1 = (event) =>{
    this.setState({
      poolSize: [parseInt(event.target.value,10), this.state.poolSize[1]]
    });
  }

  handlePoolSizeChange2 = (event) =>{
    this.setState({
      poolSize: [this.state.poolSize[0],parseInt(event.target.value,10)]
    });
  }

  

  handleInputShapeChange = (event) => {
    // if(event.target.value === "")
    //   this.setState({
    //     inputShape: [32,32]
    //   });
    // else{
    //   const val = event.target.value.split(',');
    //   let arr = []
    //   val.forEach((element) => arr.push(parseInt(element,10)));
    //   this.setState({
    //     inputShape: arr
    //   });
    // }
   
    this.setState({
      inputShape: event.target.value
    });
  }

  render(){
    if (this.props.vis) {
      let shapeEditor;
      if (this.props.index === 0){
        shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                          <label className = "layerOptionsLabel">Input shape:</label>
                          <input id="layerCountTextbox" type="text" className="textik" value={this.state.inputShape} onChange={(event) => this.handleInputShapeChange(event)}/>
                      </div>
                      }
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
            <label className = "layerOptionsLabel">Pool size:</label>
            <input className="numberEditor" type="number" value={this.state.poolSize[0]} onChange={(event) => this.handlePoolSizeChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.poolSize[1]} onChange={(event) => this.handlePoolSizeChange2(event)}/>
          </div>

          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">strides:</label>
            <input className="numberEditor" type="number" value={this.state.strides[0]} onChange={(event) => this.handlestridesChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.strides[1]} onChange={(event) => this.handlestridesChange2(event)}/>
          </div>
  
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <label className = "layerOptionsLabel" >Padding:</label>
            <select className="combobox" defaultValue={this.state.padding} onChange = {(event) => {this.handlePaddingTypeChange(event)}}>
                  {this.paddingTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
          </div>

          <div className ="layerOptionsRow" style={{gridRow:6, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null; // Don't render anything if visibility is false
    }
  }
}
