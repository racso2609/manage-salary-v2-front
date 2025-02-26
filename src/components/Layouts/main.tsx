import styled from "styled-components";
import { Outlet } from "react-router";
import { FC } from "react";
import MainBar from "../NavBars/MainBar";

export const Layout = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: calc(100vw);
  height: calc(100vh - 60px);
`;

const MainLayout: FC = () => {
  return (
    <>
      <MainBar />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};

export default MainLayout;
