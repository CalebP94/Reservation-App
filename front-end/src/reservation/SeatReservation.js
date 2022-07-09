import { React, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import axios from "axios";
import TableOptions from "../table/TableOptions";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
    const URL = process.env.REACT_APP_API_BASE_URL
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const {reservation_id} = useParams();
    const history = useHistory();


    useEffect(() => {
      const abortController = new AbortController();
      setTablesError(null);
      async function listTables() {
      
      try{
        const response = await axios.get(URL + "/tables", {signal: abortController.signal});
        setTables(response.data.data)
        setSelectedTable(response.data.data[0].table_id)
      }catch(error){
        setTablesError(error);
      }
    }
    listTables();
    return () => abortController.abort();
  }, [URL]);

  const handleChange = ({target}) => {
    setSelectedTable(Number(target.value))
  }

  const submitHandler = async (event) =>{
    event.preventDefault();
    try{
        await axios.put(`${URL}/tables/${selectedTable}/seat`, {data: {reservation_id:Number(reservation_id)}})
        .then(() => {
          axios.put(URL + `/reservations/${reservation_id}/status`, {data: {status: "seated"}});
        })
        
        history.push("/dashboard")
  
    }catch(error){
        setTablesError(error.response.data.error);
    }
  }

  const options = tables.map((table) => (
    <TableOptions table={table} key={table.table_id} />
  ));
  

  return (
    <div>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={tablesError}/>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="table_id">Select a table:</label>
          <select
            name="table_id"
            className="form-select"
            aria-label="Click to expand options"
            onChange={handleChange}
            // value={selectedTable}
          >
            <option disabled={true}>Click to expand</option>
            {options}
          </select>
        </div>

        <button type="cancel" className="btn btn-danger" onClick={() => history.push("/")}>
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
