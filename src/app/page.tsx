"use client";
import React, { JSX, useEffect, useState } from "react";
import useSelectedKey from "@/zustand/useSelectedKey";
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
import { useScreenWidth } from "@/hooks/useScreenWidth";
import "@ant-design/v5-patch-for-react-19";
import { Toaster } from "react-hot-toast";

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
  const deviceType = useScreenWidth();
  const { selectedKey, setSelectedKey } = useSelectedKey();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (deviceType === "mobile") {
      setCollapsed(true);
    }
  }, [deviceType, selectedKey]);

  return (
    <>
      <Toaster />
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="h-[100dvh] overflow-auto relative bg-white"
          collapsedWidth={deviceType === "mobile" ? 0 : 70}
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
            className="h-fit"
          />
        </Sider>
        <Button
          style={{
            left: collapsed ? (deviceType === "mobile" ? -1 : 69) : 199,
          }}
          icon={collapsed ? <RiMenuFold2Fill /> : <RiMenuUnfold2Fill />}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-2 w-12 z-50 rounded-none border-l-0 opacity-60"
        />

        <Layout>
          <Content>
            <div className="p-4 h-[100dvh]">{menuItems[selectedKey]}</div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
