# Movies sample app

## To develop (Port 3000)

### Run DB

**Proxy to Cloud SQL**

To connect to Cloud SQL locally do:

```
$ wget https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.0.0/cloud-sql-proxy.linux.amd64 -O $HOME/go/bin/cloud-sql-proxy
$ chmod +x $HOME/go/bin/cloud-sql-proxy
$ cloud-sql-proxy movies-377518:us-central1:movies
```

Then use psql to connect on localhost (as it is proxied)

```
$ psql --user postgres -h 127.0.0.1
```

Dump the db if running for the first time

```
$ psql -h 127.0.0.1 --user postgres < db-docker/sql/create_tables.sql
```

**OR Run a local docker postgres instance**

Read `README.md` inside `db-docker`

### Run backend

Copy .env and edit variables as required

```
$ cp .env.example .env
```

Use compiledemon for fast reload

```
$ go get github.com/githubnemo/CompileDaemon
$ go install github.com/githubnemo/CompileDaemon
```

Run the backend app

```
$ CompileDaemon -build "go build -o ../build/movies" -directory "./src" --command "./build/movies"
```

### Run frontend

Install dependencies

```
$ cd $PROJECT_ROOT/frontend
$ npm install
```

Run the front end app

```
$ npm start
```

### Open Development

Open browser on port :3000

## Production Build (port 8080)

### Build fronend

```
$ cd $PROJECT_ROOT/frontend
$ npm run esbuild
```

### Build backed

```
$ cd $PROJECT_ROOT
$ go build -o build/movies src/main.go
```

### Run the app

```
$ ./build/movies
```

### Open Production Build Locally (EXEC_ENV=DEV)

Open browser on port :8080. This should run the frontend and backend.

## Deployment

Copy app.yaml and edit variables as required

```
$ cp app.yaml.example app.yaml
```

Create a project in `cloud.google.com`

There are 3 services that are required for deployment

1. Cloud SQL
2. Serverless VPC Access
3. Google App Engine

Be sure 2 and 3 belong to the same region.

### Deploy

Be sure that the production build works, then deploy:

```
$ gcloud app deploy --project movies-377518
```

### Open Production

Open the browser
