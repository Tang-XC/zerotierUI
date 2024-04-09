package repository

import (
	"shop/pkg/model"
)

type Repository interface {
	User() UserRepository
	Role() RoleRepository
	Permission() PermissionRepository
	Network() NetworkRepository
	Member() MemberRepository
	System() SystemRepository
	Init() error
	Close() error
	Migrant
}
type Migrant interface {
	Migrate() error
}

type UserRepository interface {
	GetUserByID(uint) (*model.User, error)
	GetUserByAccount(string) (*model.User, error)
	List(string) (model.Users, error)
	Create(*model.User) (*model.User, error)
	Update(*model.User) (*model.User, error)
	UpdatePassword(*model.User) error
	Delete(*model.User) error
	AddRole(*model.User, *model.Role) error
	RemoveRole(*model.User, *model.Role) error
	Migrate() error
}

type RoleRepository interface {
	List() (model.Roles, error)
	Create(*model.Role) (*model.Role, error)
	GetRoleByID(uint) (*model.Role, error)
	AddPermissionToRole(uint, int64) error
	Migrate() error
}
type PermissionRepository interface {
	List() (model.Permissions, error)
	Create(*model.Permission) (*model.Permission, error)
	Migrate() error
}
type NetworkRepository interface {
	List(request model.ListRequest) (model.ResponseNetwork, error)
	Detail(string) (*model.Network, error)
	Create(*model.Network) (*model.Network, error)
	Delete(string) error
	AddMember(*model.Network, *model.Member) error
	AddRoutes(*model.Network, model.Routes) error
	Migrate() error
}
type MemberRepository interface {
	List(request model.MemberListRequest) (model.ResponseMember, error)
	Detail(string) (*model.Member, error)
	Create(*model.Member) (*model.Member, error)
	Delete(string) error
	Update(*model.Member) (*model.Member, error)
	UpdateName(*model.Member) error
	UpdateAuthorized(*model.Member) error
	UpdateActiveBridge(*model.Member) error
	Migrate() error
}
type SystemRepository interface {
	GetSystem(*model.System) (*model.System, error)
	UpdateSystem(*model.System) (*model.System, error)
	CreateSystem(*model.System) (*model.System, error)
	Migrate() error
}
