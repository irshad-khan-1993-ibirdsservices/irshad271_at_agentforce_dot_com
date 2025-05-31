public class ProductController{
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getBooks(){
        System.debug('getBooks called');
        String bookRecordType = [SELECT Id, Name FROM RecordType WHERE sObjectType='Product2' AND Name = 'Books Record Type' LIMIT 1].Id;

        List<Product2> books = [SELECT Id, Name, ProductCode, Description, Book_Author__c, Book_Cover_c__c, Cover__c,
    		(SELECT Id, Name, Product2Id, UnitPrice, IsActive, ProductCode FROM PricebookEntries WHERE IsActive = true)
			FROM Product2
			WHERE RecordType.Id =: bookRecordType
      	];
        System.debug('books : ' + books);
        return books;
    }
    
    @AuraEnabled
    public static Boolean isUserLoggedIn(){
        Boolean isLoggedIn = UserInfo.getUserType() == 'Guest' ? false : true;
        return isLoggedIn;
    }
    
    // @AuraEnabled(cacheable=true)
    // public static User getCurrentUserInfo() {
    //     Id userId = UserInfo.getUserId();
    //     User usr =  [            
    //         SELECT Id, Name
    //         FROM User 
    //         WHERE Id = :userId
    //   	];
    //     return usr;
    // }
    
    @AuraEnabled
    public static String getLogoutUrl(){
        String baseUrl = Site.getBaseUrl();
        return baseUrl + '/secur/logout.jsp?retUrl=' + baseUrl;
    }
    
    //-------------------------------------------------------------------
    
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