import styled from "styled-components";
import { Outlet } from "react-router";
import { FC } from "react";

export const Layout = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100vh;
`;

const MainLayout: FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default MainLayout;
