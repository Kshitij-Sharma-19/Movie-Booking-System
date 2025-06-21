import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createCheckoutSession = (bookingDetails) =>
  axios.post(`${BASE_URL}/payment-service/api/v1/payments/create-checkout-session`, bookingDetails);
