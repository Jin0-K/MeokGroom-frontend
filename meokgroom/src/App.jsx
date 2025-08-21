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
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import "./styles/BaseDefault.css"
import "./styles/MainBoardPage.css";
// import "./styles/FormPage.css"
// import "./styles/MyPage.css"
// import "./styles/PostDetailPage.css"
// import "./styles/ProfilePopup.css"
// import "./styles/LoginPage.css"

// ✅ 프로필 이미지 업로드 기능이 추가된 ProfilePopup
const ProfilePopup = ({ onClose, onLogout, profileImage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Replace alert with a modal or other non-blocking UI
    onLogout();
    onClose();
    navigate("/");
  };

  const handleMyPage = () => {
    onClose();
    navigate("/mypage"); // 마이페이지로 이동합니다.
  };

  return (
    <div className="profile-popup">
      <div className="user-info-section">
        <div className="user-avatar-container">
          <User size={30} />
        </div>
        <div className="user-text-info">
          <p className="user-name">USER_A</p>
          <p className="user-email">user1-test@gmail.com</p>
        </div>
      </div>
      <div className="profile-actions-section">
        <button
          className="profile-action-btn"
          onClick={handleMyPage}
        >
          마이 페이지
        </button>
        <button
          className="profile-action-btn"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

// 메인보드페이지
function MainBoardPage({ isLoggedIn, onLogout, profileImage }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [newPostContent, setNewPostContent] = useState("");
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchTerm.toLowerCase())
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
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          id: p.id,
          userName: `User ${p.userId}`,
          content: p.title,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        console.error("API 호출 에러:", err);
      });
  }, []);

  return (
    <div className="main-board-wrapper">
      <div className="main-board-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <Link to="/" className="logo-link">
              <img
                src="/logo.png"
                alt="Logo"
                className="logo-image"
              />
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

        {/* Right Main Content Area */}
        <div className="main-content-area">
          {/* Header with Search and Profile */}
          <header className="main-header">
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
            {/* '새 게시물 작성' 버튼 추가 */}
            {isLoggedIn && (
              <button
                className="post-create-btn"
                onClick={() => navigate("/new-post")}
              >
                + 새 게시물 작성
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
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
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

// 개별 포스트 페이지
function PostDetailPage({ isLoggedIn, onLogout, profileImage }) {
  const { state } = useLocation();
  const handleLike = () => {
    // The setPost function uses a callback to get the previous state (prevPost).
    setPost((prevPost) => {
      // It returns a new object by copying the old one and incrementing the likes.
      // This is crucial for immutability, which React relies on to detect changes.
      return { ...prevPost, likes: prevPost.likes + 1 };
    });
  };
  const [comments, setComments] = useState([]); // ✅ 댓글 상태 추가
  const [newComment, setNewComment] = useState(""); // ✅ 새 댓글 입력값
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: uuidv4(), user: "User1", text: newComment },
    ]);
    setNewComment("");
  };
  const { id } = useParams();
  const [post, setPost] = useState(state || null);

  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost({
          id: data.id,
          userName: `User ${data.userId}`,
          title: data.title,
          content: data.body,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          date: "2025-08-18",
          image: `https://picsum.photos/600/300?random=${id}`,
        });
      });
  }, [id]);

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="post-detail-page">
      <header className="main-header">
        <div className="right-header-wrapper">
          <div className="search-bar-container">
            <input type="text" placeholder="검색" className="search-input" />
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
      <div className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            ☁️
          </Link>
        </div>
        {/* <div className="top-category-section">
          <button className="top-category-btn active">동물/반려동물</button>
          <button className="top-category-btn">여행</button>
          <button className="top-category-btn">건강/헬스</button>
          <button className="top-category-btn">연예인</button>
        </div> */}
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

        {/* 게시물 이미지 */}
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="post" />
          </div>
        )}

        {/* 게시물 내용 */}
        <h2 className="post-title">{post.title}</h2>
        <p className="post-content">{post.content}</p>

        {/* 좋아요 & 댓글 */}

        <div className="post-stats">
          <button onClick={handleLike}>
            <span>
              <Heart /> {post.likes}
            </span>
          </button>
          <span>
            <MessageCircle /> {post.comments}
          </span>
        </div>
        {/* 댓글 작성란 */}
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
                <strong>{c.user}</strong>: {c.text}
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
          <button className="menu-btn">작성글 조회</button>
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

  const handleComplete = () => {
    alert("비밀번호 변경이 완료되었습니다!");
    navigate("/");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info">
          <User size={26} /> USER1
        </div>
      </header>

      <main className="main-box">
        <h2>비밀번호 변경</h2>
        <div className="form-group">
          <label>새로운 비밀번호</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>비밀번호 확인</label>
          <input type="password" />
        </div>
        <button className="menu-btn" onClick={handleComplete}>
          완료
        </button>
      </main>
    </div>
  );
}

