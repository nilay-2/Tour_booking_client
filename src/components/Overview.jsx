import { useEffect, useState } from "react";
import { getLocaleDate } from "./utils/util";
const Overview = ({ Header, Footer, Loader }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Natours app | All tours";
    const fetchData = async () => {
      const res = await fetch(
        "https://tour-booking-server.vercel.app/api/v1/tours",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tours = await res.json();
      setData(tours.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  if (!isLoading) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="card-container">
            {data.map((tour, i) => {
              return (
                <div className="card" key={i}>
                  <div className="card__header">
                    <div className="card__picture">
                      <div className="card__picture-overlay">&nbsp;</div>
                      <img
                        // src="img/tour-1-cover.jpg"
                        src={`http://127.0.0.1:3000/img/tours/${tour.imageCover}`}
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

                    <a
                      href={`/tours/${tour.slug}`}
                      className="btn btn--green btn--small"
                    >
                      Details
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        <Footer />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Overview;
