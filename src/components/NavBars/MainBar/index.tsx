import { NavLink, useLocation } from "react-router";
import styled from "styled-components";

const locations = [
  { name: "Dashboard", id: "dashboard", href: "/dashboard" },
  { name: "Records", id: "records", href: "/in-out" },
  { name: "Tags", id: "tags", href: "/tags" },
];

const Nav = styled.nav`
  display: flex;
  padding: 0px;
  border-bottom: 2px solid white;
  a {
    padding: 15px 20px;
    color: white;
  }
  [data-active="true"],
  a:hover {
    color: black;
    background: white;
  }
`;

const MainBar = () => {
  const location = useLocation();
  return (
    <Nav>
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
    </Nav>
  );
};

export default MainBar;
