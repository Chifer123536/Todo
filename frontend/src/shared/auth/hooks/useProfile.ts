import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/user/services";

export function useProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await userService.findProfile();
      return response;
    },
  });

  return {
    data,
    isLoading,
  };
}
