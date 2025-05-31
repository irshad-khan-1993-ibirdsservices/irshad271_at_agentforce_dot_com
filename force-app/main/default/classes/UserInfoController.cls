public with sharing class UserInfoController {
    @AuraEnabled(cacheable=true)
    public static User getCurrentUserInfo() {
        Id userId = UserInfo.getUserId();
        User usr =  [
            //SELECT Id, Name, FirstName, LastName, Email, Username, 
           	//SmallPhotoUrl, MediumPhotoUrl, FullPhotoUrl, 
            ///Title, CompanyName, AboutMe
            //FROM User 
            //WHERE Id = :userId
            
            SELECT Id, Name
            FROM User 
            WHERE Id = :userId
      	];
        return usr;
    }
}