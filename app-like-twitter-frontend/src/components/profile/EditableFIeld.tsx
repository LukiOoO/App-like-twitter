import React from "react";
import Image from "next/image";
import Pencil from "@/assets/pencil.png";
import Subm from "@/assets/verified.png";
import { EditableFieldProps } from "@/types/porps/props";

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  isEditing,
  onChange,
  onToggleEdit,
  inputType = "text",
}) => {
  return (
    <div className="p-5 flex items-center">
      {isEditing ? (
        <input
          className="bg-lighterDark p-1 rounded"
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
      <Image
        className="cursor-pointer ml-2"
        src={isEditing ? Subm : Pencil}
        alt={isEditing ? "Submit" : "Edit"}
        width={30}
        height={30}
        onClick={onToggleEdit}
      />
    </div>
  );
};

export default EditableField;
