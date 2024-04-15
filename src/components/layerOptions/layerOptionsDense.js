import React from 'react';
import "./layerOptions.css";
export default class LayerOptionsDense extends React.Component{ // komponent nastavení konvolučnej vrstvy
  activationTypes = ["linear", "sigmoid", "tanh", "relu", "softmax"] // typy aktivačných funkcií

  state = {
    numOfNeurons: this.props.numOfNeurons || 16, // počet neurónov vrstvy, prednastavená hodnota je 16
    visibility : this.props.vis, // viditeľnosť - príznak nastavujúci viditeľnosť okna
    type : this.props.type, // typ vrstvy - zobrazí vo vrchnej časti okna
    onClose: this.props.onClose, // metóda volaná po zatvorení okna
    activationType: this.props.activationType, // zvolená aktivačná vrstva, prednastavená hodnota je lineárna
    index: this.props.index, // index vrsty v sieti
    batchSize: this.props.batchSize, // veľkosť vstupnej dávky
    inputShape:this.props.inputShape, // tvar vstupných dát
  };

  selectedImage = require('./../../images/linear.png'); // obrázok, zobrazujúci vybraný tvar aktivačnej funkcie

  componentDidUpdate(prevProps) { // zmena stavu komponentu v prípade zmien vstupných argumentov
    if (prevProps.numOfNeurons !== this.props.numOfNeurons) {
      this.setState({
        numOfNeurons: this.props.numOfNeurons || 1
      });
    }
    if (prevProps.inputShape !== this.props.inputShape) {
      this.setState({
        inputShape: this.props.inputShape
      })
    }
    if(this.props.batchSize !== this.state.inputShape[0]){
      const updatedInputShape = [...this.state.inputShape];
      updatedInputShape[0] = this.props.batchSize; // úprava tvaru vstupu do siete podľa veľkosti vstupnej dávky
      this.setState({
        inputShape: updatedInputShape
      })
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

  handleBatchSizeChange = (event) =>{
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
                          <label className = "layerOptionsLabel" htmlFor="layerCount" >Batch size:</label>
                          <input id="layerCountTextbox" type="number" className="textik" min={1} max={512} value={this.state.batchSize} onChange={(event) => this.handleBatchSizeChange(event)}/>
                          <p>Input shape: {String([this.state.batchSize, this.state.inputShape.slice(1)])}</p>
                      </div>
                      }
      return (

        <div className="layerOptions" >
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
            {/* tlačidlo X pre zatvorenie okna */}
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>

          {/* editor veľkosti vstupnej dávky*/}
          {shapeEditor}
          {/* editor počtu neurónov*/}
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}> 
            <label className = "layerOptionsLabel" htmlFor="layerCount" >Neuron count:</label>
            <input id="layerCountSlider" type="range" name="layerCount" min={1} max={256}  step={1} value={String(this.state.numOfNeurons)} onChange={(event) => this.handleLayerNumChange(event)}></input>
            <input id="layerCountTextbox" type="number" className="textik" value={this.state.numOfNeurons} onChange={(event) => this.handleLayerNumChange(event)}/>
          </div>
          {/* editor aktivačnej funkcie*/}
          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel" htmlFor="activationTypeCombobox">Activation function:</label>
            <select className="combobox" defaultValue={this.state.activationType} onChange = {(event) => {this.handleLayerActivationTypeChange(event)}}>
              {this.activationTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
            <img id = "activationImage" src={this.selectedImage}/>
          </div>
          {/* tlačidlo OK pre zatvorenie okna a uloženie nastavení vrstvy do siete*/}
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
