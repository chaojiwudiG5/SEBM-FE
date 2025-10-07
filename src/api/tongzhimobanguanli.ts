// @ts-ignore
/* eslint-disable */
import request from "./src/axios/request";

/** 创建通知模板 管理员创建新的通知模板 POST /template/create */
export async function createTemplate(
  body: API.CreateTemplateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTemplateVo>("/template/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询模板详情 根据ID查询模板详细信息 GET /template/detail/${param0} */
export async function getTemplateDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTemplateDetailParams,
  options?: { [key: string]: any }
) {
  const { templateId: param0, ...queryParams } = params;
  return request<API.BaseResponseTemplateVo>(`/template/detail/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询通知模板 管理员分页查询通知模板列表 POST /template/list */
export async function getTemplateList(
  body: API.TemplateQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageTemplateVo>("/template/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
