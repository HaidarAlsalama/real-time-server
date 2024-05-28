const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // استيراد مكتبة CORS

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());

// تمكين CORS لجميع المسارات
app.use(cors());

// مسار POST
app.post("/api/data", (req, res) => {
  const { userId, data } = req.body;

  // التحقق من وجود userId في جسم الطلب
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // إرسال البيانات المستلمة إلى المستخدم المحدد بناءً على userId
  io.to(userId).emit("post", data);

  // الرد بالبيانات المستلمة
  res.json(data);
});

// معالج Socket.io
io.on("connection", (socket) => {
  console.log("Client connected");
  // الاستماع إلى userId عندما يتصل العميل
  socket.on("userId", (userId) => {
    // الانضمام إلى غرفة الـ socket باستخدام userId
    socket.join(userId);
  });
});


server.listen(PORT, () => {
  console.log(`==> The Realtime Server Works on Port |${PORT}|`);
});
