package db

import (
	"backend/src/models"
	"database/sql"
	"log"
)

type DBRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
}

func ConnectToDb(driver, dsn string) (DBRepo, error) {

	var mydbrepo DBRepo
	var err error

	switch driver {
	case "postgres":
		mydbrepo, err = NewPostgresDBRepo(dsn)
		if err != nil {
			return nil, err
		}
		log.Println("Connected to Postgres")
	}

	return mydbrepo, nil
}
