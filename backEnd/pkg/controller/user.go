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

type UserController struct {
	userService service.UserService
}

func (u *UserController) List(c *gin.Context) {
	keywords := c.Query("keywords")
	users, err := u.userService.List(keywords)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}

	common.SuccessResponse(c, users)
}
func (u *UserController) GetUser(c *gin.Context) {
	//var uu = new(model.UpdatedUser)
	token := c.Request.Header.Get("Authorization")
	user, err := u.userService.GetUser(token)
	//json.Unmarshal([]byte(user.Region), &uu.Region)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, user)
}
func (u *UserController) GetUserById(c *gin.Context) {
	var uu = new(model.UpdatedUser)
	user, err := u.userService.GetUserById(c.Param("id"))
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	uu = &model.UpdatedUser{
		ID:      user.ID,
		Name:    user.Name,
		Account: user.Account,
		Phone:   user.Phone,
		Email:   user.Email,
		Avatar:  user.Avatar,
	}
	common.SuccessResponse(c, uu)
}
func (u *UserController) Create(c *gin.Context) {
	var uu = new(model.AddUser)
	if err := c.BindJSON(uu); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	user := uu.GetUser()
	result, err := u.userService.Create(user, uu.Roles)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (u *UserController) Update(c *gin.Context) {
	uu := new(model.UpdatedUser)
	if err := c.BindJSON(uu); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	data := uu.GetUser()
	roles := uu.Roles
	_, err := u.userService.Update(c.Param("id"), roles, data)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, "更新成功")
}
func (u *UserController) Delete(c *gin.Context) {
	if err := u.userService.Delete(c.Param("id")); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}

	common.SuccessResponse(c, "删除成功")
}
func (u *UserController) ResetPassword(c *gin.Context) {
	var up = new(model.UpdatedPassword)
	if err := c.BindJSON(up); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	token := c.Request.Header.Get("Authorization")
	user, err := u.userService.GetUser(token)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	result, err := u.userService.UpdatePassword(strconv.Itoa(int(user.ID)), up)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (u *UserController) UpdatePassword(c *gin.Context) {
	up := new(model.UpdatedPassword)
	if err := c.BindJSON(up); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	result, err := u.userService.UpdatePassword(c.Param("id"), up)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (u *UserController) AddRole(c *gin.Context) {
	AddRoleParams := new(model.AddRoleParams)
	if err := c.BindJSON(AddRoleParams); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := u.userService.AddRole(AddRoleParams.UserID, AddRoleParams.RoleID)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, "添加成功")
}
func (u *UserController) RemoveRole(c *gin.Context) {
	RemoveRoleParams := new(model.RemoveRoleParams)
	if err := c.BindJSON(RemoveRoleParams); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	err := u.userService.RemoveRole(RemoveRoleParams.UserID, RemoveRoleParams.RoleID)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, "删除成功")
}
func (u *UserController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/", middleware.Auth())
	{
		v1.GET("/users", u.List)
		v1.GET("/user", u.GetUser)
		v1.GET("/user/:id", u.GetUserById)
		v1.POST("/user", u.Create)
		v1.PUT("/user/:id", u.Update)
		v1.DELETE("/user/:id", u.Delete)
		v1.POST("/user_updatePassword/:id", u.UpdatePassword)
		v1.POST("/user_resetPassword", u.ResetPassword)
		v1.POST("/addRole", u.AddRole)
		v1.POST("/removeRole", u.RemoveRole)
	}
}
func (u *UserController) Name() string {
	return "User"
}
func NewUserController(userService service.UserService) Controller {
	return &UserController{
		userService: userService,
	}
}
