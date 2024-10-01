import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }               from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { WebcamModule } from 'ngx-webcam';


/* *********************** ANGULAR MATERIAL LIBRARIES *******************************/
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule,}     from '@angular/material/form-field';
import { MatSelectModule}         from '@angular/material/select';
import { MatTableModule}          from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule }          from '@angular/material/icon';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatCheckboxModule} from '@angular/material/checkbox';
/* **********************************************************************************/

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Auth/login/login.component';
import { DashboardComponent } from './Dashboard/Components/dashboard/dashboard.component';
import { IndexpageComponent } from './Dashboard/Components/indexpage/indexpage.component';
import { MsgboxComponent } from './GlobalWidgets/msgbox/msgbox.component';
import { SnackbarComponent } from './GlobalWidgets/snackbar/snackbar.component';
import { CompaniesComponent } from './Dashboard/Components/companies/companies.component';
import { ClientsComponent } from './Dashboard/Components/clients/clients.component';
import { ClientComponent } from './Dashboard/Components/clients/client/client.component';
import { ImagesComponent } from './Dashboard/widgets/images/images.component';
import { ProgressComponent } from './Dashboard/widgets/progress/progress.component';
import { SelectionlistComponent } from './Dashboard/widgets/selectionlist/selectionlist.component';
import { IntToDatePipe } from './Dashboard/Pipes/int-to-date.pipe';
import { JobworkersComponent } from './Dashboard/Components/jobworkers/jobworkers.component';
import { JobworkerComponent } from './Dashboard/Components/jobworkers/jobworker/jobworker.component';
import { UomsComponent } from './Dashboard/Components/uoms/uoms.component';
import { UomComponent } from './Dashboard/Components/uoms/uom/uom.component';
import { ItemsComponent } from './Dashboard/Components/items/items.component';
import { ItemComponent } from './Dashboard/Components/items/item/item.component';
import { BuyingcontractsComponent } from './Dashboard/Components/buyingcontracts/buyingcontracts.component';
import { BuyingcontractComponent } from './Dashboard/Components/buyingcontracts/buyingcontract/buyingcontract.component';
import { PartycardComponent } from './Dashboard/widgets/partycard/partycard.component';
import { DocheaderComponent } from './Dashboard/widgets/docheader/docheader.component';
import { ItemdetailsComponent } from './Dashboard/widgets/itemdetails/itemdetails.component';
import { NumberInputDirective } from './Dashboard/Directives/NumberInput';
import { WebcamComponent } from './GlobalWidgets/webcam/webcam.component';
import { BuyingreceiptsComponent } from './Dashboard/Components/buyingreceipts/buyingreceipts.component';
import { BuyingreceiptComponent } from './Dashboard/Components/buyingreceipts/buyingreceipt/buyingreceipt.component';
import { SmeltingissuesComponent } from './Dashboard/Components/smeltingissues/smeltingissues.component';
import { SmeltingissueComponent } from './Dashboard/Components/smeltingissues/smeltingissue/smeltingissue.component';
import { BatchselectionComponent } from './Dashboard/widgets/batchselection/batchselection.component';
import { SmeltingreceiptsComponent } from './Dashboard/Components/smeltingreceipts/smeltingreceipts.component';
import { SmeltingreceiptComponent } from './Dashboard/Components/smeltingreceipts/smeltingreceipt/smeltingreceipt.component';
import { RefiningissuesComponent } from './Dashboard/Components/refiningissues/refiningissues.component';
import { RefiningissueComponent } from './Dashboard/Components/refiningissues/refiningissue/refiningissue.component';
import { RefiningreceiptsComponent } from './Dashboard/Components/refiningreceipts/refiningreceipts.component';
import { RefiningreceiptComponent } from './Dashboard/Components/refiningreceipts/refiningreceipt/refiningreceipt.component';
import { CastingissuesComponent } from './Dashboard/Components/castingissues/castingissues.component';
import { CastingissueComponent } from './Dashboard/Components/castingissues/castingissue/castingissue.component';
import { CastingreceiptsComponent } from './Dashboard/Components/castingreceipts/castingreceipts.component';
import { CastingreceiptComponent } from './Dashboard/Components/castingreceipts/castingreceipt/castingreceipt.component';
import { StockreportComponent } from './Dashboard/Reports/stockreport/stockreport.component';
import { StockregisterComponent } from './Dashboard/Reports/stockregister/stockregister.component';
import { SalesinvoicesComponent } from './Dashboard/Components/salesinvoices/salesinvoices.component';
import { SalesinvoiceComponent } from './Dashboard/Components/salesinvoices/salesinvoice/salesinvoice.component';
import { PendingreportComponent } from './Dashboard/Reports/pendingreport/pendingreport.component';
import { UsersComponent } from './Dashboard/Components/users/users.component';
import { UserComponent } from './Dashboard/Components/users/user/user.component';
import { DeliverydocsComponent } from './Dashboard/Components/deliverydocs/deliverydocs.component';
import { DeliverydocComponent } from './Dashboard/Components/deliverydocs/deliverydoc/deliverydoc.component';
import { StockselectionComponent } from './Dashboard/widgets/stockselection/stockselection.component';
import { LedgergroupsComponent } from './Dashboard/Components/Accounts/ledgergroups/ledgergroups.component';
import { LedgergroupComponent } from './Dashboard/Components/Accounts/ledgergroups/ledgergroup/ledgergroup.component';
import { LedgersComponent } from './Dashboard/Components/Accounts/ledgers/ledgers.component';
import { LedgerComponent } from './Dashboard/Components/Accounts/ledgers/ledger/ledger.component';
import { ReceiptsComponent } from './Dashboard/Components/Accounts/receipts/receipts.component';
import { ReceiptComponent } from './Dashboard/Components/Accounts/receipts/receipt/receipt.component';
import { PaymentsComponent } from './Dashboard/Components/Accounts/payments/payments.component';
import { PaymentComponent } from './Dashboard/Components/Accounts/payments/payment/payment.component';
import { BankreceiptsComponent } from './Dashboard/Components/Accounts/bankreceipts/bankreceipts.component';
import { BankreceiptComponent } from './Dashboard/Components/Accounts/bankreceipts/bankreceipt/bankreceipt.component';
import { BankpaymentsComponent } from './Dashboard/Components/Accounts/bankpayments/bankpayments.component';
import { BankpaymentComponent } from './Dashboard/Components/Accounts/bankpayments/bankpayment/bankpayment.component';
import { CashregisterComponent } from './Dashboard/Components/Accounts/cashregister/cashregister.component';
import { BatchhistoryComponent } from './Dashboard/Reports/batchhistory/batchhistory.component';
import { JobworkinwardsComponent } from './Dashboard/Components/jobworkinwards/jobworkinwards.component';
import { JobworkinwardComponent } from './Dashboard/Components/jobworkinwards/jobworkinward/jobworkinward.component';
import { JobworkdeliverysComponent } from './Dashboard/Components/jobworkdeliverys/jobworkdeliverys.component';
import { JobworkdeliveryComponent } from './Dashboard/Components/jobworkdeliverys/jobworkdelivery/jobworkdelivery.component';
import { PurchaseordersComponent } from './Dashboard/Components/purchaseorders/purchaseorders.component';
import { PurchaseorderComponent } from './Dashboard/Components/purchaseorders/purchaseorder/purchaseorder.component';
import { SalesordersComponent } from './Dashboard/Components/salesorders/salesorders.component';
import { SalesorderComponent } from './Dashboard/Components/salesorders/salesorder/salesorder.component';
import { SilverstockreportComponent } from './Dashboard/Reports/silverstockreport/silverstockreport.component';


