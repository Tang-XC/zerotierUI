import request,{ResponseData} from "./request"
export function getProductList(params?:any):Promise<ResponseData> {
  return request({
    url: "/products",
    method: "get",
    params,
  })
}
export function createProduct(data:any):Promise<ResponseData>{
  return request({
    url:"/product",
    method:"post",
    data,
  })
}
export function updateProduct(id:number,data:any):Promise<ResponseData>{
  return request({
    url:`/product/${id}`,
    method:"put",
    data,
  })
}
export function deleteProduct(id:number):Promise<ResponseData>{
  return request({
    url:`/product/${id}`,
    method:"delete"
  })
}