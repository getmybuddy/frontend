import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface IUserProfileProps {
  children: React.ReactNode;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  personalities: string[];
  interests: string[];
  shortBio: string;
}

const UserProfile = ({
  children,
  name,
  age,
  interests,
  location,
  occupation,
  gender,
  personalities,
  shortBio,
}: IUserProfileProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
          <div className="flex items-center mb-4">
            <div className="text-2xl font-bold">{name}</div>
            <div className="ml-4 text-gray-600">{age} years old</div>
          </div>
          <div className="text-gray-700">
            <div className="flex items-center mb-2">
              <span className="font-semibold w-24">Gender:</span>
              <span>{gender}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold w-24">Location:</span>
              <span>{location}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold w-24">Occupation:</span>
              <span>{occupation}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold">Personalities:</div>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {personalities?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="font-semibold">Interests:</div>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {interests?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold">Bio:</div>
            <p className="text-gray-700 mt-2">{shortBio}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserProfile;
