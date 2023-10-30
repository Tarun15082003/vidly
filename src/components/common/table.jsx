import React, { Component } from "react";
import TableHeader from "./tableheader";
import TableBody from "./tablebody";

class Table extends Component {
  render() {
    const { data, sortColumn, onSort, columns } = this.props;
    return (
      <table className="table">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody data={data} columns={columns} />
      </table>
    );
  }
}

export default Table;
