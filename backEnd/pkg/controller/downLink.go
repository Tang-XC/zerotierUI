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

type DownLinkController struct {
	downLinkService service.DownLinkService
}

func (d *DownLinkController) List(c *gin.Context) {
	downLinks, err := d.downLinkService.List()
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, downLinks)
}
func (d *DownLinkController) Create(c *gin.Context) {
	downLink := model.DownLink{}
	if err := c.ShouldBindJSON(&downLink); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}

	if err := d.downLinkService.Create(&downLink); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, "添加成功！")
}
func (d *DownLinkController) Update(c *gin.Context) {
	downLink := model.DownLink{}
	if err := c.ShouldBindJSON(&downLink); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	if err := d.downLinkService.Update(&downLink); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, "修改成功！")

}
func (d *DownLinkController) Delete(c *gin.Context) {
	id := c.Param("id")
	intId, _ := strconv.Atoi(id)
	if err := d.downLinkService.Delete(uint(intId)); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, "删除成功！")
}

func (d *DownLinkController) RegisterRoute(api *gin.RouterGroup) {
	api.GET("/downLinks", d.List)
	v1 := api.Group("/", middleware.Auth())
	{
		v1.POST("/downLink", d.Create)
		v1.PUT("/downLink", d.Update)
		v1.DELETE("/downLink/:id", d.Delete)
	}
}
func (d *DownLinkController) Name() string {
	return "downLink"
}
func NewDownLinkController(downService service.DownLinkService) Controller {
	return &DownLinkController{
		downLinkService: downService,
	}
}
