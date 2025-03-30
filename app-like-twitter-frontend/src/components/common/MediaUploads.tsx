import React from "react";
import MediaUploadField from "@/components/common/MediaUploadField";

export interface MediaConfig {
  label: string;
  type: "image" | "gif" | "video";
  fileUrl: string | null;
  inputAccept: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onEdit: () => void;
  onRemove: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type MediaUploadsProps = {
  mediaConfigs: MediaConfig[];
};

const MediaUploads: React.FC<MediaUploadsProps> = ({ mediaConfigs }) => {
  return (
    <>
      {mediaConfigs.map((config, index) => (
        <MediaUploadField
          key={index}
          label={config.label}
          fileUrl={config.fileUrl}
          onEdit={config.onEdit}
          onRemove={config.onRemove}
          inputAccept={config.inputAccept}
          inputRef={config.inputRef}
          onFileChange={config.onFileChange}
        />
      ))}
    </>
  );
};

export default MediaUploads;
