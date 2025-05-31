import { LightningElement, api, wire, track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/ProductController.getLogoutUrl';
import getBooks from '@salesforce/apex/ProductController.getBooks';
import getBooksFromApi from '@salesforce/apex/ProductController.getBooksFromApi';

export default class BookCommunityHomePage extends NavigationMixin(LightningElement) {
    
    @track loginLabel = "Login";
    @track itemCout = 0;
    @track isuserloggedin = false;
    @track allBooks;
    @track allBooksCopy;
    @track navigateToThisPage = '';
    connectedCallback(){
        console.log('BookCommunityHomePage: $connectedCallback called');
        // localStorage.setItem('cart', JSON.stringify({"BK1234": 5, "BK8958": 7}));
        // localStorage.removeItem('cart');
        // this.setAllThings();
        this.x();
    }
    async x(){
        await this.getAllBook();
        this.handleChackbox();
    }
    // async setAllThings(){
    //     console.log('$setAllThings called');
    //     let isUserLoggedIn = await this.checkUserLoggedIn();
    //     console.log('this.checkUserLoggedIn() : ', isUserLoggedIn);
    //     this.isuserloggedin = isUserLoggedIn;
    //     this.updateLoginLabel(isUserLoggedIn);
    //     this.updateItemCountOnCartIcon(isUserLoggedIn);
    //     this.getAllBook();
    // }
    // updateItemCountOnCartIcon(isUserLoggedIn){
    //     console.log('$updateItemCountOnCartIcon : ');
    //     if(isUserLoggedIn){
    //         let cart = localStorage.getItem('cart');
    //         if(cart != null){
    //             this.itemCout = Object.keys(JSON.parse(cart)).length;
    //         }else {
    //             this.itemCout = 0;
    //         }
    //     }else{
    //         this.itemCout = null;
    //     }
    // }
    // updateLoginLabel(isUserLoggedIn){
    //     if(isUserLoggedIn){
    //         console.log('user loggedin');
    //         this.loginLabel = 'Logout';

    //     }else{
    //         this.loginLabel = 'Login';
    //         console.log('user not loggedin');
    //     }
    // }
    async getApiBooks(){
        console.log('$getApiBooks called');
        let books = await getBooksFromApi();
        if (typeof books === 'string') {
            books = JSON.parse(books);
            books = Array.from(books.products);
        }
        return books;
    }

    async getSalesforceBooks(){
        console.log('$getSalesforceBooks called');
        let salesforceBooks = await getBooks();
        return Array.from(salesforceBooks);
    }  
    async getAllBook(){
        console.log('$getAllBook called : ');
        let sfBooks = await this.getSalesforceBooks();
        let apiBooks = await this.getApiBooks();
        sfBooks = sfBooks.map(book => {
            return ({
                "Id":book.Id,
                "bookName": book.Name,
                "productCode": book.ProductCode,
                "bookAuthor": book.Book_Author__c,
                "bookCoverImageUrl": book.Book_Cover_c__c,
                "bookPrice": book.PricebookEntries[0].UnitPrice,
                // "api": false,
                "sf": true,
            });
        });
        apiBooks = apiBooks.map(book => {
            return ({
                "Id": book.id,
                "bookName": book.name,
                "productCode": book.isbn,
                "bookAuthor": "Author Not Available",
                "bookCoverImageUrl": book.book_cover,
                "bookPrice": book.price,
                // "api": true,
                "sf": false,
            });
        });
        this.allBooks = sfBooks.concat(apiBooks);
        // console.log('sfBooks : ', JSON.stringify(sfBooks,null,2));
        // console.log('apiBooks : ', JSON.stringify(apiBooks,null,2));
        // console.log('this.allBooks : ', JSON.stringify(this.allBooks,null,2));
        // this.allBookProducts = sfBooks.concat(apiBooks);
        this.allBooksCopy = Array.from(this.allBooks);
        // this.handleChackbox();
    } 
    handleChackbox(){
        console.log('$handleChackbox called');
        this.allBooks = Array.from(this.allBooksCopy);
        let sfcheckbox = this.template.querySelector('.sf-checkbox');
        let apicheckbox = this.template.querySelector('.api-checkbox');
        if(sfcheckbox.checked == true && apicheckbox.checked != true){
            this.allBooks = this.allBooks.filter(book => (book.sf == true));
        }else if(sfcheckbox.checked != true && apicheckbox.checked == true){
            this.allBooks = this.allBooks.filter(book => (book.sf == false));
        }else if(sfcheckbox.checked == true && apicheckbox.checked == true){
            this.allBooks = this.allBooks.filter(book => (book.sf == true || book.sf == false));
        }else if(sfcheckbox.checked != true && apicheckbox.checked != true){
            this.allBooks = null;
        }
    } 
    // async checkUserLoggedIn(){
    //     console.log('$checkUserLoggedIn called');
    //     let loggedIn = await isUserLoggedIn();
    //     return loggedIn;
    // }
    // async handleLogin(){
    //     console.log('$handleLoginP called');
    //     let isLoggedIn = await this.checkUserLoggedIn();
    //     console.log('$isLoggedIn : ', isLoggedIn);
    //     // if(!isLoggedIn){
    //     //     console.log('You are not logged in go to login page');
    //     //     this[NavigationMixin.Navigate]({
    //     //         type: 'comm__loginPage',
    //     //         attributes: {
    //     //             actionName: 'login',
    //     //         },
    //     //         state: {
    //     //             retURL: window.location.pathname
    //     //         }
    //     //     });
    //     // }else{
    //     //     console.log('You are already loggedin, call to apex method to logout');
    //     //     this.handleLogout();
    //     // }

    //     if(!isLoggedIn){
    //         console.log('You are not logged in go to login page');
    //         // this[NavigationMixin.Navigate]({
    //         //     type: 'comm__loginPage',
    //         //     attributes: {
    //         //         actionName: 'login',
    //         //     },
    //         //     state: {
    //         //         retURL: window.location.pathname
    //         //     }
    //         // });
    //         this.navigateToThisPage = 'login';
    //     }else{
    //         console.log('You are already loggedin, call to apex method to logout');
    //         this.handleLogout();
    //     }
    // }
    // handleLogout() {
    //     console.log('$handleLogout called');
    //     getLogoutUrl()
    //         .then(url => {
    //             window.location.href = url;
    //         })
    //         .catch(error => {
    //             console.error('Logout error', error);
    //         });
    // } 
    handleAddToCart(e){
        console.log('$handleAddToCart called');
        let productcode = e.target.dataset.productcode;
        let isSalesforceProduct = this.allBooks.find(book => book.productCode == productcode).sf;
        this.storeBooksInLocalStorage(isSalesforceProduct, productcode);
    }
    storeBooksInLocalStorage(isSalesforceProduct, productcode){
        console.log('$handleAddToCart called');
        let cart = JSON.parse(localStorage.getItem('cart')) ?? {};
        const key = isSalesforceProduct ? `sf_${productcode}` : `api_${productcode}`;
        cart[key] = (parseInt(cart[key]) || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    // displayCart(){
    //     let cart = JSON.parse(localStorage.getItem('cart')) || {};
    //     let sfProducts = [];
    //     let apiProducts = [];
        
    //     Object.entries(cart).forEach(([key, quantity]) => {
    //         if(key.startsWith('sf_')){
    //             sfProducts.push({productCode: key.replace('sf_', ''), quantity});
    //         }else if(key.startsWith('api_')){
    //             apiProducts.push({productCode: key.replace('api_', ''), quantity});
    //         }
    //     });
    //     console.log('sfProducts : ', JSON.stringify(sfProducts,null,2));
    //     console.log('apiProducts : ', JSON.stringify(apiProducts,null,2));
    // }
    
    // handleSearchP(e){
    //     console.log('$handleSearchP called', e.detail);
    // }
    // handleOpenMyCartP(event){
    //     console.log('$handleOpenMyCartP called');
    //     let x = event.detail;
    //     let sfProducts = x.sfProducts.map(sf => sf.productCode);
    //     let apiProducts = x.apiProducts.map(api => api.productCode);
    //     console.log('x : ', JSON.stringify(x,null,2));
    //     console.log('sfProducts : ', JSON.stringify(sfProducts,null,2));
    //     console.log('apiProducts : ', JSON.stringify(apiProducts,null,2));

    // }
}