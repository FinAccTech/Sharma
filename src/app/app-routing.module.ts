import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { DashboardComponent } from './Dashboard/Components/dashboard/dashboard.component';
import { IndexpageComponent } from './Dashboard/Components/indexpage/indexpage.component';
import { CanActivate, CanCompActivate } from './Auth/auth-guard';
import { CompaniesComponent } from './Dashboard/Components/companies/companies.component';
import { ClientsComponent } from './Dashboard/Components/clients/clients.component';
import { JobworkersComponent } from './Dashboard/Components/jobworkers/jobworkers.component';
import { UomsComponent } from './Dashboard/Components/uoms/uoms.component';
import { ItemsComponent } from './Dashboard/Components/items/items.component';
import { BuyingcontractsComponent } from './Dashboard/Components/buyingcontracts/buyingcontracts.component';
import { BuyingcontractComponent } from './Dashboard/Components/buyingcontracts/buyingcontract/buyingcontract.component';
import { BuyingreceiptsComponent } from './Dashboard/Components/buyingreceipts/buyingreceipts.component';
import { BuyingreceiptComponent } from './Dashboard/Components/buyingreceipts/buyingreceipt/buyingreceipt.component';
import { SmeltingissuesComponent } from './Dashboard/Components/smeltingissues/smeltingissues.component';
import { SmeltingissueComponent } from './Dashboard/Components/smeltingissues/smeltingissue/smeltingissue.component';
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
import { DeliverydocsComponent } from './Dashboard/Components/deliverydocs/deliverydocs.component';
import { DeliverydocComponent } from './Dashboard/Components/deliverydocs/deliverydoc/deliverydoc.component';
import { LedgergroupsComponent } from './Dashboard/Components/Accounts/ledgergroups/ledgergroups.component';
import { LedgersComponent } from './Dashboard/Components/Accounts/ledgers/ledgers.component';
import { ReceiptsComponent } from './Dashboard/Components/Accounts/receipts/receipts.component';
import { PaymentsComponent } from './Dashboard/Components/Accounts/payments/payments.component';
import { BankreceiptsComponent } from './Dashboard/Components/Accounts/bankreceipts/bankreceipts.component';
import { BankpaymentsComponent } from './Dashboard/Components/Accounts/bankpayments/bankpayments.component';
import { CashregisterComponent } from './Dashboard/Components/Accounts/cashregister/cashregister.component';
import { BatchhistoryComponent } from './Dashboard/Reports/batchhistory/batchhistory.component';
import { JobworkinwardsComponent } from './Dashboard/Components/jobworkinwards/jobworkinwards.component';
import { JobworkinwardComponent } from './Dashboard/Components/jobworkinwards/jobworkinward/jobworkinward.component';
import { JobworkdeliverysComponent } from './Dashboard/Components/jobworkdeliverys/jobworkdeliverys.component';
import { JobworkdeliveryComponent } from './Dashboard/Components/jobworkdeliverys/jobworkdelivery/jobworkdelivery.component';
import { PurchaseordersComponent } from './Dashboard/Components/purchaseorders/purchaseorders.component';
import { SalesordersComponent } from './Dashboard/Components/salesorders/salesorders.component';
import { SalesorderComponent } from './Dashboard/Components/salesorders/salesorder/salesorder.component';
import { PurchaseorderComponent } from './Dashboard/Components/purchaseorders/purchaseorder/purchaseorder.component';
import { SilverstockreportComponent } from './Dashboard/Reports/silverstockreport/silverstockreport.component';

