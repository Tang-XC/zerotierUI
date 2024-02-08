package service

import (
	"shop/pkg/model"
	"shop/pkg/repository"
)

type roleService struct {
	roleRepository repository.RoleRepository
}

func (r *roleService) List() (model.Roles, error) {
	roles, err := r.roleRepository.List()
	if err != nil {
		return nil, err
	}
	return roles, nil
}
func (r *roleService) Create(role *model.Role) (string, error) {
	message := "创建成功"
	_, err := r.roleRepository.Create(role)
	if err != nil {
		return "", err
	}
	return message, nil
}
func (r *roleService) AddPermissionToRole(roleID uint, permissionID int64) error {
	return r.roleRepository.AddPermissionToRole(roleID, permissionID)
}
func (r *roleService) GetRoleByID(id uint) (*model.Role, error) {
	role, err := r.roleRepository.GetRoleByID(id)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func NewRoleService(roleRepository repository.RoleRepository) RoleService {
	return &roleService{roleRepository: roleRepository}
}
