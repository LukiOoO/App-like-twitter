import React from "react";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import { TagManagerProps } from "@/types/porps/props";

const TagManager: React.FC<TagManagerProps> = ({
  selectedTags,
  onRemoveTag,
  onToggleCreateTag,
  onToggleFindTags,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div>
        <p
          className="text-sm text-teal-600 cursor-pointer"
          onClick={onToggleFindTags}
        >
          Find tags
        </p>
        <div className="mt-2">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-xs text-teal-600">{tag}</p>
                {selectedTags.length > 1 && (
                  <Image
                    alt="Remove Icon"
                    width={16}
                    height={16}
                    src={RemoveIc}
                    className="opacity-50 hover:opacity-80 cursor-pointer"
                    onClick={() => onRemoveTag(tag)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No tags selected.</p>
          )}
        </div>
      </div>
      <p
        className="text-sm text-teal-600 cursor-pointer"
        onClick={onToggleCreateTag}
      >
        Create tag
      </p>
    </div>
  );
};

export default TagManager;
