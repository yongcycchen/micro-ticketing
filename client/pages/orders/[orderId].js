import { useEffect, useState } from "react";
// import { StripeCheckout } from "react-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ order }) => {
  // console.log(order);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  const stripe = useStripe();
  const elements = useElements();
  const onSubmit = (event) => {
    event.preventDefault();
    // doRequest();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // stripe.confirmCardPayment({});
    // stripe.createToken();
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(CardElement),
    // });
    const token = await stripe.createToken(elements.getElement(CardElement));
    console.log(token.token.id);
    doRequest({ token: token.token.id });
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <label>{order.ticket.price}</label>
      {errors}
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};
const stripePromise = loadStripe(
  "pk_test_51JZ9jjG0VpV6YP0oiF8gWT4BTTSRU9lFy9vyw2hebx5Brt4lA96vrQhG1zSyvIRqvWQ8ANYOjcHHDJ8AugYACI0e00BqdkOSbx"
);
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <div>
        Time left to pay: {timeLeft} seconds
        {/* <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_JMdyKVvf8EGTB0Fl28GsN7YY"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      /> */}
        {/* <StripeProvider apiKey="pk_test_51JZ9jjG0VpV6YP0oiF8gWT4BTTSRU9lFy9vyw2hebx5Brt4lA96vrQhG1zSyvIRqvWQ8ANYOjcHHDJ8AugYACI0e00BqdkOSbx">
        <MyStoreCheckout />
      </StripeProvider> */}
        {/* {errors} */}
      </div>
      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