const routes: Routes = [
  { path:'', component: LoginComponent}, 
  { path:'dashboard', component: DashboardComponent,canActivate: [CanActivate],  

        children:[
          { path:'', component: CompaniesComponent },                 
          { path:'companies', component: CompaniesComponent},     
          { path:'indexpage', component: IndexpageComponent, canActivate:[CanCompActivate]},                 
          { path:'clients', component: ClientsComponent, canActivate:[CanCompActivate] },                 
          { path:'jobworkers', component: JobworkersComponent, canActivate:[CanCompActivate] },                 
          { path:'uoms', component: UomsComponent, canActivate:[CanCompActivate] },                 
          { path:'items', component: ItemsComponent, canActivate:[CanCompActivate] },                           
          { path:'users', component: UsersComponent, canActivate:[CanCompActivate],data:{"adminCheck":true} },                 

          { path:'ledgergroups', component: LedgergroupsComponent, canActivate:[CanCompActivate] },                 
          { path:'ledgers', component: LedgersComponent, canActivate:[CanCompActivate] },                 

          { path:'receipts', component: ReceiptsComponent, canActivate:[CanCompActivate] },                 
          { path:'payments', component: PaymentsComponent, canActivate:[CanCompActivate] }, 
          { path:'bankreceipts', component: BankreceiptsComponent, canActivate:[CanCompActivate] }, 
          { path:'bankpayments', component: BankpaymentsComponent, canActivate:[CanCompActivate] }, 

          { path:'cashregister', component: CashregisterComponent, canActivate:[CanCompActivate] }, 
          
          { path:'buyingcontracts', component: BuyingcontractsComponent, canActivate:[CanCompActivate] },                 
          { path:'buyingcontract/:trans', component: BuyingcontractComponent, canActivate:[CanCompActivate] },                 
          
          { path:'buyingreceipts', component: BuyingreceiptsComponent, canActivate:[CanCompActivate] },                 
          { path:'buyingreceipt/:trans', component: BuyingreceiptComponent, canActivate:[CanCompActivate] },          

          { path:'deliverydocs', component: DeliverydocsComponent, canActivate:[CanCompActivate] },                 
          { path:'deliverydoc/:trans', component: DeliverydocComponent, canActivate:[CanCompActivate] },          

          { path:'salesinvoices', component: SalesinvoicesComponent, canActivate:[CanCompActivate] },                 
          { path:'salesinvoice/:trans', component: SalesinvoiceComponent, canActivate:[CanCompActivate] },          

          { path:'purchaseorders', component: PurchaseordersComponent, canActivate:[CanCompActivate] },                 
          { path:'purchaseorder/:trans', component: PurchaseorderComponent, canActivate:[CanCompActivate] },          
          
          { path:'salesorders', component: SalesordersComponent, canActivate:[CanCompActivate] },                 
          { path:'salesorder/:trans', component: SalesorderComponent, canActivate:[CanCompActivate] },          

          { path:'smeltingissues', component: SmeltingissuesComponent, canActivate:[CanCompActivate] },                 
          { path:'smeltingissue/:trans', component: SmeltingissueComponent, canActivate:[CanCompActivate] },          

          { path:'smeltingreceipts', component: SmeltingreceiptsComponent, canActivate:[CanCompActivate] },                 
          { path:'smeltingreceipt/:trans', component: SmeltingreceiptComponent, canActivate:[CanCompActivate] },          

          { path:'refiningissues', component: RefiningissuesComponent, canActivate:[CanCompActivate] },                 
          { path:'refiningissue/:trans', component: RefiningissueComponent, canActivate:[CanCompActivate] },  

          { path:'refiningreceipts', component: RefiningreceiptsComponent, canActivate:[CanCompActivate] },                 
          { path:'refiningreceipt/:trans', component: RefiningreceiptComponent, canActivate:[CanCompActivate] },  

          { path:'castingissues', component: CastingissuesComponent, canActivate:[CanCompActivate] },                 
          { path:'castingissue/:trans', component: CastingissueComponent, canActivate:[CanCompActivate] }, 
          
          { path:'castingreceipts', component: CastingreceiptsComponent, canActivate:[CanCompActivate] },                 
          { path:'castingreceipt/:trans', component: CastingreceiptComponent, canActivate:[CanCompActivate] }, 

          { path:'jobworkinward', component: JobworkinwardsComponent, canActivate:[CanCompActivate] },                 
          { path:'jobworkinward/:trans', component: JobworkinwardComponent, canActivate:[CanCompActivate] }, 

          { path:'jobworkdelivery', component: JobworkdeliverysComponent, canActivate:[CanCompActivate] },                 
          { path:'jobworkdelivery/:trans', component: JobworkdeliveryComponent, canActivate:[CanCompActivate] }, 

          { path:'goldstockreport', component: StockreportComponent, canActivate:[CanCompActivate] },       
          { path:'silverstockreport', component: SilverstockreportComponent, canActivate:[CanCompActivate] },       
          { path:'stockregister', component: StockregisterComponent, canActivate:[CanCompActivate] }, 

          { path:'pendingreport/:type', component: PendingreportComponent, canActivate:[CanCompActivate] },     
          { path:'pendingreport/:type', component: PendingreportComponent, canActivate:[CanCompActivate] },     
          { path:'pendingreport/:type', component: PendingreportComponent, canActivate:[CanCompActivate] },     

          { path:'batchhistory', component: BatchhistoryComponent, canActivate:[CanCompActivate] },       

          
      ]},  
];
 

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
