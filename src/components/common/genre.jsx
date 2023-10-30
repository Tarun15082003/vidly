import React, { Component } from "react";

class Genre extends Component {
  render() {
    const genres = this.props.genres;
    const seletedGenre = this.props.selectedGenre;
    return (
      <ul className="list-group">
        {genres.map((g) => (
          <li
            className={
              g._id === seletedGenre._id
                ? "list-group-item active"
                : "list-group-item"
            }
            key={g._id}
            style={{ cursor: "pointer" }}
            onClick={() => this.props.onGenreChange(g)}
          >
            {g.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default Genre;
