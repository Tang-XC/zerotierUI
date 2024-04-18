package model

type User struct {
	ID       uint   `gorm:"column:id;" json:"id"`
	Name     string `gorm:"column:name;" json:"name"`
	Account  string `gorm:"column:account;" json:"account"'`
	Phone    string `gorm:"column:phone;" json:"phone"'`
	Desc     string `gorm:"column:desc;" json:"desc"`
	PassWord string `gorm:"column:password;" json:"password"`
	Email    string `gorm:"column:email;" json:"email"`
	Avatar   string `gorm:"column:avatar;" json:"avatar"`
	Region   string `gorm:"column:region;" json:"region"`
	Address  string `gorm:"column:address;" json:"address"`
	Roles    []Role `gorm:"many2many:user_role;" json:"roles"`
}

func (table User) TableName() string {
	return "users"
}

type Users []User

type LoginUser struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

type RegisterUser struct {
	Account  string `json:"account"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
}

func (c *RegisterUser) GetUser() *User {
	return &User{
		Account:  c.Account,
		PassWord: c.Password,
		Phone:    c.Phone,
		Email:    c.Email,
	}
}

type AddUser struct {
	Name     string `json:"name"`
	Account  string `json:"account"'`
	Password string `json:"password"`
	Phone    string `json:"phone"'`
	Email    string `json:"email"`
	Roles    []uint `json:"roles"`
}

func (c *AddUser) GetUser() *User {
	return &User{
		Name:     c.Name,
		Account:  c.Account,
		PassWord: c.Password,
		Phone:    c.Phone,
		Email:    c.Email,
	}
}

type UpdatedUser struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Account string `json:"account"'`
	Phone   string `json:"phone"'`
	Email   string `json:"email"`
	Avatar  string `json:"avatar"`
	Roles   []uint `json:"roles"`
}

func (c *UpdatedUser) GetUser() *User {
	return &User{
		ID:      c.ID,
		Account: c.Account,
		Name:    c.Name,
		Avatar:  c.Avatar,
		Email:   c.Email,
		Phone:   c.Phone,
	}
}

type UpdatedPassword struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type User_Role struct {
	UserID uint `gorm:"column:user_id;primary_key" json:"user_id"`
	RoleID uint `gorm:"column:role_id;primary_key" json:"role_id"`
}

func (table User_Role) TableName() string {
	return "user_role"
}

type AddRoleParams struct {
	UserID uint `json:"user_id"`
	RoleID uint `json:"role_id"`
}
type RemoveRoleParams struct {
	UserID uint `json:"user_id"`
	RoleID uint `json:"role_id"`
}

type ForgetPasswordParams struct {
	Account string `json:"account"`
	Email   string `json:"email"`
}
