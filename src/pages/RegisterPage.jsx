import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !studentId.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (!/^\d{5}$/.test(studentId)) {
      setError('รหัสนักศึกษาต้องเป็นตัวเลข 5 หลักเท่านั้น')
      return
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    
    const result = await register(name, studentId, password)
    setIsLoading(false)

    if (result.success) {
      alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ')
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-brand-200">
      
      <div className="w-full max-w-[400px] animate-fade-in-up">
        
        {/* Header with Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 mb-3 flex items-center justify-center bg-white rounded-full shadow-soft border-4 border-white overflow-hidden">
            <img src="/logo.png" alt="รร.ทบอ.ช่างกล ขส.ทบ. Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold text-brand-900 tracking-tight">
            สมัครสมาชิกนักศึกษา
          </h1>
          <p className="text-[13px] font-medium text-brand-700/70 mt-1">
            A.T.E Smart Repair System
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white px-8 py-8 rounded-2xl border border-brand-100 shadow-card">
          
          {error && (
            <div className="flex items-center gap-2 text-[13px] text-brand-600 bg-brand-50 p-3 rounded-xl mb-6 border border-brand-100 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                placeholder="สมปอง รักเรียน"
              />
            </div>

            {/* Student ID Input */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                รหัสนักศึกษา (5 หลัก)
              </label>
              <input
                type="text"
                maxLength={5}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 text-[13px] font-mono text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                placeholder="12345"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 relative">
              <label className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-[13px] text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                  placeholder="ตั้งรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-8 bg-gradient-to-r from-brand-600 to-brand-800 text-white text-[13px] font-bold rounded-xl hover:from-brand-700 hover:to-brand-900 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ลงทะเบียน
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
             <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-600 hover:text-brand-800 transition-colors">
               <ArrowLeft className="w-3.5 h-3.5" />
               กลับไปหน้าเข้าสู่ระบบ
             </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
