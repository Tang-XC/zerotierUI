import request,{ResponseData} from "./request"
export function getSystem():Promise<ResponseData>{
  return request({
    url:"/systemInfo",
    method:'get',
  })
}
export function updateSystem(params:any):Promise<ResponseData>{
  return request({
    url:"/systemInfo",
    method:'post',
    data:params
  })
}
export function getDownLinks():Promise<ResponseData>{
  return request({
    url:"/downLinks",
    method:'get',
  })
}
export function addDownLink(params:any):Promise<ResponseData>{
  return request({
    url:"/downLink",
    method:'post',
    data:params
  })
}
export function deleteDownLink(id:number):Promise<ResponseData>{
  return request({
    url:`/downLink/${id}`,
    method:'delete',
  })
}