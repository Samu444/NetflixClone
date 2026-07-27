import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profile } from "../types/Profile";
import "./WhosWatching.css";

function WhosWatching() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [manageMode, setManageMode] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5145/api/profiles", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .finally(() => setLoading(false));
  }, [token]);

  const selectProfile = (profile: Profile) => {
    if (manageMode) {
      navigate("/manage-profiles", { state: { editProfile: profile } });
      return;
    }
    localStorage.setItem("activeProfile", JSON.stringify(profile));
    navigate("/home");
  };

  const avatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

  if (loading) {
    return (
      <div className="whos-watching-page">
        <p className="whos-watching-loading">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="whos-watching-page">
      <h1 className="whos-watching-title">Who's Watching?</h1>

      <div className="profiles-grid">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`profile-tile ${manageMode ? "editing" : ""}`}
            onClick={() => selectProfile(profile)}
          >
            <div className="profile-avatar-wrapper">
              <img src={avatarUrl(profile.avatarSeed)} alt={profile.name} />
              {manageMode && (
                <div className="profile-edit-overlay">✎</div>
              )}
            </div>
            <p className="profile-name">{profile.name}</p>
          </div>
        ))}

        {profiles.length < 5 && (
          <div
            className="profile-tile add-profile"
            onClick={() => navigate("/manage-profiles", { state: { addNew: true } })}
          >
            <div className="profile-avatar-wrapper add-avatar">+</div>
            <p className="profile-name">Add Profile</p>
          </div>
        )}
      </div>

      <button
        className="manage-profiles-btn"
        onClick={() => setManageMode(!manageMode)}
      >
        {manageMode ? "Done" : "Manage Profiles"}
      </button>
    </div>
  );
}

export default WhosWatching;