// @ts-ignore
/* eslint-disable */
import request from "./src/axios/request";

/** 此处后端没有提供注释 POST /borrow/borrowDevice */
export async function borrowDevice(
  body: API.BorrowRecordAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBorrowRecordVo>("/borrow/borrowDevice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /borrow/getBorrowRecordList */
export async function getBorrowRecordList(
  body: API.BorrowRecordQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListBorrowRecordVo>(
    "/borrow/getBorrowRecordList",
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

/** 此处后端没有提供注释 POST /borrow/getBorrowRecordListWithStatus */
export async function getBorrowRecordListWithStatus(
  body: API.BorrowRecordQueryWithStatusDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListBorrowRecordVo>(
    "/borrow/getBorrowRecordListWithStatus",
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

/** 此处后端没有提供注释 POST /borrow/returnDevice */
export async function returnDevice(
  body: API.BorrowRecordReturnDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBorrowRecordVo>("/borrow/returnDevice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
