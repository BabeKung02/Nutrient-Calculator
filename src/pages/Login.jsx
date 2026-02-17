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

      await Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้งานเรียบร้อยแล้ว",
        confirmButtonColor: "#667eea",
      });
    }
  };

  const handleEditUser = async (e, targetUser) => {
    e.stopPropagation();

    const { value: newName } = await Swal.fire({
      title: "แก้ไขชื่อบัญชี",
      input: "text",
      inputValue: targetUser,
      inputPlaceholder: "กรอกชื่อบัญชีใหม่",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (!value) return "กรุณากรอกชื่อบัญชี!";
        if (value === targetUser) return "ชื่อบัญชีเหมือนเดิม กรุณากรอกชื่อใหม่!";
        if (users.includes(value)) return "ชื่อบัญชีนี้มีอยู่แล้ว!";
      },
    });

    if (newName) {
      const updatedUsers = users.map((u) => (u === targetUser ? newName : u));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      const oldData = localStorage.getItem(`userData_${targetUser}`);
      if (oldData) {
        localStorage.setItem(`userData_${newName}`, oldData);
        localStorage.removeItem(`userData_${targetUser}`);
      }

      if (username === targetUser) setUsername(newName);
      if (localStorage.getItem("currentUser") === targetUser) {
        localStorage.setItem("currentUser", newName);
      }

      await Swal.fire({
        icon: "success",
        title: "แก้ไขชื่อบัญชีเรียบร้อยแล้ว",
        confirmButtonColor: "#667eea",
      });
    }
  };

  const handleDeleteUser = async (e, targetUser) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "ยืนยันการลบผู้ใช้งาน",
      text: `คุณต้องการลบบัญชี "${targetUser}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      const updatedUsers = users.filter((u) => u !== targetUser);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.removeItem(`userData_${targetUser}`);
      setUsers(updatedUsers);

      if (username === targetUser) setUsername("");
      if (localStorage.getItem("currentUser") === targetUser) {
        localStorage.removeItem("currentUser");
      }

      await Swal.fire({
        icon: "success",
        title: "ลบผู้ใช้งานเรียบร้อยแล้ว",
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
                    className={`user-item ${username === user ? "selected" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="user-avatar">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* ชื่อ */}
                    <span className="user-name">{user}</span>

                    {/* ปุ่มชิดขวา */}
                    <div className="user-action-group">
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => handleEditUser(e, user)}
                        title="แก้ไขชื่อบัญชี"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteUser(e, user)}
                        title="ลบบัญชี"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
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
  );
}