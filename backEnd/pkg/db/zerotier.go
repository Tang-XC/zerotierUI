package database

import (
	"fmt"
	"github.com/goccy/go-json"
	"io/ioutil"
	"net/http"
	"shop/pkg/config"
	"strings"
)

type ZerotierRequest struct {
	config config.ZerotierConfig
}

func (z *ZerotierRequest) init(path string, method string, data string) ([]byte, error) {
	baseUrl := fmt.Sprintf("http://%s:%d%s", z.config.Address, z.config.Port, path)
	client := &http.Client{}
	payload := strings.NewReader(data)
	req, _ := http.NewRequest(method, baseUrl, payload)
	req.Header.Add("X-ZT1-Auth", z.config.Token)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

// GET
func (z *ZerotierRequest) GET(path string) (interface{}, error) {
	body, err := z.init(path, "GET", "")
	if err != nil {
		return nil, err
	}
	var result interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// POST
func (z *ZerotierRequest) POST(path string, payload interface{}) (interface{}, error) {
	data, err := json.Marshal(payload)
	body, err := z.init(path, "POST", string(data))
	if err != nil {
		return nil, err
	}
	var result interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Delete
func (z *ZerotierRequest) DELETE(path string) (interface{}, error) {
	body, err := z.init(path, "DELETE", "")
	if err != nil {
		return nil, err
	}
	var result interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func NewZerotierRequest(config config.ZerotierConfig) *ZerotierRequest {
	return &ZerotierRequest{config: config}
}
