import { useEffect, useState } from 'react'
import { analyseFit } from './services/analyseService'
import type { CVRewrite, AnalysisResponse } from './types'
import { loadCV, saveCV } from './services/cvService'

function App() {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<AnalysisResponse | null>(null)
    const [error, setError] = useState('')
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [cvContent, setCvContent] = useState('')

    async function handleSend() {
        setLoading(true)
        try {
            //const data = await analyseFit(input)
            await new Promise(r => setTimeout(r, 3000))
            const data = await analyseFit(input)
            setResponse(data)            
        } catch {
            setError('Please try again')
        } finally {
            setLoading(false)
        }
    }

    async function getCV() {
        try {
            //const data = await analyseFit(input)
            const data = await loadCV()
            setCvContent(data.content)            
        } catch {
            setError('Failed to load CV')
        } 
    }

    async function handleSaveCv() {
        try {
            await saveCV(cvContent)            
        } catch {
            setError('Failed to save CV')
        } finally {
            editModal()
        }
    }

    useEffect(() => {
        getCV()
    }, []) //empty: run on mount only

    function resetPage() {
        setInput('')
        setResponse(null)
    }

    function editModal() {
        setEditModalOpen(!editModalOpen)
    }

    return (
        <div className="w-full min-h-screen bg-darkest">
            <main className="w-4/5 max-w-384 mx-auto py-24 flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold text-accent">
                    Job Application Helper
                </div>
                <h2 className="text-xl text-white/60 mt-8">
                    Paste job description and get CV feedback
                </h2>
                <div className='relative w-full flex flex-col items-center'>
                    <button
                        className='hover:cursor-pointer text-lg my-16 px-8 py-2 rounded-2xl bg-light text-accent/80 hover:text-accent'
                        onClick={() => editModal()}
                    >
                        Edit CV
                        { /* open a modal which contains the generic cv? */}
                    </button>
                    {editModalOpen && (
                        <div className="rounded-xl absolute z-0 top-32 left-1/2 -translate-x-1/2 bg-lightest w-2/3 max-w-5xl p-4 mx-auto flex flex-col">
                            <h3 className='text-dark text-lg font-medium'>Your CV:</h3>
                            <ul className='list-disc list-inside ml-1'>
                                <li>Use plain markdown</li>
                                <li>Separation sections by ## headings</li>
                            </ul>
                            <textarea 
                                className='rounded-xl overflow-y-auto min-h-[50dvh] bg-white/75 focus:outline-hidden p-2' 
                                value={cvContent}
                                onChange={(e) => setCvContent(e.target.value)}
                            />
                            <button
                                onClick={() => handleSaveCv()}
                                className='hover:underline hover:text-darkest my-4'
                            >
                                Save and close
                            </button>
                        </div>
                    )}
                </div>
                <textarea 
                    className="w-2/3 rounded-xl bg-white/90 min-h-[50dvh] px-3 py-2 focus:outline-hidden focus:border-lighter transition-colors overflow-y-scroll"
                    placeholder="Paste full job description here"            
                    value={input}    
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />

                <button 
                    type='button'
                    className="w-40 md:w-80 text-lg rounded-2xl py-2 text-accent/80 hover:text-accent bg-medium mt-8 mb-24"
                    disabled={!input.trim() || loading}
                    onClick={() => handleSend()}
                >
                    Submit
                </button>

                {loading && (
                    <div className='w-10 h-10 rounded-full border-4 border-white/20 border-t-white/80 animate-spin' />
                )}

                {error && (
                    <h3 className='text-xl text-red-500'>Error encountered: {error}</h3>
                )}

                {response && (
                    <section className='w-2/3 flex flex-col items-center'>
                        <div className='w-full rounded-xl bg-lightest/80 p-4 flex flex-col gap-6 justify-start'>
                            <div>
                                <h3 className='text-sm font-semibold text-dark'>Fit score</h3>
                                {response.fit_score}
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Fit explanation</h3>
                                <p className='leading-relaxed'>
                                    {response.fit_reasoning}
                                </p>                                
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Strengths</h3>
                                <ul className='list-disc list-inside'>
                                    {response.strengths.map((s: string, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>                            
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Weaknesses</h3>
                                <ul className='list-disc list-inside'>
                                    {response.weaknesses.map((w: string, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>                            
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Key Requirements</h3>
                                <ul className='list-disc list-inside'>
                                    {response.requirements.map((r: string, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>  
                            </div>
                            {/* rewrites: each object has 2 parts */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-1 text-dark">CV edits</h3>
                                {response.cv_rewrites.length > 0 ? (
                                    response.cv_rewrites.map((rewrite: CVRewrite, i) => (
                                        <div className="mb-4" key={i}>
                                            <p><b>Original:</b> {rewrite.original}</p>
                                            <p><b>Suggested:</b> {rewrite.suggested}</p>
                                        </div>                            
                                    ))
                                ) : (
                                    <p>No suggested edits</p>                                
                                )}
                            </div>
                            
                        </div>

                        <button
                            onClick={() => resetPage()}
                            className='w-40 md:w-80 py-2 bg-light rounded-xl my-4 hover:text-white/75'
                        >
                            Clear
                        </button>

                    </section>
                )}
                
                <a
                    href="https://github.com/IvanLeong03/job-helper-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 my-16 hover:underline"
                >
                    How it works
                </a>

            </main>
            

        </div>
    )
}

export default App
