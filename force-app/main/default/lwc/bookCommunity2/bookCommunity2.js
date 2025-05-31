//--------------------------------------------------------------------
import {LightningElement, wire, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/ProductController.getLogoutUrl';
import getBooks from '@salesforce/apex/ProductController.getBooks';
import getBooksFromApi from '@salesforce/apex/GetBooksFromApi.getBooksFromApi';

export default class BookCommunity2 extends NavigationMixin(LightningElement){
    @track allBooks;
    @track allBookProducts;
    @track itemCout = 0;
    allBooksCopy;
    @track isUlogedIn = false;

    connectedCallback(){
        console.log('$connectedCallback called');
        this.updateItemCountOnCartIcon();
        this.check();
    }
    check(){
        console.log('$check called');
        this.checkUserLoggedIn();
        this.getAllBook();
    }
    // async connectedCallback(){
    //     console.log('$connectedCallback called');
    //     this.updateItemCountOnCartIcon();
    //     this.check();
    // }
    // async check(){
    //     console.log('$check called');
    //     // await this.checkUserLoggedIn(); 
    //     this.checkUserLoggedIn(); 
    //     this.getAllBook();
    // }
    async getApiBooks(){
        console.log('$getApiBooks called');
        let bks = await getBooksFromApi();
        if (typeof bks === 'string') {
            bks = JSON.parse(bks);
            bks = Array.from(bks.products);
        }
        return bks;
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
                "Id": book.Id,
                "bookName": book.Name,
                "productCode": book.ProductCode,
                "bookAuthor": book.Book_Author__c,
                "bookCoverImageUrl": book.Book_Cover_c__c,
                "bookPrice": book.PricebookEntries[0].UnitPrice,
                "api": false,
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
                "api": true,
                "sf": false,
            });
        });
        this.allBooks = sfBooks.concat(apiBooks);
        this.allBookProducts = sfBooks.concat(apiBooks);
        this.allBooksCopy = Array.from(this.allBooks);
        this.handleChackbox();
    }  
    @track loginlabel = 'Login';

    async checkUserLoggedIn(){
        console.log('$checkUserLoggedIn called');
        let loggedIn = await isUserLoggedIn();
        this.isUlogedIn = loggedIn;//
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
        console.log('$handleLogout called');
        getLogoutUrl()
            .then(url => {
                window.location.href = url;
            })
            .catch(error => {
                console.error('Logout error', error);
            });
    }  

    @track myCart = [];
    @track proCodProductMap = new Map();

    async handleAddToCart(event){
        console.log('$handleAddToCart called');
        let productcode = event.target.dataset.productcode;
        let isLoggedIn = await this.checkUserLoggedIn();
        console.log('handleAddToCart: isLoggedIn : ', isLoggedIn);
        if(!isLoggedIn){
            this.handleLogin();
        }else {
            let quantity = 1;
            let cart = JSON.parse(localStorage.getItem('cart')) ?? {};
            if(cart[productcode]){
                cart[productcode] += parseInt(quantity);
            }else{
                cart[productcode] = parseInt(quantity);
            }
            window.localStorage.setItem('cart', JSON.stringify(cart));
        }
        this.updateItemCountOnCartIcon();
    }
    updateItemCountOnCartIcon(){
        console.log('updateItemCountOnCartIcon : ');
        let cart = localStorage.getItem('cart');
        if(cart != null){
            this.itemCout = Object.keys(JSON.parse(cart)).length;
        }else {
            this.itemCout = 0;
        }
    }
    
    async handleOpenMyCart(){
        console.log('$handleOpenMyCart called : ');
        let isLoggedIn = await this.checkUserLoggedIn();
        console.log('handleAddToCart: isLoggedIn : ', isLoggedIn);
        if(!isLoggedIn){
            this.handleLogin();
        }
        else {
            let cart = JSON.parse(localStorage.getItem('cart'));
            console.log('cart : ', cart);
            if(cart != null){
                for(const [productCod, quantity] of Object.entries(cart)){
                    let prodct =  this.allBookProducts.find(book => (book.productCode == productCod));
                    prodct["quantity"] = parseInt(quantity);
                    if(prodct["api"] == true){
                        prodct["bookPrice"] = parseFloat(prodct["bookPrice"].substring(1));
                    }
                    prodct["totalPrice"] = parseFloat(quantity) * parseFloat(prodct["bookPrice"]);
                    this.myCart.push(prodct);
                }
            }
            this.storeDataOnLocalStorage();
        }
    }

    async handleRefresh(){
        console.log('$handleRefresh called');
        this.check();
    }
    handleChackbox(){
        console.log('$handleChackbox called');
        this.allBooks = Array.from(this.allBooksCopy);
        let sfcheckbox = this.template.querySelector('.sf-checkbox');
        let apicheckbox = this.template.querySelector('.api-checkbox');
        if(sfcheckbox.checked == true && apicheckbox.checked != true){
            this.allBooks = this.allBooks.filter(book => (book.sf == true));
        }else if(sfcheckbox.checked != true && apicheckbox.checked == true){
            this.allBooks = this.allBooks.filter(book => (book.api == true));
        }else if(sfcheckbox.checked == true && apicheckbox.checked == true){
            this.allBooks = this.allBooks.filter(book => (book.sf == true || book.api == true));
        }else if(sfcheckbox.checked != true && apicheckbox.checked != true){
            this.allBooks = null;
        }
    }

    storeDataOnLocalStorage(){
        console.log('$storeDataOnLocalStorage called');
        window.localStorage.setItem('mycartdata',JSON.stringify(this.myCart));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/cart-page'
            }
        });
    }
 
}











