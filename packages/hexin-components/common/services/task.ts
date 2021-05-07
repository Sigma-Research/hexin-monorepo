import { ITask } from '../types/task';
import { request } from '../utils/request';

interface IGetTaskListParams {
    name?: string;
    page?: number;
    limit?: number;
}
interface IGetTaskListReponse {
    data: ITask[];
    total: number;
}
export const getTaskList = async (params: IGetTaskListParams): Promise<IGetTaskListReponse | null> => {
    const { data } = await request({
        method: 'GET',
        url: '/api/json-preprocess/task/list/',
        params: {
            limit: 10,
            ...params,
        },
    });
    return data;
};
interface ICreateTaskParams {
    name: string;
}
export const createTask = async (params: ICreateTaskParams) => {
    const { data } = await request({
        method: 'POST',
        url: '/api/json-preprocess/task/create/',
        data: { ...params },
    });
    return data;
};
interface IGetJsonUploadOssAndSignatureParams {
    task_uid: string;
}
interface IGetJsonUploadOssAndSignatureResponse {
    accessid: string;
    host: string;
    policy: string;
    signature: string;
    expire: number;
    dir: string;
}
export const getJsonUploadOssAndSignature = async (params: IGetJsonUploadOssAndSignatureParams): Promise<IGetJsonUploadOssAndSignatureResponse> => {
    const { data } = await request({
        method: 'GET',
        url: '/api/json-preprocess/task/upload/url/',
        params,
    });
    return data;
};
interface IUploadTaskJsonParams {
    task_uid: string;
    working_oss_url?: string;
    origin_oss_url?: string;
}
export const uploadTaskJson = async (params: IUploadTaskJsonParams) => {
    const { data } = await request({
        method: 'POST',
        url: '/api/json-preprocess/task/upload/',
        data: { ...params },
    });
    return data;
};
interface IGetTaskInfoParams {
    task_uid: string;
}
export const getTaskInfo = async (params: IGetTaskInfoParams) => {
    const { data } = await request({
        method: 'GET',
        url: '/api/json-preprocess/task/info/',
        params,
    });
    return data;
};
interface IUpdateTaskPublishStatusParams {
    task_uid: string;
    publish_status: -1 | 1; // -1 取消发布，1 发布
}
export const updateTaskPublishStatus = async (params: IUpdateTaskPublishStatusParams) => {
    const { data } = await request({
        method: 'POST',
        url: '/api/json-preprocess/task/publish/',
        data: { ...params },
    });
    return data;
};
export const getScriptList = async () => {
    const { data } = await request({
        method: 'GET',
        url: '/api/json-preprocess/script/list/',
    });
    return data;
};
interface IAutoadjustParams {
    task_uid: string;
    script_uids: string[];
}
export const autoadjust = async (params: IAutoadjustParams) => {
    return await request({
        method: 'POST',
        url: '/api/json-preprocess/task/auto-adjust/',
        data: { ...params },
    });
};
interface ISaveTaskJsonParams {
    task_uid: string;
    operant_type: -1 | 0; // -1 还原，0 保存
}
export const saveTaskJson = async (params: ISaveTaskJsonParams) => {
    const { data } = await request({
        method: 'POST',
        url: '/api/json-preprocess/task/save/',
        data: { ...params },
    });
    return data;
};
export const deleteTask = async (tid: string) => {
    const { data } = await request({
        method: 'POST',
        url: '/api/json-preprocess/task/delete/',
        data: { task_uid: tid },
    });
    return data;
};
