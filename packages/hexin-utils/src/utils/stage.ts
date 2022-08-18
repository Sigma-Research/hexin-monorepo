// 获取学段中文名称
export const getStageChineseName = (stageEngName: string): string => {
  stageEngName = stageEngName.toLocaleLowerCase();
  if (stageEngName === 'primary') {
    return '小学';
  } else if (stageEngName === 'junior') {
    return '初中';
  } else if (stageEngName === 'senior') {
    return '高中';
  } else if (stageEngName === 'civil_servant_examination') {
    return '公务员考试';
  } else {
    return stageEngName;
  }
};

// 获取学段英文名称
export const getStageEnglishName = (stageChName: string): string => {
  if (stageChName === '小学') return 'primary';
  else if (stageChName === '初中') return 'junior';
  else if (stageChName === '高中') return 'senior';
  else if (stageChName === '公务员考试') return 'civil_servant_examination';
  else return stageChName;
};
