import * as React from 'react';
import { useState, useEffect } from "react"; 
import { LineChart } from '@mui/x-charts/LineChart'; // knižnica pre vykreaslenie grafu

export default function GraphPanel({ history }) { // komponent pre zobrazenie grafu trénovania
  const [graphs, setGraphs] = useState([]);
  const [axisData, setAxisData] = useState();

  useEffect(() => {
    if (history && history.accuracy && history.val_accuracy) { // kontrola či sú dáta o presnosti a strate dostupné
      setGraphs([
        
        { curve: "catmullRom", data: history.accuracy, label: 'Train accuracy' },
        { curve: "catmullRom", data: history.val_accuracy, label: 'Validation accuracy' },
      ]);
    }
  }, [history]);

  const handleAccuracyClicked = () => { // udalosť po kiku na tlačidlo zobrazenia grafu presnosti
    if (history && history.accuracy && history.val_accuracy) {
      setGraphs([
        { curve: "catmullRom", data: history.accuracy, label: 'Train accuracy' },
        { curve: "catmullRom", data: history.val_accuracy, label: 'Validation accuracy' },
      ]);
    }
  };

  const handleLossClicked = () => { // udalosť po kiku na tlačidlo zobrazenia grafu straty
    if (history && history.loss && history.val_loss) {
      setGraphs([
        { curve: "catmullRom", data: history.loss, label: 'Train loss' },
        { curve: "catmullRom", data: history.val_loss, label: 'Validation loss' },
      ]);
    }
  };

  return (
    <div className='graph_panel' style={{ overflow: 'auto' }}>
      <h2>Graph panel</h2>
      <div>
        <button style={history?.accuracy ? { visibility:'visible'} : {visibility : 'collapse'}} onClick={handleAccuracyClicked}>Accuracy</button>
        <button style={history?.accuracy ? { visibility:'visible'} : {visibility : 'collapse'}} onClick={handleLossClicked}>Loss</button>
        {graphs.length > 0 && (
          <LineChart
            onAxisClick={(event, d) => setAxisData(d)}
            xAxis={[{ data : Array.from({ length: graphs[0]?.data?.length || 0 }, (_, i) => i + 1)}]}
            series={graphs}
            width={1000}
            height={430}
            colors={['#F2545B', '#427D9D']}
            
          />
        )}
      </div>
    </div>
  );
}