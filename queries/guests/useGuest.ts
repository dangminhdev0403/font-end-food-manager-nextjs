import { queryKeys } from "@/constants/keys/queryKeys";
import guestClient from "@/services/internal/customers/guests/guest.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGuestGetListOrderQuery = () => {
  return useQuery({
    queryKey: queryKeys.listOrderGuest,
    queryFn: () => guestClient.getListOrder(), // phải gọi hàm
    staleTime: 1000 * 30, // cache 30s
  });
};
export const useGuestUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: guestClient.updateOrder,

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.listOrderGuest,
      });

      const previous = queryClient.getQueryData(queryKeys.listOrderGuest);

      queryClient.setQueryData(queryKeys.listOrderGuest, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: newOrder.items,
          },
        };
      });

      return { previous };
    },

    onError: (err, newOrder, context) => {
      queryClient.setQueryData(queryKeys.listOrderGuest, context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listOrderGuest,
      });
    },
  });
};
