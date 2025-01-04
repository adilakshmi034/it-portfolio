// src/MainRoute.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Screens/Login/Login";
import Home from "./Screens/Home/Home";
import Footer from "./component/UserWebsite/Footer/Footer.js"
import SuperAdminDashboard from "./component/SuperAdminDashboard/SuperAdminDashboard";
import AddAdmin from "./component/SuperAdminDashboard/AddAdmin/AddAdmin";
import AdminList from "./component/SuperAdminDashboard/AdminList/AdminList";
import AddProduct from "./component/SuperAdminDashboard/AddProduct/AddProduct";
import ProductList from "./component/SuperAdminDashboard/ProductList/ProductList";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import AddSale from "./component/SuperAdminDashboard/AddSale/AddSale";
import SalesList from "./component/SuperAdminDashboard/SalesList/SalesList";
import AddUser from "./component/SuperAdminDashboard/AddUser/AddUser";
import SalesDashboard from "./component/SalesDashboadrd/SalesDashboard";
import AddLead from "./component/SalesDashboadrd/AddLeads/AddLead";
import LeadsList from "./component/SalesDashboadrd/LeadsList/LeadsList";
import EditAdmin from "./component/SuperAdminDashboard/EditAdmin/EditAdmin";
import AddSales from "./component/AdminDashboard/AddSales/AddSales";
import SalesByAdmin from "./component/AdminDashboard/SalesList/SalesByAdmin";
import EditSale from "./component/SuperAdminDashboard/EditSale/EditSale";
import EditSaleByAdmin from "./component/AdminDashboard/EditSale/EditSaleByAdmin";
import ForgotPassword from "./Screens/ForgotPassword/ForgotPassword";
import AddCategory from "./component/SuperAdminDashboard/Categories/AddCategory/AddCategory";
import CategoryList from "./component/SuperAdminDashboard/Categories/ViewCategory/CategoryList.js";
import UsersList from "./component/SuperAdminDashboard/UsersList/UsersList.js";
import EditCategory from "./component/SuperAdminDashboard/Categories/EditCategory/EditCategory.js";
import EditProduct from "./component/SuperAdminDashboard/EditProduct/EditProduct.js";
import DashboardGraphs from "./component/SuperAdminDashboard/DashboardGraphs";
import AddUsers from "./component/AdminDashboard/Users/AddUsers/AddUsers.js";
import ListUsers from "./component/AdminDashboard/Users/ListUsers/ListUsers.js";
import ProductView from "./component/SalesDashboadrd/ProductView/ProductView.js";
import ProductsList from "./component/AdminDashboard/Products/ProductsList/ProductsList.js";
import EditLead from "./component/SalesDashboadrd/EditLead/EditLead.js";
import EditLeads from "./component/SuperAdminDashboard/EditLeads/EditLeads.js";
import AdminEditLeads from "./component/AdminDashboard/AdminEditLeads/AdminEditLeads.js";
import UserWebsite from "./component/UserWebsite/UserWebsite.js";
// import MainPage from "./component/UserWebsite/MainPage/MainPage.js";
import AddSubCategory from "./component/SuperAdminDashboard/Categories/SubCategory/AddSubCategory/AddSubCategory.js";
import SubCategoryList from "./component/SuperAdminDashboard/Categories/SubCategory/SubCategoryByCategory/SubCategoryList.js";
import EditSubCategory from "./component/SuperAdminDashboard/Categories/SubCategory/EditSubCategory/EditSubCategory.js";
import ProductsBySubCategory from "./component/SuperAdminDashboard/ProductsBySubCategory/ProductsBySubCategory.js";
import AssignRole from "./component/SuperAdminDashboard/AssignRole/AssignRole.js";
import RoleAddSuccess from "./component/SuperAdminDashboard/AssignRole/RoleAddSuccess/RoleAddSuccess.js";
import ProductRoles from "./component/SuperAdminDashboard/ProductRoles/ProductRoles.js";
import EditRole from "./component/SuperAdminDashboard/EditRole/EditRole.js";
import LoginUser from "./component/UserWebsite/LoginPage/LoginPage.js";
import AddProductDetails from "./component/SuperAdminDashboard/AddProductDetails/AddProductDetails.js"
import EditProductDetails from "./component/SuperAdminDashboard/EditProductDetails/EditProductDetails.js";
import ViewProductDetails from "./component/SuperAdminDashboard/ViewProductDetails/ViewProductDetails.js";
import ProductDetails from "./component/UserWebsite/ProductDetail/ProductDetail.js";
import ProductRole from "./component/UserWebsite/ProductRole/ProductRole.js";
import NewArrivalProduct from "./component/UserWebsite/NewArrivalProducts/NewArrivalProduct.js";
import LandingPage from "./component/UserWebsite/LandingPage/LandingPage.js";
import AdminDashboardGraph from "./component/AdminDashboard/AdminDashboardGraph.js";
import SalesDashboardGraph from "./component/SalesDashboadrd/SalesDashboardGraph.js";
import MainPages from "./component/UserWebsite/MainPages.js";
import SalesByAdmins from "./component/SuperAdminDashboard/SalesByAdmins.js";
import Profiles from "./Screens/Profiles/Profiles.js";
import EditLeadBySuperadmin from "./component/SalesDashboadrd/EditLead/EditLead.js";
const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        

        
        <Route path="/superadmindashboard" element={<SuperAdminDashboard />}>
          <Route index element={<DashboardGraphs />} />
          {/* <Route path="Profile" element={<Profile />} /> */}
          <Route path="Profiles" element={<Profiles />}/>
          <Route path="addadmin" element={<AddAdmin />} />
          <Route path="adminlist" element={<AdminList />} />
          <Route path="editadmin/:id" element={<EditAdmin />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="addsale" element={<AddSale />} />
          <Route path="saleslist" element={<SalesList />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="editsale/:id" element={<EditSale />} />
          <Route path="userlist" element={<UsersList />} />
          <Route path="addcategory" element={<AddCategory />} />
          <Route path="categorylist" element={<CategoryList />} />
          <Route path="productsbysubcategory/:subCategoryId" element={<ProductsBySubCategory />} />
          <Route path="EditLeads/:id" element={<EditLeads/>}/>
          <Route path="editcategory/:id" element={<EditCategory />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
          <Route path="addsubcategory" element={<AddSubCategory />} />
          <Route path="subcategorylist/:categoryId" element={<SubCategoryList />} />
          <Route path="editsubcategory/:id" element={<EditSubCategory/>} />
          <Route path="/superadmindashboard/assignrole/:productId" element={<AssignRole/>} />
          <Route path="/superadmindashboard/assignrole/role-add-success" element={<RoleAddSuccess />} />
          <Route path="product/:productId" element={<ProductRoles />} />
          <Route path="/superadmindashboard/EditRole/:roleId" element={<EditRole />} />
          <Route path="/superadmindashboard/AddProductDetails/:id" element={<AddProductDetails />} />
          <Route path="/superadmindashboard/EditProductDetails/:id" element={<EditProductDetails />} />
          <Route path="/superadmindashboard/ViewProductDetails/:id" element={<ViewProductDetails />} />
          {/* <Route path="/superadmindashboard/editsale/:id" element={<EditSaleByAdmin/>}/> */}
          <Route path="/superadmindashboard/salesList/:adminId" element={<SalesByAdmins />}/>
        </Route>

        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardGraph />} />
          <Route path="Profiles" element={<Profiles />}/>
          {/* <Route path="Profile" element={<Profile />} /> */}
          <Route path="/admindashboard/addsales" element={<AddSales />}/>
          <Route path="/admindashboard/salesList/:adminId" element={<SalesByAdmin />}/>
          <Route path="/admindashboard/editsale/:id" element={<EditSaleByAdmin/>}/>
          <Route path="/admindashboard/Users/AddUsers" element={<AddUsers/>} />
          <Route path="/admindashboard/Users/ListUsers" element={<ListUsers/>}/>
          <Route path="/admindashboard/productsList" element={<ProductsList/>}/>
          <Route path="/admindashboard/AdminEditLeads/:id" element={<AdminEditLeads/>}/>
          {/* <Route path="/admindashboard/ListLeads" element={<ListLeads/>}/> */}

        </Route>
        <Route path="/salesdashboard" element={<SalesDashboard />}>
          <Route index element={<SalesDashboardGraph />} />
          {/* <Route path="Profile" element={<Profile />} /> */}
          <Route path="Profiles" element={<Profiles />}/>
          <Route path="/salesdashboard/addlead" element={<AddLead/>}/>
          <Route path="/salesdashboard/leadslist" element={<LeadsList/>}/>
          <Route path="/salesdashboard/ProductView" element={<ProductView/>}/>
          <Route path="/salesdashboard/editlist/:id" element={<EditLead/>}/>
        
          {/* <Route path="/salesdashboard/editlist/:id" element={<EditLead/>}/> */}

        </Route>
        {/* Route for pages that need shared header/footer */}
      <Route element={<MainPages />}>
        <Route index element={<LandingPage />} />
        <Route path="UserWebsite" element={<UserWebsite />} />
        <Route path="NewArrivalProduct" element={<NewArrivalProduct />} />
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
      </Route>
      <Route path="/ProductRole/:productId/roles" element={<ProductRole />} />
    </Routes>
    </div>
  );
};

export default MainRoute;
