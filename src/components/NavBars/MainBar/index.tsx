import { NavLink, useLocation } from "react-router";
import styled from "styled-components";
import { useAuthContext } from "../../../context/AuthContext";

const locations = [
  { name: "Dashboard", id: "dashboard", href: "/dashboard" },
  { name: "Records", id: "records", href: "/in-out" },
  { name: "Tags", id: "tags", href: "/tags" },
];

const Nav = styled.nav`
  display: flex;
  padding: 0px;
  border-bottom: 2px solid white;
  justify-content: space-between;

  a,
  span {
    padding: 15px 20px;
    color: white;
  }

  [data-active="true"],
  a:hover,
  span:hover {
    color: black;
    background: white;
  }
`;

const MainBar = () => {
  const location = useLocation();
  const { logout } = useAuthContext();
  return (
    <Nav>
      <section style={{ display: "flex" }}>
        {locations.map((item) => {
          return (
            <NavLink
              key={item.id}
              data-active={location.pathname === item.href}
              to={item.href}
            >
              {item.name}
            </NavLink>
          );
        })}
      </section>
      <span id="logout" style={{ alignSelf: "end" }} onClick={logout}>
        logout
      </span>
    </Nav>
  );
};

export default MainBar;
