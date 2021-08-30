import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../component/header";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <h1>Header </h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  // console.log(pageProps);
  // console.log(data);
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
