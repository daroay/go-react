package app

import (
	"backend/src/utils"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (app *App) allGenres(w http.ResponseWriter, r *http.Request) {

	genres, err := app.dbrepo.AllGenres()
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, genres)
}

func (app *App) getGenre(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	genreId, err := strconv.Atoi(id)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	movie, err := app.dbrepo.GetGenre(genreId)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, movie)
}
