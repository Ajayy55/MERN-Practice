import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NormalizeUrl() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith("/") && location.pathname !== "/") {
      navigate(location.pathname.slice(0, -1), { replace: true });
      console.log('runnn');
      
    }
  }, [location, navigate]);

  return null;
}

export default NormalizeUrl;
