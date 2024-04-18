package email

import (
	"fmt"
	"net/mail"
	"net/smtp"
	"shop/pkg/config"
)

func SendEmail(toEmail, subject, body string, smtpOption *config.SMTPOption) error {
	fromEmail := smtpOption.SmtpUser
	password := smtpOption.SmtpPassword
	smtpServer := smtpOption.SmtpServer
	smtpPort := smtpOption.SmtpPort

	from := mail.Address{
		Name:    "管理员",
		Address: fromEmail,
	}
	to := mail.Address{
		Name:    "用户",
		Address: toEmail,
	}
	message := fmt.Sprintf("From: %s\r\n", from.String())
	message += fmt.Sprintf("To: %s\r\n", to.String())
	message += fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body)

	auth := smtp.PlainAuth("", fromEmail, password, smtpServer)
	err := smtp.SendMail(fmt.Sprintf("%s:%d", smtpServer, smtpPort), auth, fromEmail, []string{toEmail}, []byte(message))
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}
