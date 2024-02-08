package model

type IpPool struct {
	IpRangeStart string `json:"ipRangeStart"`
	IpRangeEnd   string `json:"ipRangeEnd"`
}
type IpPools []IpPool
type IpPoolListRequest struct {
	NetworkId    string
	IpRangeStart string
	IpRangeEnd   string
}
type ResponseIpPool struct {
	IpPools IpPools `json:"ip_pools"`
}
type AddIpPool struct {
	IpRangeStart string `json:"ip_range_start"`
	IpRangeEnd   string `json:"ip_range_end"`
	NetworkId    string `json:"network_id"`
}
type DeleteIpPool struct {
	IpRangeStart string `json:"ipRangeStart"`
	IpRangeEnd   string `json:"ipRangeEnd"`
	NetworkId    string `json:"network_id"`
}
