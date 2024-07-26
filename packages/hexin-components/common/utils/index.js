import katex from 'katex';

const renderFang = (dom, data) => {
  while (dom.firstChild) dom.removeChild(dom.firstChild);
  const container = document.createElement('span');
  const size = data.width;
  const collapse = data.collapse;
  for (let i = 0; i < data.length; i++) {
    const span = document.createElement('span');
    span.style.width = size;
    span.style.height = size;
    span.style.boxSizing = 'border-box';
    span.style.display = 'inline-block';
    span.style.lineHeight = '1';
    span.style.verticalAlign = 'middle';
    span.style.border = '1px #000 solid';
    if (i !== 0) {
      if (collapse) {
        span.style.borderLeft = 'none';
      } else {
        span.style.marginLeft = '0.9mm';
      }
    }
    span.style.position = 'relative';
    container.appendChild(span);
  }
  dom.appendChild(container);
};

const renderTian = (dom, data) => {
  while (dom.firstChild) dom.removeChild(dom.firstChild);
  const container = document.createElement('span');
  const fontSize = data.fontSize || '9pt';
  let cellSize = data.cellSize || '8mm';
  let unit = (cellSize.match(/[a-z%]+$/) && cellSize.match(/[a-z%]+$/)[0] )|| '';
  if (!unit) {
    unit = 'px';
    cellSize += unit;
  }
  const halfSize = parseFloat(cellSize) / 2 - 0.264583 + unit;
  const pinyin = data.pinyin ? data.pinyin.trim().split(/,/) : undefined;
  const lineType = data.innerLineType || 'dashed';
  for (let i = 0; i < data.length; i++) {
    const ruby = document.createElement('ruby');
    const span = document.createElement('span');
    span.style.width = cellSize;
    span.style.height = cellSize;
    span.style.boxSizing = 'border-box';
    span.style.display = 'inline-block';
    span.style.lineHeight = '1';
    span.style.verticalAlign = 'middle';
    span.style.border = '1px #000 solid';
    if (i !== 0) span.style.borderLeft = 'none';
    span.style.position = 'relative';
    'vh'.split('').forEach(side => {
      const inner = document.createElement('span');
      inner.innerText = ' ';
      inner.style.position = 'absolute';
      inner.style.boxSizing = 'border-box';
      inner.style[side === 'v' ? 'borderLeft' : 'borderTop'] =
        '1px #666 ' + lineType;
      inner.style[side === 'v' ? 'width' : 'height'] = '1px';
      inner.style[side === 'v' ? 'top' : 'left'] = '1px';
      inner.style[side === 'v' ? 'bottom' : 'right'] = '1px';
      inner.style[side === 'v' ? 'left' : 'top'] = halfSize;
      span.appendChild(inner);
    });
    ruby.appendChild(span);
    const rt = document.createElement('rt');
    rt.style.maxWidth = cellSize;
    rt.style.whiteSpace = 'nowrap';
    rt.style.textAlign = 'center';
    rt.style.fontSize = fontSize;
    rt.style.boxSizing = 'border-box';
    if (pinyin && pinyin[i]) {
      rt.innerText = pinyin[i];
    }
    ruby.appendChild(rt);
    container.appendChild(ruby);
  }
  dom.appendChild(container);
};

const renderPinyin = (dom, data) => {
  while (dom.firstChild) dom.removeChild(dom.firstChild);
  const container = document.createElement('span');
  const fontSize = data.fontSize || '9pt';
  const pinyin = data.pinyin.trim().split(/,/);
  if (data.text) {
    const text = data.text.split('');
    for (var i = 0; i < pinyin.length; i++) {
      const ruby = document.createElement('ruby');
      const span = document.createElement('span');
      if (text[i] === ' ') {
        span.innerHTML = '&emsp;';
      } else {
        span.innerText = text[i];
      }
      ruby.appendChild(span);
      const rt = document.createElement('rt');
      rt.style.textAlign = 'center';
      rt.style.fontSize = fontSize;
      rt.innerText = pinyin[i];
      ruby.appendChild(rt);
      if (i !== 0) ruby.style.paddingLeft = '2px';
      container.appendChild(ruby);
    }
  } else {
    for (let j = 0; j < pinyin.length; j++) {
      const span = document.createElement('span');
      span.style.fontSize = fontSize;
      span.innerText = pinyin[j];
      if (i !== 0) span.style.paddingLeft = '2px';
      container.appendChild(span);
    }
  }
  dom.appendChild(container);
};

