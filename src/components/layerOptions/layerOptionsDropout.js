import React, { useState, useEffect, useRef} from "react";
import "./layerOptions.css";

export default class LayerOptionsDropout extends React.Component{
  state = {
    visibility : this.props.vis,
    onClose: this.props.onClose,
    index: this.props.index,
    rate : this.props.rate,
    type: this.props.type
  };

  componentDidUpdate(prevProps) {
    // Check if the numOfKernels prop has changed
    if (prevProps.rate!== this.props.rate) {
      this.setState({
        rate: this.props.rate || 0.5
      });
    }
  }

  handleClose = () => {
    if(this.state.rate!= ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(); // Notify the parent component about the close event
    }
  };

  handleSubmit = () => {
    if(this.state.rate!= ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(this.state); // Notify the parent component about the close event
    }
  };

  handleRateChange = (event) =>{
    this.setState({
      rate: event.target.value
    });
  }

  render(){
    if (this.props.vis) {
      return (
        <div className="layerOptions" style={{ visibility: this.props.vis }}>
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>

          <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Rate:</label>
            <input className="numberEditor" type="number" value={this.state.rate} onChange={(event) => this.handleRateChange(event)}/>
          </div>

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
