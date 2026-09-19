"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Khai báo thông tin yêu cầu của Sprint 1[cite: 1]
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [style, setStyle] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/auth/register", { name, email, password, role });
      alert("Đăng ký thành công! Chuyển sang ô Login để đăng nhập.");
    } catch (err) {
      alert("Lỗi: Email đã tồn tại hoặc server chưa chạy");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", { email, password });
      alert(`Đăng nhập thành công! Vai trò của bạn là: ${res.data.role}`);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Lỗi: Sai email hoặc mật khẩu");
    }
  };

  const handleSavePreferences = async () => {
    try {
      await axios.post("http://localhost:8000/profile/preferences", {
        email: email,
        height: parseFloat(height),
        weight: parseFloat(weight),
        gender: "Nam",
        favoriteStyles: [style],
        favoriteColors: ["Black", "White"]
      });
      alert("Tuyệt vời! Đã lưu Fashion Preferences vào Database MongoDB.");
    } catch (err) {
      alert("Lỗi lưu thông tin");
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Demo Đồ Án SOFEP - Sprint 1</h1>
      
      {!isLoggedIn ? (
        <div className="flex gap-10">
          {/* Cột Đăng Ký */}
          <div className="bg-white border p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4 text-gray-800">1. Register</h2>
            <input className="border p-2 w-full mb-3 rounded" placeholder="Họ và Tên" onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 w-full mb-3 rounded" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-2 w-full mb-3 rounded" type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
            <label className="block mb-1 text-sm font-bold text-gray-600">Phân quyền (Role):</label>
            <select className="border p-2 w-full mb-4 rounded" onChange={(e) => setRole(e.target.value)}>
              <option value="Customer">Customer</option>
              <option value="Merchant">Merchant</option>
              <option value="Admin">Admin</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded font-bold" onClick={handleRegister}>Đăng Ký Tài Khoản</button>
          </div>

          {/* Cột Đăng Nhập */}
          <div className="bg-white border p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4 text-gray-800">2. Login</h2>
            <input className="border p-2 w-full mb-3 rounded" placeholder="Email đã đăng ký" onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-2 w-full mb-3 rounded" type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 w-full rounded font-bold" onClick={handleLogin}>Đăng Nhập</button>
          </div>
        </div>
      ) : (
        /* Form Fashion Preferences - Yêu cầu cốt lõi của Sprint 1[cite: 1] */
        <div className="bg-white border p-6 rounded-lg shadow-md w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">3. Fashion Preferences (Hồ sơ thời trang)</h2>
          <p className="mb-4 text-gray-600">Xin chào: <strong className="text-blue-600">{email}</strong> | Vai trò: <strong>{role}</strong></p>
          
          <label className="block mb-1 text-sm font-bold text-gray-600">Chiều cao (cm):</label>
          <input className="border p-2 w-full mb-3 rounded" placeholder="Ví dụ: 175" onChange={(e) => setHeight(e.target.value)} />
          
          <label className="block mb-1 text-sm font-bold text-gray-600">Cân nặng (kg):</label>
          <input className="border p-2 w-full mb-3 rounded" placeholder="Ví dụ: 65" onChange={(e) => setWeight(e.target.value)} />
          
          <label className="block mb-1 text-sm font-bold text-gray-600">Phong cách yêu thích:</label>
          <input className="border p-2 w-full mb-4 rounded" placeholder="Ví dụ: Streetwear, Casual, Vintage..." onChange={(e) => setStyle(e.target.value)} />
          
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-2 w-full rounded font-bold" onClick={handleSavePreferences}>Lưu Sở Thích Vào Database</button>
          
          <button className="mt-4 text-red-500 underline text-sm" onClick={() => setIsLoggedIn(false)}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
}