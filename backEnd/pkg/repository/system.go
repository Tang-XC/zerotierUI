package repository

import (
	"gorm.io/gorm"
	"shop/pkg/model"
)

type systemRepository struct {
	db *gorm.DB
}

func (s *systemRepository) GetSystem(system *model.System) (*model.System, error) {
	target := &model.System{
		ID: system.ID,
	}
	if err := s.db.First(&target).Error; err != nil {
		return nil, err
	}
	return target, nil
}

func (s *systemRepository) UpdateSystem(system *model.System) (*model.System, error) {
	if err := s.db.Model(system).Updates(system).Error; err != nil {
		return nil, err
	}
	return system, nil
}
func (s *systemRepository) CreateSystem(system *model.System) (*model.System, error) {
	if err := s.db.Create(system).Error; err != nil {
		return nil, err
	}
	return system, nil
}

func (s *systemRepository) Migrate() error {
	return s.db.AutoMigrate(&model.System{})
}
func newSystemRepository(db *gorm.DB) SystemRepository {
	return &systemRepository{db: db}
}
