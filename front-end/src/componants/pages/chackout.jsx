import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import './index.css';

const Checkout = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const { state } = useLocation();
  const { bus, selectedSeats, totalCost } = state;
  const navigate = useNavigate();

  // Initialize passenger state for each seat selected
  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({ name: "", email: "", phone: "", seatNumber: seat }))
  );

  // Handle input changes for each passenger
  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const newPassengers = [...passengers];
    newPassengers[index][name] = value;
    setPassengers(newPassengers);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch(`${apiUrl}/api/booking`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busId: bus.id, 
          totalCost,
          passengerDetails: passengers, // send passenger details with seat numbers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }

      const data = await response.json();
      console.log('Booking confirmed:', data);
      navigate('/success', { state: { booking: { bus, selectedSeats, totalCost, passengers } } });

    } catch (error) {
      console.error('Error:', error);
      alert('Booking failed: ' + error.message);
    }
  };

  return (
    <div className="checkout-summary">
      <h1>Checkout Summary</h1>
      <div className="bus-summary">
        <h2>{bus.bus_name}</h2>
        <p>
          {bus.source} to {bus.destination}
        </p>
        <p>Departure: {moment(bus.departure_time).format("h:mm A")}</p>
        <p>Arrival: {moment(bus.arrival_time).format("h:mm A")}</p>
        <p>Fare per seat: ₹{bus.fare}</p>
        <p>Selected Seats: {selectedSeats.join(", ")}</p>
        <p>Total Cost: ₹{totalCost}</p>
      </div>
      <div className="user-details">
        <h3>Enter Passenger Details:</h3>
        <form onSubmit={handleSubmit}>
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-details">
              <h4>Passenger {index + 1} (Seat {passenger.seatNumber})</h4>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, e)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, e)}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, e)}
                  required
                />
              </label>
            </div>
          ))}
          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
