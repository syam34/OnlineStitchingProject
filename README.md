# 👗 Online Stitching Platform

An AI-assisted web application for customers to upload their dress designs and body images, analyze measurements using OpenCV (via Python backend), and place custom tailoring orders. Tailors can manage and update order statuses, and payments are integrated via Razorpay.

---

## 🚀 Features

### ✅ For Customers:
- Upload an image for **AI-based measurement detection**
- View detected measurements
- Upload fabric details and custom designs
- Place, edit, or cancel orders
- Track order status
- Make online payments (Card, UPI, Netbanking)

### 👨‍🔧 For Tailors:
- View assigned orders
- Download design images
- View customer measurements
- Update order status (Pending → In Progress → Completed)

### 💳 Payments:
- Integrated with **Razorpay**
- Supports UPI, Cards, Netbanking

---

## 🛠 Tech Stack

| Frontend | Backend (Node.js) | AI Backend (Python) | Payments |
|----------|-------------------|----------------------|----------|
| React.js + Axios + Bootstrap | Express.js + MongoDB | Flask + OpenCV | Razorpay |

---

## 🔧 Installation & Setup

### 📦 Prerequisites

- Node.js (v16+)
- MongoDB
- Python 3.7+
- Razorpay account
- OpenCV installed (`pip install opencv-python`)
- Flask & CORS installed (`pip install flask flask-cors`)

---


# 🔐 Authentication
- JWT Authentication (future scope)
- Role-based dashboard access: Customer vs Tailor

# 💰 Razorpay Integration
- After placing an order, customers can pay via Razorpay
- Upon payment success, status is auto-updated to Paid

# 🙌 Future Enhancements
- Real 3D model preview before order
- Email notifications
- Admin panel
- Firebase Authentication
- Auto suggestions for tailors based on rating and availability

 # 👨‍💻 Author
- Syamalarao Bellani – Full Stack Developer, Project Author
- LinkedIn : https://www.linkedin.com/in/bellani-syamalarao-314b162bb?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app




