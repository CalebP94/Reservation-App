import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../reservation/ReservationTable";
import useQuery from "../utils/useQuery";
import { next, previous, today } from "../utils/date-time";
import { useHistory } from "react-router";
import axios from "axios";
import TablesTable from "../table/TablesTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const history = useHistory();
  const URL = process.env.REACT_APP_API_BASE_URL;

  const query = useQuery();
  const searchDate = query.get("date");
  date = searchDate ? searchDate : date;
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);
  
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((reservations) => {
        setReservations(reservations);
      })
      .catch((error) => setReservationsError(error.response.data.error));
    return () => abortController.abort();
  }

  useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);
    function listTables() {
      
      axios
        .get(URL + "/tables", abortController.signal)
        .then((response) => {
          setTables(response.data.data);
        })
        .catch(setTablesError);
        
      }
      listTables();
      return () => abortController.abort();
  }, [URL]);

  const handleForward = () => {
    history.push(`/dashboard?date=${next(date)}`);
  };
  const handleBackwards = () => {
    history.push(`/dashboard?date=${previous(date)}`);
  };
  const handleToday = () => {
    history.push(`/dashboard?date=${today(date)}`);
  };

  return (
    <main>
      
      <div className="d-md-flex mb-3">
        <ErrorAlert error={reservationsError} />
        <div className="testing center">
          <h1>Dashboard</h1>
          <h1 className="mb-2">Reservations</h1>
          <button className="btn btn-info" onClick={handleBackwards}>PreviousDate</button>
          <button className="btn btn-info" onClick={handleToday}>Today</button>
          <button className="btn btn-info" onClick={handleForward}>NextDate</button>
          <ReservationTable reservations={reservations} />
          <h2>Tables</h2>
          <ErrorAlert error={tablesError}/>
          <TablesTable tables={tables}/>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
