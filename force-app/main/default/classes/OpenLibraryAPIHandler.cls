public class OpenLibraryAPIHandler {
    // Updated endpoint
    private static final String API_ENDPOINT = 'https://openlibrary.org/subjects/fantasy.json?limit=6';
    
    public static List<Book> getFantasyBooks() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(API_ENDPOINT);
        req.setMethod('GET');
        req.setTimeout(12000); // 12 seconds timeout
        
        Http http = new Http();
        HttpResponse res;
        
        try {
            res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                return parseBooksResponse(res.getBody());
            } else {
                System.debug('API request failed with status code: ' + res.getStatusCode());
                System.debug('Response body: ' + res.getBody());
                return null;
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());
            return null;
        }
    }
    
    private static List<Book> parseBooksResponse(String jsonResponse) {
        // The OpenLibrary response structure is different from your previous API
        // This needs to match their actual JSON structure
        Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(jsonResponse);
        List<Object> works = (List<Object>)responseMap.get('works');
        
        List<Book> books = new List<Book>();
        for (Object workObj : works) {
            Map<String, Object> work = (Map<String, Object>)workObj;
            Book b = new Book();
            b.title = (String)work.get('title');
            
            // Handle authors (array in OpenLibrary response)
            List<Object> authors = (List<Object>)work.get('authors');
            if (authors != null && !authors.isEmpty()) {
                Map<String, Object> firstAuthor = (Map<String, Object>)authors[0];
                b.author = (String)firstAuthor.get('name');
            }
            
            books.add(b);
        }
        return books;
    }
    
    public class Book {
        public String title;
        public String author;
        // Add other fields as needed from the API response
    }
}