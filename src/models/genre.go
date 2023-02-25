package models

type Genre struct {
	ID      int    `json:"id"`
	Genre   string `json:"genre"`
	Checked bool   `json:"checked"`
	Updatable
}

// Verify we implement interfaces
var _ Validatable = (*Genre)(nil)
var _ JsonProcessable = (*Genre)(nil)

func (m *Genre) IsValid() (bool, error) {
	return true, nil
}

func (m *Genre) JsonPreProcess() {
}
