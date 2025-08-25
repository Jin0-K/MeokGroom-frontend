// import statements
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 회원가입 페이지
function SignUpPage() {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password, userName, email }),
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
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
      </header>

      <main className="main-box">
        <h2>회원가입화면</h2>
        <div className="form-group">
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="menu-btn" onClick={handleSignup}>
          완료
        </button>
      </main>
    </div>
  );
}

export default SignUpPage;