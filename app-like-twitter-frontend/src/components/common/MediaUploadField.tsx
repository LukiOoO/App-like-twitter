import Image from "next/image";
import Pencil from "@/assets/pencil.png";
import RemoveIc from "@/assets/remove.png";
import { MediaUploadFieldProps } from "@/types/porps/props";

const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  fileUrl,
  onEdit,
  onRemove,
  inputAccept,
  inputRef,
  onFileChange,
}) => {
  return (
    <div>
      {fileUrl ? (
        <div className="flex items-center space-x-4">
          <Image
            src={fileUrl}
            alt={label}
            width={64}
            height={64}
            className="object-cover rounded-md"
          />
          <div className="flex space-x-2">
            <Image
              src={Pencil}
              alt={`Edit ${label}`}
              onClick={onEdit}
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={RemoveIc}
              alt={`Remove ${label}`}
              onClick={onRemove}
              width={24}
              height={24}
              className="opacity-50 hover:opacity-80 cursor-pointer"
            />
          </div>
          <input
            type="file"
            accept={inputAccept}
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          <p
            onClick={onEdit}
            className="text-slate-300 cursor-pointer hover:text-teal-600 text-sm"
          >
            Add {label}
          </p>
          <input
            type="file"
            accept={inputAccept}
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default MediaUploadField;
