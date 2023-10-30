import React, { Component } from "react";

class Like extends Component {
  render() {
    return (
      <i
        className={this.props.liked === true ? "fa fa-heart" : "fa fa-heart-o"}
        aria-hidden="true"
        onClick={this.props.onClick}
        style={{ cursor: "pointer" }}
      ></i>
    );
  }
}

export default Like;
