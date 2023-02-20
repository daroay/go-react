package db

import (
	"backend/src/db/postgres_dbrepo"
	"backend/src/models"
	"database/sql"
	"log"
)

type DBRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserById(id int) (*models.User, error)
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
