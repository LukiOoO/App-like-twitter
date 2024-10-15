"use client";

import Image from "next/image";
import { MediaProps } from "@/types/porps/props";

const Media: React.FC<MediaProps> = ({ image, gif, video }) => {
  return (
    <div className="media-container flex flex-wrap justify-center gap-4">
      {image && (
        <Image
          src={image}
          alt="Post Image"
          width={192}
          height={192}
          className="rounded-md shadow-lg object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        />
      )}

      {gif && (
        <img
          src={gif}
          alt="Post GIF"
          className="rounded-md shadow-md object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        />
      )}

      {video && (
        <video
          src={video}
          controls
          className="rounded-md shadow-lg w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        />
      )}
    </div>
  );
};

export default Media;
