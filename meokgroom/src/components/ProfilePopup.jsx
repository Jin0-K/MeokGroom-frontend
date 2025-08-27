// import statements
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const ProfilePopup = ({
  onClose,
  onLogout,
  profileImage,
  currentUser,
  setIsLoggedIn,
  setCurrentUser,
  setProfileImage,
}) => {
  const navigate = useNavigate();
  // Create a ref to attach to the popup's main container element
  const popupRef = useRef(null);

  const handleLogout = async (onLogout) => {
    // ... (rest of the handleLogout function remains the same)
  };

  const handleMyPage = () => {
    onClose();
    navigate("/mypage");
  };

  // Add a useEffect hook to handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred outside the popup element
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // The dependency array ensures the effect re-runs if onClose changes

  return (
    // Attach the ref to the top-level div of your popup
    <div className="profile-popup" ref={popupRef}>
      <div className="user-info-section">
        <div className="user-avatar-container">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="user-avatar" />
          ) : (
            <User size={26} />
          )}
        </div>
        <div className="user-text-info">
          <p className="user-name">{currentUser?.userName || "USER"}</p>
          <p className="user-email">{currentUser?.email || ""}</p>
        </div>
      </div>
      <div className="profile-actions-section">
        <button className="profile-action-btn" onClick={handleMyPage}>
          <span>마이페이지</span>
        </button>
        <button className="profile-action-btn" onClick={handleLogout}>
           <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
