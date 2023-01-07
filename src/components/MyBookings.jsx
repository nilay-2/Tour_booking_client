import { useEffect, useState } from "react";
import { getLocaleDate } from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "./utils/util";
const MyBookings = ({ Header, Footer, Loader, NoBookings }) => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Natours | My tours";
    const myTourBookings = async () => {
      const res = await fetch(`${BACKEND_URL}/api/v1/bookings/myTourBookings`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setTours((prev) => [...prev, ...data.myBookings]);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        navigate("/login");
      }
      return;
    };
    myTourBookings();
  }, []);
  const cancelBooking = async (e, tour) => {
    e.target.textContent = "PROCESSING...";
    const res = await fetch(`${BACKEND_URL}/api/v1/bookings/cancelBooking`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tour }),
    });
    const data = await res.json();
    e.target.textContent = "cancel booking";
    if (data.status === "success") {
      toast.success(`${data.message}`, {
        autoClose: false,
      });
      setTimeout(() => {
        location.reload(true);
      }, 1400);
    } else {
      toast.error(
        "Error occurred while cancelling booking, please try again later!"
      );
    }
  };
  return (
    <div>
      <Header />
      {isLoading ? (
        <main className="main">
          <Loader />
        </main>
      ) : (
        <>
          {tours.length === 0 ? (
            <NoBookings msg="There are no bookings!" />
          ) : (
            <main className="main">
              <div className="card-container">
                {tours.map((tour, i) => {
                  return (
                    <div className="card" key={i}>
                      <div className="card__header">
                        <div className="card__picture">
                          <div className="card__picture-overlay">&nbsp;</div>
                          <img
                            // src="img/tour-1-cover.jpg"
                            src={`${BACKEND_URL}/img/tours/${tour.tour.imageCover}`}
                            alt="Tour 1"
                            className="card__picture-img"
                          />
                        </div>

                        <h3 className="heading-tertirary">
                          <span>{tour.tour.name}</span>
                        </h3>
                      </div>

                      <div className="card__details">
                        <h4 className="card__sub-heading">
                          {tour.tour.difficulty} {tour.tour.duration}-day tour
                        </h4>
                        <p className="card__text">{tour.tour.summary}</p>
                        <div className="card__data">
                          <svg className="card__icon">
                            <use href="/img/icons.svg#icon-map-pin"></use>
                          </svg>
                          <span>{tour.tour.startLocation?.description}</span>
                        </div>
                        <div className="card__data">
                          <svg className="card__icon">
                            <use href="/img/icons.svg#icon-calendar"></use>
                          </svg>
                          <span>
                            {getLocaleDate(tour.date, {
                              month: "long",
                              year: "numeric",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="card__data">
                          <svg className="card__icon">
                            <use href="/img/icons.svg#icon-flag"></use>
                          </svg>
                          <span>{tour.tour.locations.length} stops</span>
                        </div>
                        <div className="card__data">
                          <svg className="card__icon">
                            <use href="/img/icons.svg#icon-user"></use>
                          </svg>
                          <span>{tour.tour.maxGroupSize} people</span>
                        </div>
                      </div>

                      <div className="card__footer">
                        <p>
                          <span className="card__footer-value">
                            &#x20B9; {tour.tour.price}
                          </span>
                          <span className="card__footer-text">per person</span>
                        </p>
                        <p className="card__ratings">
                          <span className="card__footer-value">
                            {tour.ratingsAverage}
                          </span>
                          <span className="card__footer-text">
                            rating ({tour.tour.ratingsQuantity})
                          </span>
                        </p>
                        <a
                          href={`/tours/${tour.tour.slug}`}
                          className="btn btn--green btn--small"
                        >
                          Details
                        </a>
                      </div>
                      <div className="card__footer--cancelBtn">
                        <button
                          className="btn__cancel--booking"
                          onClick={(e) => {
                            cancelBooking(e, tour.tour.id);
                          }}
                        >
                          cancel booking
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default MyBookings;
