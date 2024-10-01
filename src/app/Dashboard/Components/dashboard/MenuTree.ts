export const MenuTree =[
    {
        Caption:"Home",
        Icon:"fa-solid fa-house",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Buying Contract", Iconn: "", RouterLink:"buyingcontracts"   },
            {   Caption: "RCTI", Iconn: "", RouterLink:"buyingreceipts"   },
            {   Caption: "Delivery Doc", Iconn: "", RouterLink:"deliverydocs"   },
            {   Caption: "Sales Invoice", Iconn: "", RouterLink:"salesinvoices"   },           
            {   Caption: "Purchase Order", Iconn: "", RouterLink:"purchaseorders"   },    
            {   Caption: "Sales Order", Iconn: "", RouterLink:"salesorders"   },    
        ]
    },
 
    {
        Caption:"Smelting",
        Icon:"fa fa-superpowers",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Smelting Issue", Iconn: "", RouterLink:"smeltingissues" },
            {   Caption: "Smelting Receipt", Iconn: "", RouterLink:"smeltingreceipts" },            
        ]
    },
   
    {
        Caption:"Refining",
        Icon:"fa fa-thermometer-full",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Refining Issue", Iconn: "", RouterLink:"refiningissues" },
            {   Caption: "Refining Receipt", Iconn: "", RouterLink:"refiningreceipts" },            
        ]
    },

    {
        Caption:"Casting",
        Icon:"fa fa-stop",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Casting Issue", Iconn: "", RouterLink:"castingissues" },
            {   Caption: "Casting Receipt", Iconn: "", RouterLink:"castingreceipts" },            
        ]
    },

    {
        Caption:"Jobwork",
        Icon:"fa fa-handshake",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Jobwork Inward", Iconn: "", RouterLink:"jobworkinward" },
            {   Caption: "Jobwork Delivery", Iconn: "", RouterLink:"jobworkdelivery" },            
        ]
    },

    {
        Caption:"Reports",
        Icon:"fa fa-line-chart",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Gold Stock Report", Iconn: "", RouterLink:"goldstockreport" },
            {   Caption: "Silver Stock Report", Iconn: "", RouterLink:"silverstockreport" },
            {   Caption: "Stock Register", Iconn: "", RouterLink:"stockregister" },            
            {   Caption: "Pending DeliveryDocs", Iconn: "", RouterLink:"pendingreport/4" },            
            {   Caption: "Pending Smelting", Iconn: "", RouterLink:"pendingreport/1" },            
            {   Caption: "Pending Refining", Iconn: "", RouterLink:"pendingreport/2" },            
            {   Caption: "Pending Casting", Iconn: "", RouterLink:"pendingreport/3" },            
            {   Caption: "Batch History", Iconn: "", RouterLink:"batchhistory" },
        ]
    },

    {
        Caption:"Masters",
        Icon:"fa fa-cubes",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Clients", Iconn: "", RouterLink:"clients" },
            {   Caption: "Items", Iconn: "", RouterLink:"items" },            
            {   Caption: "Uoms", Iconn: "", RouterLink:"uoms" },                              
            {   Caption: "Job Workers", Iconn: "", RouterLink:"jobworkers" },            
        ]
    },

    {
        Caption:"Accounts",
        Icon:"fa fa-money",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Ledger Groups", Iconn: "", RouterLink:"ledgergroups" },
            {   Caption: "Ledgers", Iconn: "", RouterLink:"ledgers" },            
            {   Caption: "Receipt", Iconn: "", RouterLink:"receipts" },            
            {   Caption: "Payment", Iconn: "", RouterLink:"payments" },            
            {   Caption: "Bank Receipt", Iconn: "", RouterLink:"bankreceipts" },            
            {   Caption: "Bank Payment", Iconn: "", RouterLink:"bankpayments" },            
            {   Caption: "Cash Register", Iconn: "", RouterLink:"cashregister" },            
        ]
    },

    {
        Caption:"Settings",
        Icon:"fa fa-cog",
        RouterLink: "",
        SubMenu: 
        [
            {   Caption: "Users", Iconn: "", RouterLink:"users" },
            {   Caption: "Voucher Series", Iconn: "", RouterLink:"" },            
            {   Caption: "Features", Iconn: "", RouterLink:"" },                             
        ]
    },
]