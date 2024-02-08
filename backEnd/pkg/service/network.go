package service

import (
	"fmt"
	database "shop/pkg/db"
	"shop/pkg/model"
	"shop/pkg/repository"
	utils "shop/pkg/utils/token"
)

type networkService struct {
	networkRepository repository.NetworkRepository
	zerotier          *database.ZerotierRequest
	userRepository    repository.UserRepository
	memberRepository  repository.MemberRepository
}

func (n *networkService) List(request model.ListRequest) (model.ResponseNetwork, error) {
	n.zerotier.GET("/controller/network")
	return n.networkRepository.List(request)
}
func (n *networkService) MembershipsList(id string) (map[string]interface{}, error) {
	response, err := n.zerotier.GET(fmt.Sprintf("/controller/network/%s/member", id))
	if err != nil {
		return nil, err
	}
	result := response.(map[string]interface{})
	return result, nil
}
func (n *networkService) Detail(id string) (*model.DetailNetwork, error) {
	var detailNetwork model.DetailNetwork
	baseInfo, err := n.networkRepository.Detail(id)
	if err != nil {
		return nil, err
	}
	detailNetwork.BaseInfo = *baseInfo
	moreInfo, err := n.zerotier.GET(fmt.Sprintf("/controller/network/%s", id))
	if err != nil {
		return nil, err
	}
	detailNetwork.MoreInfo = moreInfo.(map[string]interface{})
	return &detailNetwork, nil
}
func (n *networkService) Create(addNetwork *model.AddNetwork, token string) (string, error) {
	res, err := n.zerotier.POST("/controller/network", addNetwork)
	if err != nil {
		return "", err
	}
	claim, _ := utils.ParseToken(token)

	user, _ := n.userRepository.GetUserByAccount(claim.Subject)
	network := addNetwork.GetNetwork()
	networkMap := res.(map[string]interface{})
	network.ID = fmt.Sprintf("%v", networkMap["id"])
	network.CreatedAt = int64(networkMap["creationTime"].(float64))
	network.Owner = user.Account
	_, err = n.networkRepository.Create(&network)
	if err != nil {
		return "", err
	}
	return "创建成功", nil
}
func (n *networkService) Delete(id string) error {
	n.zerotier.DELETE(fmt.Sprintf("/controller/network/%s", id))
	return n.networkRepository.Delete(id)
}
func (n *networkService) AddMember(networkId string, memberId string) (string, error) {
	network, err := n.networkRepository.Detail(networkId)
	if err != nil {
		return "", err
	}
	member, err := n.memberRepository.Detail(memberId)
	err = n.networkRepository.AddMember(network, member)
	if err != nil {
		return "", err
	}
	return "添加成功", nil
}
func (n *networkService) AddRoutes(networkId string, routes model.Routes) (string, error) {
	network, err := n.networkRepository.Detail(networkId)
	if err != nil {
		return "", err
	}
	err = n.networkRepository.AddRoutes(network, routes)
	if err != nil {
		return "", err
	}
	return "添加成功", nil
}

func NewNetworkService(networkRepository repository.NetworkRepository, zerotier *database.ZerotierRequest, userRepository repository.UserRepository, memberRepository repository.MemberRepository) NetworkService {
	return &networkService{networkRepository: networkRepository, zerotier: zerotier, userRepository: userRepository, memberRepository: memberRepository}
}
