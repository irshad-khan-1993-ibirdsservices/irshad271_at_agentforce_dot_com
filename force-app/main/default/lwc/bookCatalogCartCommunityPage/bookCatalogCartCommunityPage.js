import {LightningElement, wire, track} from 'lwc';
import getCartSfBooksByISBN from '@salesforce/apex/BookCatalogCartCommunityPageController.getCartSfBooksByISBN';
import getBooksFromApi from '@salesforce/apex/BookCatalogCartCommunityPageController.getBooksFromApi';
export default class BookCatalogCartCommunityPage extends LightningElement {

    @track myCartData;
    @track myCartDataCopy;
    @track grandTotalAmount = 0;
    sfProCode = [];
    apiProCode = [];
    connectedCallback() {
        // this.getData();
        // this.calculateGrandTotal();
        console.log('BookCatalogCartCommunityPage: $connectedCallback called');
        //localStorage.setItem('haveToOpenCart', false);
        this.handleOpenMyCart();
        // localStorage.removeItem('cart');
        // localStorage.setItem('cart', 'mycart');
        //this.getCartSfBooksByISBN(sfProCode);//for testing now
    }
    handleOpenMyCart(){
        console.log('$handleOpenMyCart called');
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        let sfProducts = [];
        let apiProducts = [];
        
        Object.entries(cart).forEach(([key, quantity]) => {
            if(key.startsWith('sf_')){
                sfProducts.push({productCode: key.replace('sf_', ''), quantity});
                this.sfProCode.push(key.replace('sf_', ''));
            }else if(key.startsWith('api_')){
                apiProducts.push({productCode: key.replace('api_', ''), quantity});
                this.apiProCode.push(key.replace('api_', ''));
            }
        });
        // console.log('sfProducts : ', JSON.stringify(sfProducts,null,2));
        // console.log('apiProducts : ', JSON.stringify(apiProducts,null,2));
        // console.log('sfProCode : ', JSON.stringify(this.sfProCode,null,2));
        // console.log('apiProCode : ', JSON.stringify(this.apiProCode,null,2));
        // const event = new CustomEvent('openmycartbtnclick', {"detail": {"sfProducts": sfProducts, "apiProducts": apiProducts}});
        // this.dispatchEvent(event);
        this.getAllBooks(sfProducts, apiProducts);//getting sf books
        
    }
    async getAllBooks(sfProducts, apiProducts){
        console.log('getAllBooks called');
        let sfBookByIsbn = await getCartSfBooksByISBN({'bookIsbn' : this.sfProCode});
        let apiBooks = await getBooksFromApi();
        let sfProductQuantityMap = sfProducts.reduce((map, item) => {
            map[item.productCode] = item.quantity;
            return map;
        },{});
        let apiProductQuantityMap = apiProducts.reduce((map, item) => {
            map[item.productCode] = item.quantity;
            return map;
        },{});

        sfBookByIsbn = sfBookByIsbn.map(book => {
            let code = book.ProductCode;          
            return ({
                "Id": book.Id,
                "bookName": book.Name,
                "productCode": book.ProductCode,
                "bookAuthor": book.Book_Author__c,
                "bookCoverImageUrl": book.Book_Cover_c__c,
                "bookPrice": book.PricebookEntries[0].UnitPrice,
                "quantity": sfProductQuantityMap[code] || 0,
                "totalPrice": parseInt(book.PricebookEntries[0].UnitPrice) * sfProductQuantityMap[code] || 0,
                "sf": true,
            });
        });
        apiBooks = JSON.parse(apiBooks);
        apiBooks = Array.from(apiBooks.products);
        apiBooks = apiBooks.map(book => {
            let code = book.isbn;
            return ({
                "Id": book.id,
                "bookName": book.name,
                "productCode": book.isbn,
                "bookAuthor": "Author Not Available",
                "bookCoverImageUrl": book.book_cover,
                "bookPrice": book.price,
                "quantity": apiProductQuantityMap[code] || 0,
                "totalPrice": parseInt(book.price) * parseInt(apiProductQuantityMap[code] || 0),
                "sf": false,
            });
        });
        apiBooks = apiBooks.filter(book => (this.apiProCode.includes(book.productCode)));            
        this.myCartData = sfBookByIsbn.concat(apiBooks);
        this.myCartDataCopy = Array.from(this.myCartData);
        this.calculateGrandTotal();
    }
    // getData(){
    //     console.log('$getData called');
    //     this.myCartData = window.localStorage.getItem('mycartdata');

