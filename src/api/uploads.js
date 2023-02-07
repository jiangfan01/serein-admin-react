import request from "../../utils/request.js";

// 获取上传的Token
export function fetchUploadToken() {
  return request({
    url: "/uploads",
    method: "get",
  });
}
