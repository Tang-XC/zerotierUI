package model

type Network struct {
	ID             string  `gorm:"column:id;" json:"id"`
	Name           string  `gorm:"column:name;" json:"name"`
	Owner          string  `gorm:"column:owner;" json:"owner"`
	CreatedAt      int64   `gorm:"column:created_at;" json:"created_at"`
	Desc           string  `gorm:"column:desc;" json:"desc"`
	MaxMemberShips int     `gorm:"column:max_memberships;" json:"max_memberships"`
	Memberships    int     `gorm:"column:memberships;" json:"memberships"`
	Members        Members `gorm:"many2many:network_members;association_foreignkey:id;foreignkey:id;" json:"members"`
}
type Networks []Network

func (n *Network) TableName() string {
	return "networks"
}

type AddNetwork struct {
	Name           string `json:"name"`
	Desc           string `json:"desc"`
	MaxMemberShips int    `json:"max_memberships"`
}

func (a *AddNetwork) GetNetwork() Network {
	return Network{
		Name:           a.Name,
		Desc:           a.Desc,
		MaxMemberShips: a.MaxMemberShips,
	}
}

type ListRequest struct {
	Page     int
	Size     int
	Keywords string
	Owner    User
}

type ResponseNetwork struct {
	Networks []Network `json:"networks"`
	Total    int64     `json:"total"`
}

type DetailNetwork struct {
	BaseInfo Network                `json:"base_info"`
	MoreInfo map[string]interface{} `json:"more_info"`
}
