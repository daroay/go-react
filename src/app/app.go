package app

import (
	"backend/src/db"
	"backend/src/sec"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
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

func generateRoutes(app App) http.Handler {
	// create router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.EnableCORS)

	// Static Assets
	publicFolder := http.FileServer(http.Dir("public"))
	mux.Handle("/*", publicFolder)

	// Front end routes
	frontEndRoutes := []string{
		"/movies",
		"/manage-catalog",
	}
	for _, s := range frontEndRoutes {
		mux.Handle(fmt.Sprintf("%s*", s), http.StripPrefix(s, publicFolder))
	}

	// Everything here is prefixed with /api
	mux.Route("/api", func(mux chi.Router) {
		mux.Get("/health", app.health)
		mux.Get("/movies", app.allMovies)
		mux.Post("/authenticate", app.authenticate)
		mux.Get("/refresh", app.refreshToken)
		mux.Get("/logout", app.logout)

		mux.Route("/admin", func(mux chi.Router) {
			mux.Use(app.AuthRequired)
			mux.Get("/movies", app.movieCatalog)
		})
	})

	return mux
}
