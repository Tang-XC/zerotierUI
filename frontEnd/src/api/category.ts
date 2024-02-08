import request,{ResponseData} from "./request"
export function getCategoryList():Promise<ResponseData> {
  return request({
    url: "/categories",
    method: "get",
  })
}
interface createCategoryRequest{
  name:string
}
export function createCategory(data:createCategoryRequest){
  return request({
    url:"/category",
    method:"post",
    data
  })
}