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
import "./styles.css";

const ProfilePopup = ({ onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("로그아웃 되었습니다!");
    onLogout();
    onClose();
    navigate("/");
  };

  const handleMyPage = () => {
    onClose();
    navigate("/mypage"); // 마이페이지로 이동합니다.
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-200">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={26} />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">USER_A</p>
          <p className="text-sm text-gray-500">user1-test@gmail.com</p>
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
//메인보드페이지
function MainBoardPage({ isLoggedIn, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "popular") {
      return b.likes - a.likes; // 좋아요 수 기준 내림차순
    }
    // 기본값은 최신순 (id 기준 내림차순)
    return b.id - a.id;
  });
  useEffect(() => {
    // JSONPlaceholder API 호출
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        // 상위 5개만 변환해서 보여주도록 예시
        const mapped = data.slice(0, 5).map((p) => ({
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
            {sortedPosts.map((post) => (
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
            {posts.length === 0 && (
              <p className="no-posts-message">작성한 게시글이 없습니다.</p>
            )}
            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
            </div>
          </div>
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
            <div className="popup-icon"><User size={26} /></div>
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
        <div className="user-info"><User size={26} /> USER1</div>
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
        <div className="user-info"><User size={26} /> USER1</div>
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
  const navigate = useNavigate();
  const handleLogin = () => {
    // Call the function passed from the parent component
    onLogin();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 font-sans text-gray-800">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
        <h2 className="mb-6 text-3xl font-bold">로그인</h2>
        <div className="space-y-4">
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
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
        </div>
      </div>
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
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}





