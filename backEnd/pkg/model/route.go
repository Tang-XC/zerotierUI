package model

type Route struct {
	Target string `json:"target"`
	Via    string `json:"via"`
}
type Routes []Route

type ResponseRoute struct {
	Routes Routes `json:"routes"`
}
type RouteListRequest struct {
	NetworkId string
}
type AddRoute struct {
	Target    string `json:"target"`
	Via       string `json:"via"`
	NetworkId string `json:"network_id"`
}
type DeleteRoute struct {
	Target    string `json:"target"`
	Via       string `json:"via"`
	NetworkId string `json:"network_id"`
}
