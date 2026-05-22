import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 8080;

// Setup Middleware
app.use(cors());
app.use(express.json());

// Setup Multer for image uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Setup simple file-based database fallback
const dbFile = path.join(__dirname, 'db.json');

const defaultDb = {
  users: [
    { id: 1, username: 'admin', password: 'admin', name: 'ผู้ดูแลระบบ', role: 'admin', initials: 'AD' },
    { id: 2, username: 'somchai', password: '1234', name: 'สมชาย วงศ์สวัสดิ์', role: 'employee', initials: 'สม' },
    { id: 3, username: 'wipa', password: '1234', name: 'วิภา จันทร์ทอง', role: 'employee', initials: 'วิ' }
  ],
  requests: []
};

function readDB() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Setup Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_project_url') && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '';

let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('💚 Supabase client connected successfully!');
  } catch (err) {
    console.error('❌ Supabase client initialization failed:', err);
  }
} else {
  console.warn('⚠️ Supabase credentials not configured. System is falling back to local file-based database (db.json).');
}

// --- DATABASE HELPER METHODS ---

async function getRequests() {
  if (supabase) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching requests from Supabase:', error.message);
      throw error;
    }
    
    return (data || []).map(r => ({
      id: r.id,
      subject: r.subject,
      category: r.category,
      reporter: r.reporter,
      reporterUsername: r.reporter_username,
      phone: r.phone,
      date: r.date,
      status: r.status,
      details: r.details,
      assignee: r.assignee,
      imageUrl: r.image_url
    }));
  } else {
    return readDB().requests;
  }
}

// --- API ROUTES ---

// Auth Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
      
      if (error) {
        console.error('Login error in Supabase:', error.message);
        return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลกับฐานข้อมูล' });
      }
      
      if (data) {
        const { password: _, ...safeUser } = data;
        res.json({ success: true, user: safeUser });
      } else {
        res.status(401).json({ success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
    }
  } else {
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } else {
      res.status(401).json({ success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  }
});

app.post('/api/register', async (req, res) => {
  const { name, studentId, password } = req.body;
  
  if (supabase) {
    try {
      // Check duplicate
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', studentId)
        .maybeSingle();
        
      if (checkError) {
        return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการเข้าถึงระบบตรวจสอบข้อมูล' });
      }
      
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'รหัสนักศึกษานี้ลงทะเบียนไว้แล้ว' });
      }
      
      const initials = name.substring(0, 2);
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          username: studentId,
          password: password,
          name: name,
          role: 'student',
          initials: initials
        });
        
      if (insertError) {
        console.error('Register insertion error in Supabase:', insertError.message);
        return res.status(500).json({ success: false, error: 'ไม่สามารถบันทึกข้อมูลผู้ใช้ใหม่ได้' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: 'ไม่สามารถประมวลผลการสมัครสมาชิกได้' });
    }
  } else {
    const db = readDB();
    if (db.users.find(u => u.username === studentId)) {
      return res.status(400).json({ success: false, error: 'รหัสนักศึกษานี้ลงทะเบียนไว้แล้ว' });
    }

    const newUser = {
      id: Date.now(),
      username: studentId,
      password: password,
      name: name,
      role: 'student',
      initials: name.substring(0, 2),
    };

    db.users.push(newUser);
    writeDB(db);
    res.json({ success: true });
  }
});

// Requests Routes
app.get('/api/requests', async (req, res) => {
  try {
    const list = await getRequests();
    res.json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' });
  }
});

