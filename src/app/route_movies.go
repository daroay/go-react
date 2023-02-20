package app

import (
	"backend/src/utils"
	"net/http"
)

func (app *App) allMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.dbrepo.AllMovies()
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, movies)
}

func (app *App) movieCatalog(w http.ResponseWriter, r *http.Request) {

}
