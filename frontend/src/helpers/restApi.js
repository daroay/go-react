class RestAPI {

  constructor(axios) {
    this.axios = axios
    this.admin = new AdminAPI(axios)
  }

  async fetchMovie(id) {
    const res = await this.axios.get(`/api/movies/${id}`)
    return res.data
  }

  async fetchMovies() {
    const res = await this.axios.get(`/api/movies`)
    return res.data
  }

  async fetchMoviesByGenreId(genreId) {
    const res = await this.axios.get(`/api/movies/genres/${genreId}`)
    return res.data
  }

  async fetchGenres()  {
    const res = await this.axios.get(`/api/genres`)
    return res.data
  }

  async fetchGenre(id)  {
    const res = await this.axios.get(`/api/genres/${id}`)
    return res.data
  }


}

class AdminAPI {

  constructor(axios) {
    this.axios = axios
  }

  async fetchGenres()  {
    const res = await this.axios.get(`/api/admin/genres`)
    return res.data
  }

  async fetchMovie(id) {
    const res = await this.axios.get(`/api/admin/movies/${id}`)
    return res.data
  }

  async fetchMovies(id) {
    const res = await this.axios.get(`/api/admin/movies`)
    return res.data
  }

  async deleteMovie(id) {
    const res = await this.axios.delete(`/api/admin/movies/${id}`)
    return res.data
  }

  async fetctchMoviesWithGenre(genreId) {
    const res = await this.axios.get(`/api/admin/genres/${genreId}`)
    return res.data
  }

  async saveMovie(id, movie) {
    console.log(movie)
    let res = null;
    if (id === 0) {
      res = await this.axios.put("/api/admin/movies/0", movie)
    } else {
      res = await this.axios.patch(`/api/admin/movies/${id}`, movie)
    }
    return res.data
  }
}

export default RestAPI