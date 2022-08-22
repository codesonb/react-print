
class BaseStrategy
{
  constructor(config, addOn, addSignal)
  {
    this.config = config;
    this.addOn = addOn;
    this.addSignal = addSignal;
  }

  renderItem(item, idx, config)
  {
    let { fields } = config;
    let elm = [];
    for (let i = 0; i < fields.length; i++)
    {
      let option = {...fields[i]};
      let baseY = option.y + (idx * 297 / (config.split||1));
      let baseKey = option.key;
      let lines = String(item[option.key]).split('\n');
      lines.forEach((line, dy) => {
        option.key = `${baseKey}-${dy}`;
        option.y = baseY - (lines.length - dy - 1) * option.fontSize;
        elm.push(this.createText(option, line));
      });
    }
    return elm;
  }

  renderAddOn(item, idx, addOn)
  {
    let elms = [];
   
    this.addSignal?.(item, idx, (o, v) => elms.push(this.createText(o, v)));
  
    // circulation add-on
    if (addOn?.msg.trim())
    {
      let o = { ...addOn };
      o.y = o.y + ( idx * 297 / (this.config.split||1) );
      
      let lines = o.msg.split('\n');
      for (let i = 0; i < lines.length; i++)
      {
        o.key = `addOn-${i}`;
        if (lines[i]) elms.push(this.createText(o, lines[i]));
        o.y += o.fontSize;
      }
    }
    return elms;
  }
}

class SvgStrategy extends BaseStrategy
{
  constructor(config, addOn, addSignal) { super(config, addOn, addSignal); }

  createText(o, v)
  {
    // o: option { x, y, fontSize }, v: text "string"
    return <text key={o.key} x={o.x} y={o.y - o.fontSize}
      fontSize={o.fontSize} dominantBaseline="hanging"
      >{ v }</text>;
  }
  
  renderPage(items, pageNumber) {
    return (
      <div className="print-page">
        <span className="page-number">{ pageNumber }</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297">
          <image href={this.config.background} x="0" y="0" width="210" height="297" />
          { items.map((itm, idx) =>
            <g key={idx}>
              { this.renderItem(itm, idx, this.config) }
              { this.renderAddOn(itm, idx, this.addOn) }
            </g>
          )}
        </svg>
      </div>
    );
  }
} // end class SvgStrategy

class HtmlStrategy extends BaseStrategy
{
  constructor(config, addOn, addSignal) { super(config, addOn, addSignal); }

  createText(o, v)
  {
    let s = {
      left: `${o.x}mm`,
      top: `${o.y - o.fontSize + (this.addOn.adjustY||0) }mm`,
      fontSize: `${o.fontSize}mm`
    };
    return <span key={o.key} style={s}>{ v }</span>
  }

  renderPage(items, pageNumber)
  {
    let bgStyle = {
       backgroundImage: `url('${this.config.background}')`
      ,backgroundPositionX: 0
      ,backgroundPositionY: 0
      ,backgroundRepeat: 'no-repeat'
      ,backgroundSize: '210mm 297mm'
    };

    return (
      <div className="page" style={bgStyle}>
      { items.map((itm, idx) =>
        <div style={{display: 'contents'}} key={idx}>
          { this.renderItem(itm, idx, this.config) }
          { this.renderAddOn(itm, idx, this.addOn) }
        </div>
      )}
      </div>
    );
  }
} // end class HtmlStrategy

export const A4PrintPage = ({config, items, addOn, addSignal, pageNumber}) => {
  return new HtmlStrategy(config, addOn, addSignal).renderPage(items, pageNumber);
}

export const A4PreviewPage = ({config, items, addOn, addSignal, pageNumber}) => {
  return new SvgStrategy(config, addOn, addSignal).renderPage(items, pageNumber);
}

