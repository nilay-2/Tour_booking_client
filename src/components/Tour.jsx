import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLocaleDate } from "./utils/util";
import { BACKEND_URL, setUserImage } from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Tour = ({ Header, Footer, Loader, Map, Error }) => {
  const { slug } = useParams();
  const [tour, setTour] = useState();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [imageURL, setImageURL] = useState("");
  useEffect(() => {
    setUserImage(setImageURL);
    if (localStorage.getItem("userData")) {
      setUser(JSON.parse(localStorage.getItem("userData")));
    }
    const fetchData = async () => {
      const res = await fetch(`${BACKEND_URL}/api/v1/tours/${slug}`, {
        method: "get",
        // credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      if (data.status === "success") {
        setTour(data.tour);
        setIsLoading(false);
        document.title = `Natours | ${data.tour.name} tour`;
      } else {
        setIsLoading(true);
      }
    };
    fetchData();
  }, []);

  const makeCheckout = async (tourId, slotId, e) => {
    e.target.textContent = "PROCESSING...";
    const res = await fetch(
      `${BACKEND_URL}/api/v1/bookings/checkout-session/${tourId}/slot/${slotId}`,
      {
        method: "get",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    const d = await res.json();
    if (d.status !== "success") {
      toast.error(`${d.message}`);
      return;
    }
    // console.log(d.session.url);
    location.assign(d.session.url);
  };

  // if (err.status) {
  //   return <Error Header={Header} Footer={Footer} msg={err.msg} />;
  // } else
  return (
    <div>
      <Header />
      {isLoading ? (
        <main className="main">
          <Loader />
        </main>
      ) : (
        <>
          <section className="section-header">
            <div className="header__hero">
              <div className="header__hero-overlay">&nbsp;</div>
              <img
                src={`${BACKEND_URL}/img/tours/${tour.imageCover}`}
                alt={`${tour.name}`}
                className="header__hero-img"
              />
              <div className="heading-box">
                <h1 className="heading-primary">
                  <span>{tour.name}</span>
                </h1>
                <div className="heading-box__group">
                  <div className="heading-box__detail">
                    <svg className="heading-box__icon">
                      <use href="/img/icons.svg#icon-clock"></use>
                    </svg>
                    <span className="heading-box__text">
                      {tour.duration} days
                    </span>
                  </div>
                  <div className="heading-box__detail">
                    <svg className="heading-box__icon">
                      <use href="/img/icons.svg#icon-map-pin"></use>
                    </svg>
                    <span className="heading-box__text">
                      {tour.startLocation.description}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-description">
            <div style={{ display: "flex" }}>
              <div className="overview-box" style={{ width: "50%" }}>
                <div>
                  <div className="overview-box__group">
                    <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-calendar"></use>
                      </svg>
                      <span className="overview-box__label">Next date</span>
                      <span className="overview-box__text">
                        {getLocaleDate(tour.startDates[0].date, {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-trending-up"></use>
                      </svg>
                      <span className="overview-box__label">Difficulty</span>
                      <span className="overview-box__text">
                        {tour.difficulty}
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-user"></use>
                      </svg>
                      <span className="overview-box__label">Participants</span>
                      <span className="overview-box__text">
                        {tour.maxGroupSize} people
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-star"></use>
                      </svg>
                      <span className="overview-box__label">Rating</span>
                      <span className="overview-box__text">
                        {tour.ratingsAverage} / 5
                      </span>
                    </div>
                  </div>

                  <div className="overview-box__group">
                    <h2 className="heading-secondary ma-bt-lg">
                      Your tour guides
                    </h2>

                    {tour.guides.map((guide, i) => {
                      return (
                        <div className="overview-box__detail" key={i}>
                          <img
                            src={`${BACKEND_URL}/img/users/${guide.photo}`}
                            alt="Lead guide"
                            className="overview-box__img"
                          />
                          <span className="overview-box__label">
                            {guide.role}
                          </span>
                          <span className="overview-box__text">
                            {guide.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="description-box" style={{ width: "50%" }}>
                <h2 className="heading-secondary ma-bt-lg">
                  About {tour.name} tour
                </h2>
                <p className="description__text">{tour.description}</p>
              </div>
            </div>
            <div className="available--dates-section" id="availableDates">
              <div className="avail--dates--title">
                <h1
                  className="heading-secondary"
                  style={{
                    fontSize: "xx-large",
                    fontWeight: "bold",
                    paddingLeft: "15px",
                  }}
                >
                  Avaliable Dates
                </h1>
              </div>
              <div className="avail--dates--container">
                {tour.startDates.map((slot, i) => {
                  return (
                    <div className="date--card" key={i}>
                      <div className="date--description">
                        <div className="date-detail">
                          <svg className="overview-box__icon">
                            <use href="/img/icons.svg#icon-calendar"></use>
                          </svg>
                          <span className="date">
                            {getLocaleDate(slot.date, {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="participants">
                          {slot.participants} / {tour.maxGroupSize} Already
                          booked
                        </div>
                      </div>
                      <div>
                        {slot.soldOut ? (
                          <button disabled className="btn--soldOut">
                            SOLD OUT
                          </button>
                        ) : (
                          <button
                            className="btn booking-btn"
                            onClick={(e) => {
                              makeCheckout(tour.id, slot._id, e);
                            }}
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="section-pictures">
            {tour.images.map((img, i) => {
              return (
                <div className="picture-box" key={i}>
                  <img
                    className={`picture-box__img picture-box__img--${i + 1}`}
                    src={`${BACKEND_URL}/img/tours/${img}`}
                    alt="The Park Camper Tour 1"
                  />
                </div>
              );
            })}
          </section>
          <section className="section-map">
            <div id="map">
              <Map tour={tour} />
            </div>
          </section>
          <section className="section-reviews">
            <div className="reviews">
              {tour.reviews.map((review, i) => {
                return (
                  <div className="reviews__card" key={i}>
                    <div className="reviews__avatar">
                      <img
                        src={`${BACKEND_URL}/img/users/${review.user.photo}`}
                        alt="Jim Brown"
                        className="reviews__avatar-img"
                      />
                      <h6 className="reviews__user">{review.user.name}</h6>
                    </div>
                    <p className="reviews__text">{review.review}</p>
                    <div className="reviews__rating">
                      {[1, 2, 3, 4, 5].map((star, i) => {
                        return (
                          <svg
                            className={`reviews__star reviews__star--${
                              review.rating >= star ? "active" : "inactive"
                            }`}
                            key={i}
                          >
                            <use href="/img/icons.svg#icon-star"></use>
                          </svg>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="section-cta">
            <div className="cta">
              <div className="cta__img cta__img--logo">
                <img
                  src="/img/logo-white.png"
                  alt="Natours logo"
                  className=""
                />
              </div>
              <img
                src={`${BACKEND_URL}/img/tours/${tour.images[1]}`}
                alt=""
                className="cta__img cta__img--1"
              />
              <img
                src={`${BACKEND_URL}/img/tours/${tour.images[2]}`}
                alt=""
                className="cta__img cta__img--2"
              />

              <div className="cta__content">
                <h2 className="heading-secondary">What are you waiting for?</h2>
                <p className="cta__text">
                  {tour.duration} days. 1 adventure. Infinite memories. Make it
                  yours today!
                </p>
                {user ? (
                  <a
                    className="btn btn--green span-all-rows"
                    id="book-tour"
                    href="#availableDates"
                  >
                    Book tour now!
                  </a>
                ) : (
                  <a href="/login" className="btn btn--green span-all-rows">
                    Log in to book tour!
                  </a>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Tour;
