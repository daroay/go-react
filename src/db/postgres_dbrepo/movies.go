package postgres_dbrepo

import (
	"backend/src/models"
	"context"
	"database/sql"
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
	movie.GenresIds = genresIds

	return &movie, nil

}

func (m *PostgresDBRepo) InsertMovie(movie models.Movie) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `insert into
						movies (title, description, release_date, runtime, mpaa_rating, image, created_at, updated_at)
					values
						($1, $2, $3, $4, $5, $6, $7, $8)
					returning
					  id`

	var newId int

	movie.Touch()
	err := m.DB.QueryRowContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Image,
		movie.CreatedAt,
		movie.UpdatedAt,
	).Scan(&newId)

	if err != nil {
		return 0, err
	}

	return newId, nil

}

func (m *PostgresDBRepo) UpdateMovieGenres(id int, genresIds []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `delete from
						movies_genres
					where
						movie_id = $1`

	_, err := m.DB.ExecContext(ctx, stmt, id)

	if err != nil {
		return err
	}

	for _, n := range genresIds {
		stmt := `insert into 
							movies_genres (movie_id, genre_id) 
						values 
							($1, $2)`
		_, err := m.DB.ExecContext(ctx, stmt, id, n)
		if err != nil {
			return err
		}
	}

	return nil

}
