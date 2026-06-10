export async function analyseFit(jobDescription: string) {

    const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ job_description: jobDescription })
    })

    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
}