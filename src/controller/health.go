package controller

import (
	"backend/src/models"
	"backend/src/utils"
	"net/http"
)

func (controllers *Controller) Health(w http.ResponseWriter, r *http.Request) {
	health := models.Health{"OK"}
	_ = utils.WriteJSON(w, http.StatusOK, health)
}
