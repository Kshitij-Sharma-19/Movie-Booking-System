import { useMutation } from "@tanstack/react-query";
import { confirmBooking } from "../services/bookingService";

export const useConfirmBooking = () =>
  useMutation({
    mutationFn: confirmBooking,
  });
