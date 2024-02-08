import request from "./request";

export interface SignInData {
  account: string;
  password: string;
}
export function signIn(data:SignInData):Promise<any>{
  return request({
    url:"/login",
    method:"post",
    data
  })
}
export interface SignUpData {
  account: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
}
export function signUp(data:SignUpData):Promise<any>{
  return request({
    url:"/register",
    method:"post",
    data
  })
}
export function getUser():Promise<any>{
  return request({
    url:"/user",
    method:"get",
  })
}
export function getAllUsers(params:any):Promise<any>{
  return request({
    url:"/users",
    method:"get",
    params
  })
}
export function createUser(data:SignUpData):Promise<any>{
  return request({
    url:"/user",
    method:"post",
    data
  })
}
export function editUser(id:number,data:SignUpData):Promise<any>{
  return request({
    url:"/user/"+id,
    method:"put",
    data
  })
}
export function deleteUser(id:number):Promise<any>{
  return request({
    url:"/user/"+id,
    method:"delete",
  })
}
export function changePassword(id:number,data:any):Promise<any>{
  return request({
    url:"/user_updatePassword/" + id,
    method:"post",
    data
  })
}

export function getRoles():Promise<any>{
  return request({
    url:"/roles",
    method:"get",
  })
}
export function getRole(id:number):Promise<any>{
  return request({
    url:"/role/"+id,
    method:"get",
  })
}
export function resetPassword(data:any):Promise<any>{
  return request({
    url:"/user_resetPassword",
    method:"post",
    data
  })
}