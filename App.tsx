
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Platform, PostInputs, SourceAspectRatio, PLATFORM_CONFIGS } from './types';
import { ICONS, FIXED_CAPTION, FIXED_HASHTAGS } from './constants.tsx';
import PlatformMockup from './components/PlatformMockup';

declare const html2canvas: any;

const App: React.FC = () => {
  const [inputs, setInputs] = useState<PostInputs>({
    platform: Platform.INSTAGRAM,
    username: '',
    photo: null,
    aspectRatio: SourceAspectRatio.SQUARE,
  });

  // Settings state persisted in localStorage
  const [caption, setCaption] = useState(() => localStorage.getItem('pmw_caption') || FIXED_CAPTION);
  const [hashtags, setHashtags] = useState(() => localStorage.getItem('pmw_hashtags') || FIXED_HASHTAGS);
  
  // UI states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('pmw_caption', caption);
  }, [caption]);

  useEffect(() => {
    localStorage.setItem('pmw_hashtags', hashtags);
  }, [hashtags]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs(prev => ({ ...prev, photo: reader.result as string }));
        setFinalImage(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject('No 2d context'); return; }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

        const targetCanvas = document.createElement('canvas');
        const targetWidth = 1024;
        const targetHeight = (pixelCrop.height / pixelCrop.width) * targetWidth;
        targetCanvas.width = targetWidth;
        targetCanvas.height = targetHeight;
        const targetCtx = targetCanvas.getContext('2d');
        if (targetCtx) { targetCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight); }
        resolve(targetCanvas.toDataURL('image/jpeg', 0.95));
      };
      image.onerror = (e) => reject(e);
    });
  };

  const handleGenerate = async () => {
    if (!inputs.photo || !croppedAreaPixels) {
      setError("Please upload and adjust your photo first.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const croppedPhoto = await getCroppedImg(inputs.photo, croppedAreaPixels);
      setFinalImage(croppedPhoto);
    } catch (err: any) {
      console.error(err);
      setError("Failed to process image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = useCallback(async () => {
    const element = document.getElementById('mockup-export');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mockup-${inputs.platform}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError("Export failed. Try again.");
    }
  }, [inputs.platform]);

  const getAspectNumeric = () => {
    switch(inputs.aspectRatio) {
      case SourceAspectRatio.SQUARE: return 1;
      case SourceAspectRatio.LANDSCAPE: return 1.91;
      case SourceAspectRatio.PORTRAIT: return 0.8;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Settings Modal Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <i className="fas fa-cog text-indigo-600"></i>
                 Post Settings
               </h3>
               <button onClick={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                 <i className="fas fa-times text-slate-500"></i>
               </button>
             </div>
             <div className="p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <i className="fas fa-align-left text-indigo-400"></i> Default Caption
                  </label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={5}
                    placeholder="Enter post description..."
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium text-slate-700 bg-slate-50 text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <i className="fas fa-hashtag text-indigo-400"></i> Default Hashtags
                  </label>
                  <textarea 
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    rows={3}
                    placeholder="#your #hashtags #here"
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium text-blue-600 bg-slate-50 text-sm transition-all"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic">Settings are saved automatically to your browser.</p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => { setCaption(FIXED_CAPTION); setHashtags(FIXED_HASHTAGS); }}
                    className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm"
                  >
                    Reset Defaults
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm"
                  >
                    Save & Close
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Sidebar Controls */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shadow-sm z-10 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg">📸</span>
              Post Designer
            </h1>
            <p className="text-slate-600 font-medium text-sm mt-1">Social Media Post Generator</p>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 flex items-center justify-center transition-all group"
            title="Open Settings"
          >
            <i className="fas fa-cog text-lg group-hover:rotate-45 transition-transform duration-500"></i>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Step 1: Platform Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600">1. Select Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.values(Platform) as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setInputs(prev => ({ ...prev, platform: p }))}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold
                    ${inputs.platform === p 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-700 bg-slate-50'
                    }`}
                >
                  <span className={`text-lg ${inputs.platform === p ? 'opacity-100' : 'opacity-70'}`}>{ICONS[p]}</span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Username Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600">2. Username</label>
            <input
              type="text"
              placeholder="@your_username"
              value={inputs.username}
              onChange={(e) => setInputs(prev => ({ ...prev, username: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-slate-900 font-medium"
            />
          </div>

          {/* Step 3: Aspect Ratio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600">3. Post Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(SourceAspectRatio) as SourceAspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => { setInputs(prev => ({ ...prev, aspectRatio: ratio })); setFinalImage(null); }}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border-2 transition-all text-[10px] font-bold
                    ${inputs.aspectRatio === ratio 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-700 bg-slate-50'
                    }`}
                >
                  <div className={`border-2 border-current rounded-sm mb-1 ${
                    ratio === SourceAspectRatio.SQUARE ? 'w-5 h-5' : 
                    ratio === SourceAspectRatio.LANDSCAPE ? 'w-7 h-4' : 'w-4 h-6'
                  }`} />
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Photo Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600">4. Upload Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden bg-slate-50"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              {inputs.photo ? (
                <div className="absolute inset-0 w-full h-full">
                  <img src={inputs.photo} className="w-full h-full object-cover" alt="uploaded preview" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm font-bold bg-indigo-600 px-4 py-2 rounded-xl shadow-lg">Change Photo</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
                    <i className="fas fa-cloud-upload-alt text-slate-400 text-xl group-hover:text-indigo-500"></i>
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-center">Drop image here or click</span>
                </>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            disabled={isGenerating || !inputs.photo}
            onClick={handleGenerate}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all
              ${isGenerating || !inputs.photo
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
              }`}
          >
            {isGenerating ? (
              <><i className="fas fa-circle-notch fa-spin"></i> Preparing Mockup...</>
            ) : (
              <><i className="fas fa-check-circle"></i> Generate Mockup Post</>
            )}
          </button>
          
          {error && <p className="text-red-600 text-sm text-center font-bold bg-red-50 p-4 rounded-xl border border-red-200">{error}</p>}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between font-medium">
          <span>&copy; 2024 Post Designer</span>
          <span className="cursor-pointer hover:text-indigo-600" onClick={() => setIsSettingsOpen(true)}>Edit Defaults</span>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col items-center justify-center gap-8 bg-slate-50">
        {!finalImage && !isGenerating && !inputs.photo && (
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-white shadow-xl text-indigo-100 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-8 border border-slate-100">
              <i className="fas fa-images text-slate-200"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Create Professional Posts Instantly</h2>
            <p className="text-slate-600 mt-3 font-medium">Upload your photo, adjust the crop, and we'll place it inside a realistic social media mockup.</p>
          </div>
        )}

        {inputs.photo && !finalImage && !isGenerating && (
          <div className="w-full flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center mb-2">
              <h2 className="text-xl font-black text-slate-900">Adjust Your Crop</h2>
              <p className="text-slate-500 text-sm font-medium">Move or zoom the image to select the perfect area.</p>
            </div>
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200" style={{ height: '500px' }}>
              <Cropper
                image={inputs.photo}
                crop={crop}
                zoom={zoom}
                aspect={getAspectNumeric()}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{ containerClassName: 'rounded-3xl' }}
              />
            </div>
            <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <i className="fas fa-search-minus text-slate-400"></i>
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              <i className="fas fa-search-plus text-slate-400"></i>
            </div>
          </div>
        )}

        {finalImage && (
          <div className="w-full flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="platform-preview rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white max-w-4xl w-full border border-slate-200">
                <PlatformMockup 
                  platform={inputs.platform} 
                  username={inputs.username} 
                  image={finalImage} 
                  selectedAspectRatio={inputs.aspectRatio}
                  caption={caption}
                  hashtags={hashtags}
                />
             </div>
             <div className="flex items-center gap-4">
               <button onClick={() => setFinalImage(null)} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all">
                  <i className="fas fa-crop-alt"></i> Back to Crop
                </button>
               <button onClick={handleDownload} className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[1.5rem] font-black shadow-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 text-lg">
                  <i className="fas fa-file-download text-xl"></i> Download Mockup PNG
                </button>
             </div>
          </div>
        )}

        {isGenerating && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="flex flex-col items-center text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-white">
               <div className="relative mb-8">
                 <div className="w-28 h-28 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fas fa-camera text-indigo-600 text-3xl animate-pulse"></i>
                 </div>
               </div>
               <h3 className="text-2xl font-black text-slate-900">Finalizing Mockup</h3>
               <p className="text-slate-600 mt-3 max-w-xs font-medium leading-relaxed">Arranging your photo into the pixel-perfect post layout...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
