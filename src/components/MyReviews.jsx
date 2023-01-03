import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFormInput, clearInput, BACKEND_URL } from "./utils/util";
import EditReviewModal from "./Modal/EditReviewModal";
import DeleteReviewModal from "./Modal/DeleteReviewModal";
const MyReviews = ({ Header, Footer, Loader }) => {
  const [user, setUser] = useState();
  const [tourData, setTourData] = useState();
  // review state
  const [reviewInfo, setReviewInfo] = useState({ review: "", rating: "" });
  // loader state
  const [isLoading, setIsLoading] = useState(true);
  // review edit -- modal state
  const [isOpen, setIsOpen] = useState(false);
  // review delete -- modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tourId, setTourId] = useState();
  useEffect(() => {
    document.title = "Natours | My reviews";
    if (localStorage.getItem("userData")) {
      setUser(JSON.parse(localStorage.getItem("userData")));
      setIsLoading(false);
    }
    const fetchTourData = async () => {
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
        setTourData(data.myBookings);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      return;
    };
    fetchTourData();
  }, []);
  const giveReview = async (e, tourId) => {
    if (!reviewInfo.review || !reviewInfo.rating) {
      toast.error("All fields are required!");
      return;
    }
    e.target.textContent = "PROCESSING...";
    const myPromise = new Promise(async function (resolve, reject) {
      const res = await fetch(`${BACKEND_URL}/api/v1/tours/${tourId}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewInfo),
      });
      const data = await res.json();
      if (data.status === "success") {
        resolve("Success");
        e.target.textContent = "SAVE";
      } else {
        reject("Error");
      }
    });
    toast.promise(
      myPromise,
      {
        pending: "Processing",
        success: "Review created successfully",
        error: "Error occured while creating review, Please try again later!",
      },
      {
        autoClose: false,
      }
    );
    setTimeout(() => {
      location.reload(true);
    }, 1400);
  };
  // review edit -- modal functions
  const openModal = (tourId, tourReview, tourRating) => {
    setTourId(tourId);
    setReviewInfo((prev) => ({
      ...prev,
      review: tourReview,
      rating: tourRating,
    }));
    setIsOpen(true);
  };

  const closeModal = (val) => {
    clearInput(reviewInfo, setReviewInfo);
    setTourId("");
    setIsOpen(val);
  };
  // review delete -- modal functions
  const openDeleteReviewModal = (tourId) => {
    setTourId(tourId);
    setDeleteOpen(true);
  };

  const closeDeleteReviewModal = (val) => {
    setDeleteOpen(val);
    setTourId("");
  };
  if (!isLoading) {
    return (
      <>
        <EditReviewModal
          reviewInfo={reviewInfo}
          isOpen={isOpen}
          closeModal={closeModal}
          tourId={tourId}
        />
        <DeleteReviewModal
          deleteOpen={deleteOpen}
          closeDeleteReviewModal={closeDeleteReviewModal}
          tourId={tourId}
        />
        <Header />
        <main className="main" style={{ height: "auto" }}>
          {tourData?.map((tour, i) => {
            return (
              <div className="review-container" key={i}>
                <div className="left-section">
                  <div className="tour-detail">
                    <div className="card--review"></div>
                    <img
                      src={`${BACKEND_URL}/img/tours/${tour.tour.imageCover}`}
                      alt=""
                    />
                    <span>{tour.tour.name}</span>
                  </div>
                </div>
                <div className="right-section">
                  <div className="profile-detail">
                    <div className="profile-image">
                      <img
                        src={`${BACKEND_URL}/img/users/${user.photo}`}
                        alt=""
                      />
                    </div>
                    <div className="name">{user.name}</div>
                    <div className="stars">
                      {" "}
                      Rating
                      {tour.review !== null ? (
                        <input
                          type="text"
                          value={`${tour.review.rating} stars`}
                          disabled
                        />
                      ) : (
                        <input
                          type="number"
                          min={1}
                          max={5}
                          name="rating"
                          placeholder="1 - 5"
                          onChange={(e) => {
                            getFormInput(setReviewInfo, e);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {tour.review !== null ? (
                    <textarea
                      cols="60"
                      rows="3"
                      disabled
                      value={tour.review.review}
                    ></textarea>
                  ) : (
                    <textarea
                      name="review"
                      cols="60"
                      rows="3"
                      onChange={(e) => {
                        getFormInput(setReviewInfo, e);
                      }}
                    ></textarea>
                  )}
                  <div className="btn-section">
                    {tour.review !== null ? (
                      <>
                        <button
                          className="btn-edit btn btn--yellow"
                          style={{ marginRight: "5px" }}
                          onClick={(e) => {
                            openModal(
                              tour.tour.id,
                              tour.review.review,
                              tour.review.rating
                            );
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn"
                          style={{ backgroundColor: "red", color: "#fff" }}
                          onClick={(e) => {
                            openDeleteReviewModal(tour.tour.id);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-save btn btn--green"
                        onClick={(e) => {
                          giveReview(e, tour.tour.id);
                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
        <Footer />
      </>
    );
  } else {
    return <Loader />;
  }
};

export default MyReviews;
