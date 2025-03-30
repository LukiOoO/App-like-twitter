import React from "react";
import Image from "next/image";
import EmptyHear from "@/assets/Nofollows.png";
import FullHear from "@/assets/Follows.png";
import AnonymusImg from "@/assets/anonymous.png";
import { UserDataProps } from "@/types/porps/props";

const UserData: React.FC<UserDataProps> = ({
  userData,
  isFrozenAccount,
  isAuthor,
  canUserFollowOrNot,
  onFollowToggle,
}) => {
  return (
    <div className="flex-1 sm:h-2/3">
      <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
        User data
      </span>
      {!isFrozenAccount ? (
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4">
              <Image
                src={userData?.avatar || AnonymusImg}
                width={96}
                height={96}
                alt="User Avatar"
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-medium text-slate-800">
              {userData.nickname}
            </h3>
            <p className="text-gray-600">{userData.email}</p>
          </div>
          <div className="mt-6 flex justify-around text-center">
            <div>
              <p className="text-lg font-semibold text-slate-700">
                {userData.followersCount}
              </p>
              <p className="text-gray-500">Followers</p>
            </div>
            <div>
              {!isAuthor && (
                <Image
                  src={canUserFollowOrNot ? EmptyHear : FullHear}
                  alt="follow user"
                  width={30}
                  height={30}
                  className="cursor-pointer"
                  onClick={onFollowToggle}
                />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700">
                {userData.followingCount}
              </p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700 text-center">
              {userData.last_login}
            </p>
            <p className="text-gray-500 text-center">Last Login</p>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center sm:w-full sm:h-full">
          <p className="font-semibold text-gray-500">
            User has a frozen account
          </p>
        </div>
      )}
    </div>
  );
};

export default UserData;
