import React, {  useState } from "react";
import moment from "moment";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [journey_date, setJourneyDate] = useState("");
  const [busesdata, setBusesData] = useState([]);
  const [errors, setErrors] = useState({});

  const [showForm, setShowform] = useState(true);

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};
    if (!source.trim()) {
      newErrors.source = "Departure city is required";
    }
    if (!destination.trim()) {
      newErrors.destination = "Arrival city is required";
    }
    if (!journey_date) {
      newErrors.journey_date = "Journey date is required";
    }
    return newErrors;
  };
  const searchBuses = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/bus/search?departureCity=${source}&arrivalCity=${destination}&date=${journey_date}`
      );
      if (!response.ok) {
        throw new Error("Failed to search buses");
      }
      const result = await response.json();
      console.log(result);
      setBusesData(result);
      setShowform(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      searchBuses();
    }
  };



  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); 
  };
  const handleBook = (id) => {
    navigate(`/bus-book/${id}`);
  };

  return (
    <>
      <div className="container">
        {showForm && (
          <form className="search-bus" onSubmit={handleSearch}>
            <h1>Find your bus</h1>
            <input
              type="text"
              name="source"
              placeholder="departure city"
              value={source}
              onChange={handleInputChange(setSource, "source")}
            />
            {errors.source && <p className="error">{errors.source}</p>}
            <input
              type="text"
              name="destination"
              placeholder="arrival city"
              value={destination}
              onChange={handleInputChange(setDestination, "destination")}
            />
            {errors.destination && (
              <p className="error">{errors.destination}</p>
            )}

            <input
              type="date"
              name="journey_date"
              placeholder="journey date"
              format="yyyy-mm-dd"
              value={journey_date}
              onChange={handleInputChange(setJourneyDate, "journey_date")}

            />
            {errors.journey_date && (
              <p className="error">{errors.journey_date}</p>
            )}

            <div className="btn">
              <button type="submit">Search</button>
            </div>
          </form>
        )}

        <div className="bus_data">
          {busesdata.map((data, index) => {
            return (
              <div key={index} className="bus-container">
                <div className="bus-details">
                  <div className="bus-image">
                    <img src={`${apiUrl}/assets/${data.bus_image}`} />
                  </div>
                  <div className="details">
                    <h1>{data.bus_name}</h1>
                    <p>
                      {data.source} to {data.destination}
                    </p>
                    <p>
                      Departure: {moment(data.departure_time).format("h:mm A")}
                    </p>
                    <p>Arrival: {moment(data.arrival_time).format("h:mm A")}</p>
                    <span>${data.fare}</span>
                  </div>
                  <div className="btn">
                    <button onClick={() => handleBook(data._id)}>
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
