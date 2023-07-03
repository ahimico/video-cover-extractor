import axios from "axios";
import { getLinkPreview } from "link-preview-js";

interface AparatDataResponse {
  video: {
    id: string;
    big_poster: string;
    small_poster: string;
  };
}
export const aparatCoverExractor = (srcURL: string) => {
  // e.g. https://www.aparat.com/v/qzba2
  const videoHash = new URL(srcURL).pathname.split("/").pop();
  const apiURL = `https://www.aparat.com/etc/api/video/videohash/${videoHash}`;
  return axios.get<unknown, AparatDataResponse>(apiURL).then((res) => {
    // @ts-ignore
    console.log("data aparat", res.data.video.big_poster);
    // @ts-ignore
    return res.data.video.big_poster;
  });
};

interface YoutubeDataResponse {
  title: string;
  images: string[];
}
export const youtubeCoverExtractor = async (srcURL: string) => {
  // e.g. https://www.youtube.com/watch?v=5JJrJGZ_LjM
  console.log(`youtube srcURL`, srcURL);

  const data = await getLinkPreview(srcURL, {
    timeout: 5_000, // NOTE: This wont work in the filtered networks!
  });
  return (data as YoutubeDataResponse).images[0];
};

export default async (req, res) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  const url = req.query.url.trim();
  console.log({ url });
  if (url.startsWith("https://www.aparat.com")) {
    const cover = await aparatCoverExractor(url);
    res.status(200).json(cover);
  }

  if (url.startsWith("https://www.youtube.com")) {
    const cover = await youtubeCoverExtractor(url);
    res.status(200).json(cover);
  }

  res.status(500).json({ message: "لطفا ادرس درست وارد کنید" });
};