// Create new request with image upload
app.post('/api/requests', upload.single('image'), async (req, res) => {
  const { subject, category, reporter, reporterUsername, phone, details, date } = req.body;
  
  const id = `MR-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const formattedDate = date || new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const status = 'รอดำเนินการ';
  const assignee = null;
  const reqDetails = details || '';
  const reqPhone = phone || '-'; // default if missing

  const newReq = {
    id,
    subject,
    category,
    reporter,
    reporterUsername,
    phone: reqPhone,
    date: formattedDate,
    status,
    details: reqDetails,
    assignee,
    imageUrl
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from('requests')
        .insert({
          id,
          subject,
          category,
          reporter,
          reporter_username: reporterUsername,
          phone: reqPhone,
          date: formattedDate,
          status,
          details: reqDetails,
          assignee,
          image_url: imageUrl
        });
        
      if (error) {
        console.error('Error inserting request to Supabase:', error.message);
        return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกคำร้อง' });
      }
      
      const updatedList = await getRequests();
      io.emit('requests_updated', updatedList);
      res.json({ success: true, request: newReq });
    } catch (err) {
      res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อบันทึกคำร้อง' });
    }
  } else {
    const db = readDB();
    db.requests.unshift(newReq);
    writeDB(db);
    
    // Emit event to all connected clients
    io.emit('requests_updated', db.requests);
    res.json({ success: true, request: newReq });
  }
});

// Update request status / assignee
app.patch('/api/requests/:id', async (req, res) => {
  const { status, assignee } = req.body;
  const reqId = req.params.id;

  if (supabase) {
    try {
      const updateData = {};
      if (status) updateData.status = status;
      if (assignee !== undefined) updateData.assignee = assignee;

      const { data, error } = await supabase
        .from('requests')
        .update(updateData)
        .eq('id', reqId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating request in Supabase:', error.message);
        return res.status(500).json({ success: false, error: 'ไม่สามารถอัปเดตข้อมูลคำร้องได้' });
      }

      if (!data) {
        return res.status(404).json({ success: false, error: 'ไม่พบรายการแจ้งซ่อมนี้' });
      }

      const updatedList = await getRequests();
      io.emit('requests_updated', updatedList);
      
      const responseReq = {
        id: data.id,
        subject: data.subject,
        category: data.category,
        reporter: data.reporter,
        reporterUsername: data.reporter_username,
        phone: data.phone,
        date: data.date,
        status: data.status,
        details: data.details,
        assignee: data.assignee,
        imageUrl: data.image_url
      };
      
      res.json({ success: true, request: responseReq });
    } catch (err) {
      res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเพื่ออัปเดตข้อมูล' });
    }
  } else {
    const db = readDB();
    const reqIndex = db.requests.findIndex(r => r.id === reqId);
    if (reqIndex !== -1) {
      if (status) db.requests[reqIndex].status = status;
      if (assignee !== undefined) db.requests[reqIndex].assignee = assignee;
      
      writeDB(db);
      
      // Emit event to all clients
      io.emit('requests_updated', db.requests);
      res.json({ success: true, request: db.requests[reqIndex] });
    } else {
      res.status(404).json({ success: false, error: 'Request not found' });
    }
  }
});

// Delete request
app.delete('/api/requests/:id', async (req, res) => {
  const reqId = req.params.id;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', reqId);

      if (error) {
        console.error('Error deleting request in Supabase:', error.message);
        return res.status(500).json({ success: false, error: 'ไม่สามารถลบข้อมูลคำร้องได้' });
      }

      const updatedList = await getRequests();
      io.emit('requests_updated', updatedList);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อลบข้อมูล' });
    }
  } else {
    const db = readDB();
    db.requests = db.requests.filter(r => r.id !== reqId);
    writeDB(db);
    
    // Emit event to all clients
    io.emit('requests_updated', db.requests);
    res.json({ success: true });
  }
});

// --- STATIC FILES & SPA FALLBACK ---

// Serve static React app and public files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html for React Router
app.use((req, res, next) => {
  // Only handle GET requests not meant for API
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

// --- SOCKET.IO ---
io.on('connection', async (socket) => {
  console.log('A user connected:', socket.id);
  
  // Send current requests on connect
  try {
    const list = await getRequests();
    socket.emit('requests_updated', list);
  } catch (err) {
    console.error('Error sending requests on connection:', err);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`A.T.E Smart Repair Server with API & Sockets is running on port ${PORT}`);
});
