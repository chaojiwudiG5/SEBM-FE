// @ts-ignore
/* eslint-disable */
import request from "../axios/request";

/** 此处后端没有提供注释 POST /mechanicanMaintenanceRecord/add */
export async function addMaintenanceTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addMaintenanceTaskParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/mechanicanMaintenanceRecord/add", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /mechanicanMaintenanceRecord/getRecordDetail */
export async function getRecordDetail(
  body: API.MechanicRecordQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseMechanicanMaintenanceRecordVo>(
    "/mechanicanMaintenanceRecord/getRecordDetail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /mechanicanMaintenanceRecord/myList */
export async function listMyTasks(
  body: API.MechanicanQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMechanicanMaintenanceRecordVo>(
    "/mechanicanMaintenanceRecord/myList",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /mechanicanMaintenanceRecord/updateStatus */
export async function updateTaskStatus(
  body: API.MechanicanUpdateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>(
    "/mechanicanMaintenanceRecord/updateStatus",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
