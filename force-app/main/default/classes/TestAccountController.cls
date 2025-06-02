public class TestAccountController {

	public static Map<Id, Decimal> getAccountWithContact(){
		List<Contact> consWithAcc = [SELECT Id, Name, Account.Id, Account.Name FROM Contact WHERE AccountId != NULL];
		Map<Id, Decimal> accConCountMap = new Map<Id, Decimal>();
		for(Contact con : consWithAcc){
			if(!accConCountMap.containsKey(con.Id)){
				accConCountMap.put(con.Id, 0);
			}
			accConCountMap.put(con.Id, accConCountMap.get(con.Id) + 1);
		}
        //System.debug(accConCountMap);
		return accConCountMap;		
	}
}