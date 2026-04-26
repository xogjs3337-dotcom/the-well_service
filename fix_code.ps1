$file = "C:\Users\user\.gemini\antigravity\scratch\the-well-service\index.html"
$lines = Get-Content -Path $file -Encoding UTF8

$part1 = $lines[0..559]

$detailJSX = @(
'                <div className="pt-28 pb-32 min-h-screen bg-gray-50 font-sans animate-in fade-in slide-in-from-bottom-12 duration-[1500ms] ease-out">',
'                    <div className="max-w-5xl mx-auto px-6">',
'                        <button onClick={onBack} className="inline-flex items-center text-[#22c55e] font-bold mb-8 hover:text-[#16a34a] transition-colors bg-green-50 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md border border-green-100">',
'                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
'                            게시판으로 복귀',
'                        </button>',
'                        <div className="bg-white rounded-[2.5rem] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">',
'                            <div className="p-8 md:p-12">',
'                                <span className="text-[#22c55e] font-black text-xs tracking-widest uppercase">{post.date}</span>',
'                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 mb-6 leading-tight break-keep">{post.title}</h1>',
'                                <div className="w-12 h-1.5 bg-[#22c55e] mb-8 rounded-full"></div>',
'                                <p className="text-lg text-gray-600 leading-relaxed font-semibold break-keep whitespace-pre-wrap mb-10">{post.content}</p>',
'                            </div>',
'                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 md:px-12 pb-12">',
'                                {images.map((img, idx) => (',
'                                    <div key={idx} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md" onClick={() => setLightboxIndex(idx)}>',
'                                        <img src={img} alt={labels[idx] || `사진 ${idx+1}`} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" />',
'                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>',
'                                        <div className="absolute bottom-3 left-3">',
'                                            <span className="bg-white/90 text-gray-800 text-xs font-black px-3 py-1.5 rounded-full shadow">{labels[idx] || `사진 ${idx+1}`}</span>',
'                                        </div>',
'                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">',
'                                            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3">',
'                                                <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>',
'                                            </div>',
'                                        </div>',
'                                    </div>',
'                                ))}',
'                            </div>',
'                        </div>',
'                    </div>',
'                    {lightboxIndex !== null && <Lightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}',
'                </div>',
'            );',
'        };',
'',
'        const BoardPage = ({ category, onBack }) => {'
)

$part3 = $lines[561..743]

$boardEnd = @('        };')

$part5 = $lines[796..860]

$result = $part1 + $detailJSX + $part3 + $boardEnd + $part5

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines($file, $result, $utf8NoBom)

Write-Host "Done. Total lines: $($result.Count)"
