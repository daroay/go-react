package app

import (
	"backend/src/utils"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (app *App) allMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.dbrepo.AllMovies()
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, movies)
}

func (app *App) getMovie(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	movieId, err := strconv.Atoi(id)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	movie, err := app.dbrepo.GetMovie(movieId)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, movie)
}
