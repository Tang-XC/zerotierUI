package model

type rules struct {
	Not  bool   `json:"not"`
	Or   bool   `json:"or"`
	Type string `json:"type"`
}
type v4AssignMode struct {
	Zt bool `json:"zt"`
}
type v6AssignMode struct {
	_6plane bool `json:"6plane"`
	rfc4193 bool `json:"rfc4193"`
	zt      bool `json:"zt"`
}

type ControllerNetwork struct {
	AuthTokens            []interface{} `json:"authTokens"`
	AuthorizationEndpoint string        `json:"authorizationEndpoint"`
	Capabilities          []interface{} `json:"capabilities"`
	ClientId              string        `json:"clientId"`
	CreationTime          int64         `json:"creationTime"`
	Dns                   []interface{} `json:"dns"`
	EnableBroadcast       bool          `json:"enableBroadcast"`
	Id                    string        `json:"id"`
	IpAssignmentPools     []interface{} `json:"ipAssignmentPools"`
	Mtu                   int           `json:"mtu"`
	MulticastLimit        int           `json:"multicastLimit"`
	Name                  string        `json:"name"`
	Nwid                  string        `json:"nwid"`
	Objtype               string        `json:"objtype"`
	Private               bool          `json:"private"`
	RemoteTraceLevel      int           `json:"remoteTraceLevel"`
	RemoteTraceTarget     interface{}   `json:"remoteTraceTarget"`
	Revision              int           `json:"revision"`
	Routes                []interface{} `json:"routes"`
	Rules                 []rules       `json:"rules"`
	RulesSource           string        `json:"rulesSource"`
	SsoEnabled            bool          `json:"ssoEnabled"`
	Tags                  []interface{} `json:"tags"`
	V4AssignMode          v4AssignMode  `json:"v4AssignMode"`
	V6AssignMode          v6AssignMode  `json:"v6AssignMode"`
}
