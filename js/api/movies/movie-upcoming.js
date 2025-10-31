export async function getMovieUpcoming(page) {
    const options = {
        method: 'GET',
        url: 'https://jericoder-api-middleware.hf.space/movie/upcoming',
        params: { page: page },
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