@NgModule({
  declarations: [    
    NumberInputDirective,
    AppComponent,
    IntToDatePipe,
    MsgboxComponent,
    ImagesComponent,
    ProgressComponent,
    SelectionlistComponent,
    LoginComponent,
    DashboardComponent,
    IndexpageComponent,    
    SnackbarComponent,
    CompaniesComponent,
    ClientsComponent,
    ClientComponent,
    JobworkersComponent,
    JobworkerComponent,
    UomsComponent,
    UomComponent,
    ItemsComponent,
    ItemComponent,
    BuyingcontractsComponent,
    BuyingcontractComponent,
    PartycardComponent,
    DocheaderComponent,
    ItemdetailsComponent,
    WebcamComponent,
    BuyingreceiptsComponent,
    BuyingreceiptComponent,
    SmeltingissuesComponent,
    SmeltingissueComponent,
    BatchselectionComponent,    
    SmeltingreceiptsComponent,
    SmeltingreceiptComponent,
    RefiningissuesComponent,
    RefiningissueComponent,
    RefiningreceiptsComponent,
    RefiningreceiptComponent,
    CastingissuesComponent,
    CastingissueComponent,
    CastingreceiptsComponent,
    CastingreceiptComponent,
    StockreportComponent,
    StockregisterComponent,
    SalesinvoicesComponent,
    SalesinvoiceComponent,
    PendingreportComponent,
    UsersComponent,
    UserComponent,
    DeliverydocsComponent,
    DeliverydocComponent,
    StockselectionComponent,
    LedgergroupsComponent,
    LedgergroupComponent,
    LedgersComponent,
    LedgerComponent,
    ReceiptsComponent,
    ReceiptComponent,
    PaymentsComponent,
    PaymentComponent,
    BankreceiptsComponent,
    BankreceiptComponent,
    BankpaymentsComponent,
    BankpaymentComponent,
    CashregisterComponent,
    BatchhistoryComponent,
    JobworkinwardsComponent,
    JobworkinwardComponent,
    JobworkdeliverysComponent,
    JobworkdeliveryComponent,
    PurchaseordersComponent,
    PurchaseorderComponent,
    SalesordersComponent,
    SalesorderComponent,
    SilverstockreportComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    WebcamModule,

    MatMenuModule,    
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    MatGridListModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
