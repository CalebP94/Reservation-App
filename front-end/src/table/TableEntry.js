import React from "react";
import axios from "axios";


export default function TableEntry({ table }) {
  const URL = process.env.REACT_APP_API_BASE_URL;

  const handleClick = async (event) => {
    try{
      const confirmed = window.confirm('Is this table ready to seat new guests? This cannot be undone.');
      if(confirmed){
        await axios.delete(`${URL}/tables/${table.table_id}/seat`);
        window.location.reload();
      }
    }catch(error){

    }
  }

  return (
    <tr className="tables-row">
      <th scope="row">{table.table_name}</th>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{table.status}</td>
      <td>{table.reservation_id}</td>
      <td>
      {table.status === "occupied" && (
        <button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={handleClick}>Finish</button>
      )}
      </td>
    </tr>
  );
}
