import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import Genre from "./common/genre";
import { getGenres } from "../services/fakeGenreService";
import { getGenre } from "../utils/genre";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    currentGenre: { _id: "0", name: "all" },
    genres: [],
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: "0", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
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
    this.setState({ currentGenre: genre, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const { sortColumn } = this.state;
    const nmovies = getGenre(this.state.movies, this.state.currentGenre);
    const sorted = _.orderBy(nmovies, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(
      sorted,
      this.state.currentPage,
      this.state.pageSize
    );
    return { totalCount: nmovies.length, data: movies };
  };

  render() {
    const { sortColumn } = this.state;
    if (this.state.movies.length === 0)
      return <p>There are no movies in the database</p>;

    const { totalCount, data } = this.getPagedData();

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
            <p>
              Showing {data.length} out of {totalCount} movies in the database.
            </p>
            <MoviesTable
              movies={data}
              sortColumn={sortColumn}
              onDelete={this.handleDelete}
              onLike={this.handleLike}
              onSort={this.handleSort}
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
