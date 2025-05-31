import {LightningElement, wire, track} from 'lwc';
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
        localStorage.setItem('haveToOpenCart', false);
        this.handleOpenMyCart();
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
        console.log('sfProducts : ', JSON.stringify(sfProducts,null,2));
        console.log('apiProducts : ', JSON.stringify(apiProducts,null,2));
        console.log('sfProCode : ', JSON.stringify(this.sfProCode,null,2));
        console.log('apiProCode : ', JSON.stringify(this.apiProCode,null,2));
        // const event = new CustomEvent('openmycartbtnclick', {"detail": {"sfProducts": sfProducts, "apiProducts": apiProducts}});
        // this.dispatchEvent(event);
        
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
    // handleAddItemOrSubtractItem(event){
    //     console.log('$handleAddItemOrSubtractItem called');
    //     let btn = event.target.name;
    //     let btnprocod = event.target.dataset.procod;
    //     let currentItemCount = parseInt(this.template.querySelector(`lightning-button[data-procoditemcount=${btnprocod}]`).innerText);
    //     if(btn == 'add'){
    //         this.myCartDataCopy = this.myCartDataCopy.map(p => {
    //             if(p.productCode == btnprocod){
    //                 currentItemCount += 1;
    //                 p["totalPrice"] = currentItemCount * p.bookPrice;
    //                 return {...p, "quantity": currentItemCount, "GrandTotal": 0};
    //             }else {
    //                 return {...p};
    //             }
    //         });
    //     }else if(btn == 'subtract'){
    //         this.myCartDataCopy = this.myCartDataCopy.map(p => {
    //             if(p.productCode == btnprocod){
    //                 if(currentItemCount > 1){
    //                     currentItemCount -= 1;
    //                 }
    //                 p["totalPrice"] = currentItemCount * p.bookPrice;
    //                 return {...p, "quantity": currentItemCount, "GrandTotal": 0};
    //             }else {
    //                 return {...p};
    //             }
    //         });
    //     }
    //     let grandTotal = 0;
    //     this.myCartDataCopy.forEach(p => {
    //         grandTotal += p.totalPrice;
    //     })
    //     this.myCartDataCopy = this.myCartDataCopy.map(p => {
    //         return {...p, "GrandTotal": grandTotal};
    //     });
    //     let cart = {};
    //     this.myCartDataCopy.forEach(p => {
    //         let k = p.productCode;
    //         let v = p.quantity;
    //         cart[k] = v;
    //     });
    //     this.calculateGrandTotal();
    //     window.localStorage.setItem('mycartdata', JSON.stringify(this.myCartDataCopy));
    //     window.localStorage.setItem('cart', JSON.stringify(cart));
    // }
    // calculateGrandTotal(){
    //     console.log('$calculateGrandTotal called');
    //     this.grandTotalAmount = 0;
    //     this.myCartDataCopy.forEach(p => {
    //         this.grandTotalAmount += parseInt(p.totalPrice);
    //     });

    // }
    // handleRemoveItem(event){
    //     console.log('$handleRemoveItem called');
    //     let itemToRemove = event.target.dataset.removebtn;
    //     console.log('itemToRemove : ', itemToRemove);
    //     let cart = JSON.parse(window.localStorage.getItem('cart'));
    //     if(Object.keys(cart).length > 0){
    //         console.log('inside if');
    //         delete cart[itemToRemove];
    //         if(Object.keys(cart).length > 0){
    //             console.log('inside if if');
    //             window.localStorage.setItem('cart', JSON.stringify(cart));
    //         }else{
    //             console.log('inside if else');
    //             window.localStorage.removeItem('cart');
    //         }
    //     }else {
    //         console.log('inside if else');
    //     }

    //     this.myCartDataCopy = this.myCartDataCopy.filter(i => (i.productCode != itemToRemove));
    //     this.calculateGrandTotal();
    //     window.localStorage.setItem('mycartdata', JSON.stringify(this.myCartDataCopy));
    // }
}