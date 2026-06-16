const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'


export async function loadCV() {
    const response = await fetch(`${API_URL}/cv`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    })
    console.log(response)

    if (!response.ok) throw new Error('Failed to load cv')
    return response.json()
}

export async function saveCV(cvContent: string) {
    const response = await fetch(`${API_URL}/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ content: cvContent })

    })

    if (!response.ok) throw new Error('Failed to load cv')
    return response.json()

}