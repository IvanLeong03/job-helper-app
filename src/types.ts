export interface CVRewrite {
    original: string
    suggested: string
}

export interface AnalysisResponse {
    requirements: string[]
    strengths: string[]
    weaknesses: string[]
    fit_score: number
    fit_reasoning: string
    cv_rewrites: CVRewrite[]
}
