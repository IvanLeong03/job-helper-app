export async function loadCV() {
    const response = await fetch('/api/cv', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    })
    console.log(response)

    if (!response.ok) throw new Error('Failed to load cv')
    return response.json()
}

export async function saveCV(cvContent: string) {
    const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ content: cvContent })

    })

    if (!response.ok) throw new Error('Failed to load cv')
    return response.json()

}