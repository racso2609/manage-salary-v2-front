import { NavLink, useLocation } from "react-router";
import styled from "styled-components";
import { useAuthContext } from "../../../context/AuthContext";
import { useThemeToggle } from "../../../stores/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const locations = [
  { name: "Dashboard", id: "dashboard", href: "/dashboard" },
  { name: "Records", id: "records", href: "/in-out" },
  { name: "Tags", id: "tags", href: "/tags" },
  { name: "Settings", id: "settings", href: "/settings" },
];

const Nav = styled.nav`
  display: flex;
  padding: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.text};
  justify-content: space-between;

  a,
  span {
    padding: 15px 20px;
    color: ${({ theme }) => theme.colors.text};
  }

  [data-active="true"],
  a:hover,
  span:hover {
    color: ${({ theme }) => theme.colors.background};
    background: ${({ theme }) => theme.colors.text};
  }
`;

const ThemeToggle = styled.span`
  cursor: pointer;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainBar = () => {
  const location = useLocation();
  const { logout } = useAuthContext();
  const { themeMode, toggleTheme } = useThemeToggle();
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
      <section style={{ display: "flex", alignItems: "center" }}>
        <ThemeToggle onClick={toggleTheme}>
          <FontAwesomeIcon icon={themeMode === 'dark' ? faSun : faMoon} />
        </ThemeToggle>
        <span id="logout" style={{ alignSelf: "end" }} onClick={logout}>
          logout
        </span>
      </section>
    </Nav>
  );
};

export default MainBar;
