import { baseUrl } from "@/App";
import { usePostData } from "@/hooks/usePostData";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VideoDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const [disabled, setDisabled] = useState<boolean>(false);
  const [savedComments, setSavedComments] = useState<any[]>(
    data?.data?.comments || []
  );
  const [nextPage, setNextPage] = useState<string | null>(
    data?.data?.nextPageToken || null
  );

  const videoUrl = `${baseUrl}/get_video_details`;

  const postMutation = usePostData({
    queryKey: ["video"],
    url: videoUrl,
  });

  const video_id = data?.data?.video_statistics?.id;

  const fetchMoreComments = useCallback(async () => {
    if (!nextPage) return;

    setDisabled(true);

    const body: any = {
      video_id: video_id,
      page: nextPage,
    };

    try {
      const response = await postMutation.mutateAsync(body);
      if (response) {
        // Add the new fetched comments to the savedComments state
        setSavedComments((prevComments) => [
          ...prevComments,
          ...response.data.comments,
        ]);
        // Update the nextPageToken state
        setNextPage(response.data.nextPageToken || null);
      }
    } catch (error: any) {
      toast.error(`${error?.message || error}`, {
        autoClose: 2000,
        theme: "light",
      });
    } finally {
      setDisabled(false);
    }
  }, [nextPage, video_id, postMutation]);

  return (
    <div className="p-5 w-full flex flex-col items-start space-y-5">
      <div className="w-auto h-auto rounded-md self-center">
        <img
          src={data?.data?.video_statistics?.snippet?.thumbnails?.default?.url}
          alt="Youtube Image"
          className="w-96 h-auto rounded-xl"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Title</span> -{" "}
          <span>{data?.data?.video_statistics?.snippet?.localized?.title}</span>
        </p>
        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Description</span> -{" "}
          <span>
            {data?.data?.video_statistics?.snippet?.localized?.description}
          </span>
        </p>
        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Date Published</span> -{" "}
          <span>
            {data?.data?.video_statistics?.snippet?.publishedAt?.split("T")[0]}{" "}
            {
              data?.data?.video_statistics?.snippet?.publishedAt
                ?.split("T")[1]
                .split("Z")[0]
            }
          </span>
        </p>

        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Comment Count</span> -{" "}
          <span>{data?.data?.video_statistics?.statistics.commentCount}</span>
        </p>

        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Favorite Count</span> -{" "}
          <span>{data?.data?.video_statistics?.statistics.favoriteCount}</span>
        </p>

        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">Like Count</span> -{" "}
          <span>{data?.data?.video_statistics?.statistics.likeCount}</span>
        </p>

        <p className="text-black text-lg">
          <span className="text-red-500 text-xl">View Count</span> -{" "}
          <span>{data?.data?.video_statistics?.statistics.viewCount}</span>
        </p>
      </div>

      {/* top level comments */}
      <div className="flex flex-col ">
        <p className="text-black text-lg mb-3">
          <span className="text-red-500 text-xl">Comments</span>
        </p>
        {data?.data?.comments.length === 0 ? (
          <div className="">
            <p>No comments found.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-3">
            {savedComments?.map((comment: any, index: number) => (
              <div
                key={index}
                className="bg-slate-100 p-3 flex flex-col space-y-1 items-start h-auto rounded-lg"
              >
                <p>
                  {
                    comment?.snippet?.topLevelComment?.snippet
                      ?.authorDisplayName
                  }
                </p>
                <p>{comment?.snippet?.topLevelComment?.snippet?.textDisplay}</p>
                <p>
                  {
                    comment?.snippet?.topLevelComment?.snippet?.publishedAt?.split(
                      "T"
                    )[0]
                  }{" "}
                  {
                    comment?.snippet?.topLevelComment?.snippet?.publishedAt
                      ?.split("T")[1]
                      .split("Z")[0]
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {nextPage && (
        <button
          disabled={disabled}
          onClick={fetchMoreComments}
          className="text-lg text-red-500 font-semibold"
        >
          Next
        </button>
      )}
      {disabled && (
        <div className="text-xl font-bold text-green-500 mb-20">
          Loading more comments...
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
