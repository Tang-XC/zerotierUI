package service

import (
	"shop/pkg/model"
)

type UserService interface {
	List(string) (model.Users, error)
	GetUser(string) (*model.User, error)
	GetUserById(string) (*model.User, error)
	Create(user *model.User, roles []uint) (string, error)
	Update(string, []uint, *model.User) (*model.User, error)
	Delete(string) error
	UpdatePassword(string, *model.UpdatedPassword) (string, error)
	ResetPassword(id string, password string) (string, error)
	AddRole(uint, uint) error
	RemoveRole(uint, uint) error
}

type AuthService interface {
	Login(*model.LoginUser) (interface{}, error)
	ForgetPassword(*model.ForgetPasswordParams) (string, error)
}

type RoleService interface {
	List() (model.Roles, error)
	Create(*model.Role) (string, error)
	AddPermissionToRole(uint, int64) error
	GetRoleByID(uint) (*model.Role, error)
}

type PermissionService interface {
	List() (model.Permissions, error)
	Create(*model.Permission) (string, error)
}

type NetworkService interface {
	List(request model.ListRequest) (model.ResponseNetwork, error)
	MembershipsList(id string) (map[string]interface{}, error)
	Detail(id string) (*model.DetailNetwork, error)
	Update(id string, network *model.UpdateNetwork) (string, error)
	Create(network *model.AddNetwork, token string) (string, error)
	Delete(id string) error
	AddMember(networkId string, memberId string) (string, error)
	AddRoutes(networkId string, routes model.Routes) (string, error)
}
type MemberService interface {
	List(request model.MemberListRequest) (model.ResponseMember, error)
	Detail(id string) (*model.Member, error)
	Create(member *model.Member) (*model.Member, error)
	Update(member *model.Member) (*model.Member, error)
	UpdateName(member *model.Member) error
	UpdateAuthorized(networkID string, nodeID string, authorized model.UpdateMemberAuthorized) error
	UpdateActiveBridge(networkID string, nodeID string, activeBridge model.UpdateMemberActiveBridge) error
	UpdateMemberIp(networkID string, nodeID string, ips model.UpdateMemberIp) error
	Delete(networkId string, id string) error
}
type RouteService interface {
	List(request model.RouteListRequest) (model.ResponseRoute, error)
	Add(route model.AddRoute) error
	Delete(deleteRoute model.DeleteRoute) error
}
type IpPoolService interface {
	List(request model.IpPoolListRequest) (model.ResponseIpPool, error)
	Add(ipPool model.AddIpPool) error
	Delete(deleteIpPool model.DeleteIpPool) error
	Recover(ipPool model.AddIpPool) error
}
type SettingService interface {
	SwitchPrivate(privateSetting model.PrivateSetting) error
	SwitchIpv4(ipv4 model.Ipv4AssignmentSetting) error
	SwitchIpv6Zt6plane(ipv6 model.Ipv6Zt6plane) error
	SwitchIpv6Rfc4193(ipv6 model.Ipv6Rfc4193) error
	SwitchIpv6Auto(ipv6 model.Ipv6Auto) error
}
type SystemService interface {
	GetSystem() (model.System, error)
	UpdateSystem(*model.System) (*model.System, error)
}
type DownLinkService interface {
	List() (model.DownLinks, error)
	Create(*model.DownLink) error
	Update(*model.DownLink) error
	Delete(id uint) error
}
