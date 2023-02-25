package moviedbclient

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
)

type MovieDBClient struct {
	apiKey     string
	httpClient *http.Client
	baseUrl    string
}

func New(apiKey string) *MovieDBClient {

	httpClient := &http.Client{}
	baseUrl := fmt.Sprintf("https://api.themoviedb.org/3/search/movie?api_key=%s", apiKey)

	return &MovieDBClient{apiKey: apiKey, httpClient: httpClient, baseUrl: baseUrl}
}

func (moviedbClient *MovieDBClient) GetMoviePoster(movieTitle string) (string, error) {
	type GetPosterResponse struct {
		Page    int `json:"page"`
		Results []struct {
			PosterPath string `json:"poster_path"`
		} `json:"results"`
		TotalPages int `json:"total_pages"`
	}

	req, err := http.NewRequest("GET", moviedbClient.baseUrl+"&query="+url.QueryEscape(movieTitle), nil)

	log.Println(req)

	if err != nil {
		return "", err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	resp, err := moviedbClient.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var responseObject GetPosterResponse

	json.Unmarshal(bodyBytes, &responseObject)

	if len(responseObject.Results) > 0 {
		return responseObject.Results[0].PosterPath, nil
	}

	return "", nil

}
