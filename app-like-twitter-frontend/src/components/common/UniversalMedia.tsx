"use client";

import Image from "next/image";
import { MediaProps } from "@/types/porps/props";

const Media: React.FC<MediaProps> = ({
  image,
  gif,
  video,
  imageClass,
  gifClass,
  videoClass,
}) => {
  return (
    <div className="media-container flex flex-wrap justify-center gap-4 lg:flex-col lg:items-center">
      {image && (
        <Image
          src={image}
          alt="Post Image"
          width={192}
          height={192}
          className={`${imageClass}`}
        />
      )}

      {gif && <img src={gif} alt="Post GIF" className={`${gifClass}`} />}

      {video && <video src={video} controls className={`${videoClass}`} />}
    </div>
  );
};

export default Media;
