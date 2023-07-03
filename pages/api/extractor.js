import axios from "axios";
import { getLinkPreview } from "link-preview-js";


export const aparatCoverExractor = (srcURL) => {
  // e.g. https://www.aparat.com/v/qzba2
  const videoHash = new URL(srcURL).pathname.split("/").pop();
  const apiURL = `https://www.aparat.com/etc/api/video/videohash/${videoHash}`;
  return axios.get(apiURL).then((res) => {
    // @ts-ignore
    console.log("data aparat", res.data.video.big_poster);
    // @ts-ignore
    return res.data.video.big_poster;
  });
};


export const youtubeCoverExtractor = async (srcURL) => {
  // e.g. https://www.youtube.com/watch?v=5JJrJGZ_LjM
  console.log(`youtube srcURL`, srcURL);

  const data = await getLinkPreview(srcURL, {
    timeout: 5_000, // NOTE: This wont work in the filtered networks!
  });
  return data.images[0];
};

export default async (req, res) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  const url = req.query.url?.trim();
  if (!url)  return res.status(500).json({ message: "لطفا ادرس درست وارد کنید" });

  if (url.startsWith("https://www.aparat.com")) {
    const cover = await aparatCoverExractor(url);
    return res.status(200).json(cover);
  }

  if (url.startsWith("https://www.youtube.com")) {
    const cover = await youtubeCoverExtractor(url);
    return res.status(200).json(cover);
  }

  res.status(500).json({ message: "لطفا ادرس درست وارد کنید" });
};
