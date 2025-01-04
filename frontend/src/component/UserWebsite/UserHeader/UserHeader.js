import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Nav,
  Button,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LOGOFULL from "../../../assets/IT Portfolio copy (1).jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserCircle,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Userheader.css";

const Header = ({
  onSoftwareClick,
  activeCategory,
  setSearchQuery,
  onNewArrivalProductClick,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQueryState] = useState("");
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedFullName = localStorage.getItem("fullName") || "";
    const storedRole = localStorage.getItem("role"); // Fetch role

    setIsLoggedIn(loggedInStatus); // Update state based on the corrected condition
    setFullName(storedFullName);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/products/get/all`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQueryState(query);
    setSearchQuery(query); // Update the parent state

    if (query.trim()) {
      // Filter products based on the search query
      const filtered = products.filter(
        (product) =>
          product.productName &&
          product.productName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSuggestionsVisible(true); // Show suggestions
    } else {
      setFilteredProducts([]); // Clear suggestions if query is empty
      setIsSuggestionsVisible(false); // Hide suggestions if no query
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQueryState(product.productName);
    setSearchQuery(product.productName);
    setFilteredProducts([]); // Clear suggestions
  
    // Hide suggestions when a suggestion is clicked
    setIsSuggestionsVisible(false);
  
    // Navigate to UserWebsite with search query in state
    navigate("/UserWebsite", { state: { searchQuery: product.productName } });
  };

  // Handle keydown event (preventing search from submitting on Enter)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSuggestionsVisible(false); // Hide suggestions when Enter is pressed
  
      if (searchQuery.trim()) {
        // Explicit search: Navigate to UserWebsite with the typed query
        navigate("/UserWebsite", { state: { searchQuery } });
      }
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery) {
      setIsSuggestionsVisible(false);
    }
  };

  // Logout function with confirmation
  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("fullName");
        localStorage.removeItem("role");
        localStorage.removeItem("sales_id");
        localStorage.removeItem("admin_Id");
        setIsLoggedIn(false);
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully.",
          icon: "success",
          showConfirmButton: false, // Hides the "OK" button
          timer: 1000, // Closes the alert after 2 seconds
        });
      }
    });
  };

  // Login redirection
  const handleLogin = () => {
    navigate("/Login");
  };

  const navigateBasedOnRole = () => {
    const role = localStorage.getItem("role");
    switch (role) {
      case "ROLE_SUPERADMIN":
        navigate("/SuperAdminDashboard");
        break;
      case "ROLE_ADMIN":
        navigate("/AdminDashboard");
        break;
      case "ROLE_SALES":
        navigate("/SalesDashboard");
        break;
      default:
        navigate("/UserDashboard");
        break;
    }
  };

  // Toggle the side menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Route to Software page
  const handleSoftwareClick = () => {
    if (typeof onSoftwareClick === "function") {
      onSoftwareClick();
    }
    navigate("/UserWebsite");
  };

  // Route to New Arrival page
  const handleNewArrivalClick = () => {
    if (typeof onNewArrivalProductClick === "function") {
      onNewArrivalProductClick();
    }
    navigate("/NewArrivalProduct");
  };

  // Render the search bar with suggestions
  const renderSearchBar = () => (
    <Form className="d-flex align-items-center w-100">
      <div className="position-relative w-100">
        <FormControl
          type="search"
          placeholder="Search products"
          className="form-control ps-5 SearchBar rounded-search"
          aria-label="Search"
          onChange={handleSearchChange}
          value={searchQuery}
          onKeyDown={handleKeyDown}
        />
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
  
      {isSuggestionsVisible && searchQuery && (
        <div className="suggestions">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(product)}
              >
                {product.productName}
              </div>
            ))
          ) : (
            <div className="no-matched-products">No matched products</div>
          )}
        </div>
      )}
    </Form>
  );
  
  return (
    <Navbar bg="light" expand="lg" className="NavbarWebsite shadow-navbar py-0">
      <Container fluid className="d-block px-0">
        <Row className="align-items-center w-100 pt-3 m-auto">
          <Col
            xs={2}
            className="d-flex justify-content-start d-lg-none d-md-none d-block hamburger-menu"
          >
            <FontAwesomeIcon
              icon={faBars}
              className="hamburger-icon d-md-none d-xl-none d-xxl-none"
              onClick={toggleMenu}
            />
          </Col>

          <Col xs={8} md={4} lg={4} className="text-center">
            <Navbar.Brand href="/">
              <img
                src={LOGOFULL}
                alt="Logo"
                style={{ width: "100px", height: "50px" }}
              />
            </Navbar.Brand>
          </Col>

          <Col
            xs={12}
            md={4}
            lg={4}
            className="my-2 my-md-0 text-center Searchbar"
          >
            {renderSearchBar()}
          </Col>

          <Col
            xs={2}
            md={4}
            lg={4}
            className="text-center d-flex justify-content-center"
          >
            <Nav className="justify-content-end">
              {isLoggedIn ? (
                <>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-profile"
                      className="d-flex align-items-center no-border profile-icon"
                    >
                      {localStorage.getItem("profileImage") ? (
                        <img
                          src={`data:image/jpeg;base64,${localStorage.getItem("profileImage")}`}
                          alt="Profile"
                          className="rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUserCircle} className="fs-4" />
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                      <Dropdown.ItemText>{fullName}</Dropdown.ItemText>
                      <Dropdown.Item
                        onClick={handleLogout}
                        className="d-flex align-items-center"
                      >
                        <FontAwesomeIcon
                          icon={faSignOutAlt}
                          className="me-2 text-danger"
                        />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Button className="loginIcons" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </Nav>
          </Col>
        </Row>

        <Row className="w-100 justify-content-start align-items-center bg-black category-links mt-2 mx-0 ">
          <Col xs="auto">
            <Button
              variant="link"
              className={`category-link ${
                activeCategory === "Software" ? "active-category" : ""
              }`}
              onClick={handleSoftwareClick}
            >
              Software
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="link"
              className={`category-link ${
                activeCategory === "NewArrival" ? "active-category" : ""
              }`}
              onClick={handleNewArrivalClick}
            >
              New Arrival
            </Button>
          </Col>
          {/* Dashboard Button placed beside New Arrival */}
          <Col xs="auto">
            {isLoggedIn ? (
              <Button
                variant="link"
                onClick={navigateBasedOnRole}
                className="category-link"
              >
                Dashboard
              </Button>
            ) : null}
          </Col>
        </Row>

        <div className={`navbar-menu ${menuOpen ? "show" : ""}`}>
          <Nav className="flex-column align-items-center">
            {renderSearchBar()}
            <Button
              variant="link"
              className="category-link"
              onClick={handleSoftwareClick}
            >
              Software
            </Button>
            <Button
              variant="link"
              className="category-link"
              onClick={handleNewArrivalClick}
            >
              New Arrivals
            </Button>
            {/* Dashboard Button placed beside New Arrival */}
            <Col xs="auto">
              {isLoggedIn ? (
                <Button
                  variant="link"
                  onClick={navigateBasedOnRole}
                  className="category-link"
                >
                  Dashboard
                </Button>
              ) : null}
            </Col>
            {isLoggedIn ? (
              <Button
                className="loginIcon full-width-button"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                className="loginIcon full-width-button"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
