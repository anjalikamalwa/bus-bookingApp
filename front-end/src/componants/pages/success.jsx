import React from "react";
import { useLocation } from "react-router-dom";
import './index.css'; // Import the CSS file

const Success = () => {
  const { state } = useLocation();
  const { booking } = state || {}; // Handle case where state might be undefined

  return (
    <div className="success-container">
      <h1>Booking Successful!</h1>
      {booking ? (
        <>
          <h2>Bus: {booking.bus.bus_name}</h2>
          <h3>Seats: {booking.selectedSeats.join(", ")}</h3>
          <h3>Total Cost: ₹{booking.totalCost}</h3>
          <h3>Passenger Details:</h3>
          {booking.passengers.map((passenger, index) => (
            <div key={index} className="passenger-details">
              <p>Name: {passenger.name}</p>
              <p>Email: {passenger.email}</p>
              <p>Phone: {passenger.phone}</p>
              <p>Seat Number: {passenger.seatNumber}</p>
            </div>
          ))}
        </>
      ) : (
        <p className="no-booking">No booking information available.</p>
      )}
    </div>
  );
};

export default Success;
