import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, []);

  const handleAddUser = async () => {
    const { value: newUser } = await Swal.fire({
      title: "เพิ่มผู้ใช้งานใหม่",
      input: "text",
      inputPlaceholder: "กรอกชื่อบัญชี",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (!value) return "กรุณากรอกชื่อบัญชี!";
        if (users.includes(value)) return "ชื่อบัญชีนี้มีอยู่แล้ว!";
      },
    });

    if (newUser) {
      const newUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(newUsers));
      setUsers(newUsers);
      setUsername(newUser);

      // แสดง alert ติ๊กถูก เพิ่มผู้ใช้งานแล้ว
      await Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้งานเรียบร้อยแล้ว",
        confirmButtonColor: "#667eea",
      });
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกชื่อบัญชี!",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    localStorage.setItem("currentUser", username);
    const userData = JSON.parse(localStorage.getItem(`userData_${username}`));

    // แสดง alert เข้าสู่ระบบสำเร็จก่อนนำทาง
    await Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ",
      confirmButtonColor: "#667eea",
    });

    if (
      userData &&
      userData.firstName?.trim() !== "" &&
      userData.lastName?.trim() !== "" &&
      userData.weight != null &&
      userData.height != null
    ) {
      navigate("/menu", { state: userData });
    } else {
      navigate("/register", { state: { username } });
    }
  };

  return (
    <div className="login-container">
      <div>
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">ยินดีต้อนรับ</h1>
            <p className="login-subtitle">เข้าสู่ระบบเพื่อใช้งาน</p>
          </div>

          {/* Content */}
          <div className="login-content">
            {users.length > 0 && (
              <>
                <div className="section-header">
                  <div className="section-indicator"></div>
                  <h3 className="section-title">เลือกบัญชีที่เคยใช้</h3>
                </div>
                <div className="user-list">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      onClick={() => setUsername(user)}
                      className={`user-item ${
                        username === user ? "selected" : ""
                      }`}
                    >
                      <div className="user-avatar">
                        <svg viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="user-name">{user}</span>
                      <div className="check-icon">
                        <svg viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="button-group">
              {users.length > 0 && (
                <button onClick={handleLogin} className="login-button">
                  เข้าสู่ระบบ
                </button>
              )}

              <button onClick={handleAddUser} className="add-user-button">
                เพิ่มผู้ใช้งานใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
