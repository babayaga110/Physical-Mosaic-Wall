
import React from 'react';
import { Platform, PLATFORM_CONFIGS, SourceAspectRatio } from '../types';

interface Props {
  platform: Platform;
  username: string;
  image: string;
  selectedAspectRatio: SourceAspectRatio;
  caption: string;
  hashtags: string;
}

const PlatformMockup: React.FC<Props> = ({ platform, username, image, selectedAspectRatio, caption, hashtags }) => {
  const config = PLATFORM_CONFIGS[platform];
  
  const renderHeader = () => {
    switch (platform) {
      case Platform.INSTAGRAM:
        return (
          <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100">
                <img src="https://picsum.photos/seed/user/50/50" alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="ml-3 font-bold text-sm text-slate-900">{username || 'username'}</div>
            <div className="ml-auto text-slate-400"><i className="fas fa-ellipsis-h"></i></div>
          </div>
        );
      case Platform.FACEBOOK:
        return (
          <div className="flex items-center px-4 py-3 bg-white">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img src="https://picsum.photos/seed/user/50/50" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3">
              <div className="font-bold text-[15px] text-[#050505]">{username || 'Username'}</div>
              <div className="text-xs text-slate-500 font-medium flex items-center">
                Just now · <i className="fas fa-globe-americas ml-1 text-[10px]"></i>
              </div>
            </div>
            <div className="ml-auto text-slate-500 self-start mt-1"><i className="fas fa-ellipsis-h"></i></div>
          </div>
        );
      case Platform.LINKEDIN:
        return (
          <div className="flex items-center px-4 py-3 bg-white">
            <div className="w-12 h-12 rounded-sm overflow-hidden border border-gray-200">
              <img src="https://picsum.photos/seed/user/60/60" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-2">
              <div className="font-bold text-sm text-slate-900">{username || 'Your Name'}</div>
              <div className="text-xs text-slate-600">Founder at Physical Mosaic Wall</div>
              <div className="text-[11px] text-slate-500 flex items-center">1h • <i className="fas fa-globe-americas ml-1"></i></div>
            </div>
            <div className="ml-auto text-slate-400 self-start mt-1"><i className="fas fa-ellipsis-h"></i></div>
          </div>
        );
      case Platform.TWITTER:
        // Twitter header is minimal; content is handled in the main body for layout accuracy
        return (
          <div className="flex items-start px-4 pt-3 bg-white">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src="https://picsum.photos/seed/user/50/50" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold text-sm text-slate-900">{username || 'Username'}</span>
                  <span className="ml-1 text-slate-500 text-sm">@{username?.toLowerCase().replace(/\s/g, '') || 'user'} · 1m</span>
                </div>
                <div className="text-slate-400"><i className="fas fa-ellipsis-h"></i></div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderActions = () => {
    switch (platform) {
      case Platform.INSTAGRAM:
        return (
          <div className="px-4 py-3 bg-white border-t border-gray-50">
            <div className="flex items-center gap-4 text-2xl text-slate-900">
              <i className="far fa-heart cursor-pointer"></i>
              <i className="far fa-comment cursor-pointer"></i>
              <i className="far fa-paper-plane cursor-pointer"></i>
              <i className="far fa-bookmark ml-auto cursor-pointer"></i>
            </div>
            <div className="mt-3 font-bold text-sm text-slate-900">1,234 likes</div>
            <div className="mt-2 text-sm leading-relaxed">
              <span className="font-bold text-slate-900 mr-2">{username || 'username'}</span>
              <span className="text-slate-800 whitespace-pre-wrap">{caption}</span>
            </div>
            <div className="mt-2 text-sm text-blue-800 font-semibold whitespace-pre-wrap">{hashtags}</div>
            <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 HOUR AGO</div>
          </div>
        );
      case Platform.FACEBOOK:
        return (
          <div className="bg-white">
             <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white border border-white"><i className="fas fa-thumbs-up"></i></div>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white border border-white"><i className="fas fa-heart"></i></div>
                  </div>
                  <span className="ml-2 text-[12px] text-slate-600 font-medium">1.2K</span>
                </div>
                <div className="text-[12px] text-slate-500">45 comments • 12 shares</div>
             </div>
             <div className="flex items-center justify-around py-1">
               <button className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="far fa-thumbs-up"></i> Like</button>
               <button className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="far fa-comment"></i> Comment</button>
               <button className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="fas fa-share"></i> Share</button>
             </div>
          </div>
        );
      case Platform.LINKEDIN:
        return (
          <div className="bg-white px-4">
             <div className="py-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white border border-white"><i className="fas fa-thumbs-up"></i></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white border border-white"><i className="fas fa-lightbulb"></i></div>
                  </div>
                  <span className="ml-2 text-xs text-slate-600 font-medium">234</span>
                </div>
                <div className="text-xs text-slate-500">12 comments • 5 shares</div>
             </div>
             <div className="flex items-center justify-between py-1">
               <button className="flex flex-col md:flex-row items-center gap-1.5 py-2 px-2 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="far fa-thumbs-up"></i> <span>Like</span></button>
               <button className="flex flex-col md:flex-row items-center gap-1.5 py-2 px-2 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="far fa-comment-dots"></i> <span>Comment</span></button>
               <button className="flex flex-col md:flex-row items-center gap-1.5 py-2 px-2 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="fas fa-retweet"></i> <span>Repost</span></button>
               <button className="flex flex-col md:flex-row items-center gap-1.5 py-2 px-2 hover:bg-gray-100 rounded text-slate-600 font-bold text-sm transition-colors"><i className="fas fa-paper-plane"></i> <span>Send</span></button>
             </div>
          </div>
        );
      case Platform.TWITTER:
        return (
          <div className="ml-14 mr-4 py-3 bg-white">
             <div className="flex items-center justify-between text-slate-500 max-w-sm">
               <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><i className="far fa-comment"></i> <span className="text-xs">42</span></div>
               <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer"><i className="fas fa-retweet"></i> <span className="text-xs">12</span></div>
               <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer"><i className="far fa-heart"></i> <span className="text-xs">256</span></div>
               <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><i className="far fa-chart-bar"></i> <span className="text-xs">1.5K</span></div>
               <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><i className="far fa-bookmark"></i></div>
             </div>
          </div>
        );
    }
  };

  const getImageAspectRatio = () => {
    switch (selectedAspectRatio) {
      case SourceAspectRatio.SQUARE: return '1 / 1';
      case SourceAspectRatio.LANDSCAPE: return '1.91 / 1';
      case SourceAspectRatio.PORTRAIT: return '4 / 5';
      default: return '1 / 1';
    }
  };

  return (
    <div 
      id="mockup-export"
      className="bg-white border border-gray-200 overflow-hidden mx-auto shadow-sm"
      style={{ 
        width: config.width, 
        maxWidth: '100%',
        height: 'auto'
      }}
    >
      <div className="flex flex-col bg-white text-slate-900">
        {renderHeader()}
        
        {/* Main Content Area */}
        {platform === Platform.TWITTER ? (
          <div className="ml-14 mr-4 bg-white">
            <div className="text-[15px] text-slate-900 whitespace-pre-wrap leading-normal mb-3">
              {caption}
              <div className="text-blue-500 mt-1">{hashtags}</div>
            </div>
            <div 
              className="relative rounded-2xl border border-gray-200 overflow-hidden bg-gray-50"
              style={{ aspectRatio: getImageAspectRatio() }}
            >
              <img src={image} alt="Post Content" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <>
            {(platform === Platform.FACEBOOK || platform === Platform.LINKEDIN) ? (
              <div className="px-4 py-2 text-[15px] text-slate-900 whitespace-pre-wrap leading-relaxed bg-white">
                {caption}
                <div className="mt-2 text-blue-700 font-semibold">{hashtags}</div>
              </div>
            ) : null}

            <div 
              className="relative bg-gray-50 flex items-center justify-center w-full overflow-hidden"
              style={{ aspectRatio: getImageAspectRatio() }}
            >
              <img 
                src={image} 
                alt="Post Content" 
                className="w-full h-full object-cover" 
              />
            </div>
          </>
        )}

        {renderActions()}
      </div>
    </div>
  );
};

export default PlatformMockup;
