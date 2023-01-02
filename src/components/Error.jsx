const Error = ({ Header, Footer, msg }) => {
  return (
    <>
      <Header />
      <main className="main--error">
        <div className="error">
          <div className="error__title">
            <h2 className="heading-secondary heading-secondary--error">
              Uh oh! something went wrong
            </h2>
            {/*<h2 className="error__emoji">😢 🤯</h2>*/}
          </div>
          <div className="error__msg">{msg}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Error;
