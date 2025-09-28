// @ts-ignore
/* eslint-disable */
import request from "../axios/request";

/** 此处后端没有提供注释 POST /reservation/reserveDevice */
export async function reserveDevice(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reserveDeviceParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseReservationVo>("/reservation/reserveDevice", {
    method: "POST",
    params: {
      ...params,
      reservationAddDto: undefined,
      ...params["reservationAddDto"],
    },
    ...(options || {}),
  });
}
