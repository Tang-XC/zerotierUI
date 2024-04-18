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
	EncryptKey             string `yaml:"encryptKey"`
}
type SMTPOption struct {
	SmtpServer   string `yaml:"smtpServer"`
	SmtpPort     int    `yaml:"smtpPort"`
	SmtpUser     string `yaml:"smtpUser"`
	SmtpPassword string `yaml:"smtpPassword"`
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
type SystemConfig struct {
	Logo         string `yaml:"logo"`
	SystemName   string `yaml:"systemName"`
	Slogan       string `yaml:"slogan"`
	Copyright    string `yaml:"copyright"`
	MaxMember    int    `yaml:"maxMember"`
	ProtocolInfo string `yaml:"protocolInfo"`
}
type Config struct {
	Server       ServerConfig   `yaml:"server"`
	DB           DBConfig       `yaml:"db"`
	Zerotier     ZerotierConfig `yaml:"zerotier"`
	SystemConfig SystemConfig   `yaml:"systemConfig"`
	Smtp         SMTPOption     `yaml:"smtp"`
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
