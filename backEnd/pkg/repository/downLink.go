package repository

import (
	"gorm.io/gorm"
	"shop/pkg/model"
)

type downLinkRepository struct {
	db *gorm.DB
}

func (d *downLinkRepository) List() (model.DownLinks, error) {
	var downLinks model.DownLinks
	err := d.db.Find(&downLinks).Error
	return downLinks, err
}
func (d *downLinkRepository) Create(downLink *model.DownLink) error {
	err := d.db.Create(downLink).Error
	return err
}
func (d *downLinkRepository) Update(downLink *model.DownLink) error {
	err := d.db.Model(model.DownLink{}).Where("id = ?", downLink.ID).Updates(downLink).Error
	return err
}
func (d *downLinkRepository) Get(id uint) (model.DownLink, error) {
	var downLink model.DownLink
	err := d.db.First(&downLink, id).Error
	return downLink, err
}
func (d *downLinkRepository) Delete(id uint) error {
	err := d.db.Delete(&model.DownLink{}, id).Error
	return err
}

func (d *downLinkRepository) Migrate() error {
	return d.db.AutoMigrate(&model.DownLink{})
}
func newDownLinkRepository(db *gorm.DB) DownLinkRepository {
	return &downLinkRepository{db: db}
}
