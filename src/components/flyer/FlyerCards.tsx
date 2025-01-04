import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import { TFlyer } from "@/types/types";
import FlyerCard from "./FlyerCard";
import PageLoader from "../loaders/PageLoader";
import { Empty } from "antd";

const FlyerCards = () => {
  const { getData } = useAxiosAPI();
  const {
    data: flyerImages,
    isPending,
    error,
  } = useQuery({
    queryKey: ["flyerImages"],
    queryFn: () => getData(API_ROUTES.FLYER.GET_ALL),
  });

  if (isPending) {
    return (
      <div className="w-full h-[calc(100dvh-290px)]">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <>
      <div className="text-lg font-semibold my-2">Uploaded Flyers</div>
      {Array.isArray(flyerImages) && flyerImages?.length === 0 ? (
        <Empty
          description="No Flyer Image uploaded yet!"
          className="h-[calc(100dvh-320px)] flex flex-col justify-center"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-[calc(100dvh-370px)] overflow-y-auto">
          {(flyerImages as TFlyer[])?.map((flyer: TFlyer) => (
            <FlyerCard key={flyer._id} flyer={flyer} />
          ))}
        </div>
      )}
    </>
  );
};

export default FlyerCards;
