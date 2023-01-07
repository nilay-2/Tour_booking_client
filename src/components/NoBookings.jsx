const NoBookings = ({ Header, Footer, msg }) => {
  return (
    <div>
      <Header />
      <main className="main">
        <div className="error">
          <div className="error__title">
            <img src="/img/noBookings.webp" alt="No bookings" />
          </div>
          <div className="error__msg">{msg}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NoBookings;
