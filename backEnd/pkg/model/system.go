package model

type System struct {
	ID           uint   `gorm:"column:id;" json:"id"`
	Logo         string `gorm:"column:logo;" json:"logo"`
	SystemName   string `gorm:"column:system_name;" json:"system_name"`
	Slogan       string `gorm:"column:slogan;" json:"slogan"`
	Copyright    string `gorm:"column:copyright;" json:"copyright"`
	MaxMember    int    `gorm:"column:max_member;" json:"max_member"`
	ProtocolInfo string `gorm:"column:protocol_info;" json:"protocol_info"`
	CustomHome   string `gorm:"column:custom_home;" json:"custom_home"`
}

func (table System) TableName() string {
	return "system"
}
