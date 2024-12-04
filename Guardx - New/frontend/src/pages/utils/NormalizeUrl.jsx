import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NormalizeUrl = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Original path and search params
    const originalPath = location.pathname;
    const originalSearch = location.search;

    // Normalize the path
    let normalizedPath = originalPath;
    
    // Remove trailing slash (except root path "/")
    if (normalizedPath !== "/" && normalizedPath.endsWith("/")) {
        normalizedPath = normalizedPath.slice(0, -1);
        navigate(-1);
    }

    // Convert to lowercase (optional, if needed)
    if (normalizedPath !== normalizedPath.toLowerCase()) {
      normalizedPath = normalizedPath.toLowerCase();
    }

    // Redirect only if the normalized path differs from the original
    if (originalPath !== normalizedPath) {
      navigate(normalizedPath + originalSearch, { replace: true });
    }
  }, [location, navigate]);

  return null; // This component has no visible output
};

export default NormalizeUrl;
