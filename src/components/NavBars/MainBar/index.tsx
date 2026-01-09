import { NavLink, useLocation } from "react-router";
import styled from "styled-components";
import { useAuthContext } from "../../../context/AuthContext";
import { useThemeToggle } from "../../../stores/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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
  position: relative;

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

  @media (max-width: 768px) {
    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: ${({ theme }) => theme.colors.surface};
      border-bottom: 2px solid ${({ theme }) => theme.colors.text};
      z-index: 1000;

      &.open {
        display: flex;
      }

      a,
      span {
        padding: 12px 20px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
      }
    }

    .nav-actions {
      span {
        padding: 12px 16px;
      }
    }

    .hamburger {
      display: flex;
      padding: 12px 16px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ThemeToggle = styled.span`
  cursor: pointer;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HamburgerButton = styled.span`
  display: none;
  cursor: pointer;
  padding: 15px 20px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MainBar = () => {
  const location = useLocation();
  const { logout } = useAuthContext();
  const { themeMode, toggleTheme } = useThemeToggle();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Nav>
      <section className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        {locations.map((item) => {
          return (
            <NavLink
              key={item.id}
              data-active={location.pathname === item.href}
              to={item.href}
              onClick={closeMobileMenu}
            >
              {item.name}
            </NavLink>
          );
        })}
      </section>

      <section style={{ display: "flex", alignItems: "center" }}>
        <HamburgerButton onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </HamburgerButton>
        <div className="nav-actions">
          <ThemeToggle onClick={toggleTheme}>
            <FontAwesomeIcon icon={themeMode === 'dark' ? faSun : faMoon} />
          </ThemeToggle>
          <span id="logout" onClick={logout}>
            logout
          </span>
        </div>
      </section>
    </Nav>
  );
};

export default MainBar;
