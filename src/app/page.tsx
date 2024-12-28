"use client";
import React, { JSX } from "react";
import { Layout, Menu } from "antd";
import {
  TbCalendar,
  TbReceipt2,
  TbLibraryPhoto,
  TbVideo,
  TbAd,
} from "react-icons/tb";
import glitzLogo from "../../public/icons/glitz_text_logo.png";
import Image from "next/image";

import PriceMenu from "@/components/menu/PriceMenu";
import Photos from "@/components/photos/Photos";
import Videos from "@/components/videos/Videos";
import Flyer from "@/components/flyer/Flyer";
import Appointments from "@/components/appointments/Appointments";

const { Content, Sider } = Layout;

const menuItems: {
  [key: string]: JSX.Element;
} = {
  appointments: <Appointments />,
  menu: <PriceMenu />,
  photos: <Photos />,
  videos: <Videos />,
  flyer: <Flyer />,
};

const items = [
  {
    key: "appointments",
    icon: <TbCalendar />,
    label: "Appointments",
  },
  {
    key: "menu",
    icon: <TbReceipt2 />,
    label: "Menu",
  },
  {
    key: "photos",
    icon: <TbLibraryPhoto />,
    label: "Photos",
  },
  {
    key: "videos",
    icon: <TbVideo />,
    label: "Videos",
  },
  {
    key: "flyer",
    icon: <TbAd />,
    label: "Flyer",
  },
];

const Home: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState("appointments");
  return (
    <Layout>
      <Sider className="h-screen overflow-auto">
        <div className="w-full bg-white py-2">
          <Image
            width={100}
            src={glitzLogo}
            alt="glitz logo"
            className="m-auto"
          />
        </div>
        <Menu
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key.toString())}
          mode="inline"
          items={items}
          className="h-full"
        />
      </Sider>
      <Layout>
        <Content>
          <div className="p-4 h-screen">{menuItems[selectedKey]}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
