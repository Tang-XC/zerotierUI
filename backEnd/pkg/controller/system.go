package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"shop/pkg/common"
	"shop/pkg/middleware"
	"shop/pkg/model"
	"shop/pkg/service"
)

type SystemController struct {
	systemService service.SystemService
}

func (s *SystemController) getSystem(c *gin.Context) {
	systemInfo, err := s.systemService.GetSystem()
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, systemInfo)
}
func (s *SystemController) updateSystem(c *gin.Context) {
	system := &model.System{
		ID: 1,
	}
	if err := c.ShouldBindJSON(system); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	info, err := s.systemService.UpdateSystem(system)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, info)
}
func (s *SystemController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/")
	{
		v1.GET("/systemInfo", s.getSystem)
		v1.POST("/systemInfo", s.updateSystem, middleware.Auth())
	}
}
func (s *SystemController) Name() string {
	return "system"
}
func NewSystemController(systemService service.SystemService) Controller {
	return &SystemController{
		systemService: systemService,
	}
}
