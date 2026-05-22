import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { io } from 'socket.io-client'
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  BookOpen,
  UserCircle,
  Settings,
  Search,
  Bell,
  Plus,
  LogOut,
  Trash2,
  X,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  Wrench,
  UserCheck,
  ImageIcon,
  UploadCloud,
  Menu
} from 'lucide-react'

// Initialize Socket.io connecting to the same host
const socket = io();

const statusStyles = {
  'รอดำเนินการ': 'text-amber-700 bg-amber-50 border-amber-200',
  'กำลังดำเนินการ': 'text-blue-700 bg-blue-50 border-blue-200',
  'รออะไหล่': 'text-orange-700 bg-orange-50 border-orange-200',
  'เสร็จสิ้น': 'text-brand-800 bg-brand-100 border-brand-300',
}

/* ───────── Sidebar Component ───────── */
function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    if (onClose) onClose()
  }

  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'แผงควบคุมหลัก' },
    { id: 'new', icon: FilePlus, label: 'แจ้งซ่อมใหม่' },
    { id: 'history', icon: ClipboardList, label: 'ประวัติการแจ้งซ่อม' },
    { id: 'knowledge', icon: BookOpen, label: 'คู่มือการใช้งาน' },
    { id: 'profile', icon: UserCircle, label: 'โปรไฟล์' },
    { id: 'settings', icon: Settings, label: 'ตั้งค่าระบบ' },
  ]

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-fade-in-up"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-brand-100 flex flex-col z-50 shadow-[4px_0_24px_rgba(137,28,28,0.02)]
          transition-transform duration-300 ease-in-out md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-brand-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full border-2 border-brand-100 p-0.5 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-[14px] font-bold text-brand-900 tracking-tight leading-tight">
                A.T.E Smart Repair
              </h1>
              <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider mt-0.5">
                รร.ทบอ.ช่างกล ขส.ทบ.
              </p>
            </div>
          </div>
          {/* Close button for mobile drawer */}
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-4">เมนูหลัก</p>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            if (item.id === 'new' && user.role !== 'student') return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  if (onClose) onClose()
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                  transition-all group relative overflow-hidden
                  ${isActive 
                    ? 'bg-brand-50 text-brand-800 font-bold' 
                    : 'text-brand-900/60 hover:bg-brand-50/50 hover:text-brand-900'
                  }
                `}
              >
                {isActive && (
                   <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600" />
                )}
                <Icon
                  className={`w-[18px] h-[18px] ${isActive ? 'text-brand-600' : 'text-brand-400 group-hover:text-brand-600'}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-brand-50">
          <div className="flex items-center gap-3 px-4 py-3 bg-brand-50/50 rounded-xl border border-brand-100 hover:border-brand-200 transition-colors">
             <div className="w-9 h-9 flex-shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-[12px] font-bold text-brand-800 border border-brand-200 shadow-sm">
               {user?.initials || 'US'}
             </div>
             <div className="flex-1 min-w-0">
               <h4 className="text-[12px] font-bold text-brand-900 truncate">{user?.name}</h4>
               <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mt-0.5">
                 {user?.role === 'student' ? 'นักศึกษา' : user?.role === 'employee' ? 'พนักงานซ่อมบำรุง' : 'ผู้ดูแลระบบ'}
               </p>
             </div>
             <button 
               onClick={handleLogout}
               className="p-1.5 flex-shrink-0 text-brand-400 hover:text-brand-800 hover:bg-white rounded-lg transition-colors"
               title="ออกจากระบบ"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </aside>
    </>
  )
}

