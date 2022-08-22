import '../css/print-preview.css';

import { useState } from 'react';
import ReactDOM from 'react-dom';

import { A4PrintPage, A4PreviewPage } from './A4Page';

const PrintPreview = ({items, config, addOn, addSignal, ...props}) =>
{
  const [modal, setModal] = useState(null);
  const [dp_throttle, setDisplayThrottle] = useState(15);
  const [preview_size, setPreviewSize] = useState(9);

  const zoomIn  = () => { setPreviewSize( Math.min(14, +1+preview_size) ); }
  const zoomOut = () => { setPreviewSize( Math.max( 0, -1+preview_size) ); }
  const onScroll = (e) =>
  {
    // progressive loading
    if (dp_throttle > pages.length) return;
    if (Math.ceil(10+e.target.scrollTop + e.target.clientHeight) >= e.target.scrollHeight) {
      setDisplayThrottle(20 + dp_throttle);
    }
  }

  const pages = items.reduce((r, x) => {
    if ( r[r.length - 1]?.length >= (config?.split||1) ) r.push([]);
    let arr = r[r.length - 1];
    arr.push(x);
    arr.key = `${arr.key||''}//${x.key}`;
    return r;
  }, [[]]);

  const print = () =>
  {
    // create print document
    let frame = document.createElement('iframe');
    frame.style.visibility = 'hidden';
    frame.style.height = 0;
    document.body.appendChild(frame);
    let doc = frame.contentDocument;

    // for eliminating React warning
    let div = doc.createElement('div');
    doc.body.appendChild(div);

    // render print content by React
    ReactDOM.render(<>{ pages.map((x,i) =>
      <A4PrintPage key={i} items={x} config={config} addOn={addOn} addSignal={addSignal}/>
    )}</>, div, () => {
      /* function callback after render */
      // set print style

      let links = [
        // import font
         'https://fonts.googleapis.com/earlyaccess/cwtexkai.css'
        // import custom style
        ,`${window.location.protocol}//${window.location.hostname}:${window.location.port}/assets/css/print-bill.css`
      ].map(link => {
        let elm = doc.createElement('link');
        elm.setAttribute('type', 'text/css');
        elm.setAttribute('rel', 'stylesheet');
        elm.setAttribute('media', 'all');
        elm.setAttribute('href', link);
        doc.head.appendChild(elm);
        return elm;
      }).map(elm => new Promise((resolve, reject) => {
        elm.onload = resolve;
      }));

      Promise.all(links).then(() => {
        // execute print
        setTimeout(() => {
          frame.focus();
          frame.contentWindow.print();
          document.body.removeChild(frame);
        // assume 1.5 second is enough for all machines to finish loading content
        }, 1500);
      });

    });
  } // end void print()

  return (
    <div id="print-preview" className={`sz-${preview_size}`}>
      <div className="body" onScroll={onScroll}>
        { pages.slice(0, dp_throttle).map((p,i) =>
          <A4PreviewPage key={p.key} config={config}
            items={p} pageNumber={`第 ${1+i} 頁`} addOn={addOn}
            addSignal={addSignal}
          />
        )}
      </div>
      <div className="afloat-tool">
        <button className="tool-btn zoom-in" onClick={zoomIn}>
          <i className="fa fa-plus"></i>
        </button>
        <button className="tool-btn zoom-out" onClick={zoomOut}>
          <i className="fa fa-minus"></i>
        </button>
        <button className="tool-btn print" onClick={print}>
          <i className="fa fa-print"></i>
        </button>
      </div>
      <div className="afloat-count">
        <span>{ Math.min(pages.length, dp_throttle) } / { pages.length }</span>
      </div>
    </div>
  );

}


export default PrintPreview;