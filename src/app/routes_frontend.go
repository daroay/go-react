package app

import (
	"log"
	"net/http"
	"net/url"
	"regexp"
)

func matches(s []*regexp.Regexp, e string) bool {
	for _, a := range s {
		if a.MatchString(e) {
			return true
		}
	}
	return false
}

func compileFrontEndRoutes() []*regexp.Regexp {
	var stringFrontEndRoutes = []string{
		"^/movies/?$",
		"^/movies/\\d+/?$",
		"^/genres/?$",
		"^/admin/movies/\\d+/edit/?$",
		"^/admin/manage-catalogue/?$",
		"^/graphql/?$",
		"^/login/?$",
	}
	var regexFrontEndRoutes = []*regexp.Regexp{}
	for _, a := range stringFrontEndRoutes {
		if r, err := regexp.Compile(a); err == nil {
			regexFrontEndRoutes = append(regexFrontEndRoutes, r)
		} else {
			log.Fatal("Error parsing regex", a, err)
		}
	}
	return regexFrontEndRoutes
}

var frontEndRoutes = compileFrontEndRoutes()

func (app *App) serveFrontEndRoutes(h http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if matches(frontEndRoutes, r.URL.Path) {
			p := ""
			rp := ""
			r2 := new(http.Request)
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = p
			r2.URL.RawPath = rp
			h.ServeHTTP(w, r2)
		} else {
			h.ServeHTTP(w, r)
		}
	})
}
