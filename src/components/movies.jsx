import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import { toast } from "react-toastify";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import Genre from "./common/genre";
import { getGenres } from "../services/genreService";
import { getGenre } from "../utils/genre";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./common/searchbox";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    currentGenre: { _id: "0", name: "all" },
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "0", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already benn deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenres = (genre) => {
    this.setState({ currentGenre: genre, currentPage: 1, searchQuery: "" });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentGenre: { _id: "0", name: "all" },
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const { sortColumn } = this.state;
    let filtered = this.state.movies;
    if (this.state.searchQuery) {
      filtered = this.state.movies.filter((m) =>
        m.title.toLowerCase().startsWith(this.state.searchQuery.toLowerCase())
      );
    } else {
      filtered = getGenre(this.state.movies, this.state.currentGenre);
    }
    filtered = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(
      filtered,
      this.state.currentPage,
      this.state.pageSize
    );
    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { sortColumn } = this.state;
    if (this.state.movies.length === 0)
      return <p>There are no movies in the database</p>;

    const { totalCount, data } = this.getPagedData();
    const { user } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-3">
            <Genre
              genres={this.state.genres}
              selectedGenre={this.state.currentGenre}
              onGenreChange={this.handleGenres}
            />
          </div>
          <div className="col">
            {user && (
              <Link
                to="/movies/new"
                className="btn btn-primary"
                style={{ marginBottom: 15 }}
              >
                New Movie
              </Link>
            )}
            <p style={{ marginBottom: 10 }}>
              Showing {data.length} out of {totalCount} movies in the database.
            </p>
            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
            <MoviesTable
              movies={data}
              sortColumn={sortColumn}
              onDelete={this.handleDelete}
              onLike={this.handleLike}
              onSort={this.handleSort}
              user={user}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={this.state.pageSize}
              currentPage={this.state.currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
