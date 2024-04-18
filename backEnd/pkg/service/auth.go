package service

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"shop/pkg/config"
	"shop/pkg/model"
	"shop/pkg/repository"
	"shop/pkg/utils/email"
	utils "shop/pkg/utils/token"
)

type authService struct {
	userRepository repository.UserRepository
	conf           *config.Config
}

func (a *authService) Login(au *model.LoginUser) (interface{}, error) {
	response := make(map[string]interface{})
	//检查用户是否存在
	data, err := a.userRepository.GetUserByAccount(au.Account)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("用户不存在")
		}
		return nil, err
	}
	//检查密码是否正确
	if data.PassWord != au.Password {
		return nil, errors.New("密码错误")
	}
	//生成token
	token, err := utils.GenerateToken(data.Account)
	response = map[string]interface{}{
		"token":   token,
		"message": "登录成功",
	}
	return response, nil
}
func (a *authService) ForgetPassword(params *model.ForgetPasswordParams) (string, error) {
	//检查用户是否存在
	data, err := a.userRepository.GetUserByAccount(params.Account)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", errors.New("用户不存在")
		}
	}
	//检查邮箱是否正确
	if data.Email != params.Email {
		return "", errors.New("邮箱与注册时填写不一致")
	}

	//生成token
	token := utils.GenerateRandomString(12)
	//发送邮件
	fmt.Println(a.conf.Smtp)
	error := email.SendEmail(data.Email, "重置密码", fmt.Sprintf("密码已为您重置为："+token), &a.conf.Smtp)
	if error != nil {
		return "", errors.New("密码重置邮件发送失败")
	}
	//重置密码
	data.PassWord = token
	a.userRepository.Update(data)
	return "邮件已发送，请注意查收", nil
}

func NewAuthService(userRepository repository.UserRepository, conf *config.Config) AuthService {
	return &authService{
		userRepository: userRepository,
		conf:           conf,
	}
}
