import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";
export default function ReservationEntry({ reservation }) {
const URL = process.env.REACT_APP_API_BASE_URL;
const history = useHistory();

  const handleClick = async() => {
    try{
      const resp = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
      if(resp){
        await axios.put(`${URL}/reservations/${reservation.reservation_id}/status`, {data: {status: "cancelled"}});
        history.go(0);
      }
    }
    catch(error){
      // No display required
    }
    
  }

  return (
    <tr>
      <th scope="row">{reservation.first_name}</th>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
      <td nowrap={"true"}>
      {reservation.status === "booked" &&(
        <>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="btn btn-success">Seat</button>
          </Link>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button className="btn btn-primary">Edit</button>
          </Link>
          <button data-reservation-id-cancel={reservation.reservation_id} className="btn btn-danger" onClick={handleClick}>Cancel</button>
        </>
      )}
      </td>
    </tr>
  );
}
