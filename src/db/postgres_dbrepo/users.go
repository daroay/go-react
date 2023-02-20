package postgres_dbrepo

import (
	"backend/src/models"
	"context"
)

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select 
							id, email, first_name, last_name, password, created_at, updated_at
						from 
							users
						where
							email = $1
						`
	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil

}

func (m *PostgresDBRepo) GetUserById(id int) (*models.User, error) {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select 
							id, email, first_name, last_name, password, created_at, updated_at
						from 
							users
						where
							id = $1
						`
	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil

}
