import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import axios from "axios";
import { useParams} from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

export default function EditReservation(){
    const URL = process.env.REACT_APP_API_BASE_URL;
    const {reservation_id} = useParams();
    const [reservation, setReservation] = useState(null);
    const [reservationError, setReservationError] = useState(null)

    useEffect(() => {
        const abortController = new AbortController();
        axios.get(`${URL}/reservations/${reservation_id}`, {signal: abortController.signal})
            .then(({data: {data}}) => {
                setReservation({
                    ...data,
                    reservation_date: formatAsDate(data.reservation_date)
                });
            })
            .catch(setReservationError);
        return () => abortController.abort();
    },[URL, reservation_id])

    
    return(
        <div>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={reservationError}/>
            {reservation &&(
                <ReservationForm populate={reservation} modifying={true}/>
            )}
        </div>
    )
}
