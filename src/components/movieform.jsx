import React from "react";
import Form from "./common/form";
import { getGenres } from "../services/genreService";
import Joi from "joi-browser";
import { getMovie, saveMovie } from "../services/movieService";

class MovieForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    errors: {},
    isOpen: false,
    genres: [],
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .greater(0)
      .less(101)
      .required()
      .label("Stock"),
    dailyRentalRate: Joi.number().greater(0).less(11).required().label("Rate"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    const moiveId = this.props.match.params.id;
    if (moiveId === "new") return;

    try {
      const { data: movie } = await getMovie(this.props.match.params.id);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  doSubmit = async () => {
    await saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        {this.renderInput("title", "Title")}
        {this.renderSelect("genreId", "Genre", this.state.genres)}
        {this.renderInput("numberInStock", "Stock")}
        {this.renderInput("dailyRentalRate", "Rate")}
        <button
          className="btn btn-primary"
          onClick={() => this.doSubmit()}
          disabled={this.validate()}
        >
          Save
        </button>
      </div>
    );
  }
}

export default MovieForm;
