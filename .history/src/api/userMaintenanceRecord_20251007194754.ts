// @ts-ignore
/* eslint-disable */
import request from "../axios/request";

/** 此处后端没有提供注释 GET /userMaintenanceRecord/${param0} */
export async function getRecordDetail1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecordDetail1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseUserMaintenanceRecordVo>(
    `/userMaintenanceRecord/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /userMaintenanceRecord/cancel */
export async function cancelRecord(
  body: API.DeleteDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/userMaintenanceRecord/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /userMaintenanceRecord/myList */
export async function listMyRecords(
  body: API.UserQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListUserMaintenanceRecordVo>(
    "/userMaintenanceRecord/myList",
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

/** 此处后端没有提供注释 POST /userMaintenanceRecord/report */
export async function createMaintenanceRecord(
  body: API.UserCreateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserMaintenanceRecordVo>(
    "/userMaintenanceRecord/report",
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
