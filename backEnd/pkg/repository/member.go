package repository

import (
	"gorm.io/gorm"
	"shop/pkg/model"
)

type memberRepository struct {
	db *gorm.DB
}

func (n *memberRepository) Migrate() error {
	return n.db.AutoMigrate(&model.Member{})
}

func (n *memberRepository) List(request model.MemberListRequest) (model.ResponseMember, error) {
	members := make(model.Members, 0)
	var response model.ResponseMember
	var offset int = (request.Page - 1) * request.Size
	var limit int = request.Size
	var total int64 = 0
	var keywords string = "%" + request.Keywords + "%"
	if request.Keywords == "" {

		//返回
		if err := n.db.Model(&members).Count(&total).Error; err != nil {
			return response, err
		}
		if err := n.db.Offset(offset).Limit(limit).Find(&members).Error; err != nil {
			return response, err
		}
	} else {
		if err := n.db.Model(&members).Where("name LIKE ? OR id LIKE ?", keywords, keywords).Count(&total).Error; err != nil {
			return response, err
		}
		if err := n.db.Offset(offset).Limit(limit).Where("name LIKE ? OR id LIKE ?", keywords, keywords).Find(&members).Error; err != nil {
			return response, err
		}
	}
	response.Members = members
	response.Total = total

	return response, nil
}
func (n *memberRepository) Detail(id string) (*model.Member, error) {
	member := &model.Member{
		ID: id,
	}
	if err := n.db.Where(member).First(member).Error; err != nil {
		return nil, err
	}
	return member, nil
}

func (n *memberRepository) Create(member *model.Member) (*model.Member, error) {
	if err := n.db.Create(member).Error; err != nil {
		return nil, err
	}
	return member, nil
}

func (n *memberRepository) Delete(id string) error {
	//清除和network的关联
	member := &model.Member{
		ID: id,
	}
	if err := n.db.Model(member).Association("Networks").Clear(); err != nil {
		return err
	}
	if err := n.db.Delete(member).Error; err != nil {
		return err
	}
	return nil
}
func (n *memberRepository) Update(member *model.Member) (*model.Member, error) {
	if err := n.db.Save(member).Error; err != nil {
		return nil, err
	}
	return member, nil
}
func (n *memberRepository) UpdateName(member *model.Member) error {
	if err := n.db.Model(member).Update("name", member.Name).Error; err != nil {
		return err
	}
	return nil
}
func (n *memberRepository) UpdateAuthorized(member *model.Member) error {
	if err := n.db.Model(member).Update("authorized", member.Authorized).Error; err != nil {
		return err
	}
	return nil
}
func (n *memberRepository) UpdateActiveBridge(member *model.Member) error {
	if err := n.db.Model(member).Update("activeBridge", member.ActiveBridge).Error; err != nil {
		return err
	}
	return nil
}
func newMemberRepository(db *gorm.DB) *memberRepository {
	return &memberRepository{
		db: db,
	}
}
