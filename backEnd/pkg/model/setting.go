package model

type PrivateSetting struct {
	Private   bool   `json:"private"`
	NetworkId string `json:"network_id"`
}
type Ipv4AssignmentSetting struct {
	Zt        bool   `json:"zt"`
	NetworkId string `json:"network_id"`
}
type Ipv6Zt6plane struct {
	Zt6plane  bool   `json:"zt6plane"`
	NetworkId string `json:"network_id"`
}
type Ipv6Rfc4193 struct {
	Rfc4193   bool   `json:"rfc4193"`
	NetworkId string `json:"network_id"`
}
type Ipv6Auto struct {
	Zt        bool   `json:"zt"`
	NetworkId string `json:"network_id"`
}
