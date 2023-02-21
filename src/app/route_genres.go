package app

import (
	"backend/src/utils"
	"net/http"
)

func (app *App) allGenres(w http.ResponseWriter, r *http.Request) {

	genres, err := app.dbrepo.AllGenres()
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, genres)
}
