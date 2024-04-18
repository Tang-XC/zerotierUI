package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"fmt"
)

func DecryptAES(ct string, key []byte) (string, error) {
	data, err := base64.StdEncoding.DecodeString(ct)
	if err != nil {
		return "", err
	}

	dnData, err := aesCBCDecrypt(data, key, []byte("0000000000000000"))
	if err != nil {
		return "", err
	}
	return string(dnData), nil
}
func aesCBCDecrypt(ciphertext, key, iv []byte) ([]byte, error) {
	// AES
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}

	if len(ciphertext)%aes.BlockSize != 0 {
		panic("ciphertext is not a multiple of the block size")
	}

	// CBC 解密
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(ciphertext, ciphertext)

	// PKCS7 反填充
	result := UnPKCS7Padding(ciphertext)
	fmt.Println(result)
	return result, nil
}
func UnPKCS7Padding(text []byte) []byte {
	// 取出填充的数据 以此来获得填充数据长度
	unPadding := int(text[len(text)-1])
	return text[:(len(text) - unPadding)]
}
