package service

import (
	"fmt"
	database "shop/pkg/db"
	"shop/pkg/model"
)

type settingService struct {
	zerotier *database.ZerotierRequest
}

func (s *settingService) SwitchPrivate(privateSetting model.PrivateSetting) error {
	data := map[string]interface{}{
		"private": privateSetting.Private,
	}
	_, err := s.zerotier.POST(fmt.Sprintf("/controller/network/%s", privateSetting.NetworkId), data)
	return err
}

func (s *settingService) SwitchIpv4(ipv4 model.Ipv4AssignmentSetting) error {
	data := map[string]interface{}{
		"v4AssignMode": map[string]interface{}{
			"zt": ipv4.Zt,
		},
	}
	_, err := s.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipv4.NetworkId), data)
	return err
}
func (s *settingService) SwitchIpv6Zt6plane(ipv6 model.Ipv6Zt6plane) error {
	data := map[string]interface{}{
		"v6AssignMode": map[string]interface{}{
			"6plane": ipv6.Zt6plane,
		},
	}
	_, err := s.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipv6.NetworkId), data)
	return err
}
func (s *settingService) SwitchIpv6Rfc4193(ipv6 model.Ipv6Rfc4193) error {
	data := map[string]interface{}{
		"v6AssignMode": map[string]interface{}{
			"rfc4193": ipv6.Rfc4193,
		},
	}
	_, err := s.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipv6.NetworkId), data)
	return err
}
func (s *settingService) SwitchIpv6Auto(ipv6 model.Ipv6Auto) error {
	data := map[string]interface{}{
		"v6AssignMode": map[string]interface{}{
			"zt": ipv6.Zt,
		},
	}
	_, err := s.zerotier.POST(fmt.Sprintf("/controller/network/%s", ipv6.NetworkId), data)
	return err
}
func (s *settingService) AddIp(ip string) error{
	data := map[string]interface{}{
		"ip": ip,
	}
	_, err := s.zerotier.POST("/controller/network", data)
	return err
}

func NewSettingService(zerotier *database.ZerotierRequest) *settingService {
	return &settingService{
		zerotier: zerotier,
	}
}
