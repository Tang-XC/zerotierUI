package service

import (
	"fmt"
	database "shop/pkg/db"
	"shop/pkg/model"
	"shop/pkg/repository"
)

type routeService struct {
	networkRepository repository.NetworkRepository
	zerotier          *database.ZerotierRequest
}

func (r *routeService) List(request model.RouteListRequest) (model.ResponseRoute, error) {
	//获取network的detail
	networkDetail, err := r.zerotier.GET(fmt.Sprintf("/controller/network/%s", request.NetworkId))
	if err != nil {
		return model.ResponseRoute{}, err
	}
	routes := networkDetail.(map[string]interface{})["routes"].([]interface{})
	if len(routes) == 0 {
		return model.ResponseRoute{
			Routes: []model.Route{},
		}, nil
	}

	//将routes转换为 model.Routes
	var routesModel model.Routes
	for _, v := range routes {
		route := v.(map[string]interface{})
		var target string = ""
		var via string = ""
		if route["target"] != nil {
			target = route["target"].(string)
		}
		if route["via"] != nil {
			via = route["via"].(string)
		}
		routesModel = append(routesModel, model.Route{
			Target: target,
			Via:    via,
		})
	}
	return model.ResponseRoute{
		Routes: routesModel,
	}, nil
}
func (r *routeService) Add(addRoute model.AddRoute) error {
	networkDetail, err := r.zerotier.GET(fmt.Sprintf("/controller/network/%s", addRoute.NetworkId))
	if err != nil {
		return err
	}
	routes := networkDetail.(map[string]interface{})["routes"].([]interface{})
	routes = append(routes, map[string]interface{}{
		"target": addRoute.Target,
		"via":    addRoute.Via,
	})
	var data = map[string]interface{}{
		"routes": routes,
	}
	_, err = r.zerotier.POST(fmt.Sprintf("/controller/network/%s", addRoute.NetworkId), data)
	if err != nil {
		return err
	}
	return nil
}
func (r *routeService) Delete(deleteRoute model.DeleteRoute) error {
	networkDetail, err := r.zerotier.GET(fmt.Sprintf("/controller/network/%s", deleteRoute.NetworkId))
	if err != nil {
		return err
	}
	routes := networkDetail.(map[string]interface{})["routes"].([]interface{})
	var newRoutes []interface{}
	for _, v := range routes {
		route := v.(map[string]interface{})
		if route["target"] != deleteRoute.Target && route["via"] != deleteRoute.Via {
			newRoutes = append(newRoutes, route)
		}
	}
	var data map[string]interface{}
	if len(newRoutes) == 0 {
		data = map[string]interface{}{
			"routes": []interface{}{},
		}
	} else {
		data = map[string]interface{}{
			"routes": newRoutes,
		}
	}
	_, err = r.zerotier.POST(fmt.Sprintf("/controller/network/%s", deleteRoute.NetworkId), data)
	if err != nil {
		return err
	}
	return nil
}

func NewRouteService(networkRepository repository.NetworkRepository, zerotier *database.ZerotierRequest) *routeService {
	return &routeService{
		networkRepository: networkRepository,
		zerotier:          zerotier,
	}
}
