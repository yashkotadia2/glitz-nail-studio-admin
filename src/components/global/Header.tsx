import { Button, Divider } from "antd";
import React from "react";
import { TbPlus } from "react-icons/tb";

type HeaderProps = {
  title: string;
  buttonText?: string;
  onClick?: () => void;
};

const Header = ({ title, buttonText = "Button", onClick }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">{title}</div>
        {buttonText === "" ? null : (
          <Button
            type="primary"
            className="mr-2"
            onClick={onClick}
            icon={<TbPlus className="text-lg" />}
          >
            {buttonText}
          </Button>
        )}
      </div>
      <Divider className="my-2 border border-gray-200" />
    </>
  );
};

export default Header;
