import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  return currentUser ? <h1>Yes</h1> : <h1>NO</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
