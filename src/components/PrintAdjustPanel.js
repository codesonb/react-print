import '../css/print-preview.css';
import { useState, useEffect } from 'react';

const PrintAdjustPanel = ({onChange, adjustY, addOn}) =>
{
  const [adjY, setAdjY]         = useState(adjustY);
  const [x, setMessageX]        = useState(addOn?.x||0);
  const [y, setMessageY]        = useState(addOn?.y||0);
  const [fontSize, setFontSize] = useState(addOn?.fontSize||3);
  const [msg, setMessage]       = useState(addOn?.msg||'');

  useEffect(() => {
    onChange?.({adjustY: adjY, x, y, fontSize, msg});
  }, [adjY, x, y, fontSize, msg]);

  return (
    <div className="row">
      <label className="field">
        <strong>Print Adjustment (Y)</strong>
        <input type="number" placeholder="Unit: mm" value={adjY} onChange={e=>setAdjY( parseFloat(e.target.value) )} />
      </label>
      <div className="adj-hid-drop">
        <div className="head">
          <button className="btn blue">Addons</button>
        </div>
        <div className="frame overdue-drop">
          <div className="box">
            <label className="field">
              <strong>Position X</strong>
              <input type="range" min="5" max="205" value={x}
                onChange={e=>setMessageX( parseInt(e.target.value, 10) )} />
            </label>
            <label className="field">
              <strong>Position Y</strong>
              <input type="range" min="5" max="294" value={y}
                onChange={e=>setMessageY( parseInt(e.target.value, 10) )} />
            </label>
            <label className="field">
              <strong>Font Size</strong>
              <input type="number" min="2" max="15" value={fontSize}
                onChange={e=>setFontSize( parseInt(e.target.value, 10) )} />
            </label>
            <label className="field">
              <strong>Message</strong>
              <textarea style={{resize: 'none'}} value={msg}
                onChange={e=>setMessage( e.target.value )}></textarea>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

}


export default PrintAdjustPanel;