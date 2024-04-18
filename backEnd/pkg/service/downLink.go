package service

import (
	"shop/pkg/model"
	"shop/pkg/repository"
)

type downLinkService struct {
	downLinkRepository repository.DownLinkRepository
}

func (d downLinkService) List() (model.DownLinks, error) {
	return d.downLinkRepository.List()
}
func (d downLinkService) Create(downLink *model.DownLink) error {
	return d.downLinkRepository.Create(downLink)
}
func (d downLinkService) Update(downLink *model.DownLink) error {
	_, err := d.downLinkRepository.Get(downLink.ID)
	if err != nil {
		return err
	}
	return d.downLinkRepository.Update(downLink)
}
func (d downLinkService) Delete(id uint) error {
	return d.downLinkRepository.Delete(id)
}

func NewDownLinkService(downLinkRepository repository.DownLinkRepository) DownLinkService {
	return &downLinkService{
		downLinkRepository: downLinkRepository,
	}
}