const load$img = $img =>
  new Promise(resolve => {
    $img.onload = () => resolve();
    $img.onerror = () => resolve();
    if ($img.complete) resolve();
  });

const div = document.createElement('div');
const parser = str => {
  if (!str) {
    return '';
  }
  // 暂时先在这里处理图片缓存的问题
  str = str.replace(/<img([^>]*) src=\"([^\"]*)\"([^>]*)>/g, (...args) => {
    let url = args[2];
    if (/base64/.test(url)) return `<img${args[1]} src="${url}"${args[3]}>`;
    if (url.includes('?')) {
      const querys = url
        .split('?')[1]
        .split('&')
        .map(item => {
          const query = item.split('=');
          return {
            key: query[0],
            value: query[1],
          };
        });
      if (querys.find(item => item.key === 't')) url = url;
      else url = url + '&t=' + Date.now().toString();
    } else {
      url = url + '?t=' + Date.now().toString();
    }
    let width;
    if (/\/resize\,w_(\d+)/.test(url)) {
      width = Number(url.match(/\/resize\,w_(\d+)/)[1]);
      url = url.replace(/\/resize\,w_(\d+)/, '');
      return `<img width="${width}"${args[1]} src="${url}"${args[3]}>`;
    }
    return `<img${args[1]} src="${url}"${args[3]}>`;
  });
  let imgCount = 0;
  const imgMap = new Map();
  str = str.replace(/<img[^>]+\/>/g, (...args) => {
    imgCount++;
    imgMap.set(imgCount, args[0]);
    return `#${imgCount}#`;
  });
  str = str.replace(/\$\$(.*?)\$\$/gi, (match, latex) => {
    let content = latex;
    div.innerHTML = content;
    content = div.innerText;
    try {
      content = katex.renderToString(content, {
        output: 'html',
      });
    } catch (err) {
      console.error('公式包含无法转换的符号', err);
    }
    return content;
  });
  str = str.replace(/#(\d+)#/g, (...args) => {
    const img = imgMap.get(Number(args[1]));
    return img;
  });
  div.innerHTML = str;
  div
    .querySelectorAll(
      '[data-label="fang"], [data-label="tian"], [data-label="pinyin"]'
    )
    .forEach((node) => {
      if (node.dataset.label === 'fang') {
        renderFang(node, {
          width: node.dataset.width,
          collapse: node.dataset.collapse,
          length: Number(node.dataset.length),
        });
      }
      if (node.dataset.label === 'tian') {
        renderTian(node, {
          fontSize: node.dataset.fontSize,
          cellSize: node.dataset.cellSize,
          pinyin: node.dataset.pinyin,
          innerLineType: node.dataset.innerLineType,
          length: Number(node.dataset.length),
        });
      }
      if (node.dataset.label === 'pinyin') {
        renderPinyin(node, {
          fontSize: node.dataset.fontSize,
          pinyin: node.dataset.pinyin,
          text: node.dataset.text,
        });
      }
    });
  str = div.innerHTML;
  return str;
};

const tiff2Jpg = (str) => {
  if (!str) {
    return str;
  }
  return str.replace(
    /src=(['"])(.*?)(\.tif[f]{0,1})\1/g,
    'src=$1$2$3?x-oss-process=image/interlace,1/format,jpg$1'
  );
}

export {
  load$img,
  parser,
  tiff2Jpg
}
