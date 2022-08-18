// 获取学科中文名称
export const getSubjectChineseName = (subEngName) => {
  subEngName = subEngName.toLocaleLowerCase();
  if (subEngName === 'english') {
    return '英语';
  } else if (subEngName === 'math') {
    return '数学';
  } else if (subEngName === 'chinese') {
    return '语文';
  } else if (subEngName === 'physics') {
    return '物理';
  } else if (subEngName === 'chemistry') {
    return '化学';
  } else if (subEngName === 'biology') {
    return '生物';
  } else if (subEngName === 'geography') {
    return '地理';
  } else if (subEngName === 'history') {
    return '历史';
  } else if (subEngName === 'politics') {
    return '政治';
  } else if (subEngName === 'art') {
    return '艺术';
  } else if (subEngName === 'science') {
    return '科学';
  } else if (subEngName === 'others') {
    return '其他';
  } else if (subEngName === 'music') {
    return '音乐';
  } else if (subEngName === 'li') {
    return '理综';
  } else if (subEngName === 'wen') {
    return '文综';
  } else if (subEngName === 'computer_science') {
    return '信息技术';
  } else if (subEngName === 'math_wen') {
    return '文数';
  } else if (subEngName === 'math_li') {
    return '理数';
  } else if (subEngName === 'japanese') {
    return '日语';
  } else if (subEngName === 'russian') {
    return '俄语';
  } else if (subEngName === 'daode_fazhi') {
    return '道德与法治';
  } else if (subEngName === 'shufa') {
    return '书法';
  } else if (subEngName === 'fine_art') {
    return '美术';
  } else if (subEngName === 'administrative_aptitude_test') {
    return '行测';
  } else {
    return subEngName;
  }
};

// 获取学科英文名称
export const getSubjectEnglishName = (chnName) => {
  if (chnName === '语文') return 'chinese';
  else if (chnName === '数学') return 'math';
  else if (chnName === '英语') return 'english';
  else if (chnName === '物理') return 'physics';
  else if (chnName === '化学') return 'chemistry';
  else if (chnName === '生物') return 'biology';
  else if (chnName === '地理') return 'geography';
  else if (chnName === '历史') return 'history';
  else if (chnName === '政治') return 'politics';
  else if (chnName === '艺术') return 'art';
  else if (chnName === '科学') return 'science';
  else if (chnName === '其他') return 'others';
  else if (chnName === '音乐') return 'music';
  else if (chnName === '理综') return 'li';
  else if (chnName === '文综') return 'wen';
  else if (chnName === '信息技术') return 'computer_science';
  else if (chnName === '文数') return 'math_wen';
  else if (chnName === '理数') return 'math_li';
  else if (chnName === '日语') return 'japanese';
  else if (chnName === '俄语') return 'russian';
  else if (chnName === '道德与法治') return 'daode_fazhi';
  else if (chnName === '书法') return 'shufa';
  else if (chnName === '美术') return 'fine_art';
  else if (chnName === '行测') return 'administrative_aptitude_test';
  else return chnName;
};
