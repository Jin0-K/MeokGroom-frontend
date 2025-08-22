import React, { useState, useEffect } from "react";
import {
  useParams,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import {
  LogOut,
  Lock,
  User,
  Heart,
  MessageCircle,
  ChevronLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";

// ✅ 프로필 이미지 업로드 기능이 추가된 ProfilePopup
const ProfilePopup = ({ onClose, onLogout, profileImage }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // ✅ 저장된 토큰을 헤더에 추가
        },
      });

      if (response.ok) {
        // 백엔드에서 로그아웃 성공을 확인
        alert("로그아웃 되었습니다!");
      } else {
        // 백엔드에서 오류가 발생했더라도 프론트엔드는 로그아웃 처리
        console.error("백엔드 로그아웃 실패");
        alert("로그아웃 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    } finally {
      // ✅ API 호출 성공/실패 여부와 관계없이 프론트엔드 상태 초기화
      localStorage.removeItem("authToken");
      onLogout();
      onClose();
      navigate("/");
    }
  };

  const handleMyPage = () => {
    onClose();
    navigate("/mypage"); // 마이페이지로 이동합니다.
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-200">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User size={26} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">
            {currentUser?.userName || "USER"}
          </p>
          <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <button
          className="flex w-full items-center space-x-2 rounded-lg p-2 text-left text-gray-700 transition hover:bg-gray-100"
          onClick={handleMyPage}
        >
          <User size={20} />
          <span>마이페이지</span>
        </button>
        <button
          className="flex w-full items-center space-x-2 rounded-lg p-2 text-left text-gray-700 transition hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

// 메인보드페이지
function MainBoardPage({
  isLoggedIn,
  onLogout,
  profileImage,
  posts,
  setPosts,
}) {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [newPostContent, setNewPostContent] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const filteredPosts = posts.filter(
    (post) =>
      (activeCategory === "전체" || post.category === activeCategory) &&
      (post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.title &&
          post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const sortedAndFilteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortOrder === "popular") {
      return b.likes - a.likes;
    }
    return b.id - a.id;
  });
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedAndFilteredPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const totalPages = Math.ceil(sortedAndFilteredPosts.length / postsPerPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = ["전체", "동물/반려동물", "여행", "건강/헬스", "연예인"];
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPostContent.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    const newPost = {
      id: uuidv4(), // ✅ 고유 ID 생성
      userName: "USER_A", // ✅ 현재 로그인된 유저
      content: newPostContent,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]); // ✅ 새 게시물을 배열 맨 앞에 추가
    setNewPostContent(""); // ✅ 입력창 초기화
    setIsModalOpen(false); // ✅ 모달 닫기
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  return (
    <div className="main-board-wrapper">
      <div className="main-board-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <Link to="/" className="logo-link">
              ☁️
            </Link>
          </div>
          <div className="category-section">
            <h3 className="category-title">카테고리</h3>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`category-btn ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="main-content-area">
          {/* Header with Search and Profile */}
          <header className="main-header">
            <div className="right-header-wrapper">
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="검색"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
              <div className="header-actions">
                {isLoggedIn ? (
                  <div className="profile-container relative">
                    <button
                      className="profile-btn"
                      onClick={() => setShowProfilePopup(!showProfilePopup)}
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
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/signup" className="signup-btn">
                      회원가입
                    </Link>
                    <Link to="/login" className="login-btn">
                      로그인
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          <div className="sort-buttons">
            <button
              className={`sort-btn ${sortOrder === "latest" ? "active" : ""}`}
              onClick={() => setSortOrder("latest")}
            >
              최신순
            </button>
            <button
              className={`sort-btn ${sortOrder === "popular" ? "active" : ""}`}
              onClick={() => setSortOrder("popular")}
            >
              인기순
            </button>
            {/* ✅ '새 게시물 작성' 버튼 추가 */}
            {isLoggedIn && (
              <button
                className="post-create-btn"
                onClick={() => navigate("/new-post")}
              >
                새 게시물 작성
              </button>
            )}
          </div>
          <div className="post-list">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/posts/${post.id}`, { state: post })}
                style={{ cursor: "pointer" }}
              >
                <div className="post-header">
                  <div className="post-author">{post.userName}</div>
                  <div className="post-stats">
                    <span className="stat-item">
                      <Heart />
                      <span className="stat-count">{post.likes}</span>
                    </span>
                    <span className="stat-item">
                      <MessageCircle />
                      <span className="stat-count">{post.comments}</span>
                    </span>
                  </div>
                </div>
                <p className="post-content">{post.content}</p>
              </div>
            ))}
            {currentPosts.length === 0 && (
              <p className="no-posts-message">작성한 게시글이 없습니다.</p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="pagination flex justify-center mt-8 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ✅ 게시물 작성 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">새 게시물 작성</h3>
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="modal-textarea"
                placeholder="내용을 입력하세요..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  작성하기
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// 개별 포스트 페이지 (댓글 추가/수정/삭제 포함)
function PostDetailPage({
  isLoggedIn,
  onLogout,
  profileImage,
  posts = [],
  setPosts = () => {},
}) {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(state || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // 🔹 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  // ===== 데이터 로드 =====
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await fetch(`/posts/${id}`);
        if (!postRes.ok) throw new Error("게시물 로드 실패");
        const postData = await postRes.json();
        setPost(postData);

        const cmtRes = await fetch(`/posts/${id}/comments`);
        if (!cmtRes.ok) throw new Error("댓글 로드 실패");
        const cmtData = await cmtRes.json();
        setComments(cmtData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPostAndComments();
  }, [id]);

  // ===== 좋아요 =====
  const handleLike = async () => {
    try {
      let response;
      if (liked) {
        // 좋아요 취소
        response = await fetch(`/posts/${id}/like`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      } else {
        // 좋아요 추가
        response = await fetch(`/posts/${id}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      }

      if (!response.ok) {
        alert("좋아요 처리 실패");
        return;
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setLiked(!liked);

      // 상위 posts 배열도 갱신
      setPosts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          : prev
      );
    } catch (err) {
      console.error("좋아요 토글 오류:", err);
    }
  };

  // ===== 댓글 추가 =====
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          text: newComment,
          userName: "USER_A", // TODO: 실제 사용자 정보로 교체
        }),
      });

      if (!response.ok) {
        alert("댓글 작성에 실패했습니다.");
        return;
      }

      const data = await response.json();
      const addedComment = data.comment || data;
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");

      // 댓글 수 +1
      setPost((prev) =>
        prev ? { ...prev, comments: (prev.comments || 0) + 1 } : prev
      );
      setPosts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) =>
              p.id === Number(id) || p.id === post?.id
                ? { ...p, comments: p.comments + 1 }
                : p
            )
          : prev
      );
    } catch (err) {
      console.error("댓글 작성 오류:", err);
    }
  };

  // ===== 댓글 수정 시작/취소/저장 =====
  const startEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentText);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const saveEditComment = async () => {
    if (!editingCommentId) return;
    const text = editedCommentText.trim();
    if (!text) return;

    try {
      const response = await fetch(
        `/posts/${id}/comments/${editingCommentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        alert("댓글 수정에 실패했습니다.");
        return;
      }

      const data = await response.json();
      const updated = data.comment || data;

      setComments((prev) =>
        prev.map((c) =>
          c.id === editingCommentId ? { ...c, text: updated.text ?? text } : c
        )
      );
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (err) {
      console.error("댓글 수정 오류:", err);
    }
  };

  // ===== 댓글 삭제 =====
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        alert("댓글 삭제에 실패했습니다.");
        return;
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      // 댓글 수 -1
      setPost((prev) =>
        prev
          ? { ...prev, comments: Math.max((prev.comments || 1) - 1, 0) }
          : prev
      );
      setPosts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) =>
              p.id === Number(id) || p.id === post?.id
                ? { ...p, comments: Math.max(p.comments - 1, 0) }
                : p
            )
          : prev
      );
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
    }
  };

  // ===== 게시물 수정/삭제 =====
  const handleEditPost = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`/posts/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ content: editedContent }),
        });
        if (!response.ok) {
          alert("게시물 수정에 실패했습니다.");
          return;
        }
        const updatedPost = await response.json();
        setPost(updatedPost);
        setIsEditing(false);

        setPosts((prev) =>
          Array.isArray(prev)
            ? prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
            : prev
        );
      } catch (err) {
        console.error("게시물 수정 오류:", err);
      }
    } else {
      setIsEditing(true);
      setEditedContent(post?.content || "");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("게시물을 정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        alert("게시물 삭제에 실패했습니다.");
        return;
      }
      alert("게시물이 삭제되었습니다.");
      // 상위 목록에서 제거
      setPosts((prev) =>
        Array.isArray(prev)
          ? prev.filter((p) => p.id !== (post?.id ?? Number(id)))
          : prev
      );
      navigate("/");
    } catch (err) {
      console.error("게시물 삭제 오류:", err);
    }
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="post-detail-page">
      <header className="main-header">
        <div className="right-header-wrapper">
          <div className="search-bar-container">
            <input type="text" placeholder="검색" className="search-input" />
            <button className="search-button">
              {/* 검색 아이콘 svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <div className="header-actions">
            {isLoggedIn ? (
              <div className="profile-container relative">
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
                  />
                )}
              </div>
            ) : (
              <>
                <Link to="/signup" className="signup-btn">
                  회원가입
                </Link>
                <Link to="/login" className="login-btn">
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            ☁️
          </Link>
        </div>
        <div className="category-section">
          <h3 className="category-title">카테고리</h3>
          <ul className="category-list">
            <li>
              <button className="category-btn active">전체</button>
            </li>
            <li>
              <button className="category-btn">동물/반려동물</button>
            </li>
            <li>
              <button className="category-btn">여행</button>
            </li>
            <li>
              <button className="category-btn">건강/헬스</button>
            </li>
            <li>
              <button className="category-btn">연예인</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="post-detail-card">
        {/* 작성자 정보 */}
        <div className="post-author-section">
          <div className="author-avatar">👤</div>
          <div className="author-info">
            <p className="author-name">{post.userName}</p>
            <p className="post-date">{post.date}</p>
          </div>
        </div>

        {/* 이미지 */}
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="post" />
          </div>
        )}

        {/* 내용 */}
        <h2 className="post-title">{post.title}</h2>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border rounded p-2"
          />
        ) : (
          <p className="post-content">{post.content}</p>
        )}

        {/* 좋아요 / 댓글 수 */}
        <div className="post-stats">
          <button onClick={handleLike}>
            <span>
              <Heart fill={liked ? "red" : "none"} /> {post.likes}
            </span>
          </button>
          <span>
            <MessageCircle /> {post.comments}
          </span>
        </div>

        {/* 게시물 액션 */}
        <div className="post-actions">
          <button onClick={handleEditPost} className="action-btn">
            <Pencil />
          </button>
          <button onClick={handleDeletePost} className="action-btn">
            <Trash2 />
          </button>
        </div>

        {/* 댓글 입력 */}
        <div className="comment-section">
          <h3>댓글</h3>
          <div className="comment-input flex space-x-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-1 bg-blue-500 text-white rounded"
            >
              등록
            </button>
          </div>

          {/* 댓글 목록 */}
          <ul className="mt-4 space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="border-b pb-2">
                {editingCommentId === c.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      onClick={saveEditComment}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={cancelEditComment}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>
                      <strong>{c.userName}</strong>: {c.text}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditComment(c.id, c.text)}
                        className="action-btn"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="action-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ✅ 프로필 이미지 업로드 기능이 추가된 마이페이지
function MyPage({ profileImage, setProfileImage }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLeave = () => {
    alert("탈퇴 처리 완료");
    setShowPopup(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User size={26} />
          )}
          User1
        </div>
      </header>

      <main className="main-content">
        <div className="profile-section">
          <div className="profile-icon relative group">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={100} />
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer"
            >
              <span className="text-center text-sm">업로드</span>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <h2>Welcome, User1</h2>
        </div>
        <div className="menu-buttons">
          <button
            className="menu-btn"
            onClick={() => navigate("/change-password")}
          >
            비밀번호 변경
          </button>
          <button className="menu-btn" onClick={() => navigate("/myposts")}>
            작성글 조회
          </button>
          <button className="menu-btn" onClick={() => setShowPopup(true)}>
            계정 탈퇴
          </button>
        </div>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-icon">
              <User size={26} />
            </div>
            <p>
              탈퇴 시 회원정보는 복구될 수 없습니다.
              <br />
              정말 탈퇴하겠습니까?
            </p>
            <div className="popup-buttons">
              <button onClick={handleLeave}>예</button>
              <button onClick={() => setShowPopup(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 비밀번호 변경 페이지
function ChangePasswordPage() {
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    // 1. 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 2. 비밀번호 유효성 검사 (예: 최소 8자 이상, 문자, 숫자, 특수문자 포함 등)
    if (newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    // 3. API 요청에 사용할 토큰을 URL에서 가져옵니다.
    // 이 토큰은 '비밀번호 찾기' 과정을 통해 받은 것으로 가정합니다.
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");

    if (!resetToken) {
      alert("비밀번호를 변경할 수 있는 권한이 없습니다.");
      navigate("/findpassword");
      return;
    }

    try {
      const response = await fetch("/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // ✅ 인증 토큰을 헤더에 추가합니다.
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/login");
      } else {
        alert(
          "비밀번호 변경에 실패했습니다. 유효하지 않은 요청이거나 토큰이 만료되었습니다."
        );
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 변경 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info">
          <User size={26} /> {currentUser?.userName || "USER"}
        </div>
      </header>

      <main className="main-box">
        <h2>비밀번호 변경</h2>
        <div className="form-group">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="menu-btn" onClick={handleChangePassword}>
          완료
        </button>
      </main>
    </div>
  );
}

// 회원가입 페이지
function SignUpPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const response = await fetch("/auth/signup", {
        // ✅ API 호출
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password, userName }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
      </header>

      <main className="main-box">
        <h2>회원가입화면</h2>
        <div className="form-group">
          <label>ID</label>
          <input type="ID" />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input type="ID" />
        </div>
        <button className="menu-btn" onClick={handleSignup}>
          완료
        </button>
      </main>
    </div>
  );
}
// New login page component
function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await fetch("/auth/login", {
        // ✅ API 호출
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // ✅ 토큰 저장
        onLogin();
        navigate("/");
      } else {
        alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 font-sans text-gray-800">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
      </header>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
        <h2 className="mb-6 text-3xl font-bold">로그인</h2>
        <div className="space-y-4">
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white shadow transition hover:bg-blue-700"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            회원가입
          </Link>
          <div className="mt-6 text-sm text-gray-500">
            아이디를 까먹으셨나요?
            <Link
              to="/findid"
              className="font-medium text-blue-600 hover:underline"
            >
              아이디 찾기
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            비밀번호를 까먹으셨나요?
            <Link
              to="/findpassword"
              className="font-medium text-blue-600 hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이디 찾는 페이지
function FindIdentificationPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const handleFindId = async () => {
    try {
      const response = await fetch("/auth/findid", {
        // ✅ API 호출
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, email }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`당신의 아이디는: ${data.id} 입니다.`);
      } else {
        alert("아이디를 찾을 수 없습니다. 이름과 이메일을 확인해주세요.");
      }
    } catch (error) {
      console.error("아이디 찾기 중 오류 발생:", error);
      alert("아이디 찾기 중 문제가 발생했습니다.");
    }
  };
  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info"></div>
      </header>

      <main className="main-box">
        <h2>아이디 찾기</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="menu-btn" onClick={handleFindId}>
          완료
        </button>
      </main>
    </div>
  );
}
// 비밀번호 찾는 페이지
function FindPasswordPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const handleFindPassword = async () => {
    try {
      const response = await fetch("/auth/findpassword", {
        // ✅ API 호출
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email }),
      });

      if (response.ok) {
        alert("비밀번호 변경 링크가 이메일로 전송되었습니다.");
      } else {
        alert("계정을 찾을 수 없습니다. 아이디와 이메일을 확인해주세요.");
      }
    } catch (error) {
      console.error("비밀번호 찾기 중 오류 발생:", error);
      alert("비밀번호 찾기 중 문제가 발생했습니다.");
    }
  };
  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info"></div>
      </header>

      <main className="main-box">
        <h2>비밀번호 찾기</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="menu-btn" onClick={handleFindPassword}>
          완료
        </button>
      </main>
    </div>
  );
}
// 사용자에게 로그인 여부와 프로필 이미지를 받습니다.
function NewPostPage({ isLoggedIn, profileImage, onAddPost }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
      userName: "USER_A", // ✅ 현재 로그인된 사용자 정보로 변경 필요
    };
    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // ✅ 인증 토큰 헤더에 추가
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        alert("게시물 작성이 완료되었습니다.");
        const createdPost = await response.json(); // ✅ 서버에서 응답으로 받은 게시물 데이터
        onAddPost(createdPost); // 상태 업데이트 함수 호출
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
    <div className="new-post-container">
      <header className="main-header">
        <div className="right-header-wrapper">
          <div className="search-bar-container">
            {/* 검색창은 이 페이지에서는 숨기거나 제거합니다 */}
          </div>
          <div className="header-actions">
            {isLoggedIn ? (
              <div className="profile-container relative">
                <button className="profile-btn">
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
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="new-post-content-area">
        <div className="new-post-sidebar">
          <div className="logo" onClick={() => navigate("/")}>
            ☁️
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
        <div className="post-form-area">
          <div className="post-title-section">
            <h2 className="post-title-label">제목</h2>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="post-title-input"
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
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => navigate("/")}>
              취소
            </button>
            <button className="btn-primary" onClick={handleComplete}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// 작성글조회페이지
// MyPostsPage 컴포넌트는 App.js에서 'posts' 상태와 'isLoggedIn' 등을 prop으로 받습니다.
function MyPostsPage({ isLoggedIn, profileImage, posts }) {
  const navigate = useNavigate();
  const currentUserName = "USER_A"; // 로그인한 사용자 이름 가정
  const [activeCategory, setActiveCategory] = useState("전체");

  const myPosts = posts.filter(
    (post) =>
      post.userName === currentUserName &&
      (activeCategory === "전체" || post.category === activeCategory)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = myPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(myPosts.length / postsPerPage);

  const categories = ["전체", "동물/반려동물", "여행", "건강/헬스", "연예인"];

  return (
    <div className="myposts-page-container">
      <header className="main-header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="right-header-wrapper">
          <div className="search-bar-container">{/* 검색창 */}</div>
          <div className="header-actions">
            {isLoggedIn && (
              <div className="profile-container relative">
                <button className="profile-btn">
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
              </div>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="login-btn">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="myposts-content-area">
        <div className="page-header-section">
          <h2 className="page-title">User1의 최신 작성글입니다.</h2>
          <div className="user-profile-icon">
            <User size={30} />
          </div>
        </div>
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`tab-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="post-list-area">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div
                key={post.id}
                className="my-post-card"
                onClick={() => navigate(`/posts/${post.id}`, { state: post })}
                style={{ cursor: "pointer" }}
              >
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <div className="post-stats">
                  <span className="stat-item">
                    <Heart size={18} />
                    <span className="stat-count">{post.likes}</span>
                  </span>
                  <span className="stat-item">
                    <MessageCircle size={18} />
                    <span className="stat-count">{post.comments}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts-message">작성한 게시글이 없습니다.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 전체 라우터
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // ✅ 프로필 이미지 상태 추가
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // API 호출을 App.js에서 수행
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const categories = [
          "동물/반려동물",
          "여행",
          "건강/헬스",
          "연예인",
          "전체",
        ];
        const mapped = data.map((p) => ({
          id: p.id,
          userName: `User ${p.userId}`,
          content: p.title,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          category: categories[Math.floor(Math.random() * categories.length)],
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        console.error("API 호출 에러:", err);
      });
  }, []);
  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("성공적으로 로그인 되었습니다!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken"); // ✅ localStorage에서 토큰 삭제
    setProfileImage(null);
  };
  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // ✅ 새 게시물 추가 함수
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainBoardPage
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              profileImage={profileImage}
              posts={posts} // ✅ posts 상태 전달
              setPosts={setPosts} // ✅ setPosts 함수 전달
            />
          }
        />
        <Route
          path="/MyPage"
          element={
            <MyPage
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          }
        />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/findid" element={<FindIdentificationPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/new-post"
          element={
            <NewPostPage
              isLoggedIn={isLoggedIn}
              profileImage={profileImage}
              onAddPost={addPost}
            />
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PostDetailPage
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              profileImage={profileImage}
              posts={posts}
            />
          }
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/myposts"
          element={
            <MyPostsPage
              isLoggedIn={isLoggedIn}
              profileImage={profileImage}
              posts={posts}
            />
          }
        />
      </Routes>
    </Router>
  );
}
