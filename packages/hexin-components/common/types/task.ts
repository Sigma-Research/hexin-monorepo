export type TData = string | number
export enum ETaskPublishStatus {
  CANCEL = -1,
  UNPUBLISH = 0,
  PUBLISH = 1,
}
export interface ITask {
  uid: string
  name: string
  publish_status: ETaskPublishStatus
  publish_time: TData
  worker_id?: string
  is_del?: 0 | 1
  create_time: TData
  update_time: TData
  working_oss_url?: string
  origin_oss_url?: string
}
export enum EAutoadjustStatus {
  UNDO = 0,
  DOING = 1,
  SUCCESS = 2,
  FAILED = 3,
}
export interface ITaskJson {
  uid: string
  task_uid: string
  script_uid_list: string[]
  working_oss_url: string
  origin_oss_url: string
  auto_adjust_status: EAutoadjustStatus
  worker_id: string
  json_lock?: boolean
  is_del: 0 | 1
  create_time: TData
  update_time: TData
}
export interface IScriptMeta {
  uid: string
  name: string
  tag_list: string[]
  is_unique?: boolean
}
export type TTaskDetail = Pick<
  ITask,
  | 'uid'
  | 'name'
  | 'publish_status'
  | 'publish_time'
  | 'create_time'
  | 'update_time'
> &
  Pick<
    ITaskJson,
    | 'script_uid_list'
    | 'working_oss_url'
    | 'origin_oss_url'
    | 'auto_adjust_status'
  >
