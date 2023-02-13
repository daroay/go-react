package main

import (
	"backend/src/controller"
	"backend/src/db"
	"fmt"
	"log"
	"net/http"
	"os"

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

	// start a web server with given routes
	port := os.Getenv("SERVICE_PORT")
	log.Println("Starting application on port", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), controller.GetRoutesHandler(dbrepo))

	if err != nil {
		log.Fatal(err)
	}

}
