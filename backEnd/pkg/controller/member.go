package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"shop/pkg/common"
	"shop/pkg/middleware"
	"shop/pkg/model"
	"shop/pkg/service"
	"strconv"
)

type MemberController struct {
	memberService service.MemberService
}

func (m *MemberController) List(c *gin.Context) {
	var request model.MemberListRequest
	request.Page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	request.Size, _ = strconv.Atoi(c.DefaultQuery("size", "10"))
	request.Keywords = c.DefaultQuery("keywords", "")
	request.NetworkId = c.DefaultQuery("networkId", "")
	members, err := m.memberService.List(request)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, members)
}
func (m *MemberController) Update(c *gin.Context) {
	var member model.Member
	if err := c.ShouldBindJSON(&member); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	result, err := m.memberService.Update(&member)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (m *MemberController) UpdateName(c *gin.Context) {
	var member model.Member
	if err := c.ShouldBindJSON(&member); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := m.memberService.UpdateName(&member)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, nil)
}
func (m *MemberController) UpdateAuthorized(c *gin.Context) {
	networkId := c.Param("networkId")
	nodeId := c.Param("nodeId")
	var authorized model.UpdateMemberAuthorized
	if err := c.ShouldBindJSON(&authorized); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := m.memberService.UpdateAuthorized(networkId, nodeId, authorized)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (m *MemberController) UpdateActiveBridge(c *gin.Context) {
	networkId := c.Param("networkId")
	nodeId := c.Param("nodeId")
	var activeBridge model.UpdateMemberActiveBridge
	if err := c.ShouldBindJSON(&activeBridge); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := m.memberService.UpdateActiveBridge(networkId, nodeId, activeBridge)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (m *MemberController) UpdateMemberIp(c *gin.Context) {
	networkId := c.Param("networkId")
	nodeId := c.Param("nodeId")
	var ips model.UpdateMemberIp
	if err := c.ShouldBindJSON(&ips); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := m.memberService.UpdateMemberIp(networkId, nodeId, ips)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}
func (m *MemberController) Delete(c *gin.Context) {
	id := c.Param("id")
	err := m.memberService.Delete(id)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, nil)
}

func (m *MemberController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/", middleware.Auth())
	{
		v1.GET("/controller/member", m.List)
		v1.PUT("/controller/member", m.Update)
		v1.PUT("/controller/member/name", m.UpdateName)
		v1.PUT("/controller/network/:networkId/member/authorized/:nodeId", m.UpdateAuthorized)
		v1.PUT("/controller/network/:networkId/member/activeBridge/:nodeId", m.UpdateActiveBridge)
		v1.DELETE("/controller/member/:id", m.Delete)
		v1.PUT("/controller/network/:networkId/member/ip/:nodeId", m.UpdateMemberIp)
	}
}

func (m *MemberController) Name() string {
	return "member"
}

func NewMemberController(memberService service.MemberService) Controller {
	return &MemberController{
		memberService: memberService,
	}
}