// 회원가입 페이지
function SignUpPage() {
  const navigate = useNavigate();
  const handleSignup = () => {
    alert("회원가입이 완료되었습니다!");
    navigate("/");
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
// New login page component
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Call the function passed from the parent component
    onLogin();
    navigate("/");
  };

  return (
    <div className="login-page-container">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
      </header>
      <div className="login-box">
        <h2 className="login-header">로그인</h2>
        <div className="form-content-group">
          <div className="form-field-group">
            <label className="input-label">아이디</label>
            <input
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-field-group">
            <label className="input-label">비밀번호</label>
            <input
              type="password"
              className="form-input"
            />
          </div>
          <button
            className="login-button"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
        <div className="link-group">
          <p className="link-text">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="link-btn">
              회원가입
            </Link>
          </p>
          <div className="link-text-divider">
            <p className="link-text">
              아이디를 까먹으셨나요?
              <Link to="/findid" className="link-btn">
                아이디 찾기
              </Link>
            </p>
          </div>
          <div className="link-text-divider">
            <p className="link-text">
              비밀번호를 까먹으셨나요?
              <Link to="/findpassword" className="link-btn">
                비밀번호 찾기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이디 찾는 페이지
function FindIdentificationPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    alert("아이디 정보를 해당 이메일에 전송했습니다!");
    navigate("/");
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
          <input type="Email" />
        </div>

        <button className="menu-btn" onClick={handleComplete}>
          완료
        </button>
      </main>
    </div>
  );
}
// 비밀번호 찾는 페이지
function FindPasswordPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    alert("초기화된 비밀번호를 해당 이메일에 전송했습니다!");
    navigate("/");
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
          <input type="text" placeholder="ID" />

          <input type="email" placeholder="Email" />
        </div>

        <button className="menu-btn" onClick={handleComplete}>
          완료
        </button>
      </main>
    </div>
  );
}
// 사용자에게 로그인 여부와 프로필 이미지를 받습니다.
function NewPostPage({ isLoggedIn, profileImage }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["동물/반려동물", "여행", "건강/헬스", "연예인"];

  const handleComplete = () => {
    if (!title || !content || !selectedCategory) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }
    // 게시물 작성 로직 (서버에 데이터 전송 등)
    console.log("새 게시물 작성 완료:", {
      title,
      content,
      category: selectedCategory,
    });
    alert("게시물 작성이 완료되었습니다.");
    navigate("/"); // 작성 후 메인 페이지로 이동
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

// 전체 라우터
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // ✅ 프로필 이미지 상태 추가

  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("성공적으로 로그인 되었습니다!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileImage(null); // 로그아웃 시 프로필 이미지 초기화
    alert("로그아웃 되었습니다!");
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
            <NewPostPage isLoggedIn={isLoggedIn} profileImage={profileImage} />
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PostDetailPage
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              profileImage={profileImage}
            />
          }
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}
