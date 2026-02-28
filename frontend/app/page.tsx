"use client"
import { useState, useEffect } from 'react'

export default function Home() {
  // --- BURAYI GÜNCELLE ---
  // Fly.io'dan aldığın ana linki buraya yapıştır (Sonunda / olmasın)
  const BASE_URL = "https://anket-projesi.fly.dev"; 
  // -----------------------

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [sorular, setSorular] = useState<any[]>([]) // TypeScript için tip tanımı eklendi
  const [userTokens, setUserTokens] = useState(0)
  const [mesaj, setMesaj] = useState('Sisteme hoş geldiniz')

  // 1. GİRİŞ FONKSİYONU
  const loginYap = async () => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.token) {
        setToken(data.token)
        setMesaj("Giriş başarılı. Lütfen anketi doldurun.")
        // Soruları getir fonksiyonunu çağırıyoruz
        const resQ = await fetch(`${BASE_URL}/questions`)
        const dataQ = await resQ.json()
        setSorular(dataQ)
      } else {
        setMesaj("Hata: " + (data.error || "Giriş başarısız"))
      }
    } catch (err) {
      setMesaj("Bağlantı hatası! Sunucuya ulaşılamıyor.");
    }
  }

  // 2. ANKETİ BİTİRME VE TOKEN ALMA
  const anketBitir = async () => {
    try {
      const res = await fetch(`${BASE_URL}/finish-survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setUserTokens(data.total_tokens)
        setMesaj("Tebrikler! 10 Token kazandınız.")
        setSorular([]) 
      }
    } catch (err) {
      setMesaj("Token yükleme hatası!");
    }
  }

  return (
    <div className="p-10 bg-slate-100 min-h-screen text-black flex flex-col items-center relative font-sans">
      
      {/* SAĞ ÜST KÖŞE CÜZDAN */}
      {token && (
        <div className="fixed top-5 right-5 bg-white border-2 border-yellow-400 p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cüzdanım</p>
            <p className="text-xl font-black text-yellow-600">{userTokens} Token</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg mt-10 border border-gray-100">
        <h1 className="text-3xl font-black mb-8 text-center text-slate-800 tracking-tight">Anket Sistemi</h1>
        
        {!token ? (
          /* GİRİŞ EKRANI */
          <div className="flex flex-col gap-5">
            <input 
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all bg-gray-50 text-lg"
              placeholder="E-posta / Kullanıcı Adı"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all bg-gray-50 text-lg"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={loginYap} className="bg-blue-600 text-white p-4 rounded-2xl font-bold text-xl hover:bg-blue-700 transition shadow-lg active:scale-95">
              Giriş Yap
            </button>
          </div>
        ) : (
          /* ANKET EKRANI */
          <div className="flex flex-col gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <p className="text-blue-800 font-medium">Hoş geldin, <span className="font-bold">{email}</span></p>
            </div>

            {sorular && sorular.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-700 border-b pb-2">Aktif Sorular</h2>
                {sorular.map((soru: any) => (
                  <div key={soru.id} className="p-5 bg-white border-2 border-gray-50 rounded-2xl shadow-sm hover:border-blue-200 transition">
                    <p className="font-bold text-slate-800 mb-3">{soru.text}</p>
                    <textarea 
                      className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Cevabınızı buraya yazın..."
                      rows={2}
                    ></textarea>
                  </div>
                ))}
                <button onClick={anketBitir} className="w-full bg-green-500 text-white p-5 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-xl hover:scale-[1.02] active:scale-95">
                  Anketi Gönder ve 10 Token Al! 🚀
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg font-medium">{mesaj}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}