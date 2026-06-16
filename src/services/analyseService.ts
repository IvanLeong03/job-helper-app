const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function analyseFit(jobDescription: string) {

    const response = await fetch(`${API_URL}/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ job_description: jobDescription })
    })

    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
}


export async function fakeAnalyseFit(jobDescription: string) {
    return {
        requirements: [
            jobDescription.slice(0, 3),
            jobDescription.slice(4, 7),
            jobDescription.slice(8, 10)
        ],
        strengths: [
            "Ball handling",
            "Shot creation",
            "Outside Shooting",
            "On-ball defense",
            "Athleticism"
        ],
        weaknesses: [
            "Rebounding",
            "Finishing through contact",
            "Tracking off-ball runs"
        ],
        fit_score: 8,
        fit_reasoning: "Generates offense for himself and teammates",
        cv_rewrites: []
    }
}