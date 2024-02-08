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

type RoleController struct {
	roleService service.RoleService
}

func (r *RoleController) List(c *gin.Context) {
	roles, err := r.roleService.List()
	if err != nil {
		common.FailedResponse(c, 400, err)
	}
	common.SuccessResponse(c, roles)
}

func (r *RoleController) Create(c *gin.Context) {
	roleAdd := new(model.AddRole)
	if err := c.BindJSON(roleAdd); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	role := roleAdd.GetRole()
	result, err := r.roleService.Create(role)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (r *RoleController) AddPermissionToRole(c *gin.Context) {
	baseRoleID := c.Param("role_id")
	basePermissionID := c.Param("permission_id")

	roleID, _ := strconv.Atoi(baseRoleID)
	permissionID, _ := strconv.ParseInt(basePermissionID, 10, 64)
	err := r.roleService.AddPermissionToRole(uint(roleID), permissionID)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, nil)
}
func (r *RoleController) GetRoleByID(c *gin.Context) {
	baseRoleID := c.Param("role_id")
	roleID, _ := strconv.Atoi(baseRoleID)
	role, err := r.roleService.GetRoleByID(uint(roleID))
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, role)
}
func (r *RoleController) Name() string {
	return "User"
}

func (r *RoleController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/", middleware.Auth())
	{
		v1.GET("/role/:role_id", r.GetRoleByID)
		v1.GET("/roles", r.List)
		v1.POST("/role", r.Create)
		v1.GET("/role/:role_id/permission/:permission_id", r.AddPermissionToRole)
	}
}
func NewRoleController(roleService service.RoleService) Controller {
	return &RoleController{roleService: roleService}
}
