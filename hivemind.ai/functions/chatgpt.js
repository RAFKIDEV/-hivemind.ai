const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Get the request body (prompt and coin from the frontend)
    const { prompt, coin } = JSON.parse(event.body);

    // Use the OpenAI API key from environment variables
    const openAiApiKey = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: `Provide a response for ${coin}.` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: data.choices[0].message.content.trim() })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'No response from ChatGPT' })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching ChatGPT response' })
        };
    }
};