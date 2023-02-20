package postgres_dbrepo

import (
	"backend/src/models"
	"context"
	"database/sql"
)

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select 
							id, genre
						from
							genres
						order by
					  	genre`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	return genres, nil

}
