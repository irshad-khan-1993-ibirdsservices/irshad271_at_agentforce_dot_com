/*
 * You can execute the code on annonymous window to check the method (getCartSfBooksByISBN)
	List<String> bookIsbn = new List<String>{
      'BK3756',
      'BK3857',
      'BK2749'
    };
    List<Product2> books = BookCatalogCartCommunityPageController.getCartSfBooksByISBN(bookIsbn);
    for(Product2 book : books){
        System.debug('book : ' +  book);
    }
*/
public with sharing class BookCatalogCartCommunityPageController {
	@AuraEnabled(cacheable=true)
    public static List<Product2> getCartSfBooksByISBN(List<String> bookIsbn){
        System.debug('getCartSfBooksByISBN called');
        Set<String> bookIsbnSet = new Set<String>(bookIsbn);
        String bookRecordType = [SELECT Id, Name FROM RecordType WHERE sObjectType='Product2' AND Name = 'Books Record Type' LIMIT 1].Id;

        List<Product2> books = [SELECT Id, Name, ProductCode, Description, Book_Author__c, Book_Cover_c__c, Cover__c,
    		(SELECT Id, Name, Product2Id, UnitPrice, IsActive, ProductCode FROM PricebookEntries WHERE IsActive = true)
			FROM Product2
			WHERE RecordType.Id =: bookRecordType AND ProductCode IN :bookIsbnSet
      	];
        //System.debug('books : ' + books);
        return books;
    }
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