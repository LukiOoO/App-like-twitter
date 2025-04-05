import React from "react";
import Image from "next/image";
import { Checkbox } from "@nextui-org/checkbox";
import Pencil from "@/assets/pencil.png";
import AnonymusImg from "@/assets/anonymous.png";
import { UserInfoProps } from "@/types/porps/props";
import EditableField from "./EditableFIeld";

const UserInfo: React.FC<UserInfoProps> = ({
  userData,
  setUserData,
  isFrozenAccount,
  isEditedNick,
  isEditedEmail,
  setIsEditedNick,
  setIsEditedEmail,
  handlePencilClick,
  fileInputRef,
  handleFileChange,
  changeUserData,
  sendResetPasswordEmail,
  freezeAccount,
  unFreezeAccount,
  email,
}) => {
  const toggleNickEdit = () => {
    if (isEditedNick) {
      setIsEditedNick(false);
      changeUserData();
    } else {
      setIsEditedNick(true);
      setIsEditedEmail(false);
    }
  };

  const toggleEmailEdit = () => {
    if (isEditedEmail) {
      setIsEditedEmail(false);
      changeUserData();
    } else {
      setIsEditedEmail(true);
      setIsEditedNick(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center ">
      {!isFrozenAccount ? (
        <>
          <p className="p-5 flex items-center">
            <Image
              src={userData?.avatar || AnonymusImg}
              width={80}
              height={80}
              alt="User Image"
              className="rounded-full object-cover"
            />
            <Image
              className="cursor-pointer"
              src={Pencil}
              alt="Edit Avatar"
              width={30}
              height={30}
              onClick={handlePencilClick}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </p>
          <EditableField
            value={userData.nickname}
            isEditing={isEditedNick}
            onChange={(newVal) =>
              setUserData({ ...userData, nickname: newVal })
            }
            onToggleEdit={toggleNickEdit}
          />
          <EditableField
            value={userData.email}
            isEditing={isEditedEmail}
            onChange={(newVal) => setUserData({ ...userData, email: newVal })}
            onToggleEdit={toggleEmailEdit}
            inputType="email"
          />
          <p className="p-5 flex space-x-1">
            <span>Freeze Account</span>
            <Checkbox
              color="default"
              isSelected={userData.freeze_or_not}
              onChange={() => freezeAccount(!userData.freeze_or_not)}
            />
          </p>
          <p className="p-5 flex">
            Change password
            <Image
              className="cursor-pointer"
              src={Pencil}
              alt="Change Password"
              width={30}
              height={30}
              onClick={sendResetPasswordEmail}
            />
          </p>
        </>
      ) : (
        <p className="p-5 flex space-x-1">
          <span>Freeze Account</span>
          <Checkbox
            color="default"
            defaultSelected={true}
            onChange={unFreezeAccount}
          />
        </p>
      )}
    </div>
  );
};

export default UserInfo;
