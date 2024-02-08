package repository

import (
	"fmt"
	"gorm.io/gorm"
	"shop/pkg/model"
)

type networkRepository struct {
	db *gorm.DB
}

func (n *networkRepository) List(request model.ListRequest) (model.ResponseNetwork, error) {
	networks := make(model.Networks, 0)
	response := model.ResponseNetwork{}
	var total int64
	var offset int = (request.Page - 1) * request.Size
	var limit int = request.Size
	var keywords string = fmt.Sprintf("%%%s%%", request.Keywords)
	var queryString string = "name LIKE ? OR owner LIKE ? OR id LIKE ? OR `desc` LIKE ?"
	var isAdmin = false
	//request.Owner.Roles为[{1 普通用户  []}]
	if request.Keywords == "" {
		for _, role := range request.Owner.Roles {
			if role.ID == 2 {
				isAdmin = true
				break
			}
		}
		if isAdmin {
			if err := n.db.Model(&networks).Preload("Members").Count(&total).Error; err != nil {
				return response, err
			}
			if err := n.db.Offset(offset).Preload("Members").Limit(limit).Find(&networks).Error; err != nil {
				return response, err
			}
		} else {
			if err := n.db.Model(&networks).Preload("Members").Where("Owner = ?", request.Owner.Account).Count(&total).Error; err != nil {
				return response, err
			}
			if err := n.db.Offset(offset).Preload("Members").Where("Owner = ?", request.Owner.Account).Limit(limit).Find(&networks).Error; err != nil {
				return response, err
			}
		}
	} else {
		if isAdmin {
			if err := n.db.Model(&networks).Preload("Members").Where(queryString, keywords, keywords, keywords, keywords).Count(&total).Error; err != nil {
				return response, err
			}
			if err := n.db.Offset(offset).Preload("Members").Limit(limit).Where(queryString, keywords, keywords, keywords, keywords).Find(&networks).Error; err != nil {
				return response, err
			}
		} else {
			if err := n.db.Model(&networks).Preload("Members").Where("Owner = ?", request.Owner.Account).Where(queryString, keywords, keywords, keywords, keywords).Count(&total).Error; err != nil {
				return response, err
			}
			if err := n.db.Offset(offset).Preload("Members").Limit(limit).Where("Owner = ?", request.Owner.Account).Where(queryString, keywords, keywords, keywords, keywords).Find(&networks).Error; err != nil {
				return response, err
			}
		}
	}

	response.Networks = networks
	response.Total = total
	return response, nil
}
func (n *networkRepository) Detail(id string) (*model.Network, error) {
	network := &model.Network{
		ID: id,
	}
	if err := n.db.Preload("Members").Where(network).First(network).Error; err != nil {
		return nil, err
	}
	return network, nil
}

func (n *networkRepository) Create(network *model.Network) (*model.Network, error) {
	if err := n.db.Create(network).Error; err != nil {
		return nil, err
	}
	return network, nil
}
func (n *networkRepository) Delete(id string) error {
	network := &model.Network{
		ID: id,
	}
	if err := n.db.Delete(network).Error; err != nil {
		return err
	}
	return nil
}
func (n *networkRepository) AddMember(network *model.Network, member *model.Member) error {
	if err := n.db.Model(network).Association("Members").Append(member); err != nil {
		return err
	}
	return nil
}
func (n *networkRepository) AddRoutes(network *model.Network, routes model.Routes) error {
	if err := n.db.Model(network).Association("Routes").Append(routes); err != nil {
		return err
	}
	return nil
}
func (n *networkRepository) Migrate() error {
	return n.db.AutoMigrate(&model.Network{})
}
func newNetworkRepository(db *gorm.DB) NetworkRepository {
	return &networkRepository{db: db}
}
