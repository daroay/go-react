package db

import (
	"backend/src/db/postgres_dbrepo"
	"backend/src/models"
	"database/sql"
	"log"
)

type DBRepo interface {
	Connection() *sql.DB

	// ** Movies ** //
	AllMovies() ([]*models.Movie, error)
	GetMovie(id int) (*models.Movie, error)
	// GetMovieWithGenres(id int) (*models.Movie, error)

	// ** Users ** //
	GetUserByEmail(email string) (*models.User, error)
	GetUserById(id int) (*models.User, error)

	// ** Genres ** //
	AllGenres() ([]*models.Genre, error)
}

func ConnectToDb(driver, dsn string) (DBRepo, error) {

	var mydbrepo DBRepo
	var err error

	switch driver {
	case "postgres":
		mydbrepo, err = postgres_dbrepo.New(dsn)
		if err != nil {
			return nil, err
		}
		log.Println("Connected to Postgres")
	}

	return mydbrepo, nil
}
