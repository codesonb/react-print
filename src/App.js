import cfgJson from './page-config.json';

import { useState, useEffect } from 'react';

import moment from 'moment';

import PrintAdjustPanel from "./components/PrintAdjustPanel";
import PrintPreview from "./components/PrintPreview";

//---------------------------------------------
// -- Fake items obtained from API
class Ticket
{
  constructor(o) {
    Object.assign(this, o);
    this.today = moment().format('yyyy-MM-dd');
  }
  get id() {
    let t = '0'.repeat(6) + this.ticket_id;
    return t.substring(t.length - 6);
  }
}

const tickets = [
   { ticket_id: 1, cust_id: 4, cust_name: 'Adam',    item_name: 'Beaty and the Beast' }
  ,{ ticket_id: 2, cust_id: 3, cust_name: 'Bob',     item_name: 'Lion King'           }
  ,{ ticket_id: 3, cust_id: 2, cust_name: 'Crystal', item_name: 'Lion King'           }
  ,{ ticket_id: 4, cust_id: 1, cust_name: 'David',   item_name: 'Beaty and the Beast' }
].map(t => new Ticket(t));

//---------------------------------------------

const App = () =>
{
  const [addOn, setAddOn]     = useState({ msg: '', x: 140, y: 53, fontSize: 5 });

  const [sel_group, setGroup] = useState('groupKey1');
  const [sel_style, setStyle] = useState('printStyle1');

  const [config, setConfig]   = useState(cfgJson['groupKey1']['printStyle1']);

  //-------------------------------
  // init
  useEffect(() => {
    // monitor user selections
    setConfig(cfgJson[sel_group][sel_style]);
  }, [sel_group, sel_style]);

  return (
    <main>
      <PrintAdjustPanel onChange={setAddOn} />
      <PrintPreview items={tickets}
        config={config}
        addOn={addOn} />
    </main>
  );
}

export default App;
