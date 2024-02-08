package controller

import (
	"github.com/gin-gonic/gin"
	"shop/pkg/common"
	"shop/pkg/model"
	"shop/pkg/service"
)

type IpPoolController struct {
	ipPoolService service.IpPoolService
}

func (r *IpPoolController) Name() string {
	return "IpPool"
}
func (r *IpPoolController) List(c *gin.Context) {
	var request model.IpPoolListRequest
	request.NetworkId = c.DefaultQuery("networkId", "")
	ipPools, err := r.ipPoolService.List(request)
	if err != nil {
		common.FailedResponse(c, 400, err)
	}
	common.SuccessResponse(c, ipPools)
}
func (r *IpPoolController) Add(c *gin.Context) {
	var addIpPool model.AddIpPool
	if err := c.ShouldBindJSON(&addIpPool); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	err := r.ipPoolService.Add(addIpPool)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	if addIpPool.NetworkId == "" || addIpPool.IpRangeStart == "" || addIpPool.IpRangeEnd == "" {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, "添加成功")
}
func (r *IpPoolController) Delete(c *gin.Context) {
	var deleteIpPool model.DeleteIpPool
	if err := c.ShouldBindJSON(&deleteIpPool); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	err := r.ipPoolService.Delete(deleteIpPool)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, "删除成功")
}
func (r *IpPoolController) Recover(c *gin.Context) {
	var recoverIpPool model.AddIpPool
	if err := c.ShouldBindJSON(&recoverIpPool); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	err := r.ipPoolService.Recover(recoverIpPool)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, "修改成功")
}

func (r *IpPoolController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/")
	v1.GET("/controller/ipPool", r.List)
	v1.POST("/controller/ipPool", r.Add)
	v1.DELETE("/controller/ipPool", r.Delete)
	v1.POST("/controller/ipPool/recover", r.Recover)
}
func NewIpPoolController(ipPoolService service.IpPoolService) *IpPoolController {
	return &IpPoolController{
		ipPoolService: ipPoolService,
	}
}
