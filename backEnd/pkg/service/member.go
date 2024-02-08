package service

import (
	"fmt"
	"github.com/goccy/go-json"
	database "shop/pkg/db"
	"shop/pkg/model"
	"shop/pkg/repository"
)

type memberService struct {
	memberRepository  repository.MemberRepository
	networkRepository repository.NetworkRepository
	zerotier          *database.ZerotierRequest
}

func (m *memberService) List(request model.MemberListRequest) (model.ResponseMember, error) {
	//获取member列表
	res, err := m.zerotier.GET(fmt.Sprintf("/controller/network/%s/member", request.NetworkId))
	if err != nil {
		return model.ResponseMember{}, err
	}

	response := res.(map[string]interface{})
	//遍历response

	for k, _ := range response {
		//获取member详情
		result, err := m.zerotier.GET(fmt.Sprintf("/controller/network/%s/member/%s", request.NetworkId, k))
		if err != nil {
			return model.ResponseMember{}, err
		}

		detail := result.(map[string]interface{})

		//获取peer
		zt_data, _ := m.zerotier.GET("/status")
		peer, _ := m.zerotier.GET(fmt.Sprintf("/peer/%s", k))
		ips, _ := json.Marshal(detail["ipAssignments"])
		if memberDetail, err := m.memberRepository.Detail(detail["id"].(string)); err != nil {
			//判断err的类型是否为存在
			if err.Error() == "record not found" {
				addResult, _ := m.Create(&model.Member{
					ID:           k,
					Name:         "",
					Authorized:   detail["authorized"].(bool),
					ActiveBridge: detail["activeBridge"].(bool),
					IP:           string(ips),
					Latency:      peer.(map[string]interface{})["latency"].(float64),
				})
				//判断是否为根服务器
				if addResult.ID == zt_data.(map[string]interface{})["address"].(string) {
					addResult.Status = "根服务器"
				} else {
					if len(peer.(map[string]interface{})) == 0 || peer.(map[string]interface{})["latency"] == "-1" {
						addResult.Status = "离线"
						addResult.Latency = -1
					} else {
						addResult.Status = "在线"
					}
				}
				//添加member到network，建立关联
				networkResult, _ := m.networkRepository.Detail(request.NetworkId)
				err := m.networkRepository.AddMember(networkResult, addResult)
				if err != nil {
					return model.ResponseMember{}, err
				}
			}
		} else {
			//判断是否为根服务器
			if memberDetail.ID == zt_data.(map[string]interface{})["address"].(string) {
				memberDetail.Status = "根服务器"
			} else {
				if len(peer.(map[string]interface{})) == 0 || peer.(map[string]interface{})["latency"] == "-1" {
					memberDetail.Status = "离线"
					memberDetail.Latency = -1
				} else {
					memberDetail.Status = "在线"
					memberDetail.Latency = peer.(map[string]interface{})["latency"].(float64)
				}
			}
			memberDetail.IP = string(ips)
			memberDetail.Authorized = detail["authorized"].(bool)
			memberDetail.ActiveBridge = detail["activeBridge"].(bool)
			m.Update(memberDetail)
		}
	}
	members, err := m.memberRepository.List(request)
	if err != nil {
		return model.ResponseMember{}, err
	}
	return members, nil
}
func (m *memberService) Detail(id string) (*model.Member, error) {
	member, err := m.memberRepository.Detail(id)
	if err != nil {
		return nil, err
	}
	return member, nil
}
func (m *memberService) Create(member *model.Member) (*model.Member, error) {
	member, err := m.memberRepository.Create(member)
	if err != nil {
		return nil, err
	}
	return member, nil
}
func (m *memberService) Delete(id string) error {
	err := m.memberRepository.Delete(id)
	if err != nil {
		return err
	}
	return nil
}
func (m *memberService) Update(member *model.Member) (*model.Member, error) {
	member, err := m.memberRepository.Update(member)
	if err != nil {
		return nil, err
	}
	return member, nil
}
func (m *memberService) UpdateName(member *model.Member) error {
	err := m.memberRepository.UpdateName(member)
	if err != nil {
		return err
	}
	return nil
}
func (m *memberService) UpdateAuthorized(networkID string, nodeID string, authorized model.UpdateMemberAuthorized) error {
	var params = make(map[string]interface{})
	params = map[string]interface{}{"authorized": authorized.Authorized}
	m.zerotier.POST(fmt.Sprintf("/controller/network/%s/member/%s", networkID, nodeID), params)
	member, _ := m.memberRepository.Detail(nodeID)
	member.Authorized = authorized.Authorized
	m.memberRepository.UpdateAuthorized(member)
	return nil
}
func (m *memberService) UpdateActiveBridge(networkID string, nodeID string, activeBridge model.UpdateMemberActiveBridge) error {
	var params = make(map[string]interface{})
	params = map[string]interface{}{"activeBridge": activeBridge.ActiveBridge}
	m.zerotier.POST(fmt.Sprintf("/controller/network/%s/member/%s", networkID, nodeID), params)
	member, _ := m.memberRepository.Detail(nodeID)
	member.ActiveBridge = activeBridge.ActiveBridge
	m.memberRepository.UpdateActiveBridge(member)
	return nil
}
func (m *memberService) UpdateMemberIp(networkID string, nodeID string, ips model.UpdateMemberIp) error {
	var params = make(map[string]interface{})
	params["ipAssignments"] = ips.IpAssignments
	m.zerotier.POST(fmt.Sprintf("/controller/network/%s/member/%s", networkID, nodeID), params)
	return nil
}

func NewMemberService(memberRepository repository.MemberRepository, networkRepository repository.NetworkRepository, zerotier *database.ZerotierRequest) MemberService {
	return &memberService{
		memberRepository:  memberRepository,
		networkRepository: networkRepository,
		zerotier:          zerotier,
	}
}