/* //--------------------------------------------------------------------
import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isUserLoggedIn from '@salesforce/apex/ProductController.isUserLoggedIn';
import getLogoutUrl from '@salesforce/apex/ProductController.getLogoutUrl';
import getBooks from '@salesforce/apex/ProductController.getBooks';
import getBooksFromApi from '@salesforce/apex/GetBooksFromApi.getBooksFromApi';

export default class BookCommunity2 extends NavigationMixin(LightningElement) {

    @track books;
    @track salesforcebooks;

    async connectedCallback(){
        console.log('BookCommunity: $connectedCallback called');
        console.log('$connectedCallback');
        // let books = await this.getApiBooks();
        //this.books = Array.from(books);

        // let sfbooks = await this.getSalesforceBooks();
        // this.salesforcebooks = Array.from(sfbooks);

        // this.checkUserLoggedIn(); 
        // this.handleRefresh();
        this.check();
        
    }
    async check(){
        await this.checkUserLoggedIn(); 
        await this.handleRefresh();
    }    
    @track loginlabel = 'Login';

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
        console.log('$handleLogout called');
        getLogoutUrl()
            .then(url => {
                window.location.href = url;
            })
            .catch(error => {
                console.error('Logout error', error);
            });
    }  

    async getApiBooks(){
        console.log('$getApiBooks called');
        let bks = await getBooksFromApi();
        if (typeof bks === 'string') {
            bks = JSON.parse(bks);
            bks = Array.from(bks.books);
            console.log('bks : ', JSON.stringify(bks));
        }
        return bks;
    }

    async getSalesforceBooks(){
        console.log('$getSalesforceBooks called');
        let salesforceBooks = await getBooks();
        return Array.from(salesforceBooks);
    }

    async handleAddToCart(){
        console.log('$handleAddToCart called');
        //this.handleLogin();
        let isLoggedIn = await this.checkUserLoggedIn();
        console.log('handleAddToCart: isLoggedIn : ', isLoggedIn);
        if(!isLoggedIn){
            console.log('user not logged in plese go to login');
            this.handleLogin();

        }else {
            console.log('user loged in hai');
        }

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
        }else{
            this.salesforcebooks = null;
        }
    }
} */