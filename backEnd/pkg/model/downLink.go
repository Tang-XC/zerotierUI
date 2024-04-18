package model

type DownLink struct {
	ID   uint   `gorm:"column:id;primary_key" json:"id"'`
	Icon string `gorm:"column:icon" json:"icon"'`
	Name string `gorm:"column:name" json:"name"'`
	URL  string `gorm:"column:url" json:"url"'`
}
type AddDownLink struct {
	Icon string `json:"icon"`
	Name string `json:"name"`
	URL  string `json:"url"`
}
type DownLinks []DownLink

func (a AddDownLink) GetDownLink() DownLink {
	return DownLink{
		Icon: a.Icon,
		Name: a.Name,
		URL:  a.URL,
	}
}

func (DownLink) TableName() string {
	return "down_link"
}
