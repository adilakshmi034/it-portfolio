import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa"; // Font Awesome icons
import * as IoIcons from "react-icons/io"; // Ionicons
import * as RiIcons from "react-icons/ri"; // Remix icons
import { AiOutlineUser } from "react-icons/ai";

export const SidebarData = [
  {
    title: "Sales DashBoard",
    path: "/salesdashboard",
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
    //     icon: <FaIcons.FaDollarSign />, 
    //   },
    // ],
  },
 
 
  
  {
    title: "Leads",
    path: "#",
    icon: <IoIcons.IoIosPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/salesdashboard/addlead",
        icon: <FaIcons.FaUserPlus />,
        className: "submenu-item",
      },
      {
        title: "View",
        path: "/salesdashboard/leadslist",
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
    icon: <FaIcons.FaBoxOpen />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "View",
        path: "/salesdashboard/ProductView",
        icon: <FaIcons.FaEye />,
        className: "submenu-item",
      },
    ],
  },
  {
    title: "Profile",
    path: "/salesdashboard/Profiles",
    icon: <AiOutlineUser/>, // Logout icon
},
  {
    title: "Logout",
    path: "/Login",
    icon: <IoIcons.IoMdLogOut />,
  },
];