/* ───────── Header Component ───────── */
function Header({ activeTab, onMenuOpen, searchQuery, setSearchQuery }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const titleMap = {
    dashboard: 'ภาพรวมระบบ',
    new: 'แจ้งซ่อมใหม่',
    history: 'ประวัติการแจ้งซ่อม',
    knowledge: 'คู่มือและคลังความรู้',
    profile: 'ข้อมูลส่วนตัว',
    settings: 'ตั้งค่าระบบ',
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-brand-100 px-4 md:px-10 h-[64px] md:h-[72px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={onMenuOpen}
          className="md:hidden p-2 text-brand-800 hover:bg-brand-50 rounded-xl border border-brand-100 transition-all flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="text-[14px] md:text-[18px] font-bold text-brand-900 truncate">
          {titleMap[activeTab] || 'ภาพรวมระบบ'}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        {/* Search bar - becomes simpler/collapses on smaller screens */}
        <div className={`
          flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border transition-all
          ${searchFocused 
            ? 'border-brand-400 bg-white shadow-[0_2px_10px_rgba(137,28,28,0.08)] w-40 md:w-64' 
            : 'border-brand-200 bg-brand-50/30 w-28 md:w-56 hover:bg-white hover:border-brand-300'
          }
        `}>
          <Search className={`w-3.5 h-3.5 md:w-4 md:h-4 ${searchFocused ? 'text-brand-600' : 'text-brand-400'}`} strokeWidth={2} />
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[11px] md:text-[13px] text-brand-900 placeholder-brand-300 md:placeholder-brand-400 outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        
        <button className="relative p-2 text-brand-400 hover:text-brand-800 bg-brand-50/50 hover:bg-brand-50 rounded-xl border border-transparent hover:border-brand-200 transition-colors">
          <Bell className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.8} />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-600 rounded-full border border-white" />
        </button>
      </div>
    </header>
  )
}

