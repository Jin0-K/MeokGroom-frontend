// import statements
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

// 비밀번호 변경 페이지
function ChangePasswordPage({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");

    if (!resetToken) {
      alert("비밀번호를 변경할 수 있는 권한이 없습니다.");
      navigate("/findpassword");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
    <div className="changepsswd-page">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
        {/* <div className="user-info">
          <User size={26} />{currentUser?.userName || "USER"}   
        </div> */}
      </header>

      <main className="changepsswd-container">
        <h2 className="changepsswd-title">비밀번호 변경</h2>
        <div className="chngpsswd-form">
          <div className="chngpsswd-form-group">
            <label className="chngpsswd-input-label">새로운 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="chngpsswd-form-input"
            />
          </div>
          <div className="chngpsswd-form-group">
            <label className="chngpsswd-input-label">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="chngpsswd-form-input"
            />
          </div>
        </div>
        <button className="chngpsswd-complete-btn" onClick={handleChangePassword}>
          완료
        </button>
      </main>
    </div>
  );
}

export default ChangePasswordPage;
