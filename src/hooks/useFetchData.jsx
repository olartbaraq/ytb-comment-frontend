import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const fetchData = async (url) => {
  const headers = {
    Accept: "application/json",
  };

  try {
    const { data } = await axios.get(url, { headers });
    return data;
  } catch (error) {
    const errorBody = error.response?.data || { detail: error.message };
    console.error(errorBody);
    toast.error(`${errorBody}`, {
      autoClose: 2000,
      theme: "light",
    });
    throw new Error(errorBody.detail);
  }
};

const useFetchData = (url, queryKey) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchData(url),
  });
};

export default useFetchData;
