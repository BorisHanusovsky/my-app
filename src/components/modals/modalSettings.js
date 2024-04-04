import React, { useState } from 'react';

export default function ModalSettings({ visibility, onSettingsClose }) {
  const [selectedOptimizer, setSelectedOptimizer] = useState('SGD');
  const [learningRate, setLearningRate] = useState('0.001');
  const [epochs, setEpochs] = useState('10');

  const optimizers = ['SGD', 'Adam', 'Adadelta', 'Adagrad', 'Adamax'];
  
  const handleClosePressed = () => {
    onSettingsClose(null);
  };

  const handleCloseSelected = () => {
    onSettingsClose({
      optimizer: selectedOptimizer,
      learningRate: parseFloat(learningRate),
      epochs: parseInt(epochs)
    });
  };

  return (
    <div style={{ display: visibility ? 'block' : 'none', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '1', width: '100%', height: '100%' }}>
      <div style={{ backgroundColor: '#427D9D', margin: '15% auto', padding: '20px', border: '2px solid #fff', width: '30%', minWidth: '300px' }}>
        <div className="layerOptionsRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Training settings</h2>
          <span className="close" onClick={handleClosePressed} style={{ cursor: 'pointer' }}> &times; </span>
        </div>
        <div className="layerOptionsRow">
            <label className="layerOptionsLabel">Optimizer:</label>
            <select className="combobox" onChange={(event) => setSelectedOptimizer(event.target.value)}>
              {optimizers.map((op) => (<option key={op} value={op}>{op}</option>))}
            </select>
        </div>
        <div className="layerOptionsRow">
            <label className="layerOptionsLabel">Learning rate:</label>
            <input type='text' value={learningRate} onChange={(event) => setLearningRate(event.target.value)} style={{ height: '50%', maxWidth: '100px'}}></input>
        </div>
        <div className="layerOptionsRow">
            <label className="layerOptionsLabel">Epochs:</label>
            <input type='text' value={epochs} onChange={(event) => setEpochs(event.target.value)} style={{ height: '50%', maxWidth: '100px'}}></input>
        </div>
        <button onClick={handleCloseSelected}>OK</button>
      </div>
    </div>
  );
}
