import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default ({ isOpen, closeModal, tourId, reviewInfo }) => {
  const closeOnOverlay = () => {
    closeModal(false);
  };

  const closeOnBtnClick = () => {
    closeModal(false);
  };
  const submitReview = async (e) => {
    const rating = document.querySelector("#rating").value;
    const review = document.querySelector("#review").value;
    const reviewObj = { review, rating };
    if (!review || !rating) {
      toast.error("All fields are required!");
      return;
    }
    e.target.textContent = "PROCESSING...";
    const res = await fetch(
      `http://127.0.0.1:3000/api/v1/reviews/tour/${tourId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewObj),
      }
    );
    const data = await res.json();
    if (data.status === "success") {
      toast.success("Review updated successfully!");
    } else {
      toast.error("Error occured while updating review!");
    }
    e.target.textContent = "save and continue";
    setTimeout(() => {
      location.assign("/myReviews");
    }, 1400);
    return;
  };
  if (!isOpen) {
    document.querySelector("body").classList.remove("active-modal");
    return;
  }
  document.querySelector("body").classList.add("active-modal");
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="overlay" onClick={closeOnOverlay}></div>
      <div className="content">
        <div className="btn-section">
          <button
            className="btn"
            style={{ color: "#000000" }}
            onClick={closeOnBtnClick}
          >
            X
          </button>
        </div>
        <h1 className="modal-title">Update Review and Rating</h1>
        <div className="input-section">
          <input
            type="text"
            name="rating"
            id="rating"
            placeholder="1 - 5"
            defaultValue={reviewInfo.rating}
          />
        </div>
        <div className="text-section">
          <textarea
            name="review"
            id="review"
            cols="60"
            rows="8"
            defaultValue={reviewInfo.review}
          ></textarea>
        </div>
        <div className="submitbtn-section">
          <button className="btn btn--green" onClick={submitReview}>
            Save and Continue
          </button>
        </div>
      </div>
    </div>,
    document.querySelector("#portal")
  );
};
