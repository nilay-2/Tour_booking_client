import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocaleDate } from "./utils/util";
import { BACKEND_URL } from "./utils/util";
const Overview = ({ Loader }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Natours app | All tours";
    const fetchData = async () => {
      const res = await fetch(`${BACKEND_URL}/api/v1/tours`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const tours = await res.json();
      console.log(tours);
      setData(tours?.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      {/*<Header />*/}
      <main className="main">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="card-container">
            {data.map((tour, i) => {
              return (
                <div className="card" key={i}>
                  <div className="card__header">
                    <div className="card__picture">
                      <div className="card__picture-overlay">&nbsp;</div>
                      <img
                        // src="img/tour-1-cover.jpg"
                        src={`${BACKEND_URL}/img/tours/${tour.imageCover}`}
                        alt="Tour 1"
                        className="card__picture-img"
                      />
                    </div>

                    <h3 className="heading-tertirary">
                      <span>{tour.name}</span>
                    </h3>
                  </div>

                  <div className="card__details">
                    <h4 className="card__sub-heading">
                      {tour.difficulty} {tour.duration}-day tour
                    </h4>
                    <p className="card__text">{tour.summary}</p>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use href="/img/icons.svg#icon-map-pin"></use>
                      </svg>
                      <span>{tour.startLocation.description}</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use href="/img/icons.svg#icon-calendar"></use>
                      </svg>
                      <span>
                        {getLocaleDate(tour.startDates[0].date, {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use href="/img/icons.svg#icon-flag"></use>
                      </svg>
                      <span>{tour.locations.length} stops</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use href="/img/icons.svg#icon-user"></use>
                      </svg>
                      <span>{tour.maxGroupSize} people</span>
                    </div>
                  </div>

                  <div className="card__footer">
                    <p>
                      <span className="card__footer-value">
                        &#x20B9; {tour.price}
                      </span>
                      <span className="card__footer-text">per person</span>
                    </p>
                    <p className="card__ratings">
                      <span className="card__footer-value">
                        {tour.ratingsAverage}
                      </span>
                      <span className="card__footer-text">
                        rating ({tour.ratingsQuantity})
                      </span>
                    </p>

                    <Link
                      to={`/tours/${tour.slug}`}
                      className="btn btn--green btn--small"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {/*<Footer />*/}
    </div>
  );
};

export default Overview;
