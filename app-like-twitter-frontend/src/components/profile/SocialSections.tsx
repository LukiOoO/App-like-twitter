import React from "react";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import { SocialSectionsProps } from "@/types/porps/props";

const SocialSections: React.FC<SocialSectionsProps> = ({
  followers,
  following,
  tags,
  searchTermFollowers,
  handleSearchFollowers,
  searchTerm,
  handleSearch,
  searchTermTag,
  handleSearchTag,
  removeFollowing,
  removeTag,
  currentUserNickname,
}) => {
  const filteredFollowers = followers.filter((followerObj: any) =>
    followerObj.follower[0]
      .toLowerCase()
      .includes(searchTermFollowers.toLowerCase())
  );
  const filteredFollowing = following.filter((followingObj: any) =>
    followingObj.following[0].toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTags = Array.isArray(tags)
    ? tags.filter((tagObj: any) =>
        tagObj.tag.toLowerCase().includes(searchTermTag.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="mt-2 text-center h-1/3 border-lighterDark border-b-4">
        <div className="flex justify-around">
          <input
            type="search"
            className="bg-lighterDark rounded-lg w-36 text-center"
            placeholder="Search..."
            value={searchTermFollowers}
            onChange={handleSearchFollowers}
          />
          <span className="text-xl font-bold text-white">
            Your followers ({followers.length}):
          </span>
        </div>
        <ul className="h-5/6 overflow-y-scroll scrollbar-hide flex flex-col">
          {filteredFollowers.length > 0 ? (
            filteredFollowers.map((followerObj: any, index: number) => (
              <li className="flex justify-center m-2" key={index}>
                <p>
                  {followerObj.follower[0] !== currentUserNickname
                    ? followerObj.follower[0]
                    : ""}
                </p>
              </li>
            ))
          ) : (
            <li className="flex justify-center m-2">No matches found</li>
          )}
        </ul>
      </div>

      <div className="mt-2 text-center h-1/3 border-lighterDark border-b-4">
        <div className="flex justify-around">
          <input
            type="search"
            className="bg-lighterDark rounded-lg w-36 text-center"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="text-xl font-bold text-white">
            You Follow ({following.length}):
          </span>
        </div>
        <ul className="h-5/6 overflow-y-scroll scrollbar-hide flex flex-col">
          {filteredFollowing.length > 0 ? (
            filteredFollowing.map((followingObj: any, index: number) => (
              <li className="flex justify-center m-2" key={index}>
                <p>{followingObj.following[0]}</p>
                <Image
                  className="ml-2 opacity-10 hover:opacity-80 cursor-pointer"
                  src={RemoveIc}
                  alt="Remove"
                  width={20}
                  onClick={() => removeFollowing(followingObj.following[1])}
                />
              </li>
            ))
          ) : (
            <li className="flex justify-center m-2">No matches found</li>
          )}
        </ul>
      </div>

      <div className="mt-2 text-center h-1/3">
        <div className="flex justify-around">
          <input
            type="search"
            className="bg-lighterDark rounded-lg w-36 text-center"
            placeholder="Search..."
            value={searchTermTag}
            onChange={handleSearchTag}
          />
          <span className="text-xl font-bold text-white">
            Your Tags ({Array.isArray(tags) ? tags.length : 0}):
          </span>
        </div>
        <ul className="h-[70%] overflow-y-scroll scrollbar-hide flex flex-col">
          {filteredTags.length > 0 ? (
            filteredTags.map((tagObj: any, index: number) => (
              <li className="flex justify-center m-2" key={index}>
                <p>{tagObj.tag}</p>
              </li>
            ))
          ) : (
            <li className="flex justify-center m-2">No matches found</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SocialSections;
