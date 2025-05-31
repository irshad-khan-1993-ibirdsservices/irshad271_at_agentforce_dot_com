import { LightningElement, wire, track } from 'lwc';
import getBooks from '@salesforce/apex/ProductController.getBooks';
import getBooksFromApi from '@salesforce/apex/GetBooksFromApi.getBooksFromApi';
import { NavigationMixin } from 'lightning/navigation';

export default class BookCommunity extends NavigationMixin(LightningElement){
    @track books;
    @track salesforcebooks;

    async connectedCallback(){
        console.log('BookCommunity: $connectedCallback called');
        let books = await this.getApiBooks();
        this.books = Array.from(books);
    }

    async getApiBooks(){
        console.log('$getApiBooks called');
        let bks = await getBooksFromApi();
        if (typeof bks === 'string') {
            bks = JSON.parse(bks);
            bks = Array.from(bks.books);
        }
        return bks;
    }

    async getSalesforceBooks(){
        console.log('$getSalesforceBooks called');
        let salesforceBooks = await getBooks();
        return Array.from(salesforceBooks);
    }

    handleAddToCart(){
        console.log('$handleAddToCart called');
    }

    async handleRefresh(){
        console.log('$handleRefresh called');
        let sfcheckbox = this.template.querySelector('.sf-checkbox');
        let apicheckbox = this.template.querySelector('.api-checkbox');
        if(apicheckbox.checked){
            console.log('api checked');
            let books = await this.getApiBooks();
            this.books = Array.from(books);
        }else{
            this.books = null;
        }
        if(sfcheckbox.checked){
            console.log('salesforce checked');
            let salesforceBooks = await this.getSalesforceBooks();
            this.salesforcebooks = Array.from(salesforceBooks);
            this.salesforcebooks = this.salesforcebooks.map(book => {
                return {...book, price: book.PricebookEntries[0].UnitPrice};
            });
            console.log('this.salesforcebooks : ', JSON.stringify(this.salesforcebooks));
        }else{
            this.salesforcebooks = null;
        }
    }
     
}


























//--------------------------------------------------------------------
/* import { LightningElement, wire, track } from 'lwc';
import getBooks from '@salesforce/apex/ProductController.getBooks';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getBooksFromApi from '@salesforce/apex/GetBooksFromApi.getBooksFromApi';
import { NavigationMixin } from 'lightning/navigation';
import getCurrentUserInfo from '@salesforce/apex/ProductController.getCurrentUserInfo';

export default class BookCommunity extends NavigationMixin(LightningElement) {
    @track books;
    @track salesforcebooks;
    @track loggedIn = false;


    async connectedCallback() {
        console.log('BookCommunity: $connectedCallback called');
        let books = await this.getApiBooks();
        this.books = Array.from(books);
    }
    async getApiBooks(){
        console.log('$getApiBooks called');
        let bks = await getBooksFromApi();
        if (typeof bks === 'string') {
            bks = JSON.parse(bks);
            bks = Array.from(bks.books);
        }
        return bks;
    }

    async getSalesforceBooks(){
        console.log('$getSalesforceBooks called');
        let salesforceBooks = await getBooks();
        return Array.from(salesforceBooks);
    }

    // async checkUserLoggedIn(){
    //     this.loggedIn = await isUserLoggedIn();
    //     console.log('await isUserLoggedIn() : ', await isUserLoggedIn());
    // }

    async handleCheckbox(event){//handleCheckbox
        if(event.target.name == 'checkboxapi' && event.target.checked){
            console.log('api checked');
            let books = await this.getApiBooks();
            this.books = Array.from(books);
        }else if(event.target.name == 'checkboxapi' && !(event.target.checked)){
            this.books = null;
        }
        if(event.target.name == 'checkboxsalesforce' && event.target.checked){
            console.log('salesforce checked');
            let salesforceBooks = await this.getSalesforceBooks();
            this.salesforcebooks = Array.from(salesforceBooks);
        }else if(event.target.name == 'checkboxsalesforce' && !(event.target.checked)){
            this.salesforcebooks = null;
        }
    }

    // handleloginUser(){
    //     console.log('$handleloginUser working');
    //     this[NavigationMixin.Navigate]({
    //         type: 'comm__loginPage',
    //         attributes: {
    //             actionName: this.loggedIn == true ? 'logout' : 'login',
    //         },
    //         state: {
    //             retURL: window.location.pathname
    //         }
    //     });
    // }
    // async usrInfo(){
    //     let uInfo = await getCurrentUserInfo();
    //     if(this.loggedIn && uInfo){
    //         console.log('usrName : ' , uInfo);
    //     }else {
    //         console.log('user not logged in');
    //     }
    // }

    handleAddToCart(){
        console.log('$handleAddToCart called');
        if(this.loggedIn == true){
            //then add to cart
            console.log('//then add to cart');
        }else {
            //go to login page for get logged in customer
            console.log('//go to login page for get logged in customer');
        }
    }
} */