package app

import (
	"backend/src/clients/moviedbclient"
	"backend/src/db"
	"backend/src/sec"
	"net/http"
)

type App struct {
	dbrepo        db.DBRepo
	auth          sec.Auth
	Routes        http.Handler
	moviedbClient *moviedbclient.MovieDBClient
}

func New(dbrepo db.DBRepo, auth sec.Auth, moviedbClient *moviedbclient.MovieDBClient) *App {
	app := App{dbrepo: dbrepo, auth: auth, moviedbClient: moviedbClient}
	app.Routes = generateRoutes(app)
	return &app
}
