import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SubMenu.css";

function SubMenu({
  item,
  isCollapsed,
  isOpen,
  setOpenMenu,
  onLogout,
  level = 0,
}) {
  const location = useLocation();
  const [openSubNav, setOpenSubNav] = useState(null); // Track open state for nested submenus

  const handleMenuClick = (e) => {
    if (item.subNav) {
      e.preventDefault(); // Prevent navigation
      setOpenMenu(isOpen ? null : item.title); // Toggle the main menu
    }

    if (onLogout && item.title === "Logout") {
      onLogout(e); // Trigger logout
    }
  };

  const handleSubMenuClick = (subItemTitle) => {
    setOpenSubNav(openSubNav === subItemTitle ? null : subItemTitle); // Toggle the submenu
  };

  return (
    <li>
      <Link
        to={item.path === "#" ? "#" : item.path}
        className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
        onClick={handleMenuClick}
      >
        <div
          className={`submenu-item ${level > 0 ? "submenu-nested" : ""}`}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {item.icon}
          {!isCollapsed && <span className="sidebar-label">{item.title}</span>}
        </div>
        {!isCollapsed && item.subNav && (
          <div>{isOpen ? item.iconOpened : item.iconClosed}</div>
        )}
      </Link>

      {/* Render subnav if active */}
      {isOpen &&
        !isCollapsed &&
        item.subNav &&
        item.subNav.map((subItem, index) => (
          <li key={index}>
            <Link
              to={subItem.path === "#" ? "#" : subItem.path}
              className="sidebar-link"
              onClick={(e) => {
                if (subItem.subNav) {
                  e.preventDefault();
                  handleSubMenuClick(subItem.title);
                }
              }}
            >
              <div
                className={`submenu-item ${level > 0 ? "submenu-nested" : ""}`}
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
              >
                {subItem.icon}
                {!isCollapsed && <span className="sidebar-label">{subItem.title}</span>}
              </div>
              {!isCollapsed && subItem.subNav && (
                <div>
                  {openSubNav === subItem.title
                    ? subItem.iconOpened
                    : subItem.iconClosed}
                </div>
              )}
            </Link>

            {/* Nested submenus */}
            {openSubNav === subItem.title &&
              subItem.subNav &&
              subItem.subNav.map((nestedItem, nestedIndex) => (
                <SubMenu
                  key={nestedIndex}
                  item={nestedItem}
                  isCollapsed={isCollapsed}
                  level={level + 2} // Increase nesting level
                />
              ))}
          </li>
        ))}
    </li>
  );
}

export default SubMenu;
