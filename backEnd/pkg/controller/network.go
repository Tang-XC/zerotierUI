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

type NetworkController struct {
	networkService service.NetworkService
	userService    service.UserService
}

func (n *NetworkController) List(c *gin.Context) {
	var request model.ListRequest
	request.Page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	request.Size, _ = strconv.Atoi(c.DefaultQuery("size", "10"))
	request.Keywords = c.DefaultQuery("keywords", "")

	var token = c.GetHeader("Authorization")
	user, _ := n.userService.GetUser(token)
	request.Owner = *user

	networks, err := n.networkService.List(request)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, networks)
}
func (n *NetworkController) MembershipsList(c *gin.Context) {
	id := c.Param("id")
	response, err := n.networkService.MembershipsList(id)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
	}
	common.SuccessResponse(c, response)
}
func (n *NetworkController) Detail(c *gin.Context) {
	id := c.Param("id")
	network, err := n.networkService.Detail(id)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, network)
}
func (n *NetworkController) Create(c *gin.Context) {
	var addNetwork model.AddNetwork
	if err := c.ShouldBindJSON(&addNetwork); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	token := c.GetHeader("Authorization")
	network, err := n.networkService.Create(&addNetwork, token)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, network)
}
func (n *NetworkController) Delete(c *gin.Context) {
	id := c.Param("id")
	err := n.networkService.Delete(id)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, nil)
}
func (n *NetworkController) Update(c *gin.Context) {
	id := c.Param("id")
	updateNetwork := new(model.UpdateNetwork)
	if err := c.ShouldBindJSON(updateNetwork); err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	network, err := n.networkService.Update(id, updateNetwork)
	if err != nil {
		common.FailedResponse(c, http.StatusBadRequest, err)
		return
	}
	common.SuccessResponse(c, network)
}

func (n *NetworkController) RegisterRoute(api *gin.RouterGroup) {
	v1 := api.Group("/", middleware.Auth())
	{
		v1.GET("/controller/network", n.List)
		v1.POST("/controller/network", n.Create)
		v1.GET("/controller/network/:id", n.Detail)
		v1.DELETE("/controller/network/:id", n.Delete)
		v1.GET("/controller/network/memberships/:id", n.MembershipsList)
		v1.PUT("/controller/networkDetail/:id", n.Update)
	}
}

func (n *NetworkController) Name() string {
	return "network"
}
func NewNetworkController(networkService service.NetworkService, userService service.UserService) Controller {
	return &NetworkController{networkService: networkService, userService: userService}
}
