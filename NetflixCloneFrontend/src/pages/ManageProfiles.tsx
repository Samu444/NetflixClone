import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Profile } from "../types/Profile";
import "./WhosWatching.css";
import "./ManageProfiles.css";

const AVATAR_SEEDS = ["Felix", "Aneka", "Milo", "Zara", "Leo", "Nova", "Kofi", "Amara"];

function ManageProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(AVATAR_SEEDS[0]);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const loadProfiles = () => {
    fetch("http://localhost:5145/api/profiles", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data));
  };

  useEffect(() => {
    loadProfiles();

    const state = location.state as { editProfile?: Profile; addNew?: boolean } | null;
    if (state?.editProfile) {
      setEditingId(state.editProfile.id);
      setName(state.editProfile.name);
      setAvatarSeed(state.editProfile.avatarSeed);
    } else if (state?.addNew) {
      setIsNew(true);
      setName("");
      setAvatarSeed(AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)]);
    }
  }, []);

  const avatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }

    if (isNew) {
      const response = await fetch("http://localhost:5145/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatarSeed, isKids: false }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to create profile.");
        return;
      }
    } else if (editingId) {
      const response = await fetch(`http://localhost:5145/api/profiles/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatarSeed }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to update profile.");
        return;
      }
    }

    resetForm();
    loadProfiles();
  };

  const handleDelete = async () => {
    if (!editingId) return;

    const response = await fetch(`http://localhost:5145/api/profiles/${editingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const text = await response.text();
      setError(text || "Failed to delete profile.");
      return;
    }

    resetForm();
    loadProfiles();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsNew(false);
    setName("");
    setError("");
  };

  const showForm = isNew || editingId !== null;

  return (
    <div className="whos-watching-page">
      <h1 className="whos-watching-title">
        {showForm ? (isNew ? "Add Profile" : "Edit Profile") : "Manage Profiles"}
      </h1>

      {!showForm ? (
        <>
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="profile-tile editing"
                onClick={() => {
                  setEditingId(profile.id);
                  setName(profile.name);
                  setAvatarSeed(profile.avatarSeed);
                }}
              >
                <div className="profile-avatar-wrapper">
                  <img src={avatarUrl(profile.avatarSeed)} alt={profile.name} />
                  <div className="profile-edit-overlay">✎</div>
                </div>
                <p className="profile-name">{profile.name}</p>
              </div>
            ))}

            {profiles.length < 5 && (
              <div
                className="profile-tile add-profile"
                onClick={() => {
                  setIsNew(true);
                  setAvatarSeed(AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)]);
                }}
              >
                <div className="profile-avatar-wrapper add-avatar">+</div>
                <p className="profile-name">Add Profile</p>
              </div>
            )}
          </div>

          <button className="manage-profiles-btn" onClick={() => navigate("/whos-watching")}>
            Done
          </button>
        </>
      ) : (
        <div className="profile-form">
          <img className="profile-form-avatar" src={avatarUrl(avatarSeed)} alt="Preview" />

          <div className="avatar-picker">
            {AVATAR_SEEDS.map((seed) => (
              <img
                key={seed}
                src={avatarUrl(seed)}
                alt={seed}
                className={`avatar-option ${avatarSeed === seed ? "selected" : ""}`}
                onClick={() => setAvatarSeed(seed)}
              />
            ))}
          </div>

          {error && <p className="profile-form-error">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-form-input"
            maxLength={20}
          />

          <div className="profile-form-actions">
            <button className="profile-save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="profile-cancel-btn" onClick={resetForm}>
              Cancel
            </button>
            {editingId && !isNew && (
              <button className="profile-delete-btn" onClick={handleDelete}>
                Delete Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProfiles;