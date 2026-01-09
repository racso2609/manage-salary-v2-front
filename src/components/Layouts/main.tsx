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
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
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
