import { useState } from 'react'
import { analyseFit } from './services/analyseService'
import type { CVRewrite, AnalysisResponse } from './types'

function App() {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<AnalysisResponse | null>(null)
    const [error, setError] = useState('')

    async function handleSend() {
        setLoading(true)

        try {
            const data = await analyseFit(input)
            setResponse(data)            
        } catch {
            console.error('Please try again')
            setError(error)
        } finally {
            setLoading(false)
        }

    }

    function resetPage() {
        setInput('')
        setResponse(null)
    }

    return (
        <div className="w-full min-h-screen bg-darkest">
            <main className="w-4/5 max-w-384 mx-auto py-24 flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold text-lightest">
                    employmentmaxxing (temporary name)
                </div>
                <h2 className="text-xl text-white/60 mt-8">
                    Paste job description and get CV suggestions and general advice
                </h2>
                <div>
                    {/* doesn't do anything yet*/}
                    <button className='text-white/60 text-lg hover:underline my-16 px-4 rounded-xl  border border-dashed border-lightest'>
                        Edit my CV
                        { /* open another page which contains the generic cv? */}
                    </button>
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
                    className="text-lg rounded-xl px-8 py-2 text-lightest/80 hover:text-lightest bg-medium mt-8 mb-24"
                    disabled={!input.trim() || loading}
                    onClick={() => handleSend()}
                >
                    Rate my chances
                </button>

                {loading && (
                    <p className='text-white/80'>Waiting for response</p>
                )}

                {error && (
                    <h3 className='text-xl text-red-500'>Error encountered: {error}</h3>
                )}

                {response && (
                    <section className='flex flex-col items-center'>
                        <div className='rounded-xl w-2/3 bg-lightest/80 p-2 flex flex-col gap-6 justify-start'>
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
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Your strengths</h3>
                                <ul className='list-disc list-inside'>
                                    {response.strengths.map((s: string, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>                            
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Your weaknesses</h3>
                                <ul className='list-disc list-inside'>
                                    {response.weaknesses.map((w: string, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>                            
                            </div>
                            <div>
                                <h3 className='text-sm font-semibold mb-1 text-dark'>Job Requirements</h3>
                                <ul className='list-disc list-inside'>
                                    {response.requirements.map((r: string, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>  
                            </div>
                            {/* rewrites: each object has 2 parts */}
                            <div className="text-sm font-semibold mt-8 text-dark">CV edits</div>
                            {response.cv_rewrites.map((rewrite: CVRewrite, i) => (
                                <div className="mb-4" key={i}>
                                    <p><b>Original:</b> {rewrite.original}</p>
                                    <p><b>Suggested:</b> {rewrite.suggested}</p>
                                </div>                            
                            ))}
                        </div>

                        <button
                            onClick={() => resetPage()}
                            className='px-4 py-2 bg-light rounded-xl my-4 hover:text-white/75'
                        >
                            Clear
                        </button>

                    </section>
                )}
                
                {/* 
                <a className="text-white/60 my-16">How it works</a>
                */}

            </main>
            

        </div>
    )
}

export default App
