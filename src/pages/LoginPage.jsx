import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600)) // Slight delay for feel
    const result = await login(username, password)
    setIsLoading(false)

    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-brand-200">
      
      <div className="w-full max-w-[380px] animate-fade-in-up">
        
        {/* Header with Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-white rounded-full shadow-soft border-4 border-white overflow-hidden">
            <img src="/logo.png" alt="รร.ทบอ.ช่างกล ขส.ทบ. Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight">
            A.T.E Smart Repair
          </h1>
          <p className="text-[13px] font-medium text-brand-700/70 mt-1">
            ระบบแจ้งซ่อม รร.ทบอ.ช่างกล ขส.ทบ.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white px-8 py-10 rounded-2xl border border-brand-100 shadow-card">
          
          {error && (
            <div className="flex items-center gap-2 text-[13px] text-brand-600 bg-brand-50 p-3 rounded-xl mb-6 border border-brand-100 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="login-username" className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                ชื่อผู้ใช้งาน / รหัสนักศึกษา
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                placeholder="กรอกชื่อผู้ใช้งาน หรือ 12345"
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2 relative">
              <label htmlFor="login-password" className="block text-[12px] font-bold text-brand-900 uppercase tracking-wide">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-[13px] text-brand-900 bg-transparent border-b border-brand-200 focus:border-brand-600 outline-none transition-colors placeholder:text-brand-300"
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-8 bg-gradient-to-r from-brand-600 to-brand-800 text-white text-[13px] font-bold rounded-xl hover:from-brand-700 hover:to-brand-900 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center border-t border-brand-50 pt-6">
            <p className="text-[13px] text-brand-600">
              ยังไม่มีบัญชีผู้ใช้งาน?{' '}
              <Link to="/register" className="font-bold text-brand-800 hover:text-brand-600 transition-colors">
                สมัครสมาชิกที่นี่
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info (Demo Accounts) */}
        <div className="mt-8 text-center animate-fade-in-up stagger-2">
           <p className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-3">บัญชีทดสอบ</p>
           <div className="flex flex-col gap-2 text-[12px] text-brand-600">
             <div className="flex justify-center items-center gap-2">
               <span className="w-16 text-right font-medium">Admin:</span>
               <span className="font-mono text-brand-800 bg-white border border-brand-100 px-2 py-0.5 rounded shadow-sm">admin</span> / <span className="font-mono text-brand-800 bg-white border border-brand-100 px-2 py-0.5 rounded shadow-sm">admin</span>
             </div>
             <div className="flex justify-center items-center gap-2">
               <span className="w-16 text-right font-medium">Employee:</span>
               <span className="font-mono text-brand-800 bg-white border border-brand-100 px-2 py-0.5 rounded shadow-sm">somchai</span> / <span className="font-mono text-brand-800 bg-white border border-brand-100 px-2 py-0.5 rounded shadow-sm">1234</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  )
}
