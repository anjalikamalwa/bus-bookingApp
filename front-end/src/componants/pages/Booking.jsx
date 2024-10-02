import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import "./index.css";

const Booking = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBusDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/bus/${id}`);
      if (!response.ok) throw new Error("Failed to fetch bus details");
      const result = await response.json();
      setBus(result);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        alert("You can only select a maximum of 10 seats.");
      }
    }
  };

  const calculateTotalCost = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + bus.seatPrices[seat - 1];
    }, 0);
  };


  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        bus: { ...bus, id }, 
        selectedSeats,
        totalCost: calculateTotalCost(),
      },
    });
  };
  return (
    <div className="bus-details">
      {bus && (
        <div className="book-bus">
          <h1>{bus.bus_name}</h1>
          <img src={`${apiUrl}/assets/${bus.bus_image}`} alt={bus.bus_name} />
          <p>
            {bus.source} to {bus.destination}
          </p>
          <p>Departure: {moment(bus.departure_time).format("h:mm A")}</p>
          <p>Arrival: {moment(bus.arrival_time).format("h:mm A")}</p>
          <p>Fare: ${bus.fare}</p>
          <div className="seat-selection">
            <h3>Select Seats:</h3>
            <div className="seats-grid">
              {Array.from({ length: bus.seat_capacity }, (_, index) => (
                <button
                  key={index}
                  className={`seat ${
                    selectedSeats.includes(index + 1) ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <p>Selected Seats: {selectedSeats.join(", ")}</p>
            <p>Total Cost: ${calculateTotalCost()}</p>
            <div className="btn">
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
