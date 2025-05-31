public class GetBooksFromApi{
    @AuraEnabled(cacheable=true)
    public static String getBooksFromApi(){
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        Http http = new Http();
        try{
            //req.setEndpoint('https://api.itbook.store/1.0/search/mongodb');
            //req.setEndpoint('https://api.itbook.store/1.0/search/salesforce');
            req.setEndpoint('http://ec2-44-244-77-173.us-west-2.compute.amazonaws.com/ibs/api/products');
            req.setMethod('GET');
            req.setTimeout(12000);
            res = http.send(req);
            if(res.getStatusCode() == 200){
                return res.getBody();
            }else {
                return null;
            }
        }catch (Exception e){
            System.debug('Callout error: ' + e.getMessage());
            throw new AuraHandledException('Failed to get books: ' + e.getMessage());
        }
    }
}