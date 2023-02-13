package controller

import (
	"backend/src/utils"
	"net/http"
)

func (controller *Controller) AllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := controller.dbrepo.AllMovies()
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, movies)
}
