import { LightningElement, api, wire, track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/BookCommunityHeaderController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/BookCommunityHeaderController.getLogoutUrl';
export default class BookCommunityHeader2 extends NavigationMixin(LightningElement) {
    @api loginLabel = "Login";
    @api itemCout = 0;
    @api isuserloggedin = false;
    @api searchedBook = '';
    @api navigateToThisPage = '';

    connectedCallback(){
        console.log('BookCommunityHeader2: $connectedCallback called');
        this.setLoginLabel();
    }
    goToMyCartPage(){
        console.log('BookCommunityHeader2: $goToMyCartPage called');
        let haveToOpenCart = localStorage.getItem('haveToOpenCart') || null;
        if(haveToOpenCart == 'true'){
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/my-books-cart'
                }
            });
        }
    }

    async handleLoginLogout(){
        console.log('BookCommunityHeader2: $handleLoginLogout called');
        let loggedIn = await isUserLoggedIn();
        this.getUserLoginLogout(loggedIn);//user ko login or logout karwao homePage pr
    }
    async setLoginLabel(){
        let loggedIn = await isUserLoggedIn();
        console.log('BookCommunityHeader2: $setLoginLabel called');
        if(!loggedIn){
            this.loginLabel = 'Login';
            localStorage.setItem('loginLabel', 'Login');
        }else{
            this.loginLabel = 'Logout';
            localStorage.setItem('loginLabel', 'Logout');
        }
    }
    getUserLoginLogout(loggedIn){
        console.log('BookCommunityHeader2: $getUserLoginLogout called');
        if(!loggedIn){
            this.handleLogin(false);
        }else{
            this.handleLogout();
        }
    }
    handleLogin(forRedirectToCart){
        console.log('BookCommunityHeader2: $handleLogin called');
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {actionName: 'login'},
            state: {retURL: window.location.pathname}
        });
    }
    handleLogout() {
        console.log('BookCommunityHeader2: $handleLogout called');
        localStorage.setItem('haveToOpenCart', false);
        getLogoutUrl()
            .then(url => {
                window.location.href = url;
            })
            .catch(error => {
                console.error('Logout error', error);
            });
    }
    async checkUserLoggedIn(){
        console.log('BookCommunityHeader2: $checkUserLoggedIn called');
        let loggedIn = await isUserLoggedIn();
        console.log('BookCommunityHeader2: $loggedIn : ', loggedIn);
        return loggedIn;
    }
    async handleCartPage(){
        console.log('BookCommunityHeader2: $handleCartPage called');
        let loggedIn = await isUserLoggedIn();
        if(!loggedIn){
            this.handleLogin(true);
        }else if(loggedIn){
            localStorage.setItem('haveToOpenCart', true);
            this.goToMyCartPage();
        }      
    }
    
    handleSearch(e){
        console.log('BookCommunityHeader2: $handleSearch called');
    }
}