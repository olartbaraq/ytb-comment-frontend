import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({ url, body }: { url: string; body: any }) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const { data } = await axios.post(url, body, { headers });
    return data;
  } catch (error: any) {
    const errorBody = error.response?.data | error;
    console.error(errorBody);
    throw errorBody;
  }
};

export const usePostData = ({
  queryKey,
  url,
}: {
  queryKey: any;
  url: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postData({ url, body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(queryKey);
      return data;
    },
  });
};
