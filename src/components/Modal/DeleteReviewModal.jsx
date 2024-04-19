import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL, getAccessControlAllowOrigin } from "../utils/util";

export default ({ deleteOpen, closeDeleteReviewModal, tourId }) => {
  const closeModal = () => {
    closeDeleteReviewModal(false);
  };

  const deleteReview = async (e) => {
    e.target.textContent = "PROCESSING...";
    const res = await fetch(`${BACKEND_URL}/api/v1/reviews/tour/${tourId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": getAccessControlAllowOrigin(),
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.status === "success") {
      toast.success(`${data.message}`, {
        autoClose: false,
      });
      setTimeout(() => {
        location.reload(true);
      }, 1400);
    } else {
      toast.error("Error occurred whie deleting your review!");
    }
    e.target.textContent = "Yes, Delete My Review";
    return;
  };
  if (!deleteOpen) {
    document.querySelector("body").classList.remove("active-modal");
    return;
  }
  document.querySelector("body").classList.add("active-modal");
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="overlay" onClick={closeModal}></div>
      <div className="content">
        <div className="block1">
          <div className="title">Delete Your Review?</div>
          <button
            className="btn"
            style={{ color: "#000000" }}
            onClick={closeModal}
          >
            X
          </button>
        </div>
        <div className="block2">
          Are you sure you want to delete your review?
        </div>
        <div className="block3">
          <div className="btn-section">
            <button className="btn" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="btn"
              style={{ color: "#FFF", backgroundColor: "#000000" }}
              onClick={deleteReview}
            >
              Yes, Delete My Review
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#portal")
  );
};
