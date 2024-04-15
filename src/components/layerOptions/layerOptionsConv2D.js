import React from 'react';
import "./layerOptions.css";

export default class LayerOptionsConv2D extends React.Component{ // komponent nastavení konvolučnej vrstvy
  activationTypes = ["linear", "sigmoid", "tanh", "relu"]  // typy aktivačných funkcií
  paddingTypes = ["valid", "same"] // typy okrajového doplnenia , valid - bez dplnenia, same - doplnenie zachovávajúce veľkosť príznakovej mapy

  state = {
    numOfKernels: this.props.numOfKernels || 16, // počet kernelov použitých pri konvolúcii, prednastvená hodnota je 16
    visibility : this.props.vis, // viditeľnosť - príznak nastavujúci viditeľnosť okna
    type : this.props.type, // typ vrstvy - zobrazí vo vrchnej časti okna
    onClose: this.props.onClose, // metóda volaná po zatvorení okna
    activationType: this.props.activationType || this.activationTypes[0], // zvolená aktivačná vrstva, prednastavená hodnota je lineárna
    kernelSize: this.props.kernelSize || [3,3], // veľkosť konvolučného jadra, prednastavená hodnota je štvorec s veľkosťou strany 3
    strides: this.props.strides || [1,1], // veľkosti posunu hlasovacieho okna, prednastavená hodnota je 1 pre posuny v smere X a Y
    padding: this.props.padding || this.paddingTypes[0], // vybraný tup okrajového doplnenia, prednastavená je typ valid
    index: this.props.index, // index vrsty v sieti
    batchSize: this.props.batchSize, // veľkosť vstupnej dávky
    inputShape : this.props.inputShape || [] // tvar vstupných dát
  };
  
  selectedImage = require(`./../../images/${this.state.activationType}.png`); // obrázok, zobrazujúci vybraný tvar aktivačnej funkcie

  componentDidUpdate(prevProps) { // zmena stavu komponentu v prípade zmien vstupných argumentov
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
    if(this.state.inputShape){
      if(this.props.batchSize !== this.state.inputShape[0]){
        const updatedInputShape = [...this.state.inputShape];
        updatedInputShape[0] = this.props.batchSize; // úprava tvaru vstupu do siete podľa veľkosti vstupnej dávky
        this.setState({
          inputShape: updatedInputShape
        })
      }
    }
    
  }

  handleClose = () => { // po stlačení tlačidla X nebudú uložené aktuálne nastavenia do modelu
    this.props.onClose();
  };

  handleSubmit = () => { // po stlačení tlačidla OK budú uložené aktuálne nastavenia do modelu
    this.props.onClose(this.state);
  };

  // UKLADANIE STAVU KOMPONENT
  //-----------------------------------------------------------------------------------------

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

  handleBatchSizeChange = (event) => {
    this.setState({
      batchSize: event.target.value,
    });
  }

//-----------------------------------------------------------------------------------------
// ZOBRAZENIE OKNA

  render(){
    if (this.props.vis) { // okno zbude zobrazené len ak argument vis(viditeľnosť) bude mať kladnú hodnotu
      let shapeEditor;
      if (this.props.index === 0){ // logika zobrazenia/nezobrazenia editoru pre veľkosť vstupnej dávky
        shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                          <label className = "layerOptionsLabel">Batch size:</label>
                          <input id="layerCountTextbox" type="number" className="textik" min={1} max={512} value={this.state.batchSize} onChange={(event) => this.handleBatchSizeChange(event)}/>
                          <p>Input shape: {String([this.state.batchSize, this.state.inputShape.slice(1)])}</p>
                      </div> 
                      }
      return (
        <div className="layerOptions" style={{ visibility: this.props.vis }}>
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
             {/* tlačidlo X pre zatvorenie okna */}
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>
          {/* editor veľkosti vstupnej dávky*/}
          {shapeEditor}
          {/* editor počtu konvolučných jadier*/}
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}> 
            <label className = "layerOptionsLabel">Kernel count:</label>
            <input id="layerCountSlider" type="range" name="layerCount" min={1} max={256}  step={1} value={this.state.numOfKernels} onChange={(event) => this.handleLayerNumChange(event)}></input>
            <input id="layerCountTextbox" type="number" className="textik" value={this.state.numOfKernels} onChange={(event) => this.handleLayerNumChange(event)}/>
          </div>
          {/* editor aktivačnej funkcie*/}
          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Activation function:</label>
            <select className="combobox" defaultValue={this.state.activationType} onChange = {(event) => {this.handleLayerActivationTypeChange(event)}}>
              {this.activationTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
            <img id = "activationImage" src={this.selectedImage}/>
          </div>
          {/* editor veľkosti konvolučného jadra*/}
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Kernel size:</label>
            <input className="numberEditor" type="number" value={this.state.kernelSize[0]} onChange={(event) => this.handleKernelSize1Change(event)}/>
            <input className="numberEditor" type="number" value={this.state.kernelSize[1]} onChange={(event) => this.handleKernelSize2Change(event)}/>
          </div>
          {/* editor veľkosti posunu konvolučného jadra*/}
          <div className ="layerOptionsRow" style={{gridRow:6, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Strides:</label>
            <input className="numberEditor" type="number" value={this.state.strides[0]} onChange={(event) => this.handleStrideChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.strides[1]} onChange={(event) => this.handleStrideChange2(event)}/>
          </div>
          {/* editor typu okrajového doplnenia*/}
          <div className ="layerOptionsRow" style={{gridRow:7, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Padding:</label>
            <select className="combobox" defaultValue={this.state.padding} onChange = {(event) => {this.handlePaddingTypeChange(event)}}>
                  {this.paddingTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
          </div>
          {/* tlačidlo OK pre zatvorenie okna a uloženie nastavení vrstvy do siete*/}
          <div className ="layerOptionsRow" style={{gridRow:8, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
