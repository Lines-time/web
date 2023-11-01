package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-pkgz/auth"
	"github.com/go-pkgz/auth/avatar"
	"github.com/go-pkgz/auth/provider"
	"github.com/go-pkgz/auth/token"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	})

	authService := auth.NewService(auth.Opts{
		SecretReader: token.SecretFunc(func(id string) (string, error) { // secret key for JWT
			return "secret", nil
		}),
		TokenDuration:  time.Minute * 5, // token expires in 5 minutes
		CookieDuration: time.Hour * 24,  // cookie expires in 1 day and will enforce re-login
		Issuer:         "my-test-app",
		URL:            "http://127.0.0.1:8080",
		AvatarStore:    avatar.NewLocalFS("./tmp"),
		Validator: token.ValidatorFunc(func(_ string, claims token.Claims) bool {
			// allow only dev_* names
			return claims.User != nil && strings.HasPrefix(claims.User.Name, "dev_")
		}),
	})
	authService.AddDirectProvider("local", provider.CredCheckerFunc(func(user, password string) (ok bool, err error) {
		fmt.Println(user, password)
		if user == "admin" && password == "admin" {
			return true, nil
		}
		return false, nil
	}))
	authMiddleware := authService.Middleware()
	authRoutes, _ := authService.Handlers()

	e.Group("/auth", echo.WrapMiddleware(func(h http.Handler) http.Handler {
		return authRoutes
	}))

	api := e.Group("/api")
	api.Use(echo.WrapMiddleware(authMiddleware.Auth))
	api.GET("/", func(c echo.Context) error {
		fmt.Println(c.Request().URL.User)
		return c.String(200, "Hello from api")
	})

	e.Logger.Fatal(e.Start(":3000"))
}
