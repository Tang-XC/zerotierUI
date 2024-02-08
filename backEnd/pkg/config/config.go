package config

import (
	"errors"
	"gopkg.in/yaml.v3"
	"os"
)

type ServerConfig struct {
	Env                    string `yaml:"env"`
	Address                string `yaml:"address"`
	Port                   int    `yaml:"port"`
	GracefulShutdownPeriod int    `yaml:"gracefulShutdownPeriod"`
	JwtSecret              string `yaml:"jwtSecret"`
}

type DBConfig struct {
	Port     int    `yaml:"port"`
	Host     string `yaml:"host"`
	Name     string `yaml:"name"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
}
type ZerotierConfig struct {
	Address   string `yaml:"address"`
	Port      int    `yaml:"port"`
	Token     string `yaml:"token"`
	TokenPath string `yaml:"tokenPath"`
}
type Config struct {
	Server   ServerConfig   `yaml:"server"`
	DB       DBConfig       `yaml:"db"`
	Zerotier ZerotierConfig `yaml:"zerotier"`
}

func Parse(appConfig string) (*Config, error) {
	config := &Config{}
	file, err := os.Open(appConfig)
	if errors.Is(err, os.ErrNotExist) {
		return nil, err
	}
	defer file.Close()

	if err := yaml.NewDecoder(file).Decode(&config); err != nil {
		return nil, err
	}
	return config, nil
}
