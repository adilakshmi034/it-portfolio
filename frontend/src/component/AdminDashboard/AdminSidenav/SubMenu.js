import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SubMenu.css';

function SubMenu({ item, isCollapsed, currentOpenMenu, setCurrentOpenMenu, onLogout, level = 0 }) {
  const location = useLocation();
  const isActive = currentOpenMenu === item.title; // Check if this menu is active

  const handleClick = (e) => {
    if (item.subNav) {
      e.preventDefault();
      if (isActive) {
        setCurrentOpenMenu(null); // Close if already open
      } else {
        setCurrentOpenMenu(item.title); // Open this menu
      }
    }
    if (onLogout && item.title === "Logout") {
      onLogout(e);
    }
  };

  return (
    <li>
      <Link
        to={item.path === "#" ? "#" : item.path}
        className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
        onClick={handleClick}
      >
        <div
          className={`submenu-item ${level > 0 ? "submenu-nested" : ""}`}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {item.icon}
          {!isCollapsed && <span className="sidebar-label">{item.title}</span>}
        </div>
        {!isCollapsed && item.subNav && (
          <div>{isActive ? item.iconOpened : item.iconClosed}</div>
        )}
      </Link>

      {/* Render subnav if active */}
      {isActive &&
        !isCollapsed &&
        item.subNav &&
        item.subNav.map((subItem, index) => (
          <SubMenu
            item={subItem}
            key={index}
            isCollapsed={isCollapsed}
            currentOpenMenu={currentOpenMenu}
            setCurrentOpenMenu={setCurrentOpenMenu}
            level={level + 1} // Increase level for nested menus
          />
        ))}
    </li>
  );
}

export default SubMenu;