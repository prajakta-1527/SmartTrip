import "axios" from axios;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'Berlin';
    const categories = searchParams.get('categories') || 'tourism';
    const radius = searchParams.get('radius') || '5000'; // Default radius in meters
    const limit = searchParams.get('limit') || '10';
  
    try {
      const response = await axios.get('https://api.geoapify.com/v2/places', {
        params: {
          apiKey: process.env.GEOAPIFY_API_KEY,
          categories,
          filter: circle:13.405,52.52,${radius}, // Example coordinates (Berlin)
          limit,
        },
      });
  
      const recommendations = response.data.features.map((feature: any) => ({
        name: feature.properties.name,
        address: feature.properties.formatted,
        category: feature.properties.categories[0],
        coordinates: feature.geometry.coordinates,
      }));
  
      return new Response(JSON.stringify(recommendations), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Geoapify API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }