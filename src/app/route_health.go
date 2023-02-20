package app

import (
	"backend/src/models"
	"backend/src/utils"
	"net/http"
)

func (app *App) health(w http.ResponseWriter, r *http.Request) {
	health := models.Health{Message: "OK"}
	_ = utils.WriteJSON(w, http.StatusOK, health)
}
