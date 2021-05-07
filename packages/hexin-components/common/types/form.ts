    // 目录树接口
  export interface IReplaceForm {
      find: string;
      replace: string;
  }
  export interface IChoiceIndex {
      value: number;
  }
  export interface IRenameDialogVisible {
      value?: boolean;
      type: string
  }
  export interface IRenameForm {
      name: string;
  }
  export interface ISettingOption {
    contentLevelFlag: boolean,
    nodeLevelFlag: boolean,
    levelIndentFlag: boolean
  }
  export interface ICheckedAllJson {
    value: boolean,
    update: number
  }