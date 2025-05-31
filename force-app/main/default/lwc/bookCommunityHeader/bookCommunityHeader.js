import { LightningElement, api, wire, track } from 'lwc';

export default class BookCommunityHeader extends LightningElement {
    @api loginLabel = "Login";
    @api itemCout = 0;
    @api isuserloggedin = false;
    @api searchedBook = '';
    @api navigateToThisPage = '';

    handleLogin(){
        console.log('$handleLogin called');
        const event = new CustomEvent('loginbtnclick', {"detail": this.loginLabel});
        this.dispatchEvent(event);
        if(this.navigateToThisPage == 'login'){
            this[NavigationMixin.Navigate]({
                type: 'comm__loginPage',
                attributes: {
                    actionName: 'login',
                },
                state: {
                    retURL: window.location.pathname
                }
            });
        }else{
            console.log("'this.navigateToThisPage != login'");
        }
    }
    handleOpenMyCart(){
        console.log('$handleOpenMyCart called');
        const event = new CustomEvent('openmycartbtnclick', {"detail": ''});
        this.dispatchEvent(event);
    }
    handleSearch(e){
        console.log('$handleSearch called');
        this.searchedBook = e.target.value;
        const event = new CustomEvent('searchingbooks', {"detail": this.searchedBook});
        this.dispatchEvent(event);
    }
}