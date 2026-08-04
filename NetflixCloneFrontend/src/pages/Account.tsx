import { Link, useNavigate } from "react-router-dom";
import "./WhosWatching.css";

function Account() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="whos-watching-page">
      <h1 className="whos-watching-title">Account</h1>

      <div style={{ maxWidth: "500px", width: "100%", color: "white" }}>
        <div style={{ background: "#181818", padding: "24px", borderRadius: "6px", marginBottom: "20px" }}>
          <p style={{ color: "#737373", fontSize: "0.85rem", marginBottom: "6px" }}>Name</p>
          <p style={{ fontSize: "1.1rem" }}>{user.name}</p>
        </div>

        <div style={{ background: "#181818", padding: "24px", borderRadius: "6px", marginBottom: "20px" }}>
          <p style={{ color: "#737373", fontSize: "0.85rem", marginBottom: "6px" }}>Email</p>
          <p style={{ fontSize: "1.1rem" }}>{user.email}</p>
        </div>

        <div style={{ background: "#181818", padding: "24px", borderRadius: "6px", marginBottom: "20px" }}>
          <p style={{ color: "#737373", fontSize: "0.85rem", marginBottom: "6px" }}>Password</p>
          <p style={{ fontSize: "1.1rem" }}>••••••••</p>
        </div>
      </div>

      <button className="manage-profiles-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>

      <Link to="/forgot-password" style={{ color: "#b3b3b3", marginTop: "16px", fontSize: "0.9rem" }}>
        Change Password
      </Link>
    </div>
  );
}

export default Account;