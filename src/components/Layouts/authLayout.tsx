import { FC, PropsWithChildren } from "react";
import { Layout as MainLayout } from "./main";
import { Outlet } from "react-router";

type AuthLayout = PropsWithChildren;

const AuthLayout: FC<AuthLayout> = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AuthLayout;
