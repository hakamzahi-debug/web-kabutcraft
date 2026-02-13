
import React, { useState, useEffect } from 'react';
import { NeobrutalistButton } from './components/NeobrutalistButton';
import { ChatSection } from './components/ChatSection';
import { getQnaAnswer, getVideosFromSearch } from './services/geminiService';
import { Page, VideoItem } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [chatMode, setChatMode] = useState<'menu' | 'admin' | 'member' | 'discord'>('menu');
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);
  const [qnaInput, setQnaInput] = useState('');
  const [qnaAnswer, setQnaAnswer] = useState('');
  const [isQnaLoading, setIsQnaLoading] = useState(false);
  
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Link Discord persis sesuai permintaan
  const DISCORD_INVITE_LINK = "https://discord.gg/GfFyREkU5";

  useEffect(() => {
    if (currentPage === 'video' && videos.length === 0) {
      fetchVideos();
    }
  }, [currentPage]);

  const fetchVideos = async () => {
    setIsVideoLoading(true);
    try {
      const data = await getVideosFromSearch();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleQna = async () => {
    if (!qnaInput.trim()) return;
    setIsQnaLoading(true);
    setQnaAnswer('');
    try {
      const answer = await getQnaAnswer(qnaInput);
      setQnaAnswer(answer || "Aku kurang yakin soal itu!");
    } catch (err) {
      setQnaAnswer("Maaf, aku lagi sibuk. Coba lagi nanti ya!");
    } finally {
      setIsQnaLoading(false);
    }
  };

  const resetChat = () => {
    setChatMode('menu');
    setAcknowledgedWarning(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return (
          <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2 pb-8 text-black">
            <h2 className="text-3xl font-black mb-4 underline decoration-4">Tentang Aku</h2>
            
            <div className="border-4 border-black neobrutalism-shadow overflow-hidden bg-white mb-6">
              <img 
                src="https://raw.githubusercontent.com/MistHaze/assets/main/haze-pfp.jpg" 
                alt="MistHaze" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1587573089734-09cb99c7a0bc?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>

            <div className="bg-white p-6 border-4 border-black neobrutalism-shadow font-bold leading-relaxed space-y-4">
              <p>
                Aku bergabung pada Youtube pada tahun 2020. Sekarang sudah berjalan sekitar 5 tahun, 
                dan secara resmi aku menamakan Youtube ku <span className="bg-[#ffd900] px-1 border border-black">KabutCraft</span>.
              </p>
              
              <p>
                Perkenalkan <span className="text-blue-600 underline">Im MistHaze</span> panggil aku <span className="bg-[#7ae0ff] px-1">Haze</span>, 
                Aku adalah seorang animator dan pengembang aplikasi/web.
              </p>

              <div className="bg-[#ff80e5] p-4 border-2 border-black transform -rotate-1">
                <p className="underline decoration-2 mb-1 font-black">Cita-citaku:</p>
                <ul className="list-disc list-inside">
                  <li>Polisi</li>
                  <li>Seorang pembisnis besar</li>
                  <li>Developer</li>
                </ul>
              </div>

              <div className="pt-4 border-t-4 border-black mt-4">
                <h3 className="text-2xl font-black mb-4 bg-black text-white p-2 text-center uppercase tracking-tighter">
                  THE CREW CRAFT!!
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["MistHaze", "Lopli", "Hanzen", "Keshi", "Rain", "Nia", "Renmaru", "Asep"].map((name, idx) => (
                    <span key={idx} className="bg-white border-2 border-black px-3 py-1 text-sm font-black neobrutalism-shadow-hover transition-transform">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <NeobrutalistButton onClick={() => setCurrentPage('home')} bgColor="bg-[#ff5ecf]">
              Kembali Ke Beranda
            </NeobrutalistButton>
          </div>
        );
      case 'chat':
        if (chatMode === 'menu') {
          return (
            <div className="space-y-6 text-black">
              <h2 className="text-3xl font-black mb-4 underline decoration-4 italic">Chat & Posting</h2>
              <div className="space-y-4">
                <NeobrutalistButton onClick={() => setChatMode('admin')} bgColor="bg-[#ffd900]">
                  Chat Admin (Crisp) 💬
                </NeobrutalistButton>
                <NeobrutalistButton onClick={() => setChatMode('member')} bgColor="bg-[#7ae0ff]">
                  Chat Only Member (AI) 🤖
                </NeobrutalistButton>
                <NeobrutalistButton onClick={() => setChatMode('discord')} bgColor="bg-[#5865F2] text-white">
                  Discord Community 🎮
                </NeobrutalistButton>
              </div>
              <NeobrutalistButton onClick={() => setCurrentPage('home')} bgColor="bg-[#ff5ecf]" className="mt-8">
                Kembali Ke Beranda
              </NeobrutalistButton>
            </div>
          );
        } else if (chatMode === 'admin') {
          if (!acknowledgedWarning) {
            return (
              <div className="space-y-6 flex flex-col items-center text-black">
                <div className="bg-[#ffd900] border-4 border-black p-6 neobrutalism-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <img src="https://api.iconify.design/ri:error-warning-fill.svg" width="32" className="text-black" />
                    <h2 className="text-2xl font-black uppercase">Peringatan!</h2>
                  </div>
                  <p className="font-bold leading-tight mb-6 text-sm">
                    Admin akan membalas jika sedang aktif. Jika admin sedang offline, pesan akan diteruskan ke email admin.
                  </p>
                  <NeobrutalistButton onClick={() => setAcknowledgedWarning(true)} bgColor="bg-black text-white">
                    SAYA MENGERTI
                  </NeobrutalistButton>
                </div>
                <button onClick={resetChat} className="font-black underline">Kembali</button>
              </div>
            );
          }
          return (
            <div className="space-y-4 flex flex-col h-[75vh] text-black">
              <h2 className="text-2xl font-black underline decoration-4">Chat Admin</h2>
              <div className="flex-1 border-4 border-black neobrutalism-shadow bg-white overflow-hidden">
                <iframe 
                  src="https://go.crisp.chat/chat/embed/?website_id=9bab5eee-525e-4069-aeaf-abc734a170eb"
                  className="w-full h-full"
                  title="Crisp Chat"
                  frameBorder="0"
                />
              </div>
              <button onClick={resetChat} className="bg-black text-white px-4 py-2 font-bold border-2 border-black">
                Ganti Mode Chat
              </button>
            </div>
          );
        } else if (chatMode === 'discord') {
          return (
            <div className="space-y-6 flex flex-col items-center text-black">
              <h2 className="text-3xl font-black underline decoration-4 self-start">DISCORD SERVER</h2>
              
              <div className="bg-[#5865F2] border-4 border-black neobrutalism-shadow p-8 text-center space-y-6 w-full text-white">
                <div className="w-24 h-24 bg-white border-4 border-black mx-auto flex items-center justify-center neobrutalism-shadow mb-4 rounded-full overflow-hidden">
                  <img src="https://api.iconify.design/bi:discord.svg" width="60" className="text-[#5865F2]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase">KABUTCRAFT SERVER</h3>
                  <p className="font-bold opacity-90 text-sm leading-tight">
                    Klik tombol di bawah untuk langsung bergabung ke komunitas KabutCraft di Discord!
                  </p>
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={() => window.open(DISCORD_INVITE_LINK, '_blank')} 
                    className="w-full bg-white text-[#5865F2] py-4 px-4 text-xl font-black border-4 border-black neobrutalism-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    JOIN SEKARANG! 🚀
                  </button>
                </div>

                <div className="bg-black/20 p-2 border-2 border-black/30 font-mono text-xs">
                  {DISCORD_INVITE_LINK}
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button onClick={resetChat} className="bg-white border-4 border-black px-4 py-2 font-black neobrutalism-shadow">
                  KEMBALI
                </button>
                <button onClick={() => { resetChat(); setCurrentPage('home'); }} className="flex-1 bg-[#ff5ecf] border-4 border-black px-4 py-2 font-black neobrutalism-shadow">
                  BERANDA
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4 text-black">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black underline decoration-4">AI Chat</h2>
                <button onClick={resetChat} className="text-sm font-bold underline">Menu Chat</button>
              </div>
              <ChatSection />
              <NeobrutalistButton onClick={() => { resetChat(); setCurrentPage('home'); }} bgColor="bg-[#ff5ecf]">
                Ke Beranda
              </NeobrutalistButton>
            </div>
          );
        }
      case 'video':
        return (
          <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2 pb-8 text-black">
            <h2 className="text-3xl font-black mb-4 underline decoration-4">YouTube KabutCraft</h2>
            
            <div className="bg-white border-4 border-black p-4 neobrutalism-shadow">
              <h3 className="font-black text-xl mb-4 bg-[#ff0000] text-white p-2 inline-block uppercase">Update Terbaru</h3>
              <div className="aspect-video bg-black border-2 border-black overflow-hidden mb-4">
                 <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed?listType=user_uploads&list=kabutcraft" 
                    title="Latest Video"
                    frameBorder="0"
                    allowFullScreen
                  />
              </div>
              <NeobrutalistButton 
                onClick={() => window.open('https://youtube.com/@kabutcraft', '_blank')} 
                bgColor="bg-[#ff0000] text-white"
              >
                Ke Channel YouTube 🎥
              </NeobrutalistButton>
            </div>

            <NeobrutalistButton onClick={() => setCurrentPage('home')} bgColor="bg-[#ff5ecf]">
              Kembali ke Beranda
            </NeobrutalistButton>
          </div>
        );
      case 'qna':
        return (
          <div className="space-y-4 text-black">
            <h2 className="text-3xl font-black mb-4 underline decoration-4">Q&A with Crew</h2>
            <div className="bg-white p-6 border-4 border-black neobrutalism-shadow">
              <input 
                className="w-full p-3 border-2 border-black font-bold mb-4 focus:outline-none"
                placeholder="Tanya apa saja..."
                value={qnaInput}
                onChange={(e) => setQnaInput(e.target.value)}
              />
              <NeobrutalistButton onClick={handleQna} bgColor="bg-[#ffd900]" className="mb-4">
                Kirim Pertanyaan
              </NeobrutalistButton>
              {isQnaLoading && <p className="font-black animate-pulse italic">Memikirkan jawaban...</p>}
              {qnaAnswer && (
                <div className="mt-4 p-4 bg-[#ff5ecf] border-2 border-black font-black text-white">
                  {qnaAnswer}
                </div>
              )}
            </div>
            <NeobrutalistButton onClick={() => setCurrentPage('home')} bgColor="bg-[#ff5ecf]">
              Back Home
            </NeobrutalistButton>
          </div>
        );
      case 'sawer':
        return (
          <div className="space-y-6 flex flex-col items-center text-black">
            <h2 className="text-3xl font-black mb-4 underline decoration-4 self-start">Support / Sawer</h2>
            <div className="bg-white border-4 border-black neobrutalism-shadow p-8 text-center space-y-4 w-full">
              <div className="w-20 h-20 bg-[#ffd900] border-4 border-black mx-auto flex items-center justify-center neobrutalism-shadow mb-4">
                <img src="https://api.iconify.design/ri:hand-coin-fill.svg" width="40" />
              </div>
              <h3 className="text-2xl font-black uppercase">Dukung KabutCraft!!</h3>
              <p className="font-bold text-gray-700 text-sm">Setiap dukungan sangat membantu operasional KabutCraft. Terima kasih!</p>
              <div className="pt-4">
                <NeobrutalistButton onClick={() => window.open('https://saweria.co/KabutCraft', '_blank')} bgColor="bg-[#ffd900]">
                  Sawer Sekarang 💸
                </NeobrutalistButton>
              </div>
            </div>
            <NeobrutalistButton onClick={() => setCurrentPage('home')} bgColor="bg-[#ff5ecf]">
              Kembali
            </NeobrutalistButton>
          </div>
        );
      default:
        return (
          <div className="space-y-6 text-center text-black">
            <div className="flex justify-center gap-8 mb-8 scale-110">
              <a href="#" className="hover:scale-110 transition-transform"><img src="https://api.iconify.design/ri:instagram-line.svg" width="32" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><img src="https://api.iconify.design/ri:tiktok-fill.svg" width="32" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><img src="https://api.iconify.design/ri:twitter-x-fill.svg" width="32" /></a>
            </div>

            <div className="space-y-4">
              <NeobrutalistButton onClick={() => setCurrentPage('about')} bgColor="bg-[#7ae0ff]">
                About Me
              </NeobrutalistButton>
              <NeobrutalistButton onClick={() => { resetChat(); setCurrentPage('chat'); }} bgColor="bg-[#7ae0ff]">
                Chat & Posting
              </NeobrutalistButton>
              <NeobrutalistButton onClick={() => setCurrentPage('video')} bgColor="bg-[#00ffa3]">
                My Vidio
              </NeobrutalistButton>
              <NeobrutalistButton onClick={() => setCurrentPage('qna')} bgColor="bg-[#ff80e5]">
                Qna & Kru
              </NeobrutalistButton>
              <NeobrutalistButton onClick={() => setCurrentPage('sawer')} bgColor="bg-[#ffd900]">
                Sawer / Donasi 💰
              </NeobrutalistButton>
            </div>

            <div className="pt-12 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-black max-w-sm mx-auto uppercase">
                Klik <span className="bg-[#7ae0ff] px-2 border-2 border-black">Tombol</span> ini, untuk saling chat 😊
              </h1>
              <p className="mt-8 text-gray-700 font-bold opacity-60 text-xs">
                ( Developed by MistHaze )
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-card p-8 md:p-12 min-h-[80vh] flex flex-col relative overflow-hidden">
        {renderContent()}
      </div>
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: black; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default App;
