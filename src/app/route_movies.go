package app

import (
	"backend/src/models"
	"backend/src/utils"
	"log"
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

func (app *App) insertMovie(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie

	err := utils.ReadJSON(w, r, &movie)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	// try to get an image
	movieImageUrl, err := app.moviedbClient.GetMoviePoster(movie.Title)
	if err == nil {
		movie.Image = movieImageUrl
	} else {
		log.Println("error getting movie poster", err)
	}

	if _, err := movie.IsValid(); err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	newID, err := app.dbrepo.InsertMovie(movie)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	// insert genres
	err = app.dbrepo.UpdateMovieGenres(newID, movie.GenresIds)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	resp := utils.JSONResponse{
		Error:   false,
		Message: "movie updated",
	}

	utils.WriteJSON(w, http.StatusAccepted, resp)

}

func (app *App) updateMovie(w http.ResponseWriter, r *http.Request) {
}
