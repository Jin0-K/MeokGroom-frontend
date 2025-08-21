import React, { useState, useEffect } from "react";
import {
  useParams,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
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
import "./styles/MainBoardPage.css";
import "./styles/FormPage.css"
import "./styles/MyPage.css"
import "./styles/PostDetailPage.css"
import "./styles/ProfilePopup.css"
import "./styles/LoginPage.css"

const ProfilePopup = ({ onClose, onLogout }) => {
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

//메인보드페이지
function MainBoardPage({ isLoggedIn, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태
  const [postsPerPage] = useState(10); // ✅ 한 페이지당 게시물 수 (상수로 설정)
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "popular") {
      return b.likes - a.likes; // 좋아요 수 기준 내림차순
    }
    // 기본값은 최신순 (id 기준 내림차순)
    return b.id - a.id;
  });
  // ✅ 게시물 필터링 및 정렬 로직
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
  // ✅ 페이지네이션을 위한 게시물 인덱스 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedAndFilteredPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // ✅ 총 페이지 수 계산
  const totalPages = Math.ceil(sortedAndFilteredPosts.length / postsPerPage);
  useEffect(() => {
    // JSONPlaceholder API 호출
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        // 상위 5개만 변환해서 보여주도록 예시
        const mapped = data.map((p) => ({
          id: p.id,
          userName: `User ${p.userId}`,
          content: p.title,
          likes: Math.floor(Math.random() * 100), // 임시 좋아요 수
          comments: Math.floor(Math.random() * 20), // 임시 댓글 수
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
                  // 로그인 상태일 때: 프로필 아이콘과 팝업
                  <div className="profile-container relative">
                    <button
                      className="profile-btn"
                      onClick={() => setShowProfilePopup(!showProfilePopup)}
                    >
                      <User />
                    </button>
                    {showProfilePopup && (
                      <ProfilePopup
                        onClose={() => setShowProfilePopup(false)}
                        onLogout={onLogout}
                      />
                    )}
                  </div>
                ) : (
                  // 로그아웃 상태일 때: 회원가입, 로그인 버튼
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
              onClick={() => setSortOrder("latest")} // ✅ 최신순 버튼 클릭 시 상태 변경
            >
              최신순
            </button>
            <button
              className={`sort-btn ${sortOrder === "popular" ? "active" : ""}`}
              onClick={() => setSortOrder("popular")} // ✅ 인기순 버튼 클릭 시 상태 변경
            >
              인기순
            </button>
          </div>
          <div className="post-list">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/posts/${post.id}`)} // ✅ 클릭 시 상세 페이지 이동
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
                  onClick={() => setCurrentPage(index + 1)} // ✅ 클릭 시 페이지 변경
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
    </div>
  );
}
//개별포스
function PostDetailPage({ isLoggedIn, onLogout }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
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
          date: "2025-08-18", // 예시
          image: `https://picsum.photos/600/300?random=${id}`, // 랜덤 이미지
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
              // 로그인 상태일 때: 프로필 아이콘과 팝업
              <div className="profile-container relative">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfilePopup(!showProfilePopup)}
                >
                  <User />
                </button>
                {showProfilePopup && (
                  <ProfilePopup
                    onClose={() => setShowProfilePopup(false)}
                    onLogout={onLogout}
                  />
                )}
              </div>
            ) : (
              // 로그아웃 상태일 때: 회원가입, 로그인 버튼
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
        <div className="top-category-section">
          <button className="top-category-btn active">동물/반려동물</button>
          <button className="top-category-btn">여행</button>
          <button className="top-category-btn">건강/헬스</button>
          <button className="top-category-btn">연예인</button>
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
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
        </div>
      </div>
    </div>
  );
}

// 마이페이지
function MyPage() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLeave = () => {
    alert("탈퇴 처리 완료");
    setShowPopup(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ☁️
        </div>
        <div className="user-info">
          <User size={26} /> User1
        </div>
      </header>

      {/* ✅ 메인 컨텐츠 영역 수정 */}
      <main className="main-content">
        <div className="profile-section">
          <div className="profile-icon">
            <User size={100} />
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
          <label>ID</label>
          <input type="ID" />
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
// 전체 라우터
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("성공적으로 로그인 되었습니다!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다!");
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainBoardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          }
        />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/findid" element={<FindIdentificationPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/posts/:id" element={<PostDetailPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}
