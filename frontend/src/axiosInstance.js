import axios from "axios";

const axiosInstance = axios.create({
  baseURL: '${process.env.REACT_APP_API_URL}', 
  headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("jwt")
    
  }
});

export default axiosInstance;
