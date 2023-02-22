package app

import (
	"backend/src/sec"
	"backend/src/utils"
	"errors"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v4"
)

func (app *App) authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := utils.ReadJSON(w, r, &requestPayload)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate user against db
	user, err := app.dbrepo.GetUserByEmail(requestPayload.Email)
	if err != nil {
		utils.ErrorJSON(w, errors.New("invalid credentials"), http.StatusBadGateway)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		utils.ErrorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// create a jwt user
	u := sec.JwtUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	// generate token
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		utils.ErrorJSON(w, err)
		return
	}

	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	utils.WriteJSON(w, http.StatusAccepted, tokens)

}

func (app *App) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.CookieName {
			claims := &sec.Claims{}
			refreshToken := cookie.Value

			// parse token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.auth.Secret), nil
			})
			if err != nil {
				utils.ErrorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get user id from token claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				utils.ErrorJSON(w, errors.New("unkown user"), http.StatusUnauthorized)
				return
			}

			user, err := app.dbrepo.GetUserById(userID)
			if err != nil {
				utils.ErrorJSON(w, errors.New("unkown user"), http.StatusUnauthorized)
				return
			}

			u := sec.JwtUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			tokenPairs, err := app.auth.GenerateTokenPair(&u)
			if err != nil {
				utils.ErrorJSON(w, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			http.SetCookie(w, app.auth.GetRefreshCookie(tokenPairs.RefreshToken))
			utils.WriteJSON(w, http.StatusOK, tokenPairs)
			return
		}
	}
	// at this point there is no refresh-token
	utils.WriteJSON(w, http.StatusOK, struct{}{})
}

func (app *App) logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, app.auth.GetExpiredRefreshCookie())
	w.WriteHeader(http.StatusAccepted)
}
