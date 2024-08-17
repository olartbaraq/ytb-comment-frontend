import { baseUrl } from "@/App";
import { usePostData } from "@/hooks/usePostData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import Image1 from "../assets/images/image1.png";
import Image2 from "../assets/images/image2.png";
import { useNavigate } from "react-router-dom";

const searchFormSchema = z.object({
  videoID: z
    .string({
      invalid_type_error: "videoID must be a string",
      required_error: "This field is required",
    })
    .min(1, "Video ID cannot be empty")
    .trim(),
});

const requiredForm = searchFormSchema.required();

const Homepage = () => {
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState<boolean>(false);

  const videoUrl = `${baseUrl}/get_video_details`;

  const postMutation = usePostData({
    queryKey: ["video"],
    url: videoUrl,
  });

  const methods = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(requiredForm),
    defaultValues: {
      videoID: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<z.infer<typeof searchFormSchema>> = async (
    values: z.infer<typeof requiredForm>
  ) => {
    setDisabled(true);

    const body: any = {
      video_id: values.videoID,
    };
    console.log(body);

    try {
      const data = await postMutation.mutateAsync(body);
      if (data) {
        // navigate to another page and show the data
        navigate("/video-details", { state: { data } });
      }
    } catch (error: any) {
      toast.success(`${error?.message || error}`, {
        autoClose: 2000,
        theme: "light",
      });
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="w-full flex flex-row items-center">
      {/* Part Text */}
      <div className="bg-white w-full md:w-2/3 flex flex-col items-center space-y-4 py-3 ">
        <div className="w-48 md:w-96 flex flex-col items-start space-y-6">
          <div className="w-auto h-auto ">
            <img src={Image2} alt="Youtube Image" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-lg text-gray-300">Features</p>
            <h2 className="text-black font-bold text-2xl"> - Video Details</h2>
            <h2 className="text-black font-bold text-2xl">
              - Top Level Comments
            </h2>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className=" w-52 md:w-full flex flex-row items-center space-x-3">
              <div className="w-full space-y-2 items-start flex flex-col mt-6">
                <input
                  type="text"
                  placeholder="_VB39Jo8mAQ"
                  {...methods.register("videoID")}
                  className="border rounded-md bg-slate-100 h-10 w-44 md:w-72 px-4"
                />
                <p className="text-red-600 text-sm">
                  {methods.formState.errors.videoID?.message}
                </p>
              </div>
              <button
                disabled={disabled}
                className={`w-24 h-10 rounded-lg flex justify-center items-center px-6 ${
                  disabled ? "bg-slate-200" : "bg-red-500"
                } text-white text-[8px] md:text-sm font-medium`}
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Part Image */}
      <div className="hidden bg-slate-100 w-full h-screen md:flex items-center justify-center p-10">
        <div className="w-full h-auto">
          <img src={Image1} alt="Some Screen Image" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
