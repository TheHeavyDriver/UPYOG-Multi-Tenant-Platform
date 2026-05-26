// Gemini AI API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Debug: log whether the key is loaded (shows first 5 chars only for security)
if (GEMINI_API_KEY) {
  console.log('[Gemini] API key loaded:', GEMINI_API_KEY.substring(0, 5) + '...')
} else {
  console.warn('[Gemini] API key NOT found. Make sure .env exists with VITE_GEMINI_API_KEY and restart dev server.')
}

// Send a question to Gemini with data context
export const askGemini = async (question, dataContext) => {
  if (!GEMINI_API_KEY) {
    return 'API key not configured. Please set VITE_GEMINI_API_KEY in your .env file and restart the dev server.'
  }

  const prompt = `You are a property tax analytics assistant for the UPYOG multi-tenant platform serving Indian cities. Answer the following question based ONLY on the data provided below. Be concise and accurate.

DATA CONTEXT:
${dataContext}

QUESTION: ${question}

If the question cannot be answered from the data, say so politely. Always include specific numbers when answering.`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API request failed')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process your question. Please try again.'
  } catch (error) {
    console.error('Gemini API Error:', error)
    return `Error: ${error.message}. Please check your API key and try again.`
  }
}
