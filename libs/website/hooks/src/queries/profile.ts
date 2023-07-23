import { UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@website/api/client";

export const usePageAccentColor = (options: { handle: string }): UseQueryResult<string> => {
   const queryKey = ["profile", options.handle, "accentColor"];
   const client = useQueryClient();
   return useQuery({
      queryKey,
      queryFn: async () => {
         const data = client.getQueryData<string>(queryKey);
         if (data) {
            return data;
         }
         return await api.profile.getAccentColor.query({
            handle: options.handle,
         });
      },
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
};
