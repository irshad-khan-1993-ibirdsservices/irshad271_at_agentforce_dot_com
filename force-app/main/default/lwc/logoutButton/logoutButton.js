import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/ProductController.getLogoutUrl';
export default class LogoutButton extends NavigationMixin(LightningElement) {
    @track loginlabel = 'Login';    
    connectedCallback() {
        console.log('$connectedCallback');
        this.checkUserLoggedIn();        
    }

    async checkUserLoggedIn(){
        console.log('$checkUserLoggedIn called');
        let loggedIn = await isUserLoggedIn();
        console.log('$loggedIn : ', loggedIn);
        if(loggedIn){
            console.log('user loggedin');
            this.loginlabel = 'Logout';
        }else{
            this.loginlabel = 'Login';
            console.log('user not loggedin');
        }
        return loggedIn;
    }

    async handleLogin(){
        console.log('$handleLogin called');
        let isLoggedIn = await this.checkUserLoggedIn();
        console.log('$isLoggedIn : ', isLoggedIn);

        if(!isLoggedIn){
            console.log('You are not logged in go to login page');
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
            console.log('You are already loggedin, call to apex method to logout');
            this.handleLogout();
        }
    }
    handleLogout() {
        getLogoutUrl()
            .then(url => {
                window.location.href = url;
            })
            .catch(error => {
                console.error('Logout error', error);
            });
    }
}



//------------------------------------------------------------

/* import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/ProductController.getLogoutUrl';
export default class LogoutButton extends NavigationMixin(LightningElement) {
    @track loginlabel = 'Login';    
    connectedCallback() {
        console.log('$connectedCallback');
        this.checkUserLoggedIn();        
    }

    async checkUserLoggedIn(){
        console.log('$checkUserLoggedIn called');
        let loggedIn = await isUserLoggedIn();
        console.log('$loggedIn : ', loggedIn);
        if(loggedIn){
            console.log('user loggedin');
            this.loginlabel = 'Logout';
        }else{
            this.loginlabel = 'Login';
            console.log('user not loggedin');
        }
        return loggedIn;
    }

    async handleLogin(){
        console.log('$handleLogin called');
        let isLoggedIn = await this.checkUserLoggedIn();
        console.log('$isLoggedIn : ', isLoggedIn);

        if(!isLoggedIn){
            console.log('You are not logged in go to login page');
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
            console.log('You are already loggedin, call to apex method to logout');
            this.handleLogout();
        }
    }
    handleLogout() {
        getLogoutUrl()
            .then(url => {
                window.location.href = url;
            })
            .catch(error => {
                console.error('Logout error', error);
            });
    }
} */