/* ───────── Request Detail Modal ───────── */
function DetailModal({ request, onClose, onUpdateStatus, onAcceptCase, userRole, currentUsername }) {
  const [status, setStatus] = useState(request.status)

  if (!request) return null

  const canAcceptCase = userRole === 'employee' && !request.assignee;
  const isMyCase = userRole === 'employee' && request.assignee === currentUsername;
  const canUpdateStatus = userRole === 'admin' || isMyCase;

  return (
    <div className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" style={{animationDuration: '0.2s'}}>
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(137,28,28,0.15)] w-full max-w-[600px] overflow-hidden border border-brand-100 max-h-[90vh] flex flex-col">
        
        <div className="p-5 md:p-8 pb-4 md:pb-6 border-b border-brand-50 flex items-start justify-between bg-brand-50/30 flex-shrink-0">
          <div>
            <p className="text-[10px] md:text-[11px] font-mono font-bold text-brand-600 mb-1">{request.id}</p>
            <h3 className="text-base md:text-lg font-bold text-brand-900 leading-snug">{request.subject}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white rounded-lg border border-brand-100 text-brand-400 hover:text-brand-900 hover:border-brand-300 transition-colors shadow-sm">
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-5 md:p-8 space-y-5 md:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4">
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">หมวดหมู่</p>
              <p className="text-[12px] md:text-[13px] font-bold text-brand-900">{request.category}</p>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">ผู้แจ้งซ่อม (รหัสนักศึกษา)</p>
              <p className="text-[12px] md:text-[13px] font-bold text-brand-900 truncate">{request.reporter} <span className="text-brand-500 font-normal">({request.reporterUsername})</span></p>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">วันที่แจ้ง</p>
              <p className="text-[12px] md:text-[13px] font-bold text-brand-900">{request.date}</p>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">เบอร์โทรศัพท์ติดต่อ</p>
              <p className="text-[12px] md:text-[13px] font-bold text-brand-900">
                {request.phone && request.phone !== '-' ? (
                  <a href={`tel:${request.phone}`} className="text-brand-700 hover:text-brand-900 hover:underline font-mono">
                    {request.phone}
                  </a>
                ) : (
                  <span className="text-brand-300">-</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">สถานะ</p>
              <div className="mt-1">
                <span className={`inline-block px-2.5 py-1 border rounded-md text-[10px] md:text-[11px] font-bold ${statusStyles[request.status]}`}>
                  {request.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">รายละเอียดเพิ่มเติม</p>
            <div className="text-[12px] md:text-[13px] text-brand-900/80 leading-relaxed bg-brand-50/50 p-4 rounded-xl border border-brand-100 whitespace-pre-wrap">
              {request.details || 'ไม่มีข้อมูลเพิ่มเติม'}
            </div>
          </div>

          {/* Image Display */}
          {request.imageUrl && (
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">รูปภาพประกอบ</p>
              <div className="rounded-xl border border-brand-100 overflow-hidden shadow-sm">
                 <img src={request.imageUrl} alt="รูปภาพปัญหา" className="w-full h-auto max-h-[250px] md:max-h-[300px] object-cover" />
              </div>
            </div>
          )}

          <div>
             <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">ผู้รับผิดชอบ (ช่าง)</p>
             <div className="flex items-center gap-2">
               {request.assignee ? (
                 <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200">
                   <UserCheck className="w-4 h-4 flex-shrink-0" />
                   รับเคสโดย: พนักงาน {request.assignee}
                 </div>
               ) : (
                 <span className="text-[12px] md:text-[13px] text-brand-500">ยังไม่มีผู้รับเคส</span>
               )}
             </div>
          </div>

          {canAcceptCase && (
             <div className="pt-4 border-t border-brand-50">
               <button 
                 onClick={() => onAcceptCase(request.id)}
                 className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-800 text-white text-[13px] font-bold rounded-xl hover:from-brand-700 hover:to-brand-900 shadow-md shadow-brand-600/20 transition-all hover:-translate-y-0.5"
               >
                 รับเคสนี้ (Accept Case)
               </button>
             </div>
          )}

          {canUpdateStatus && (
            <div className="pt-4 border-t border-brand-50">
              <p className="text-[9px] md:text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-3">อัปเดตสถานะงาน</p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {['รอดำเนินการ', 'กำลังดำเนินการ', 'รออะไหล่', 'เสร็จสิ้น'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatus(s)
                      onUpdateStatus(request.id, s)
                    }}
                    className={`
                      px-3 py-2 rounded-xl text-[11px] md:text-[12px] font-bold border transition-all text-center
                      ${status === s
                          ? 'bg-brand-800 border-brand-800 text-white shadow-md shadow-brand-800/20'
                          : 'bg-white border-brand-200 text-brand-600 hover:border-brand-400 hover:bg-brand-50'
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────── Main Dashboard Inner ───────── */
function DashboardView({ requests, setRequests, setActiveTab, searchQuery }) {
  const { user } = useAuth()
  const [selectedReq, setSelectedReq] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด')

  // Real-time listener for selection sync
  useEffect(() => {
    if (selectedReq) {
      const updatedReq = requests.find(r => r.id === selectedReq.id);
      if (updatedReq && (updatedReq.status !== selectedReq.status || updatedReq.assignee !== selectedReq.assignee)) {
        setSelectedReq(updatedReq);
      }
    }
  }, [requests, selectedReq]);

  const visibleRequests = requests.filter((r) => {
    if (user.role === 'admin') return true;
    if (user.role === 'student') return r.reporterUsername === user.username;
    if (user.role === 'employee') return true;
    return false;
  });

  const filteredRequests = visibleRequests.filter((r) => {
    let matchesTab = true;
    if (filterStatus === 'งานของฉัน' && user.role === 'employee') {
      matchesTab = r.assignee === user.username;
    } else if (filterStatus === 'งานที่รอรับ' && user.role === 'employee') {
      matchesTab = !r.assignee;
    } else if (filterStatus !== 'ทั้งหมด') {
      matchesTab = r.status === filterStatus;
    }

    if (!matchesTab) return false;

    // Filter by student ID, reporter name, subject, or request ID
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchesReporter = r.reporterUsername?.toLowerCase().includes(q) || r.reporter?.toLowerCase().includes(q);
      const matchesSubject = r.subject?.toLowerCase().includes(q);
      const matchesId = r.id?.toLowerCase().includes(q);
      return matchesReporter || matchesSubject || matchesId;
    }

    return true;
  });

  const getCount = (status) => visibleRequests.filter((r) => r.status === status).length

  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  }

  const handleAcceptCase = async (id) => {
    await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'กำลังดำเนินการ', assignee: user.username })
    });
    alert('คุณได้รับเคสนี้แล้วและสถานะถูกเปลี่ยนเป็น "กำลังดำเนินการ"');
  }

  const handleDeleteRequest = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการแจ้งซ่อมนี้?')) {
      await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    }
  }

  const tabs = user.role === 'employee' 
    ? ['ทั้งหมด', 'งานที่รอรับ', 'งานของฉัน', 'กำลังดำเนินการ', 'เสร็จสิ้น']
    : ['ทั้งหมด', 'รอดำเนินการ', 'กำลังดำเนินการ', 'รออะไหล่', 'เสร็จสิ้น'];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-brand-100 shadow-soft">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-900 tracking-tight">
            สวัสดี, {user.name}
          </h3>
          <p className="text-[12px] md:text-[13px] font-bold text-brand-600 mt-1">
            {user.role === 'admin' && "นี่คือภาพรวมของระบบแจ้งซ่อมทั้งหมด"}
            {user.role === 'employee' && "ยินดีต้อนรับสู่ระบบรับงานและจัดการการซ่อมบำรุง"}
            {user.role === 'student' && "คุณสามารถแจ้งปัญหาและติดตามสถานะได้ที่นี่"}
          </p>
        </div>

        {user.role === 'student' && (
          <button
            onClick={() => setActiveTab('new')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-brand-600 to-brand-800 text-white text-[13px] font-bold rounded-xl hover:from-brand-700 hover:to-brand-900 shadow-md shadow-brand-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            แจ้งซ่อมใหม่ (New)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'รอดำเนินการ', count: getCount('รอดำเนินการ'), icon: Clock },
          { label: 'กำลังดำเนินการ', count: getCount('กำลังดำเนินการ'), icon: Loader2 },
          { label: 'รออะไหล่', count: getCount('รออะไหล่'), icon: Package },
          { label: 'เสร็จสิ้น', count: getCount('เสร็จสิ้น'), icon: CheckCircle2 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 md:p-6 rounded-2xl border border-brand-100 shadow-soft relative overflow-hidden group hover:border-brand-300 transition-colors">
            <div className="absolute top-0 right-0 p-2 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-12 h-12 md:w-16 md:h-16 text-brand-800" />
            </div>
            <p className="text-[11px] md:text-[12px] font-bold text-brand-500 tracking-wide mb-1 md:mb-2 relative z-10">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-extrabold text-brand-900 relative z-10">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-brand-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-soft">
        <div className="flex overflow-x-auto gap-2 p-3 border-b border-brand-100 bg-brand-50/30 no-scrollbar scrollbar-none snap-x whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`
                px-3.5 py-2 rounded-xl text-[11px] md:text-[12px] font-bold transition-all snap-start flex-shrink-0
                ${filterStatus === tab
                    ? 'bg-brand-800 text-white shadow-md shadow-brand-800/20'
                    : 'bg-white text-brand-600 border border-brand-200 hover:border-brand-400 hover:text-brand-800'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest w-28">รหัสรายการ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest">เรื่องที่แจ้งซ่อม</th>
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest">หมวดหมู่</th>
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest">วันที่แจ้ง</th>
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest w-36">สถานะ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-brand-400 tracking-widest text-right">ผู้รับผิดชอบ</th>
                <th className="px-6 py-4 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-brand-400 text-[13px] font-bold">
                    ไม่พบรายการแจ้งซ่อมในหมวดหมู่นี้
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-brand-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-mono font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md border border-brand-100">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-brand-900 flex items-center gap-2">
                        {req.subject}
                        {req.imageUrl && <ImageIcon className="w-3.5 h-3.5 text-brand-500" />}
                      </p>
                      {(user.role === 'admin' || user.role === 'employee') && (
                        <p className="text-[11px] font-medium text-brand-500 mt-1 flex items-center gap-1.5 flex-wrap">
                          <UserCircle className="w-3.5 h-3.5" />
                          รหัส นศ: <span className="font-bold">{req.reporterUsername}</span>
                          {req.phone && req.phone !== '-' && (
                            <>
                              <span className="text-brand-200">|</span>
                              <span>โทร: <span className="font-bold text-brand-700">{req.phone}</span></span>
                            </>
                          )}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-brand-700">{req.category}</td>
                    <td className="px-6 py-4 text-[12px] font-medium text-brand-500">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 border rounded-md text-[11px] font-bold ${statusStyles[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {req.assignee ? (
                          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2 py-1 rounded-md border border-brand-200">
                            {req.assignee}
                          </span>
                       ) : (
                          <span className="text-[11px] font-medium text-brand-300">-</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="p-2 text-brand-500 hover:text-white bg-white hover:bg-brand-600 border border-brand-200 hover:border-brand-600 rounded-xl shadow-sm transition-all"
                          title="ดูรายละเอียด/อัปเดต"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-2 text-red-500 hover:text-white bg-white hover:bg-red-600 border border-brand-200 hover:border-red-600 rounded-xl shadow-sm transition-all"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-brand-50">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-brand-400 text-[13px] font-bold">
              ไม่พบรายการแจ้งซ่อมในหมวดหมู่นี้
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="p-4 flex flex-col gap-3 hover:bg-brand-50/20 active:bg-brand-50/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-bold text-brand-500 bg-brand-50/50 px-2 py-0.5 rounded border border-brand-100">
                        {req.category}
                      </span>
                    </div>
                    <h4 className="text-[13.5px] font-bold text-brand-900 leading-snug flex items-center gap-1.5">
                      {req.subject}
                      {req.imageUrl && <ImageIcon className="w-3.5 h-3.5 text-brand-500 inline-block flex-shrink-0" />}
                    </h4>
                  </div>
                  <span className={`inline-block px-2 py-0.5 border rounded text-[10px] font-bold flex-shrink-0 ${statusStyles[req.status]}`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-brand-500 font-medium">
                  <div>
                    <span>{req.date}</span>
                    {(user.role === 'admin' || user.role === 'employee') && (
                      <span className="ml-2 pl-2 border-l border-brand-100">
                        นศ: <span className="font-bold text-brand-700">{req.reporterUsername}</span>
                        {req.phone && req.phone !== '-' && (
                          <span className="ml-1 text-[10px] text-brand-500 font-bold">({req.phone})</span>
                        )}
                      </span>
                    )}
                  </div>
                  {req.assignee ? (
                    <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      ช่าง: {req.assignee}
                    </span>
                  ) : (
                    <span className="text-[10px] text-brand-300">ยังไม่มีผู้รับเคส</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-50/50">
                  <button
                    onClick={() => setSelectedReq(req)}
                    className="flex-1 py-2 px-3 text-[12px] font-bold text-brand-700 hover:text-white bg-brand-50 hover:bg-brand-600 border border-brand-200 hover:border-brand-600 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    ดูรายละเอียด / จัดการ
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-2 text-red-500 hover:text-white bg-white hover:bg-red-600 border border-brand-200 hover:border-red-600 rounded-xl transition-all"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedReq && (
        <DetailModal
          request={selectedReq}
          onClose={() => setSelectedReq(null)}
          onUpdateStatus={handleUpdateStatus}
          onAcceptCase={handleAcceptCase}
          userRole={user.role}
          currentUsername={user.username}
        />
      )}
    </div>
  )
}


/* ───────── New Request Form View ───────── */
/* ───────── New Request Form View ───────── */
function NewRequestView({ setActiveTab }) {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('ไฟฟ้า')
  const [phone, setPhone] = useState('') // New Phone field state
  const [details, setDetails] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subject.trim()) return

    // Phone validation (Thai numbers start with 0, 9-10 digits)
    if (!phone || !/^0[0-9]{8,9}$/.test(phone)) {
      alert('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก เริ่มต้นด้วย 0)')
      return
    }

    setIsSubmitting(true)

    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('category', category);
    formData.append('phone', phone.trim()); // Send phone to backend
    formData.append('details', details.trim());
    formData.append('reporter', user.name);
    formData.append('reporterUsername', user.username);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        body: formData, // fetch automatically sets Content-Type for FormData
      });
      const data = await res.json();
      
      if (data.success) {
        setActiveTab('dashboard')
        alert('ส่งคำร้องแจ้งซ่อมเรียบร้อยแล้ว!');
      } else {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto animate-fade-in-up bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl border border-brand-100 shadow-card">
      <div className="mb-6 md:mb-8 border-b border-brand-50 pb-4 md:pb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-50 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100 flex-shrink-0">
          <FilePlus className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-brand-900 tracking-tight font-sans">แบบฟอร์มแจ้งซ่อมใหม่</h3>
          <p className="text-[11px] md:text-[13px] font-bold text-brand-500 mt-0.5 md:mt-1">กรุณาระบุรายละเอียดปัญหาที่พบ พร้อมแนบรูปภาพเพื่อให้ช่างประเมิน</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">
              รหัสนักศึกษา (ระบบกรอกให้อัตโนมัติ)
            </label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-brand-50/50 border border-brand-100 rounded-xl text-[12px] md:text-[13px] font-bold text-brand-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">
              เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="ตัวอย่าง 0812345678"
              maxLength={10}
              className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-brand-50/30 border border-brand-200 rounded-xl text-[12px] md:text-[13px] font-bold text-brand-900 outline-none focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10 transition-all placeholder:text-brand-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">เรื่องที่แจ้งซ่อม <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ตัวอย่างเช่น แอร์ห้องสมุดไม่เย็น, ท่อน้ำในห้องน้ำแตก"
            className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-brand-50/30 border border-brand-200 rounded-xl text-[12px] md:text-[13px] font-bold text-brand-900 outline-none focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10 transition-all placeholder:text-brand-300"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">หมวดหมู่</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-brand-50/30 border border-brand-200 rounded-xl text-[12px] md:text-[13px] font-bold text-brand-900 outline-none focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10 transition-all"
          >
            <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ (HVAC)</option>
            <option value="ไฟฟ้า">ระบบไฟฟ้า (Electrical)</option>
            <option value="ประปา">ระบบประปา (Plumbing)</option>
            <option value="อาคารสถานที่">อาคารสถานที่ (Structural)</option>
            <option value="ไอทีและคอมพิวเตอร์">ไอทีและคอมพิวเตอร์ (IT/Network)</option>
            <option value="ทั่วไป">ทั่วไป (General)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">รายละเอียดเพิ่มเติม / สถานที่</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="อธิบายสถานที่และลักษณะของปัญหาเพิ่มเติม..."
            rows={4}
            className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-brand-50/30 border border-brand-200 rounded-xl text-[12px] md:text-[13px] font-bold text-brand-900 outline-none focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10 transition-all placeholder:text-brand-300 resize-none"
          />
        </div>

        {/* Image Upload Area */}
        <div>
          <label className="block text-[10px] md:text-[12px] font-bold text-brand-900 uppercase tracking-widest mb-1.5 md:mb-2">แนบรูปภาพปัญหา (ถ้ามี)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-brand-200 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-600 hover:bg-brand-50/50 transition-colors group"
          >
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {imageFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-green-500 mb-2" />
                <p className="text-[12px] md:text-[13px] font-bold text-brand-900 truncate max-w-[250px]">{imageFile.name}</p>
                <p className="text-[10px] md:text-[11px] text-brand-500 mt-1">คลิกเพื่อเปลี่ยนรูปภาพ</p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-7 h-7 md:w-8 md:h-8 text-brand-400 group-hover:text-brand-600 mb-2 transition-colors" />
                <p className="text-[12px] md:text-[13px] font-bold text-brand-900">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-[10px] md:text-[11px] text-brand-500 mt-1">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 md:pt-8 border-t border-brand-50">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-brand-200 text-[13px] font-bold text-brand-600 rounded-xl hover:bg-brand-50 hover:border-brand-300 transition-all text-center"
            disabled={isSubmitting}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-800 text-white text-[13px] font-bold rounded-xl hover:from-brand-700 hover:to-brand-900 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            ส่งข้อมูลแจ้งซ่อม
          </button>
        </div>
      </form>
    </div>
  )
}

/* ───────── Placeholder View ───────── */
function PlaceholderView({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-300 mb-6 border-2 border-brand-100 shadow-soft">
        <Wrench className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-brand-900">{title}</h3>
      <p className="text-[13px] font-bold text-brand-500 mt-2">เมนูส่วนนี้กำลังอยู่ระหว่างการพัฒนาเพื่อปรับปรุงระบบ</p>
    </div>
  )
}

/* ───────── Main App Shell ───────── */
function DashboardShell() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [requests, setRequests] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch initial requests and listen for Socket.io Real-time updates
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();

    socket.on('requests_updated', (updatedRequests) => {
      setRequests(updatedRequests);
    });

    return () => {
      socket.off('requests_updated');
    };
  }, []);

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-brand-50/50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="flex-1 ml-0 md:ml-64 min-w-0 flex flex-col">
        <Header 
          activeTab={activeTab} 
          onMenuOpen={() => setIsSidebarOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="flex-1 p-4 md:p-10 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView requests={requests} setRequests={setRequests} setActiveTab={setActiveTab} searchQuery={searchQuery} />}
          {activeTab === 'new' && <NewRequestView setActiveTab={setActiveTab} />}
          {activeTab === 'history' && <DashboardView requests={requests} setRequests={setRequests} setActiveTab={setActiveTab} searchQuery={searchQuery} />}
          {activeTab === 'knowledge' && <PlaceholderView title="คู่มือการใช้งาน" />}
          {activeTab === 'profile' && <PlaceholderView title="ข้อมูลโปรไฟล์" />}
          {activeTab === 'settings' && <PlaceholderView title="ตั้งค่าระบบ" />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
