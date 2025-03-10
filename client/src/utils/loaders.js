/** a general loader for a get request */
const generalLoader = async ({ apiUrl }) => {
    try {
      const response = await fetch(apiUrl, { credentials: 'include' });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Response(
          JSON.stringify({ message: data.error || "Something went wrong" }),
          { status: response.status }
        );
      }
  
      return data;
    } catch (error) {
      throw new Response(
        JSON.stringify({ message: error.message || 'Unknown error' }),
        { status: 500 }
      );
    }
  };
  
  export default generalLoader;
  