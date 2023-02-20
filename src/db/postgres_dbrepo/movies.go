package postgres_dbrepo

import (
	"backend/src/models"
	"context"
	"database/sql"
	"log"
)

func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select 
			id, title, release_date, runtime,
			mpaa_rating, description, coalesce(image, ''),
			created_at, updated_at
		from
			movies
		order by
			title
	`

	rows, err := m.DB.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) GetMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select 
							id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at
						from
						  movies
						where
						  id = $1
						`

	var movie models.Movie
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	query = `select 
						g.id, g.genre, 1
					from
						movies_genres mg
					left join 
						genres g on (mg.genre_id = g.id)
					where
					  mg.movie_id = $1
					order by
					  g.genre`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	var genresIds []int
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
			&g.Checked,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
		genresIds = append(genresIds, g.ID)
	}

	movie.Genres = genres
	log.Println(genresIds)
	movie.GenresIds = genresIds

	return &movie, nil

}
