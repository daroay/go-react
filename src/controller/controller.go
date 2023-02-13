package controller

import (
	"backend/src/db"
	"backend/src/initializers"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Controller struct {
	dbrepo db.DBRepo
}

func GetRoutesHandler(dbrepo db.DBRepo) http.Handler {

	// create router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(initializers.EnableCORS)

	// Static Assets
	fs := http.FileServer(http.Dir("public"))
	mux.Handle("/*", fs)

	// Front end routes
	feRoutes := []string{
		"/movies",
	}
	for _, s := range feRoutes {
		mux.Handle(fmt.Sprintf("%s*", s), http.StripPrefix(s, fs))
	}

	controller := Controller{dbrepo: dbrepo}

	mux.Get("/api/health", controller.Health)
	mux.Get("/api/movies", controller.AllMovies)

	return mux
}
