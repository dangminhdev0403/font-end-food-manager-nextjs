import { queryKeys } from "@/lib/queryKeys";
import guestClient from "@/services/internal/customers/guests/guest.client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestGetListOrderQuery = () => {
  return useQuery({
    queryKey: queryKeys.listOrderGuest,
    queryFn: () => guestClient.getListOrder,
  });
};

export const useGuestUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: guestClient.updateOrder,
  });
};
