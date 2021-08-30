const LandingPage = ({ color }) => {
  console.log("ifajdfkl", color);
  return <h1>landing</h1>;
};

LandingPage.getInitialProps = () => {
  console.log("i am on the server!");
  return { color: "red" };
};

export default LandingPage;
