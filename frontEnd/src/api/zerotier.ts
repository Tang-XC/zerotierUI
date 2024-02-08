import request from "./request"
import { ResponseData } from "./request"
export function hostedNetworks(params={}):Promise<ResponseData> {
  return request({
    url: "/controller/network",
    method: "get",
    params
  })
}
export function hostedNetworkDetail(id:string):Promise<ResponseData> {
  return request({
    url: "/controller/network/" + id,
    method: "get",
  })

}
export function CreateNetworks(data={}):Promise<ResponseData> {
  return request({
    url: "/controller/network",
    method: "post",
    data
  })
}
export function getNetwork(id:string):Promise<ResponseData> {
  return request({
    url: "/controller/network/" + id,
    method: "get",
  })
}
export function deleteNetwork(id:string):Promise<ResponseData> {
  return request({
    url: "/controller/network/" + id,
    method: "delete",
  })
}
export function getMembershipsList(params:any):Promise<ResponseData> {
  return request({
    url: "/controller/member",
    method: "get",
    params
  })
}
export function updateMember(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/member",
    method: "put",
    data
  })
}
export function updateMemberName(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/member/name",
    method: "put",
    data
  })
}
export function UpdateMemberAuthorized(networkID:string,id:string,data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/" + networkID +"/member/authorized/" + id,
    method: "put",
    data
  })
}
export function UpdateMemberActiveBridPge(networkID:string,id:string,data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/" + networkID +"/member/activeBridge/" + id,
    method: "put",
    data
  })
}
export function DeleteMember(id:string):Promise<ResponseData> {
  return request({
    url: "/controller/member/" + id,
    method: "delete",
  })
}
export function updateMemberIp(networkID:string,id:string,data:any):Promise<ResponseData>{
  return request({
    url: "/controller/network/" + networkID +"/member/ip/" + id,
    method: "put",
    data
  })
}

export function getRoutesList(params:any):Promise<ResponseData> {
  return request({
    url: "/controller/route",
    method: "get",
    params
  })
}
export function createRoute(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/route",
    method: "post",
    data
  })
}
export function deleteRoute(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/route",
    method: "delete",
    data
  })
}
export function getIpPoolList (params:any):Promise<ResponseData> {
  return request({
    url: "/controller/ipPool",
    method: "get",
    params
  })
}
export function createIpPool (data:any):Promise<ResponseData> {
  return request({
    url: "/controller/ipPool",
    method: "post",
    data
  })
}
export function deleteIpPool (data:any):Promise<ResponseData> {
  return request({
    url: "/controller/ipPool",
    method: "delete",
    data
  })
}
export function switchPrivate (data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/switchPrivate",
    method: "put",
    data
  })
}
export function switchIpv4 (data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/switchIpv4",
    method: "put",
    data
  })
}
export function switchIpv6Zt6plane(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/switchIpv6Zt6plane",
    method: "put",
    data
  })
}
export function switchIpv6Rfc4193(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/switchIpv6Rfc4193",
    method: "put",
    data
  })
}
export function switchIpv6Auto(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/network/switchIpv6Auto",
    method: "put",
    data
  })
}
export function recoverIpPool(data:any):Promise<ResponseData> {
  return request({
    url: "/controller/ipPool/recover",
    method: "post",
    data
  })
}
