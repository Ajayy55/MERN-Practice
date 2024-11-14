import axios from "axios";
import { PORT } from "../../port/Port";

export const fetchRolesList = async () => {
  try {
    const admin = localStorage.getItem('user');
    
    // Check if 'user' exists in localStorage
    if (!admin) {
      throw new Error('User not found in localStorage');
    }

    const url = `${PORT}getUserRoles/${admin}`;
    const response = await axios.get(url);

    // If the response is successful, return the data
    return response.data.response;
    
  } catch (error) {
    console.error('Error fetching roles list:', error.message || error);
    return { error: error.message || 'Something went wrong' };
  }
};
