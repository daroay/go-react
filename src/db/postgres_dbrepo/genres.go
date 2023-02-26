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
							id, genre, created_at, updated_at
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
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	return genres, nil

}

func (m *PostgresDBRepo) GetGenre(id int) (*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select 
							id, genre, created_at, updated_at
						from
							genres
						where
						  id = $1
						`

	var genre models.Genre
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&genre.ID,
		&genre.Genre,
		&genre.CreatedAt,
		&genre.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &genre, nil

}
