import React from "react";
import Header from "../global/Header";
import FlyerForm from "./FlyerForm";
import FlyerCards from "./FlyerCards";

const Flyer = () => {
  return (
    <div>
      <Header
        title="Flyer"
        buttonText={null}
        onClick={() => {
          console.log("Flyer clicked");
        }}
      />
      <FlyerForm />
      <FlyerCards />
    </div>
  );
};

export default Flyer;
