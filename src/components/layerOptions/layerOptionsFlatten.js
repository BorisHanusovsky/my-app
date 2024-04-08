import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default class LayerOptionsflatten extends React.Component{
  state = {
    visibility : this.props.vis,
    onClose: this.props.onClose,
    index: this.props.index,
    type: this.props.type,
    batchSize: this.props.batchSize,
    inputShape:this.props.inputShape,
  };


  componentDidUpdate(prevProps) {
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

  handleSubmit = () => {
    this.props.onClose(this.state);
  };

  handleInputShapeChange = (event) => {
    const inputShapeString = event.target.value;
    const inputShapeArray = inputShapeString.split(',').map(num => parseInt(num, 10) || 0);
    this.setState({ inputShape: inputShapeArray });
  }

  handleBatchSizeChange = (event) =>{
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
