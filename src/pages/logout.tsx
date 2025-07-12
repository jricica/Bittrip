import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:3001/api/logout', { method: 'POST' }).finally(() => {
      navigate('/login');
    });
  }, [navigate]);

  return null;
}
