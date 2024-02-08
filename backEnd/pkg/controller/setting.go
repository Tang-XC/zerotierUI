package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"shop/pkg/common"
	"shop/pkg/middleware"
	"shop/pkg/model"
	"shop/pkg/service"
)

type SettingController struct {
	settingService service.SettingService
}

func (s *SettingController) Name() string {
	return "Setting"
}
func (s *SettingController) SwitchPrivate(c *gin.Context) {
	var privateSetting model.PrivateSetting
	if err := c.BindJSON(&privateSetting); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := s.settingService.SwitchPrivate(privateSetting)
	if err != nil {
		common.FailedResponse(c, http.StatusInternalServerError, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (s *SettingController) SwitchIpv4(c *gin.Context) {
	var ipv4 model.Ipv4AssignmentSetting
	if err := c.BindJSON(&ipv4); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := s.settingService.SwitchIpv4(ipv4)
	if err != nil {
		common.FailedResponse(c, http.StatusInternalServerError, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (s *SettingController) SwitchIpv6Zt6plane(c *gin.Context) {
	var ipv6 model.Ipv6Zt6plane
	if err := c.BindJSON(&ipv6); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := s.settingService.SwitchIpv6Zt6plane(ipv6)
	if err != nil {
		common.FailedResponse(c, http.StatusInternalServerError, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (s *SettingController) SwitchIpv6Rfc4193(c *gin.Context) {
	var ipv6 model.Ipv6Rfc4193
	if err := c.BindJSON(&ipv6); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := s.settingService.SwitchIpv6Rfc4193(ipv6)
	if err != nil {
		common.FailedResponse(c, http.StatusInternalServerError, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (s *SettingController) SwitchIpv6Auto(c *gin.Context) {
	var ipv6 model.Ipv6Auto
	if err := c.BindJSON(&ipv6); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := s.settingService.SwitchIpv6Auto(ipv6)
	if err != nil {
		common.FailedResponse(c, http.StatusInternalServerError, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}

func (s *SettingController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/", middleware.Auth())
	{
		v1.PUT("/controller/network/switchPrivate", s.SwitchPrivate)
		v1.PUT("/controller/network/switchIpv4", s.SwitchIpv4)
		v1.PUT("/controller/network/switchIpv6Zt6plane", s.SwitchIpv6Zt6plane)
		v1.PUT("/controller/network/switchIpv6Rfc4193", s.SwitchIpv6Rfc4193)
		v1.PUT("/controller/network/switchIpv6Auto", s.SwitchIpv6Auto)
	}
}
func NewSettingController(settingService service.SettingService) Controller {
	return &SettingController{
		settingService: settingService,
	}
}
