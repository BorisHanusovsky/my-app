import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default class LayerOptionsflatten extends React.Component{
  state = {
    visibility : this.props.vis,
    onClose: this.props.onClose,
    index: this.props.index,
    type: this.props.type,
    inputShape:this.props.inputShape,
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
    this.setState({ visibility: false });
    this.props.onClose(this.state.inputShape); // Assuming you want to pass the inputShape back to the parent component
  };

  handleSubmit = () => {
    this.setState({ visibility: false });
    this.props.onClose(this.state); // Pass the entire state or just the parts you need
  };

  handleInputShapeChange = (event) => {
    const inputShapeString = event.target.value;
    const inputShapeArray = inputShapeString.split(',').map(num => parseInt(num, 10) || 0);
    this.setState({ inputShape: inputShapeArray });
  }

  render(){
    if (this.props.vis) {
        let shapeEditor;
        if (this.props.index === 0){
            shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                            <label className = "layerOptionsLabel">Input shape:</label>
                            <input title="batch size , height, width, chanels" id="layerCountTextbox" type="text" className="textik" value={this.state.inputShape} onChange={(event) => this.handleInputShapeChange(event)}/>
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
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null; // Don't render anything if visibility is false
    }
  }
}
