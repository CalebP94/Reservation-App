import React from "react";
import { useState} from "react";
import { useHistory } from "react-router";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm({ populate, modifying = false }) {
  const URL = process.env.REACT_APP_API_BASE_URL + "/reservations";
  const history = useHistory();
  
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [errors, setErrors] = useState(null);

  
  const [formData, setFormData] = useState(populate || initialFormState);
 
  const handleChange = ({ target }) => {
    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: parseInt(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      setErrors(null)
      if(modifying){
        await axios.put(`${URL}/${populate.reservation_id}`, {data: formData});
      }else{
        await axios.post(URL, {data: formData});
      }
      history.push(`/dashboard?date=${formData.reservation_date}`)
    }catch(e){
      setErrors(e.response.data.error)
    }
    
  };

  return (
    <div>
      <ErrorAlert error={errors}/>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            name="first_name"
            type="text"
            className="form-control"
            id="first_name"
            aria-describedby="emailHelp"
            placeholder="Joe"
            required={true}
            onChange={handleChange}
            value={formData.first_name}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            name="last_name"
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Shmoe"
            required={true}
            onChange={handleChange}
            value={formData.last_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            name="mobile_number"
            type="tel"
            className="form-control"
            id="mobile_number"
            required={true}
            onChange={handleChange}
            value={formData.mobile_number}
          />
          <small>format: 9991234567 </small>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation</label>
          <input
            name="reservation_date"
            type="date"
            className="form-control"
            id="reservation_date"
            placeholder="Shmoe"
            required={true}
            onChange={handleChange}
            value={formData.reservation_date}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation</label>
          <input
            name="reservation_time"
            type="time"
            className="form-control"
            id="reservation_time"
            required={true}
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Guests</label>
          <input
            name="people"
            type="number"
            className="form-control"
            id="people"
            placeholder="6"
            min="1"
            max="50"
            required={true}
            onChange={handleChange}
            value={formData.people}
          />
        </div>
        <button
          type="cancel"
          className="btn btn-danger"
          onClick={() => history.push("/")}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
