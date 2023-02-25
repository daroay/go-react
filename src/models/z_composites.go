package models

import "time"

type Updatable struct {
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

func (u *Updatable) Touch() {
	u.UpdatedAt = time.Now()
	if u.CreatedAt.IsZero() {
		u.CreatedAt = time.Now()
	}
}

type Validatable interface {
	IsValid() (bool, error)
}

type JsonProcessable interface {
	JsonPreProcess()
}
