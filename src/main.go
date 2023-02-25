package main

import (
	"backend/src/app"
	"backend/src/clients/moviedbclient"
	"backend/src/db"
	"backend/src/sec"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {

	// log config
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// load environment
	err := godotenv.Load()
	// error when env variables are not loaded either through app.yaml or .env
	if err != nil && os.Getenv("EXEC_ENV") == "" {
		log.Fatal("Error loading .env file")
	}

	// auth
	jwtSecret := os.Getenv("JWT_SECRET")
	jwtIssuer := os.Getenv("JWT_ISSUER")
	jwtAudience := os.Getenv("JWT_AUDIENCE")
	cookieDomain := os.Getenv("COOKIE_DOMAIN")

	// -- Due to chrome bug, we can't prefix __Host- on non-https localhost
	cookieName := "refresh_token"
	if os.Getenv("EXEC_ENV") == "PROD" {
		cookieName = fmt.Sprintf("__Host-%s", cookieName)
	}

	auth := sec.Auth{
		Issuer:        jwtIssuer,
		Audience:      jwtAudience,
		Secret:        jwtSecret,
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookieDomain:  cookieDomain,
		CookiePath:    "/",
		CookieName:    cookieName,
	}

	// start db connection
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	dbHost := os.Getenv("DB_HOST")
	connString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable timezone=UTC connect_timeout=5", dbHost, dbPort, dbUser, dbPass, dbName)
	dbrepo, err := db.ConnectToDb("postgres", connString)
	if err != nil {
		log.Fatal(err)
	}
	defer dbrepo.Connection().Close()

	// create moviedbclient
	movieDBAPIKey := os.Getenv("MOVIEDB_APIKEY")
	moviedbClient := moviedbclient.New(movieDBAPIKey)

	// start a web server with given routes
	port := os.Getenv("SERVICE_PORT")
	log.Println("Starting application on port", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), app.New(dbrepo, auth, moviedbClient).Routes)

	if err != nil {
		log.Fatal(err)
	}

}
