import { useState, useEffect, useRef } from 'react';
import rough from 'roughjs';
import { Download, Share2, Sparkles, Trash2, Box, Cloud, GitBranch, Layout, Cpu, Maximize2 } from 'lucide-react';
import { parseASCII } from './utils/parser';
import confetti from 'canvas-confetti';

const EXAMPLES = [
  {
    id: 'arch',
    name: 'Cloud Arch',
    icon: <Cloud size={20} />,
    data: `      [ Mobile ]
          |
    +-----+-----+
    |  Auth API |
    +-----+-----+
          |
    +-----+-----+      +--------+
    |  Gateway  | <--- | Config |
    +-----+-----+      +--------+
       /     \\
   [Node 1] [Node 2]
      \\       /
    +-----+-----+
    | Database  |
    +-----------+`
  },
  {
    id: 'flow',
    name: 'Login Flow',
    icon: <GitBranch size={20} />,
    data: `( Start )
    |
[ Credentials ]
    |
{ Valid? } --No--> [ Error ]
    |
   Yes
    |
[ Home Page ]
    |
 ( End )`
  },
  {
    id: 'ui',
    name: 'Web Layout',
    icon: <Layout size={20} />,
    data: `+-----------------------+
| [ Logo ]  [H] [A] [C] |
+-----------------------+
|                       |
|   [ Better Design ]   |
|   [ Modern Style  ]   |
|                       |
|   +-------+ +-------+ |
|   | Card1 | | Card2 | |
|   +-------+ +-------+ |
+-----------------------+`
  },
  {
    id: 'rocket',
    name: 'Rocket Art',
    icon: <Box size={20} />,
    data: `      /\\
     |  |
     |  |
    /|  |\\
   /_|  |_\\
     |  |
    /____\\
   ( vvvv )`
  },
  {
    id: 'system',
    name: 'Bot System',
    icon: <Cpu size={20} />,
    data: `      [o] [o]
       \\___/
      |     |
    --| ROB |---
      |     |
      +-----+
       /   \\
      [ ] [ ]`
  }
];

function App() {
  const [ascii, setAscii] = useState(EXAMPLES[0].data);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderCanvas();
    }
  }, [ascii, width, height]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rc = rough.canvas(canvas);
    const elements = parseASCII(ascii);

    elements.forEach((el) => {
      const options = {
        roughness: 1.5,
        stroke: '#1e1e1e',
        strokeWidth: 2,
        seed: 42,
      };

      if (el.type === 'line' && el.x2 !== undefined && el.y2 !== undefined) {
        rc.line(el.x, el.y, el.x2, el.y2, options);
      } else if (el.type === 'rectangle' && el.width !== undefined && el.height !== undefined) {
        rc.rectangle(el.x, el.y, el.width, el.height, { ...options, fill: 'rgba(99, 102, 241, 0.05)', fillStyle: 'hachure' });
      } else if (el.type === 'circle' && el.width !== undefined) {
        rc.circle(el.x, el.y, el.width, { ...options, fill: 'rgba(0,0,0,0.05)' });
      } else if (el.type === 'text' && el.text) {
        ctx.font = '20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillStyle = '#1e1e1e';
        ctx.fillText(el.text, el.x, el.y);
      }
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="app-container">
      <header>
        <h1>ASCII <Sparkles size={32} style={{ verticalAlign: 'middle', marginLeft: '8px' }} /> Excalidraw</h1>
        <p className="subtitle">Modern ASCII-to-Sketch Transformer</p>
      </header>

      <div className="editor-grid">
        <div className="panel">
          <div className="panel-header">
            <span>Editor</span>
            <button className="secondary" onClick={() => setAscii('')} title="Clear">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={ascii}
            onChange={(e) => setAscii(e.target.value)}
            spellCheck={false}
            placeholder="Drawing something..."
          />
          <div className="examples-section">
            {EXAMPLES.map(ex => (
              <div key={ex.id} className="example-card" onClick={() => setAscii(ex.data)}>
                <i>{ex.icon}</i>
                <span className="name">{ex.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>Preview</span>
            <div className="size-controls">
              <label><Maximize2 size={12} /> W <input type="range" min="400" max="1200" value={width} onChange={e => setWidth(Number(e.target.value))} /></label>
              <label>H <input type="range" min="300" max="1000" value={height} onChange={e => setHeight(Number(e.target.value))} /></label>
            </div>
            <button key="download-btn" onClick={downloadImage}>
              <Download size={16} /> Export
            </button>
          </div>
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} width={width} height={height} />
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="secondary">
          <Share2 size={16} /> Share Design
        </button>
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Built with Antigravity • Powered by Rough.js
      </footer>
    </div>
  );
}

export default App;
