/**
 * ASCII 解析引擎 - 将字符转换为几何基元
 * 支持基础的框图、线条和形状
 */

export interface Element {
  type: 'line' | 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  text?: string;
}

export function parseASCII(ascii: string): Element[] {
  const lines = ascii.split('\n');
  const elements: Element[] = [];
  const charWidth = 14;
  const charHeight = 24;
  const padding = 4; // 增加间距防止粘连

  // 1. 扫描矩形框 (支持 [ box ])
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    let startIdx = -1;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '[') {
        startIdx = c;
      } else if (line[c] === ']' && startIdx !== -1) {
        const width = (c - startIdx + 1) * charWidth - padding;
        elements.push({
          type: 'rectangle',
          x: startIdx * charWidth + padding / 2,
          y: r * charHeight + padding,
          width: width,
          height: charHeight - padding * 2
        });
        startIdx = -1;
      }
    }
  }

  // 2. 扫描线条与文本
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const x = c * charWidth;
      const y = r * charHeight;

      if (char === '+' || char === '*') {
        elements.push({ type: 'circle', x: x + charWidth / 2, y: y + charHeight / 2, width: 4, height: 4 });
      } else if (char === '-' || char === '_' || char === '=') {
        // 水平线：稍微收缩两端防止连接处过度重合导致变粗
        elements.push({ type: 'line', x: x + 2, y: y + charHeight / 2, x2: x + charWidth - 2, y2: y + charHeight / 2 });
      } else if (char === '|') {
        elements.push({ type: 'line', x: x + charWidth / 2, y: y + 2, x2: x + charWidth / 2, y2: y + charHeight - 2 });
      } else if (char === '/') {
        elements.push({ type: 'line', x: x + charWidth - 2, y: y + 2, x2: x + 2, y2: y + charHeight - 2 });
      } else if (char === '\\') {
        elements.push({ type: 'line', x: x + 2, y: y + 2, x2: x + charWidth - 2, y2: y + charHeight - 2 });
      } else if (char !== ' ' && char !== '[' && char !== ']' && char !== '\r') {
        elements.push({ type: 'text', x: x + 2, y: y + charHeight / 2 + 6, text: char });
      }
    }
  }

  return elements;
}
