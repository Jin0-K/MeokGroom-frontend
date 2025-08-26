// import statements
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import ProfilePopup from "../components/ProfilePopup";

function NewPostPage({ isLoggedIn, profileImage, onAddPost, currentUser, onLogout }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const categories = ["동물/반려동물", "여행", "건강/헬스", "연예인"];

  const handleComplete = async () => {
    if (!title || !content || !selectedCategory) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }
    const newPost = {
      title,
      content,
      category: selectedCategory,
      userName: currentUser?.userName,
    };
    try {
      const response = await fetch("http://localhost:8082/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        alert("게시물 작성이 완료되었습니다.");
        const createdPost = await response.json();
        onAddPost(createdPost);
        navigate("/");
      } else {
        alert("게시물 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시물 작성 중 오류 발생:", error);
      alert("게시물 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="newpost-page">
      <div className="sidebar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="category-section">
          <h3 className="category-title">카테고리</h3>
          <ul className="category-list">
            <li>
              <button
                className={`category-btn ${
                  !selectedCategory ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("")}
              >
                전체
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={`category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main-content-area">
        <header className="main-header">
          <div /* className="search-bar-container" */></div>
          <div className="header-actions">
            {isLoggedIn ? (
              <div className="profile-container">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfilePopup((v) => !v)}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User />
                  )}
                </button>
                  {showProfilePopup && (
                    <ProfilePopup
                      onClose={() => setShowProfilePopup(false)}
                      onLogout={onLogout}
                      profileImage={profileImage}
                      currentUser={currentUser}
                    />
                  )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                로그인
              </Link>
            )}
          </div>
        </header>

        <div className="newpost-container">
          <div className="newpost-title-section">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="newpost-title-input"
            />
          </div>
          <div className="post-content-section">
            <textarea
              placeholder="내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-content-textarea"
            />
          </div>
          <div className="post-tags">
            {categories.map((category) => (
              <button
                key={category}
                className={`tag-button ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="newpost-action-btns">
            <button className="newpost-cancel-btn" onClick={() => navigate("/")}>
              취소
            </button>
            <button className="newpost-complete-btn" onClick={handleComplete}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
