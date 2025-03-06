const generalLoader = async ({ apiUrl }) => {
    try {
      const response = await fetch(apiUrl, { credentials: 'include' });
      const data = await response.json();
  
      if (!response.ok) {
        // יצירת Response מותאם אישית עם הודעת שגיאה וסטטוס
        throw new Response(
          JSON.stringify({ message: data.error }),
          { status: response.status }
        );
      }
  
      return data;
    } catch (error) {
      // במקרה של שגיאה, החזר Response מותאם אישית עם פרטי השגיאה
      throw new Response(
        JSON.stringify({ message: error.message || 'Unknown error' }),
        { status: 500 }
      );
    }
  };
  
  export default generalLoader;
  