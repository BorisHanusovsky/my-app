import React from 'react';
import "./layerOptions.css";

export default class LayerOptionsMaxPool2D extends React.Component{ // komponent nastavení hlasovacej vrstvy s výberom maximálnej hodnoty
  paddingTypes = ["valid", "same"] // typy okrajového doplnenia , valid - bez dplnenia, same - doplnenie zachovávajúce veľkosť príznakovej mapy

  state = {
    visibility : this.props.vis, // viditeľnosť - príznak nastavujúci viditeľnosť okna
    type : this.props.type, // typ vrstvy - zobrazí vo vrchnej časti okna
    onClose: this.props.onClose, // metóda volaná po zatvorení okna
    poolSize : this.props.poolSize || [2,2], // veľkosť hlasovacieho okna, prednastavená hodnota je štvorec s veľkosťou strany 2
    strides: this.props.strides || [2,2], // veľkosti posunu hlasovacieho okna, prednastavená hodnota je 2 pre posuny v smere X a Y
    padding: this.props.padding || this.paddingTypes[0], // vybraný tup okrajového doplnenia, prednastavená je typ valid
    index: this.props.index, // index vrsty v sieti
    batchSize: this.props.batchSize,  // veľkosť vstupnej dávky
    inputShape : this.props.inputShape || null // tvar vstupných dát
  };

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
          {/* editor veľkosti hlasovacieho okna*/}
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Pool size:</label>
            <input className="numberEditor" type="number" value={this.state.poolSize[0]} onChange={(event) => this.handlePoolSizeChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.poolSize[1]} onChange={(event) => this.handlePoolSizeChange2(event)}/>
          </div>
          {/* editor veľkosti posunu hlasovacieho okna*/}
          <div className ="layerOptionsRow" style={{gridRow:4, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">strides:</label>
            <input className="numberEditor" type="number" value={this.state.strides[0]} onChange={(event) => this.handlestridesChange1(event)}/>
            <input className="numberEditor" type="number" value={this.state.strides[1]} onChange={(event) => this.handlestridesChange2(event)}/>
          </div>
          {/* editor typu okrajového doplnenia*/}
          <div className ="layerOptionsRow" style={{gridRow:5, gridColumn:1/3}}>
            <label className = "layerOptionsLabel" >Padding:</label>
            <select className="combobox" defaultValue={this.state.padding} onChange = {(event) => {this.handlePaddingTypeChange(event)}}>
                  {this.paddingTypes.map((activ) => (<option value = {activ}>{activ}</option>))}
            </select>
          </div>
          {/* tlačidlo OK pre zatvorenie okna  a uloženie nastavení vrstvy do siete*/}
          <div className ="layerOptionsRow" style={{gridRow:6, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
