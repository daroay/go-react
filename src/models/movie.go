package models

import "time"

type Movie struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	ReleaseDate time.Time `json:"release_date"`
	RunTime     int       `json:"runtime"`
	MPAARating  string    `json:"mpaa_rating"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	Genres      []*Genre  `json:"genres,omitempty"`
	GenresIds   []int     `json:"genres_ids,omitempty"`
	Updatable
}

// Verify we implement interfaces
var _ Validatable = (*Movie)(nil)
var _ JsonProcessable = (*Movie)(nil)

func (m *Movie) JsonPreProcess() {
}

func (m *Movie) IsValid() (bool, error) {
	return true, nil
}
