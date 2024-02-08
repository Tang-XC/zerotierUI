package controller

import (
	"errors"
	"github.com/gin-gonic/gin"
	"shop/pkg/common"
	"shop/pkg/model"
	"shop/pkg/service"
)

type RouteController struct {
	routeService service.RouteService
}

func (r *RouteController) List(c *gin.Context) {
	var request model.RouteListRequest
	request.NetworkId = c.DefaultQuery("networkId", "")

	routes, err := r.routeService.List(request)
	if err != nil {
		common.FailedResponse(c, 400, err)
	}
	common.SuccessResponse(c, routes)
}
func (r *RouteController) Add(c *gin.Context) {
	var addRoute model.AddRoute
	if err := c.ShouldBindJSON(&addRoute); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	err := r.routeService.Add(addRoute)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	if addRoute.NetworkId == "" || addRoute.Target == "" || addRoute.Via == "" {
		common.FailedResponse(c, 400, errors.New("参数错误"))
		return
	}
	common.SuccessResponse(c, "添加成功")
}
func (r *RouteController) Delete(c *gin.Context) {
	var deleteRoute model.DeleteRoute
	if err := c.ShouldBindJSON(&deleteRoute); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	err := r.routeService.Delete(deleteRoute)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, "删除成功")
}

func (r *RouteController) Name() string {
	return "Route"
}
func (r *RouteController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/")
	{
		v1.GET("/controller/route", r.List)
		v1.POST("/controller/route", r.Add)
		v1.DELETE("/controller/route", r.Delete)
	}
}
func NewRouteController(routeService service.RouteService) Controller {
	return &RouteController{routeService: routeService}
}
