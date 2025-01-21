import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { UserIcon } from "../icons";
import { userReviews } from "@/constants/userTestimonials";

const UserTestimonials: React.FC = () => {
  return (
    <div className="snap-x ">
      <div className="w-full p-5 hidden lg:block">
        <div className="grid grid-cols-6 grid-rows-1 gap-4">
          <div className="col-span-3 grid grid-cols-3 grid-flow-row gap-4">
            {/* First row */}
            <Card className="boxShadow col-span-1 p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[0].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[0].message}
              </CardContent>
            </Card>
            <Card className="boxShadow col-span-2 p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[1].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[1].message}
              </CardContent>
            </Card>

            {/* Second row */}
            <Card className="boxShadow col-span-2 p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[2].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[2].message}
              </CardContent>
            </Card>
            <Card className="boxShadow col-span-1 p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[3].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[3].message}
              </CardContent>
            </Card>
          </div>
          <Card className="boxShadow col-span-1  gap-4 p-1 shadow-lg">
            <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
              <div className="flex items-center">
                <UserIcon />
                <h2 className="ml-1">{userReviews[4].name}</h2>
              </div>
            </CardHeader>
            <CardContent className="font-normal leading-6 ">
              {userReviews[4].message}
            </CardContent>
          </Card>
          <div className="col-span-2 grid grid-rows-2 grid-cols-1 gap-4">
            <Card className="boxShadow p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[5].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[5].message}
              </CardContent>
            </Card>
            <Card className="boxShadow p-1 shadow-lg">
              <CardHeader className="font-medium -tracking-[0.07em] text-[28px]">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[6].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal leading-6 ">
                {userReviews[6].message}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex lg:hidden overflow-x-auto p-2 no-scrollbar">
        <div className="flex flex-col">
          <div className="flex flex-no-wrap mb-3">
            {" "}
            {/* Ensure the content doesn't wrap */}
            <div className="flex-shrink-0 w-[180px] mr-3">
              {" "}
              {/* First item with half width */}
              <Card className="boxShadow p-0.5 h-60 shadow-md">
                <CardHeader className="font-medium -tracking-[0.07em] text-base">
                  <div className="flex items-center">
                    <UserIcon />
                    <h2 className="ml-1">{userReviews[0].name}</h2>
                  </div>
                </CardHeader>
                <CardContent className="font-normal text-sm">
                  {userReviews[0].message}
                </CardContent>
              </Card>
            </div>
            <div className="flex-shrink-0 w-[360px]">
              {" "}
              {/* Second item with full width */}
              <Card className="boxShadow p-0.5 h-60 shadow-md">
                <CardHeader className="font-medium -tracking-[0.07em] text-base">
                  <div className="flex items-center">
                    <UserIcon />
                    <h2 className="ml-1">{userReviews[1].name}</h2>
                  </div>
                </CardHeader>
                <CardContent className="font-normal text-sm">
                  {userReviews[1].message}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex flex-no-wrap">
            {" "}
            {/* Ensure the content doesn't wrap */}
            <div className="flex-shrink-0 w-[360px] mr-3">
              {" "}
              {/* Second item with full width */}
              <Card className="boxShadow p-0.5 h-60 shadow-md">
                <CardHeader className="font-medium -tracking-[0.07em] text-base">
                  <div className="flex items-center">
                    <UserIcon />
                    <h2 className="ml-1">{userReviews[2].name}</h2>
                  </div>
                </CardHeader>
                <CardContent className="font-normal text-sm">
                  {userReviews[2].message}
                </CardContent>
              </Card>
            </div>
            <div className="flex-shrink-0 w-[180px]">
              {" "}
              {/* First item with half width */}
              <Card className="boxShadow p-0.5 h-60 shadow-md">
                <CardHeader className="font-medium -tracking-[0.07em] text-base">
                  <div className="flex items-center">
                    <UserIcon />
                    <h2 className="ml-1">{userReviews[3].name}</h2>
                  </div>
                </CardHeader>
                <CardContent className="font-normal text-sm">
                  {userReviews[3].message}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex"></div>
        </div>

        <div className="ml-3 mr-3">
          <Card className="boxShadow w-[180px] p-0.5 h-[491px]  shadow-md">
            <CardHeader className="font-medium -tracking-[0.07em] text-base">
              <div className="flex items-center">
                <UserIcon />
                <h2 className="ml-1">{userReviews[4].name}</h2>
              </div>
            </CardHeader>
            <CardContent className="font-normal text-sm">
              {userReviews[4].message}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <div className="flex-shrink-0 w-[360px] mb-3">
            {" "}
            {/* Second item with full width */}
            <Card className="boxShadow p-0.5 h-60 shadow-md">
              <CardHeader className="font-medium -tracking-[0.07em] text-base">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[5].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal text-sm">
                {userReviews[5].message}
              </CardContent>
            </Card>
          </div>
          <div className="flex-shrink-0 w-[360px]">
            {" "}
            {/* Second item with full width */}
            <Card className="boxShadow p-0.5 h-60 shadow-md">
              <CardHeader className="font-medium -tracking-[0.07em] text-base">
                <div className="flex items-center">
                  <UserIcon />
                  <h2 className="ml-1">{userReviews[6].name}</h2>
                </div>
              </CardHeader>
              <CardContent className="font-normal text-sm">
                {userReviews[6].message}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTestimonials;
