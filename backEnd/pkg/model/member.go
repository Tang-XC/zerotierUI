package model

type Member struct {
	ID           string   `gorm:"column:id;" json:"id"`
	Name         string   `gorm:"column:name;" json:"name"`
	Authorized   bool     `gorm:"column:authorized" json:"authorized"`
	ActiveBridge bool     `gorm:"column:activeBridge" json:"activeBridge"`
	IP           string   `gorm:"column:ip" json:"ip"`
	Status       string   `gorm:"column:status" json:"status"`
	Latency      float64  `gorm:"column:latency" json:"latency"`
	Networks     Networks `gorm:"many2many:network_members;association_foreignkey:id;foreignkey:id;"`
}
type Members []Member

func (m *Member) TableName() string {
	return "members"
}

type ResponseMember struct {
	Members Members `json:"members"`
	Total   int64   `json:"total"`
}

type MemberListRequest struct {
	Page      int
	Size      int
	Keywords  string
	NetworkId string
}

type UpdateMember struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Authorized   bool    `json:"authorized"`
	ActiveBridge bool    `json:"activeBridge"`
	IP           string  `json:"ip"`
	Status       string  `json:"status"`
	Latency      float64 `json:"latency"`
}
type UpdateMemberAuthorized struct {
	Authorized bool `json:"authorized"`
}

type UpdateMemberActiveBridge struct {
	ActiveBridge bool `json:"activeBridge"`
}

type UpdateMemberIp struct {
	IpAssignments []string `json:"ipAssignments"`
}

func (u UpdateMember) GetMember() Member {
	return Member{
		ID:           u.ID,
		Name:         u.Name,
		Authorized:   u.Authorized,
		ActiveBridge: u.ActiveBridge,
		IP:           u.IP,
		Status:       u.Status,
		Latency:      u.Latency,
	}
}
