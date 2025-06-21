import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "../services/paymentService";

export const useCheckoutSession = () =>
  useMutation({
    mutationFn: createCheckoutSession,
  });
