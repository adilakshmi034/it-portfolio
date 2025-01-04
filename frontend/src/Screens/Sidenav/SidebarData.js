import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa"; // Font Awesome icons
import * as IoIcons from "react-icons/io"; // Ionicons
import * as RiIcons from "react-icons/ri"; // Remix icons
import { AiOutlineUser } from "react-icons/ai";

export const SidebarData = [
  {
    title: "SuperAdmin DashBoard",
    path: "/SuperAdminDashboard",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Admin",
    path: "#", 
    icon: <IoIcons.IoIosPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/SuperAdminDashboard/addadmin",
        icon: <FaIcons.FaUserPlus />,
        className: "submenu-item",
      },
      {
        title: "View",
        path: "/SuperAdminDashboard/adminlist",
        icon: <IoIcons.IoIosEye />,
        className: "submenu-item",
      },
    ],
  },
 
  {
    title: "Sales",
    path: "#", 
    icon: <IoIcons.IoIosPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/SuperAdminDashboard/addsale",
        icon: <FaIcons.FaUserPlus />,
        className: "submenu-item",
      },
      {
        title: "View",
        path: "/SuperAdminDashboard/saleslist",
        icon: <IoIcons.IoIosEye />,
        className: "submenu-item",
      },
    ],
  },
  {
    title: "Leads",
    path: "#", // No direct link
    icon: <IoIcons.IoIosPeople />, // Admin icon
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "View",
        path: "/SuperAdminDashboard/userlist",
        icon: <IoIcons.IoIosEye />,
        className: "submenu-item",
      },
    ],
  },
  {
    title: "Categories",
    // path: "/",
    icon: <FaIcons.FaBoxOpen />, // Box icon for products
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add ",
        path: "/SuperAdminDashboard/addcategory",
        icon: <FaIcons.FaPlusCircle />,
        className: "submenu-item",
      },
      {
        title: "View ",
        path: "/SuperAdminDashboard/categorylist",
        icon: <FaIcons.FaEye />,
        className: "submenu-item",
      },
      {
        title: "SubCategories", // Nested categories under Products
        icon: <FaIcons.FaTags />, // Icon for categories
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        className: "submenu-item",
        subNav: [
          {
            title: "Add",
            path: "/SuperAdminDashboard/addsubcategory",
            icon: <FaIcons.FaPlusCircle />,
            className: "submenu-item",
          },
        ],
      },
    ],
  },
  {
    title: "Products", // Nested categories under Products
    icon: <FaIcons.FaTags />, // Icon for categories
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/SuperAdminDashboard/addproduct",
        icon: <FaIcons.FaPlusCircle />,
        className: "submenu-item",
      },
      {
        title: "View",
        path: "/SuperAdminDashboard/productlist",
        icon: <FaIcons.FaEye />,
        className: "submenu-item",
      },
    ],
  },
  {
    title: "Profile",
    path: "/superadmindashboard/Profiles",
    icon: <AiOutlineUser/>, // Logout icon
},
  {
    title: "Logout",
    path: "/Login",
    icon: <IoIcons.IoMdLogOut />, // Logout icon
},
];
