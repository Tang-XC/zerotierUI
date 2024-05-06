package service

import (
	"fmt"
	database "shop/pkg/db"
	"shop/pkg/model"
	"shop/pkg/repository"
)

type ipPoolService struct {
	networkRepository repository.NetworkRepository
	zerotier          *database.ZerotierRequest
}

func (i *ipPoolService) List(request model.IpPoolListRequest) (model.ResponseIpPool, error) {
	networkDetail, err := i.zerotier.GET(fmt.Sprintf("/controller/network/%s", request.NetworkId))
	if err != nil {
		return model.ResponseIpPool{}, err
	}
	ipPools := networkDetail.(map[string]interface{})["ipAssignmentPools"].([]interface{})
	if len(ipPools) == 0 {
		return model.ResponseIpPool{
			IpPools: []model.IpPool{},
		}, nil
	}
	var IpPoolsModel model.IpPools
	for _, v := range ipPools {
		ipPool := v.(map[string]interface{})
		var ipRangeStart string = ""
		var ipRangeEnd string = ""
		if ipPool["ipRangeStart"] != nil {
			ipRangeStart = ipPool["ipRangeStart"].(string)
		}
		if ipPool["ipRangeEnd"] != nil {
			ipRangeEnd = ipPool["ipRangeEnd"].(string)
		}
		IpPoolsModel = append(IpPoolsModel, model.IpPool{
			IpRangeStart: ipRangeStart,
			IpRangeEnd:   ipRangeEnd,
		})
	}
	return model.ResponseIpPool{
		IpPools: IpPoolsModel,
	}, nil
}
func (i *ipPoolService) Add(ipPool model.AddIpPool) error {
	networkDetail, err := i.zerotier.GET(fmt.Sprintf("/controller/network/%s", ipPool.NetworkId))
	if err != nil {
		return err
	}
	ipPools := networkDetail.(map[string]interface{})["ipAssignmentPools"].([]interface{})
	ipPools = append(ipPools, map[string]interface{}{
		"ipRangeStart": ipPool.IpRangeStart,
		"ipRangeEnd":   ipPool.IpRangeEnd,
	})
	var data = map[string]interface{}{
		"ipAssignmentPools": ipPools,
	}
	_, err = i.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipPool.NetworkId), data)
	if err != nil {
		return err
	}
	return nil
}
func (i *ipPoolService) Delete(deleteIpPool model.DeleteIpPool) error {
	networkDetail, err := i.zerotier.GET(fmt.Sprintf("/controller/network/%s", deleteIpPool.NetworkId))
	if err != nil {
		return err
	}
	ipPools := networkDetail.(map[string]interface{})["ipAssignmentPools"].([]interface{})
	var newIpPools []interface{}
	for _, v := range ipPools {
		ipPool := v.(map[string]interface{})
		if ipPool["ipRangeStart"] != deleteIpPool.IpRangeStart && ipPool["ipRangeEnd"] != deleteIpPool.IpRangeEnd {
			newIpPools = append(newIpPools, ipPool)
		}
	}
	//判断newIpPools是否为空，如果为空则删除整个ipAssignmentPools
	var data map[string]interface{}
	if len(newIpPools) == 0 {
		data = map[string]interface{}{
			"ipAssignmentPools": []interface{}{},
		}
	} else {
		data = map[string]interface{}{
			"ipAssignmentPools": newIpPools,
		}
	}
	res, err := i.zerotier.POST(fmt.Sprintf("/controller/network/%s", deleteIpPool.NetworkId), data)
	fmt.Println(res)
	if err != nil {
		return err
	}
	return nil
}
func (i *ipPoolService) Recover(ipPool model.AddIpPool) error {
	var data = map[string]interface{}{
		"ipAssignmentPools": []interface{}{
			map[string]interface{}{
				"ipRangeStart": ipPool.IpRangeStart,
				"ipRangeEnd":   ipPool.IpRangeEnd,
			},
		},
	}
	fmt.Println(fmt.Sprintf("/controller/network/%s", ipPool.NetworkId))
	_, err := i.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipPool.NetworkId), data)
	if err != nil {
		return err
	}
	return nil
}
func NewIpPoolService(networkRepository repository.NetworkRepository, zerotier *database.ZerotierRequest) *ipPoolService {
	return &ipPoolService{
		networkRepository: networkRepository,
		zerotier:          zerotier,
	}
}
