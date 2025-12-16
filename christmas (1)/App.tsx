import React, { useState, useEffect } from 'react';
import { Experience } from './components/Experience';

// --- Configuration ---
// Define the static images that will be deployed with the site.
// GitHub Pages Deployment Note:
// 1. Ensure a folder named 'photos' exists at the root of your public directory (next to index.html).
// 2. Ensure images are named exactly '1.jpg' through '41.jpg' (case sensitive on GitHub!).
// 3. If your images are .JPG or .jpeg, you must update the extension below.
const STATIC_IMAGES = Array.from({ length: 41 }, (_, i) => `photos/${i + 1}.jpg`);

function App() {
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Initialize state with the static images so users see them immediately upon loading
  const [displayImages, setDisplayImages] = useState<string[]>(STATIC_IMAGES);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCameraReady = (video: HTMLVideoElement) => {
    setCameraReady(true);
  };

  const handleError = (msg: string) => {
      setErrorMsg(msg);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsProcessing(true);
      const files = Array.from(event.target.files);
      const validFiles: File[] = [];
      let sizeError = false;

      files.forEach(file => {
          // 15MB Limit Per File to be safe
          if (file.size > 15 * 1024 * 1024) {
              sizeError = true;
          } else {
              validFiles.push(file);
          }
      });

      if (sizeError) {
          alert("部分图片过大（超过15MB），为了防止浏览器崩溃已跳过。");
      }

      if (validFiles.length > 0) {
          const newUrls = validFiles.map(file => URL.createObjectURL(file));
          
          // Small delay to allow UI to show "Processing" state
          setTimeout(() => {
            setDisplayImages(prev => [...prev, ...newUrls]);
            setIsProcessing(false);
          }, 500);
      } else {
          setIsProcessing(false);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-yellow-500 font-serif selection:bg-yellow-500/30">
      
      {/* 3D Experience */}
      <Experience 
        uploadedImages={displayImages} 
        onCameraReady={handleCameraReady}
        onError={handleError}
      />

      {/* Loading Screen / Error Screen */}
      <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-black pointer-events-none transition-opacity duration-1000 ${(!cameraReady || isProcessing) ? 'opacity-100' : 'opacity-0'}`}>
         {errorMsg ? (
            <div className="text-center pointer-events-auto p-8 border border-red-500/50 rounded-lg bg-red-900/20 max-w-md backdrop-blur-md">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl text-red-500 mb-2 font-bold uppercase tracking-widest">启动失败</h2>
                <p className="text-red-300 text-sm">{errorMsg}</p>
                <p className="text-gray-500 text-xs mt-4">请确保允许摄像头权限，并使用最新版 Chrome/Edge 浏览器。</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-800 hover:bg-red-700 text-white rounded uppercase text-xs tracking-widest transition-colors"
                >
                    重试
                </button>
            </div>
         ) : (
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(255,215,0,0.2)]"></div>
                <h2 className="text-2xl text-yellow-500 tracking-[0.2em] uppercase animate-pulse">
                    {isProcessing ? "正在处理照片..." : "正在启动魔法..."}
                </h2>
                <p className="text-yellow-500/40 text-sm mt-3 tracking-widest">
                    请允许访问摄像头以进行手势交互
                </p>
                {/* Deployment hint for user if images are missing */}
                <p className="text-red-500/60 text-[10px] mt-8 tracking-widest uppercase">
                    若看到紫色方块，说明 photos 文件夹路径错误
                </p>
            </div>
         )}
      </div>

      {/* Main UI Overlay */}
      <div className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-1000 ${(cameraReady && !isProcessing) ? 'opacity-100' : 'opacity-0'}`}>
         
         {/* Title / Header */}
         <div className="absolute top-8 w-full text-center opacity-50">
             <h1 className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-700">
                 圣诞记忆星系
             </h1>
         </div>

         {/* Instruction Text */}
         <div className="absolute bottom-24 w-full text-center">
            <div className="inline-block bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/10">
                <p className="text-yellow-100 text-xs md:text-sm tracking-[0.3em] uppercase text-shadow-lg font-bold">
                    张开手掌：散开 &nbsp;&bull;&nbsp; 握拳：凝聚 &nbsp;&bull;&nbsp; 捏合：查看
                </p>
            </div>
         </div>

         {/* Add More Button */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
              <label className="group cursor-pointer flex items-center justify-center px-6 py-2 rounded-full bg-white/5 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500 transition-all duration-300">
                  <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest group-hover:text-yellow-200">
                      + 添加更多照片
                  </span>
                  <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileUpload}
                  />
              </label>
          </div>
      </div>

    </div>
  );
}

export default App;