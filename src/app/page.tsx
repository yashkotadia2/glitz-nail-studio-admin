"use client";
import React, { JSX, useState } from "react";
import { Button, Layout, Menu } from "antd";
import {
  TbCalendar,
  TbReceipt2,
  TbLibraryPhoto,
  TbVideo,
  TbAd,
} from "react-icons/tb";
import { RiMenuFold2Fill, RiMenuUnfold2Fill } from "react-icons/ri";
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
  const [selectedKey, setSelectedKey] = useState("appointments");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-screen overflow-auto relative"
      >
        <div className="w-full bg-white py-2">
          <Image
            width={collapsed ? 40 : 100}
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
        <Button
          type="link"
          icon={collapsed ? <RiMenuFold2Fill /> : <RiMenuUnfold2Fill />}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-0 right-0 mt-2 mr-2 w-12 h-12 z-50"
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
