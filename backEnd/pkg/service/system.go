package service

import (
	"gorm.io/gorm"
	"shop/pkg/model"
	"shop/pkg/repository"
)

type systemService struct {
	systemRepository repository.SystemRepository
}

func (s *systemService) GetSystem() (model.System, error) {
	system := &model.System{
		ID:         1,
		Logo:       "",
		SystemName: "",
		Copyright:  "",
	}
	info, err := s.systemRepository.GetSystem(system)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			create, err := s.systemRepository.CreateSystem(system)
			if err != nil {
				return *create, err
			}
			return *create, nil
		}
		return *info, err
	}
	return *info, nil
}
func (s *systemService) UpdateSystem(system *model.System) (*model.System, error) {
	//查找指定ID的系统信息
	_, err := s.systemRepository.GetSystem(system)
	if err != nil {
		//如果没有找到则创建
		if err == gorm.ErrRecordNotFound {
			s.systemRepository.CreateSystem(system)
		}
		return system, err
	}
	//更新系统信息
	_, err = s.systemRepository.UpdateSystem(system)
	if err != nil {
		return nil, err
	}
	return system, nil
}

func NewSystemService(systemRepository repository.SystemRepository) SystemService {
	return &systemService{
		systemRepository: systemRepository,
	}
}
