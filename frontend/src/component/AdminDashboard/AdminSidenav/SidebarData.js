import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { AiOutlineUser } from "react-icons/ai";

export const SidebarData = [
  {
    title: "Admin DashBoard",
    path: "/adminDashboard",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    // subNav: [
    //   {
    //     title: "Users",
    //     path: "/overview/users",
    //     icon: <IoIcons.IoIosPeople />, // Users icon
    //   },
    //   {
    //     title: "Revenue",
    //     path: "/overview/revenue",
    //     icon: <FaIcons.FaDollarSign />, // Dollar sign icon for revenue
    //   },
    // ],
  },

  
  {
    title: "Sales",
    path: "#", // No direct link
    icon: <IoIcons.IoIosPeople />, // Admin icon
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/admindashboard/addsales",
        icon: <FaIcons.FaUserPlus />,
        className: "submenu-item",
      },
      {
        title: "View",
        path: "/admindashboard/salesList/:adminId",
        icon: <IoIcons.IoIosEye />,
        className: "submenu-item",
      },
      // {
      //   title: "Edit",
      //   path: "/SuperAdminDashboard/EditAdmin",
      //   icon: <FaIcons.FaUserEdit />, // Edit icon
      // },
    ],
  },
  {
    title: "Leads",
    path: "#", // No direct link
    icon: <IoIcons.IoIosPeople />, // Admin icon
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      // {
      //   title: "Add",
      //   path: "/AdminDashboard/Users/AddUsers",
      //   icon: <FaIcons.FaUserPlus />, // Plus icon for adding
      // },
      {
        title: "View",
        path: "/AdminDashboard/Users/ListUsers",
        icon: <IoIcons.IoIosEye />, 
        className: "submenu-item",
      },
      // {
      //   title: "Edit",
      //   path: "/SuperAdminDashboard/editadmin",
      //   icon: <FaIcons.FaUserEdit />, // Edit icon
      // },
    ],
  },
  {
    title: "Products",
   // path: "/",
    icon: <FaIcons.FaBoxOpen />, // Box icon for products
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "View",
        path: "/admindashboard/ProductsList",
        icon: <FaIcons.FaEye />, 
        className: "submenu-item",
      },
    ],
  },
  {
    title: "Profile",
    path: "/admindashboard/Profiles",
    icon: <AiOutlineUser/>, // Logout icon
},
  {
    title: "Logout",
    path: "/login",
    icon: <IoIcons.IoMdLogOut />,
  },
];
