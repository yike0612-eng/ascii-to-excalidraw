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
  const charWidth = 12; // 稍微调宽
  const charHeight = 22;

  // 1. 扫描矩形框 (例如 [ User ] 或 +---+ )
  // 识别 [...] 模式
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    let startIdx = -1;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '[') {
        startIdx = c;
      } else if (line[c] === ']' && startIdx !== -1) {
        const width = (c - startIdx + 1) * charWidth;
        elements.push({
          type: 'rectangle',
          x: startIdx * charWidth,
          y: r * charHeight + 5,
          width: width,
          height: charHeight
        });
        startIdx = -1;
      }
    }
  }

  // 2. 扫描线条
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const x = c * charWidth;
      const y = r * charHeight;

      if (char === '+' || char === '*' || char === '.') {
        // 连接点
        elements.push({ type: 'circle', x: x + 6, y: y + 11, width: 3, height: 3 });
      } else if (char === '-' || char === '_' || char === '=') {
        elements.push({ type: 'line', x, y: y + 11, x2: x + charWidth, y2: y + 11 });
      } else if (char === '|') {
        elements.push({ type: 'line', x: x + 6, y, x2: x + 6, y2: y + charHeight });
      } else if (char === '/') {
        elements.push({ type: 'line', x: x + charWidth, y, x2: x, y2: y + charHeight });
      } else if (char === '\\') {
        elements.push({ type: 'line', x, y, x2: x + charWidth, y2: y + charHeight });
      } else if (char !== ' ' && char !== '[' && char !== ']' && char !== '\r') {
        // 如果不是框架字符，则作为文本
        elements.push({ type: 'text', x: x + 2, y: y + 16, text: char });
      }
    }
  }

  return elements;
}