    //     if(this.myCartData != null || !isEmpty(this.myCartData)){
    //         console.log('this.myCartData : ', this.myCartData);
    //         this.myCartData = JSON.parse(this.myCartData);
    //         this.myCartDataCopy = Array.from(this.myCartData);
    //     }
    // }
    handleAddItemOrSubtractItem(event){
        console.log('$handleAddItemOrSubtractItem called');
        let btn = event.target.name;
        let btnprocod = event.target.dataset.procod;
        let currentItemCount = parseInt(this.template.querySelector(`lightning-button[data-procoditemcount=${btnprocod}]`).innerText);
        /* if(btn == 'add'){
            this.myCartDataCopy = this.myCartDataCopy.map(p => {
                if(p.productCode == btnprocod){
                    currentItemCount += 1;
                    p["totalPrice"] = currentItemCount * p.bookPrice;
                    return {...p, "quantity": currentItemCount};
                }else {
                    return {...p};
                }
            });
        }else if(btn == 'subtract'){
            this.myCartDataCopy = this.myCartDataCopy.map(p => {
                if(p.productCode == btnprocod){
                    if(currentItemCount > 1){
                        currentItemCount -= 1;
                    }
                    p["totalPrice"] = currentItemCount * p.bookPrice;
                    return {...p, "quantity": currentItemCount};
                }else {
                    return {...p};
                }
            });
        } */
        
        // cart = cart.map(item => {
        //     if(item.startsWith('api_')){
        //         return {...item.substring(4)};
        //     }else if(item.startsWith('sf_')){
        //         return {...item.substring(3)};
        //     }
        // });
        
        
        
        if(btn == 'add'){
            currentItemCount += 1;
        }else if(btn == 'subtract' && currentItemCount > 1){
            currentItemCount -= 1;
        }
        this.myCartDataCopy = this.myCartDataCopy.map(p => {
            if(p.productCode == btnprocod){
                p["totalPrice"] = currentItemCount * p.bookPrice;
                return {...p, "quantity": currentItemCount};
            }else {
                return {...p};
            }

        });

        let isbtnsf =  event.target.dataset.isitemsf;
        // console.log('btn : ', btn);
        // console.log('btnprocod : ', btnprocod);
        // console.log('currentItemCount : ', currentItemCount);
        // console.log('isbtnsf : ', isbtnsf);
        let cart = JSON.parse(localStorage.getItem('cart'));
        if(isbtnsf == 'true'){
            let key = 'sf_' + btnprocod;
            // console.log('key : ' + key);
            cart[key] = currentItemCount;
        }else if(isbtnsf == 'false'){
            let key = 'api_' + btnprocod;
            // console.log('key : ' + key);
            cart[key] = currentItemCount;
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // console.log('cart : ', JSON.stringify(cart,null,2));
        // let currentItemOfCart = cart.map(item => {
        //     if(item.startsWith('api_')){
        //         return {...item};
        //     }else if(item.startsWith('sf_')){
        //         return {...item};
        //     }
        // });
        // console.log('currentItemOfCart : ', JSON.stringify(currentItemOfCart,null,2));
        // let grandTotal = 0;
        // this.myCartDataCopy.forEach(p => {
        //     grandTotal += p.totalPrice;
        // })
        // this.myCartDataCopy = this.myCartDataCopy.map(p => {
        //     return {...p, "GrandTotal": grandTotal};
        // });
        // let cart = {};
        // this.myCartDataCopy.forEach(p => {
        //     let k = p.productCode;
        //     let v = p.quantity;
        //     cart[k] = v;
        // });
        this.calculateGrandTotal();
        // window.localStorage.setItem('mycartdata', JSON.stringify(this.myCartDataCopy));
        // window.localStorage.setItem('cart', JSON.stringify(cart));
    }
    calculateGrandTotal(){
        console.log('$calculateGrandTotal called');
        // console.log('this.myCartDataCopy', JSON.stringify(this.myCartDataCopy,null,2));
        this.grandTotalAmount = 0;
        this.myCartDataCopy.forEach(p => {
            this.grandTotalAmount += parseInt(p.totalPrice);
        });

    }
    handleRemoveItem(event){
        console.log('$handleRemoveItem called');
        let itemToRemove = event.target.dataset.removebtn;
        let isbtnsf =  event.target.dataset.isitemsf;
        console.log('itemToRemove', itemToRemove)
        console.log('itemToRemove : ', itemToRemove);
        let cart = JSON.parse(window.localStorage.getItem('cart'));
        if(Object.keys(cart).length > 0){
            console.log('inside if');
            let key;
            if(isbtnsf == 'true'){
                key = 'sf_' + itemToRemove;
            }else if(isbtnsf == 'false'){
                key = 'api_' + itemToRemove;
            }
            console.log('key : ', key);
            delete cart[key];
            delete cart.key;
            if(Object.keys(cart).length > 0){
                console.log('inside if if');
                localStorage.setItem('cart', JSON.stringify(cart));
                // console.log('cart : ', JSON.stringify(cart, null,2));
            }else{
                console.log('inside if else');
                localStorage.removeItem('cart');
            }
        }else {
            console.log('inside if else');
        }

        this.myCartDataCopy = this.myCartDataCopy.filter(i => (i.productCode != itemToRemove));
        this.calculateGrandTotal();
        // window.localStorage.setItem('mycartdata', JSON.stringify(this.myCartDataCopy));
    }
}