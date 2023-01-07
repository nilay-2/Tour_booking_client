const NoBookings = ({ msg }) => {
  return (
    <div>
      <main className="main--error">
        <div className="error">
          <div className="error__title">
            <img src="/img/noBookings.webp" alt="No bookings" />
          </div>
          <div className="error__msg">{msg}</div>
        </div>
      </main>
    </div>
  );
};

export default NoBookings;
