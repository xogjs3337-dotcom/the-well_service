// --- UNIVERSAL FLOATING BACK BUTTON ---

        const DraggablePreview = ({ src, initialPosition, onPositionChange, onDelete }) => {
            const imgRef = useRef(null);
            const [pos, setPos] = useState(initialPosition || { x: 50, y: 50 });
            const [isDragging, setIsDragging] = useState(false);
            const [startPos, setStartPos] = useState({ x: 0, y: 0 });

            const handleMouseDown = (e) => {
                setIsDragging(true);
                setStartPos({ x: e.clientX, y: e.clientY });
            };

            const handleMouseMove = (e) => {
                if (!isDragging || !imgRef.current) return;
                const dx = e.clientX - startPos.x;
                const dy = e.clientY - startPos.y;
                const rect = imgRef.current.getBoundingClientRect();
                const percentX = (dx / rect.width) * 100;
                const percentY = (dy / rect.height) * 100;
                let newX = Math.min(100, Math.max(0, pos.x - percentX * 1.5));
                let newY = Math.min(100, Math.max(0, pos.y - percentY * 1.5));
                setPos({ x: newX, y: newY });
                setStartPos({ x: e.clientX, y: e.clientY });
                if (onPositionChange) onPositionChange({ x: newX, y: newY });
            };

            const handleMouseUp = () => setIsDragging(false);
            const handleMouseLeave = () => setIsDragging(false);

            return (
                <div className="relative w-full h-32 overflow-hidden rounded-xl border border-gray-200 group bg-gray-100" onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
                    <div ref={imgRef} className="w-full h-full cursor-move" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: `${pos.x}% ${pos.y}%`, backgroundRepeat: 'no-repeat' }} />
                    <div className="absolute inset-0 border-2 border-[#10b981] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 flex items-center justify-center">
                        <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">드래그하여 뷰 조정</span>
                    </div>
                </div>
            );
        };

        const BoardPage = ({ category, onBack }) => {
            const readableCategory = category ? category.replace('-', ' ') : '알 수 없음';
            const [posts, setPosts] = useState([]);
            const [activeIndex, setActiveIndex] = useState(0);
            
            const [viewMode, setViewMode] = useState('LIST');
            const [stage, setStage] = useState('after');
            const [imgIndex, setImgIndex] = useState(0);

            useEffect(() => {
                window.scrollTo(0, 0);
                const mockPosts = [
                    { 
                        id: 1, title: `[${readableCategory}] 첫 번째 프리미엄 현장`, content: `더 웰 서비스만의 독보적인 8단계 세척 시스템을 적용한 대표 사례입니다. 대형 창호와 특수 바닥재의 오염을 완벽하게 제거하여 본래의 광택을 되찾아드렸습니다. 상세 리포트에서 작업 전후의 놀라운 변화를 확인하세요.`, date: '2026.03.20', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
                        detail: {
                            before: [{ url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }],
                            during: [{ url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }],
                            after: [{ url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }, { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }]
                        }
                    },
                    { 
                        id: 2, title: `[${readableCategory}] 두 번째 디테일 작업 완료`, content: `정밀 바닥 세척과 왁스 코팅을 통해 공간의 위생 등급을 한 차원 높인 현장입니다. 특수 장비를 활용하여 찌든 때를 뿌리까지 제거했습니다.`, date: '2026.03.15', img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1200',
                        detail: {
                            before: [{ url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }],
                            during: [],
                            after: [{ url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }]
                        }
                    },
                    { 
                        id: 3, title: `[${readableCategory}] 친환경 특수 약품 시공`, content: `인체에 무해한 최고급 약품만을 사용하여 찌든 오염물과 바이러스까지 박멸했습니다. 아이들과 노약자가 머무는 공간에도 안심하고 시공할 수 있는 더 웰 서비스의 친환경 솔루션입니다.`, date: '2026.03.10', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200',
                        detail: { before: [], during: [], after: [{ url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200', posX: 50, posY: 50 }] }
                    }
                ];
                setPosts(mockPosts);
            }, [category]);

            const activePost = posts[activeIndex];
            const currentDetailImages = activePost && activePost.detail && activePost.detail[stage] ? activePost.detail[stage] : [];
            const activeImg = (viewMode === 'DETAIL' && currentDetailImages[imgIndex]) 
                ? currentDetailImages[imgIndex] 
                : (activePost ? { url: activePost.img, posX: 50, posY: 50 } : null);

            const openProjectDetail = () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setViewMode('DETAIL');
                setStage('after');
                setImgIndex(0);
            };

            const [isModalOpen, setIsModalOpen] = useState(false);
            const [formData, setFormData] = useState({ title: '', content: '' });
            const [filesData, setFilesData] = useState({ main: null, before: [], during: [], after: [] });

            const handleFileChange = (e, stageType) => {
                if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files).map(f => ({
                        file: f, url: URL.createObjectURL(f), posX: 50, posY: 50
                    }));
                    if(stageType === 'main') setFilesData({ ...filesData, main: newFiles[0] });
                    else setFilesData({ ...filesData, [stageType]: [...filesData[stageType], ...newFiles] });
                }
            };
            
            const handleUpload = (e) => {
                e.preventDefault();
                const detailImgs = {
                    before: filesData.before.map(f => ({ url: f.url, posX: f.posX, posY: f.posY })),
                    during: filesData.during.map(f => ({ url: f.url, posX: f.posX, posY: f.posY })),
                    after: filesData.after.map(f => ({ url: f.url, posX: f.posX, posY: f.posY }))
                };
                const newPost = { id: Date.now(), title: formData.title, content: formData.content, date: '오늘', img: filesData.main ? filesData.main.url : posts[0].img, detail: detailImgs };
                setPosts([newPost, ...posts]);
                setIsModalOpen(false);
                setFilesData({ main: null, before: [], during: [], after: [] });
            };

            return (
                <div className="pt-28 pb-32 min-h-screen bg-gray-50 font-sans animate-in fade-in slide-in-from-bottom-12 duration-[1500ms] ease-out">
                    
                    {/* 통합 플로팅 뒤로가기 버튼 */}
                    <div className="fixed top-24 left-6 md:left-12 z-[90] animate-in slide-in-from-left-10 duration-500">
                        <button 
                            onClick={viewMode === 'DETAIL' ? () => setViewMode('LIST') : onBack} 
                            className="group flex items-center bg-white/90 backdrop-blur-md border border-gray-100 p-2 md:pr-6 rounded-full shadow-2xl hover:bg-[#10b981] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#10b981] group-hover:bg-white text-white group-hover:text-[#10b981] rounded-full flex items-center justify-center transition-colors shadow-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </div>
                            <span className="hidden md:block ml-4 font-black transition-colors uppercase tracking-tight">
                                {viewMode === 'DETAIL' ? '현장 목록으로' : '대문으로 돌아가기'}
                            </span>
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                            <div>
                                <div className="w-16 h-1.5 bg-[#10b981] rounded-full mb-6"></div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                    {viewMode === 'LIST' ? `${readableCategory} 현황` : 'Success Story'}
                                </h1>
                                <p className="text-lg text-gray-400 font-medium">{viewMode === 'LIST' ? '현장 관리 데이터를 번호별로 탐색하세요.' : `${activePost?.title}의 드라마틱한 변화 기록입니다.`}</p>
                            </div>
                            {viewMode === 'LIST' && (
                                <button onClick={() => setIsModalOpen(true)} className="mt-8 md:mt-0 inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-bold shadow-xl hover:bg-[#10b981] transition-transform transform hover:-translate-y-1 duration-300">
                                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                    새 갤러리 업로드
                                </button>
                            )}
                        </div>
                        
                        {posts.length > 0 && activePost ? (
                            <div className="bg-white rounded-[2.5rem] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row h-auto lg:min-h-[650px] relative group animate-in fade-in zoom-in-95 duration-500">
                                
                                {/* 1. 큰 이미지 영역 */}
                                <div className={`w-full lg:w-[60%] min-h-[400px] lg:h-auto relative overflow-hidden bg-gray-900 flex-shrink-0 group/slider ${viewMode === 'LIST' ? 'cursor-pointer' : ''}`} onClick={viewMode === 'LIST' ? openProjectDetail : null}>
                                    <div 
                                        className="absolute inset-0 w-full h-full transition-all duration-1000 group-hover/slider:scale-[1.05]" 
                                        style={{ 
                                            backgroundImage: `url(${activeImg ? activeImg.url : activePost.img})`, 
                                            backgroundSize: 'cover', 
                                            backgroundPosition: viewMode === 'DETAIL' ? `${activeImg.posX}% ${activeImg.posY}%` : 'center'
                                        }} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity"></div>

                                    {viewMode === 'LIST' && (
                                        <div className="absolute inset-0 flex items-end justify-between p-10 opacity-0 group-hover/slider:opacity-100 transition-all transform translate-y-4 group-hover/slider:translate-y-0 text-white pointer-events-none">
                                            <span className="font-black text-xl tracking-tight">상세 리포트 보기</span>
                                            <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center shadow-2xl ring-2 ring-white/50">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    )}
                                    {/* 상세 슬라이더 화살표 */}
                                    {viewMode === 'DETAIL' && currentDetailImages.length > 1 && (
                                        <React.Fragment>
                                            <button onClick={() => setImgIndex((i) => (i - 1 + currentDetailImages.length) % currentDetailImages.length)} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-[#10b981] text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all z-20"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>
                                            <button onClick={() => setImgIndex((i) => (i + 1) % currentDetailImages.length)} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-[#10b981] text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all z-20"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg></button>
                                        </React.Fragment>
                                    )}
                                </div>
                                
                                {/* 2. 우측 패널 */}
                                <div className="w-full lg:w-[40%] flex flex-col bg-white relative">
                                    <div className="p-10 lg:p-12 flex-grow overflow-y-auto custom-scrollbar active-info-scroll border-b border-gray-50">
                                        
                                        <div className={`flex justify-between items-center mb-8 ${viewMode === 'DETAIL' ? 'sticky top-0 bg-white/95 backdrop-blur-sm z-30 py-2 -mx-4 px-4' : ''}`}>
                                            <span className="bg-gray-100 text-gray-500 font-extrabold text-[10px] px-3 py-1 rounded-md tracking-widest uppercase">
                                                {viewMode === 'LIST' ? 'CASE SUMMARY' : 'DETAILED REPORT'}
                                            </span>
                                            {viewMode === 'DETAIL' && (
                                                <button onClick={() => setViewMode('LIST')} className="bg-gray-50 text-gray-400 p-2 rounded-full hover:text-gray-900 hover:bg-gray-200 transition-colors flex items-center pl-4 pr-5 group">
                                                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                                    <span className="text-xs font-black">목록으로</span>
                                                </button>
                                            )}
                                        </div>

                                        {viewMode === 'DETAIL' && (
                                            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 sticky top-[60px] z-20 shadow-sm border border-gray-100">
                                                {['before', 'during', 'after'].map(s => (
                                                    <button key={s} onClick={() => {setStage(s); setImgIndex(0);}} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${stage === s ? 'bg-[#10b981] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
                                                        {s === 'before' ? '작업 전' : s === 'during' ? '작업 중' : '작업 후'}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 leading-tight break-keep">{activePost.title}</h2>
                                        <div className="w-12 h-1.5 bg-[#10b981] mb-8 rounded-full"></div>
                                        <p className="text-lg text-gray-600 leading-relaxed font-semibold break-keep whitespace-pre-wrap">{activePost.content}</p>
                                    </div>
                                    
                                    {/* 3. 하단 패널 */}
                                    <div className="h-40 lg:h-44 bg-gray-50/50 p-6 flex space-x-5 items-center overflow-x-auto custom-scrollbar">
                                        {viewMode === 'LIST' ? (
                                            posts.map((post, idx) => (
                                                <button key={post.id} onClick={() => setActiveIndex(idx)} className={`relative w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === idx ? 'ring-4 ring-[#10b981] ring-offset-2 scale-105 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}>
                                                    <img src={post.img} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#10b981] text-white flex items-center justify-center rounded-full text-[13px] font-black shadow-lg ring-2 ring-white">{idx + 1}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="flex space-x-3 w-full h-full">
                                                {currentDetailImages.length > 0 ? currentDetailImages.map((img, idx) => (
                                                    <button key={idx} onClick={() => setImgIndex(idx)} className={`relative h-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${imgIndex === idx ? 'border-[#10b981] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img.url})` }} />
                                                    </button>
                                                )) : <div className="text-gray-300 font-bold text-xs w-full text-center py-10">해당 단계의 사진이 없습니다.</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200"><p className="text-2xl font-bold text-gray-500">등록된 갤러리가 없습니다.</p></div>
                        )}
                        
                    </div>
                </div>
            );
        };
// --- END UNIVERSAL FLOATING BACK BUTTON ---
