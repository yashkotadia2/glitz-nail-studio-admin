import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import { TFlyer } from "@/types/types";
import FlyerCard from "./FlyerCard";
import PageLoader from "../loaders/PageLoader";

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
      <div className="w-full h-[calc(100vh-340px)]">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {(flyerImages as TFlyer[])?.map((flyer: TFlyer) => (
        <FlyerCard key={flyer._id} flyer={flyer} />
      ))}
    </div>
  );
};

export default FlyerCards;
