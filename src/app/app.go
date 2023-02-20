package app

import (
	"backend/src/db"
	"backend/src/sec"
	"net/http"
)

type App struct {
	dbrepo db.DBRepo
	auth   sec.Auth
	Routes http.Handler
}

func New(dbrepo db.DBRepo, auth sec.Auth) *App {
	app := App{dbrepo: dbrepo, auth: auth}
	app.Routes = generateRoutes(app)
	return &app
}
