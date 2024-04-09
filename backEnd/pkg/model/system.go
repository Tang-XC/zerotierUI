package model

type System struct {
	ID         uint   `gorm:"column:id;" json:"id"`
	Logo       string `gorm:"column:logo;" json:"logo"`
	SystemName string `gorm:"column:system_name;" json:"system_name"`
	Slogan     string `gorm:"column:slogan;" json:"slogan"`
	Copyright  string `gorm:"column:copyright;" json:"copyright"`
}

func (table System) TableName() string {
	return "system"
}
