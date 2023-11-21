import React, { Component } from "react";

class SearchBox extends Component {
  render() {
    return (
      <input
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Seacrh..."
        value={this.props.value}
        onChange={(e) => this.props.onChange(e.currentTarget.value)}
      />
    );
  }
}

export default SearchBox;
