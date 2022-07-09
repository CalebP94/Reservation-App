import React from "react";
import TableEntry from "./TableEntry";

export default function TablesTable({ tables }) {
    const list = tables.map((table) => <TableEntry key={table.table_id} table={table}/>);
    

  return (
    <div className="overscroll">
      <table className="table content-table">
        <thead>
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Occupied By</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
            {list}
        </tbody>
      </table>
    </div>
  );
}