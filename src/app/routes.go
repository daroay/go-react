package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func generateRoutes(app App) http.Handler {
	// create router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)

	// Everything here is prefixed with /api
	mux.Route("/api", func(mux chi.Router) {
		mux.Get("/health", app.health)
		mux.Get("/movies", app.allMovies)
		mux.Get("/movies/{id}", app.getMovie)
		mux.Post("/authenticate", app.authenticate)
		mux.Get("/refresh", app.refreshToken)
		mux.Get("/logout", app.logout)

		mux.Route("/admin", func(mux chi.Router) {
			mux.Use(app.authRequired)
			mux.Get("/movies", app.allMovies)
			mux.Get("/genres", app.allGenres)
			mux.Get("/movies/{id}", app.getMovie)
		})
	})

	// Static Assets
	publicFolder := http.FileServer(http.Dir("public"))
	static := "/static/media"
	mux.Handle(fmt.Sprintf("%s*", static), http.StripPrefix(static, publicFolder))

	// Front end routes
	mux.Handle("/*", app.serveFrontEndRoutes(publicFolder))

	// At this point, ano other route is NotFound

	return mux
}
