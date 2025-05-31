public class BookCommunityHeaderController {
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
    // 
    
    @AuraEnabled
    public static String getLogoutUrl(){
        String baseUrl = Site.getBaseUrl();
        return baseUrl + '/secur/logout.jsp?retUrl=' + baseUrl;
    }
}