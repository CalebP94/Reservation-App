import axios from "axios";
import React, { useState } from "react";
import ErrorAlert from '../layout/ErrorAlert';
import ReservationTable from "./ReservationTable";

export default function SearchReservation(){
    const URL = process.env.REACT_APP_API_BASE_URL
    const [reservations, setReservations] = useState([])
    const [reservationsErrors, setReservationsErrors] = useState(null);
    const [mobileNumber, setMobileNumber] = useState("");

    const handleChange = ({ target }) => {

          setMobileNumber(
             target.value,
          );
        };

    const handleSubmit = async (event) => {
      const abortController = new AbortController();
        try{
            event.preventDefault();
            const response = await axios.get(URL + `/reservations?mobile_number=${mobileNumber}`, {signal: abortController.signal});
            setReservations(response.data.data);
        }catch(error){
            setReservationsErrors(null);
        }
        return () => abortController.abort();
    }


    return (
        <div>
            <h1>Search Reservations</h1>
            <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Enter a customer's phone number</label>
          <input
            name="mobile_number"
            type="text"
            className="form-control"
            id="mobile_number"
            aria-describedby="mobile_number"
            placeholder="example: 123-876-5309"
            required={true}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      <div>
        <ErrorAlert error={reservationsErrors}/>
          <ReservationTable reservations={reservations}/>
      </div>
        </div>
    )
}