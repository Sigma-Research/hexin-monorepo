import { TTaskDetail } from "../types/task";
import { TJson, TNode } from "../types/json";
import { getJsonUploadOssAndSignature, saveTaskJson } from "../services/task";
import { uploadOss } from "../utils/oss";
import { deepClone, safeStringify } from "../utils/json";

export const handleTaskJsonSave = async (json: TJson, task: TTaskDetail) => {
  const r = deepClone(json, {
    callback: (item: TNode) => {
      // 这里需要注意引用链，不要影响正在使用的 Json 数据
      const node = { ...item };
      return node;
    }
  });
  const {
    policy,
    accessid: OSSAccessKeyId,
    signature,
    dir,
    host
  } = await getJsonUploadOssAndSignature({ task_uid: task.uid });
  // 路径拼接
  const path = task.working_oss_url.split("/");
  const key = `${dir}${path[path.length - 1]}`;
  const file = new File([safeStringify(r)], `${task.name}.json`, {
    type: "application/json"
  });
  // 上传 oss
  await uploadOss({
    url: host,
    data: {
      key,
      policy,
      OSSAccessKeyId,
      success_action_status: "200",
      signature,
      file // 这里需要注意 file 参数需要放在最下面，否则可能导致上传失败
    }
  });
  // 同步至 taskJson 信息
  await saveTaskJson({
    task_uid: task.uid,
    operant_type: 0
  });
  console.log(`上传成功：${host}/${key}?t=${new Date().getTime()}`);
}