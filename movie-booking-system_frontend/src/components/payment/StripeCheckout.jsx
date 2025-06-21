import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useBooking } from "../../context/BookingContext";
import { createCheckoutSession } from "../../services/paymentService";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = () => {
  const { bookingDetails } = useBooking();

  useEffect(() => {
    const redirectToStripe = async () => {
      const stripe = await stripePromise;
      try {
        const res = await createCheckoutSession(bookingDetails);
        const sessionId = res.data.id;
        await stripe.redirectToCheckout({ sessionId });
      } catch (err) {
        alert("Payment initiation failed.");
        console.error(err);
      }
    };

    if (bookingDetails) {
      redirectToStripe();
    }
  }, [bookingDetails]);

  return <p>Redirecting to payment gateway...</p>;
};

export default StripeCheckout;
