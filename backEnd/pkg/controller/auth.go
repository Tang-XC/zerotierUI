package controller

import (
	"github.com/gin-gonic/gin"
	"shop/pkg/common"
	"shop/pkg/config"
	"shop/pkg/model"
	"shop/pkg/service"
	"shop/pkg/utils/crypto"
)

type AuthController struct {
	userService service.UserService
	authService service.AuthService
	conf        *config.Config
}

func (a *AuthController) Login(c *gin.Context) {
	loginInfo := new(model.LoginUser)
	if err := c.BindJSON(loginInfo); err != nil {
		common.FailedResponse(c, 401, err)
		return
	}
	encKey := []byte(a.conf.Server.EncryptKey)

	loginInfo.Account, _ = crypto.DecryptAES(loginInfo.Account, encKey)
	result, err := a.authService.Login(loginInfo)
	if err != nil {
		common.FailedResponse(c, 401, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (a *AuthController) Register(c *gin.Context) {
	registerInfo := new(model.RegisterUser)
	if err := c.BindJSON(registerInfo); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	user := registerInfo.GetUser()
	roles := []uint{1}
	result, err := a.userService.Create(user, roles)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (a *AuthController) ForgetPassword(c *gin.Context) {
	forgetInfo := new(model.ForgetPasswordParams)

	if err := c.BindJSON(forgetInfo); err != nil {
		common.FailedResponse(c, 400, err)
		return
	}

	result, err := a.authService.ForgetPassword(forgetInfo)
	if err != nil {
		common.FailedResponse(c, 400, err)
		return
	}
	common.SuccessResponse(c, result)
}
func (a *AuthController) Name() string {
	return "auth"
}
func (a *AuthController) RegisterRoute(api *gin.RouterGroup) {
	api.POST("/login", a.Login)
	api.POST("/register", a.Register)
	api.POST("/forgetPassword", a.ForgetPassword)
}
func NewAuthController(u service.UserService, a service.AuthService, conf *config.Config) Controller {
	return &AuthController{
		userService: u,
		authService: a,
		conf:        conf,
	}
}
