import request from "../../utils/request.js";

// 课程数量
export function courseCharts() {
  return request({
    url: "/admin/charts/courses",
    method: "get",
  });
}

// 课程数量
export function sexesCharts() {
  return request({
    url: "/admin/charts/sexes",
    method: "get",
  });
}

// 课程数量
export function articlesCharts() {
  return request({
    url: "/admin/charts/articles",
    method: "get",
  });
}

