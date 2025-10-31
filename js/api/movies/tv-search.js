export async function getTVSeriesBySearch(query) {
    const options = {
        method: 'GET',
        url: 'https://jericoder-api-middleware.hf.space/tv/search',
        params: { page: page, query: query },
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.request(options); // Wait for the response
        return res.data; // Optionally return it
    } catch (err) {
        console.error('❌ Error fetching movie data:', err);
        return null; // Return null or handle error gracefully
    }
}