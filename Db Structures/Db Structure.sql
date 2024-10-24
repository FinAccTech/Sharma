CREATE TABLE Users
(
	UserSno INT PRIMARY KEY IDENTITY(1,1),
	UserName VARCHAR(20),
	Password VARCHAR(10),
  User_Type TINYINT,
  Active_Status BIT  
)

GO

INSERT INTO Users VALUES ('Admin','srini',1,1)
INSERT INTO Users VALUES ('sharma','sharma',1,1)

INSERT INTO Comp_Rights(UserSno,CompSno,Comp_Right) VALUES (1,1,1)
INSERT INTO Comp_Rights(UserSno,CompSno,Comp_Right) VALUES (1,2,1)

INSERT INTO Comp_Rights(UserSno,CompSno,Comp_Right) VALUES (2,1,1)
INSERT INTO Comp_Rights(UserSno,CompSno,Comp_Right) VALUES (2,2,1)



GO

CREATE TABLE Comp_Rights
(
  RightsSno INT PRIMARY KEY IDENTITY(1,1),
  UserSno INT,
  CompSno INT,
  Comp_Right BIT
)
GO

CREATE TABLE Companies
(
	CompSno INT PRIMARY KEY IDENTITY(1,1),
	Comp_Name VARCHAR(50),
	Comp_Logo VARCHAR(20),
	Status TINYINT
)

GO

INSERT INTO	Companies VALUES ('Sharma Bullion Pty Ltd.','sharmabullion.jpeg',1)
INSERT INTO	Companies VALUES ('AussieMint','aussiemint.jpeg',1)

GO


CREATE TABLE Voucher_Types
(
  VouTypeSno INT PRIMARY KEY IDENTITY(1,1),
  VouType_Name VARCHAR(20),
  Stock_Type TINYINT,
  Cash_Type TINYINT
)
GO

INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Opening Stock',1,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Buying Contract',1,2)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('RCTI',1,2)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Smelting Issue',2,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Smelting Receipt',1,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Refining Issue',2,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Refining Receipt',1,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Casting Issue',2,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Casting Receipt',1,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Sales Invoice',2,1)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Delivery Doc',2,0)

INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Opening Cash',0,1)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('PAYMENT',0,2)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('RECEIPT',0,1)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('BANK PAYMENT',0,2)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('BANK RECEIPT',0,1)

INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Jobwork Inward',0,0)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('JobWork Delivery',0,0)

INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Purchase Order',0,2)
INSERT INTO Voucher_Types(VouType_Name,Stock_Type,Cash_Type)  VALUES ('Sales Order',0,1)

GO

CREATE TABLE Voucher_Series
(
  SeriesSno       INT PRIMARY KEY IDENTITY(1,1),
  VouTypeSno      INT,
  Series_Name     VARCHAR(20),  
  Num_Method      TINYINT,
  Allow_Duplicate BIT,
  Start_No        INT,
  Current_No      INT,
  Prefix          CHAR(4),
  Suffix          CHAR(3),
  Width           TINYINT,
  Prefill         VARCHAR(1),
  Print_Voucher   BIT,
  Print_On_Save   BIT,
  Show_Preview    BIT,
  Print_Style     VARCHAR(100),
  IsDefault       BIT,
  Active_Status   BIT,
  Create_Date     INT,  
  CompSno         INT  
)
GO


INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (1,'Opening Stock',1,0,1,0,'OPS','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (2,'Buying Contract',1,0,1,0,'BC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (3,'RCTI',1,0,1,0,'BR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (4,'Smelting Issue',1,0,1,0,'SI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (5,'Smelting Receipt',1,0,1,0,'SR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (6,'Refining Issue',1,0,1,0,'RI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (7,'Refining Receipt',1,0,1,0,'RR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (8,'Casting Issue',1,0,1,0,'CI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (9,'Casting Receipt',1,0,1,0,'CR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (10,'Sales Invoice',1,0,1,0,'SAL','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (11,'Delivery Doc',1,0,1,0,'DOC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (12,'Opening Cash',1,0,1,0,'OPC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (13,'Payment',1,0,1,0,'PMT','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (14,'RECEIPT',1,0,1,0,'REC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (15,'Bank Payment',1,0,1,0,'BKT','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (16,'Bank Receipt',1,0,1,0,'BKR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (17,'Jobwork Inward',1,0,1,0,'JI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (18,'Jobwork Delivery',1,0,1,0,'JR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (19,'Purchase Order',1,0,1,0,'PO','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (20,'Sales Order',1,0,1,0,'SO','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),1)
GO

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (1,'Buying Contract',1,0,1,0,'BC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (2,'Buying Contract',1,0,1,0,'BC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (3,'RCTI',1,0,1,0,'BR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (4,'Smelting Issue',1,0,1,0,'SI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (5,'Smelting Receipt',1,0,1,0,'SR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (6,'Refining Issue',1,0,1,0,'RI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (7,'Refining Receipt',1,0,1,0,'RR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (8,'Casting Issue',1,0,1,0,'CI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (9,'Casting Receipt',1,0,1,0,'CR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (10,'Sales Invoice',1,0,1,0,'SAL','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (11,'Delivery Doc',1,0,1,0,'DOC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (12,'Opening Cash',1,0,1,0,'OPC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (13,'Payment',1,0,1,0,'PMT','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (14,'RECEIPT',1,0,1,0,'REC','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (15,'Bank Payment',1,0,1,0,'BKT','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (16,'Bank Receipt',1,0,1,0,'BKR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (17,'Jobwork Inward',1,0,1,0,'JI','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (18,'Jobwork Delivery',1,0,1,0,'JR','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (19,'Purchase Order',1,0,1,0,'PO','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No,  Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, 
  Print_On_Save, Show_Preview, Print_Style, IsDefault,  Active_Status, Create_Date, CompSno)
  VALUES (20,'Sales Order',1,0,1,0,'SO','',4,'0',0,0,0,0,1,1,dbo.DateToInt(GETDATE()),2)

  
GO

CREATE TABLE Transaction_Setup
(
  SetupSno            INT IDENTITY(1,1),  
  CompSno             INT,
  PartyCode_AutoGen   BIT,
  PartyCode_Prefix    CHAR(4),
  PartyCode_CurrentNo INT,

  UomCode_AutoGen     BIT,
  UomCode_Prefix      CHAR(4),
  UomCode_CurrentNo   INT,

  ItemCode_AutoGen    BIT,
  ItemCode_Prefix     CHAR(4),
  ItemCode_CurrentNo  INT  
)
GO

-------------------INSERTING DEFAULT VALUES FOR TRANSACTION SETUP ---------------------
INSERT INTO Transaction_Setup(CompSno,
                                  PartyCode_AutoGen, PartyCode_Prefix, PartyCode_CurrentNo,
                                  UomCode_AutoGen, UomCode_Prefix,  UomCode_CurrentNo,
                                  ItemCode_AutoGen, ItemCode_Prefix,  ItemCode_CurrentNo                                  
                             )
VALUES (1,1,'C',0, 1, 'U', 0, 1,'I', 0)
GO
INSERT INTO Transaction_Setup(CompSno,
                                  PartyCode_AutoGen, PartyCode_Prefix, PartyCode_CurrentNo,
                                  UomCode_AutoGen, UomCode_Prefix,  UomCode_CurrentNo,
                                  ItemCode_AutoGen, ItemCode_Prefix,  ItemCode_CurrentNo                                
                             )
VALUES (2,1,'C',0, 1, 'U', 0, 1, 'I', 0)
GO

CREATE TABLE Ledger_Groups
(
  GrpSno    INT PRIMARY KEY IDENTITY(1,1),
  Grp_Name  VARCHAR(50),
  Remarks   VARCHAR(50),
  IsStd     BIT,
  CompSno   INT,
  UserSno   INT
)
GO



INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('CASH','',1,1,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Bank Accounts','',1,1,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Customers','',1,1,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Suppliers','',1,1,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Expenses','',1,1,1)
GO

INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('CASH','',1,2,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Bank Accounts','',1,2,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Customers','',1,2,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Suppliers','',1,2,1)
INSERT INTO Ledger_Groups (Grp_Name, Remarks, IsStd, CompSno, UserSno) VALUES ('Expenses','',1,2,1)
GO

CREATE TABLE Ledgers
(
  LedSno        INT PRIMARY KEY IDENTITY(1,1),
  Led_Name      VARCHAR(50),
  GrpSno        INT,
  IsStd         BIT,
  Open_Balance  MONEY,
  Remarks       VARCHAR(50),
  CompSno       INT,
  UserSno       INT
)
GO

INSERT INTO Ledgers (Led_Name, GrpSno, IsStd, Open_Balance, Remarks, CompSno, UserSno) VALUES ('Cash A/c', 1, 1, 0, '', 1, 1)
GO
INSERT INTO Ledgers (Led_Name, GrpSno, IsStd, Open_Balance, Remarks, CompSno, UserSno) VALUES ('Cash A/c', 1, 1, 0, '', 2, 1)
GO


CREATE TABLE Vouchers
(
  VouSno        INT PRIMARY KEY IDENTITY(1,1),
  Vou_No        VARCHAR(20),
  VouTypeSno    INT,
  SeriesSno     INT,
  VouDate       INT,  
  Remarks       VARCHAR(50),
  LedSno        INT,
  Cash_Amount   MONEY,
  Bank_Amount   MONEY,
  BankLedSno    INT,
  BankDetails   VARCHAR(50),
  CompSno       INT,
  UserSno       INT
)
GO

CREATE TABLE Voucher_Details
(
  DetSno  INT PRIMARY KEY IDENTITY(1,1),
  VouSno  INT,  
  LedSno  INT,
  Debit   MONEY,
  Credit  MONEY,
  Remarks VARCHAR(20)
)
GO

CREATE TABLE  Image_Details
(
  DetSno INT PRIMARY KEY IDENTITY(1,1),
  TransSno    INT,
  Image_Grp   TINYINT,   /* 1- Party Images 2-Other Images */
  Image_Name  VARCHAR(50),
  Image_Url   VARCHAR(100),
  CompSno     INT
)
GO


CREATE TABLE Party
(
  PartySno INT PRIMARY KEY IDENTITY(1,1),
  Party_Code VARCHAR(20),
  Party_Name VARCHAR(50),
  Party_Cat TINYINT,
  Party_Type TINYINT,
  Address VARCHAR(200),
  Mobile VARCHAR(20),
  City VARCHAR(50),
  State VARCHAR(50),
  Pincode VARCHAR(20),
  Sex TINYINT,
  Dob INT,
  Reference VARCHAR(50),
  Create_Date INT,
  Email VARCHAR(50),
  Remarks VARCHAR(100),
  Active_Status TINYINT,
  Reg_Number VARCHAR(20),
  Gst_Number VARCHAR(50),
  Director_Name VARCHAR(30),
  Issue_Date INT,
  Expiry_Date INT,  
  CompSno INT,
  UserSno INT,
  LedSno INT
)

GO

CREATE TABLE Uoms
(
  UomSno INT PRIMARY KEY IDENTITY(1,1),
  Uom_Code VARCHAR(10),
  Uom_Name VARCHAR(20),   -- Box
  Remarks VARCHAR(50),
  Active_Status     BIT,
  BaseUomSno INT,         -- Nos
  Base_Qty FLOAT,          -- 50,
  CompSno INT
)
GO

INSERT INTO Uoms (Uom_Code, Uom_Name, Remarks, Active_Status, BaseUomSno, Base_Qty,CompSno) VALUES ('U1', 'Grams','',1,0,0,1 )
INSERT INTO Uoms (Uom_Code, Uom_Name, Remarks, Active_Status, BaseUomSno, Base_Qty,CompSno) VALUES ('U2', 'Ounce','',1,1,31.1,1 )

INSERT INTO Uoms (Uom_Code, Uom_Name, Remarks, Active_Status, BaseUomSno, Base_Qty,CompSno) VALUES ('U1', 'Grams','',1,0,0,2 )
INSERT INTO Uoms (Uom_Code, Uom_Name, Remarks, Active_Status, BaseUomSno, Base_Qty,CompSno) VALUES ('U2', 'Ounce','',1,1,31.1,2 )
GO

CREATE TABLE Item_Groups
(
  GrpSno INT PRIMARY KEY IDENTITY(1,1),
  Grp_Code VARCHAR(10),
  Grp_Name VARCHAR(20)
)
GO

INSERT INTO Item_Groups VALUES ('AU','GOLD')
INSERT INTO Item_Groups VALUES ('AG','SILVER')
GO


CREATE TABLE Items
(
  ItemSno INT PRIMARY KEY IDENTITY(1,1),
  Item_Code VARCHAR(10),
  Item_Name VARCHAR(20),
  GrpSno INT,
  Remarks VARCHAR(50),  
  CompSno INT,
  OpenSno INT
)
GO


INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I1','AU','Gold',1,0,1)
INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I2','AG','Silver',1,0,2)
INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I3','Sample Item','Sample',1,0,1)

INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I1','AU','Gold',2,0,1)
INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I2','AG','Silver',2,0,2)
INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I3','Sample Item','Sample',2,0,1)

INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I4','Left Over Gold','Left Over Gold',1,0,1)
INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno, OpenSno,GrpSno) VALUES ('I4','Left Over Gold','Left Over Gold',2,0,1)


GO

CREATE TABLE Transactions
(
  TransSno INT PRIMARY KEY IDENTITY(1,1),  
  Trans_Date INT,
  VouTypeSno INT,
  SeriesSno INT,  
  Trans_No VARCHAR(20),
  Due_Date INT,
  PartySno INT,
  RefSno INT,
  Batch_Bills VARCHAR(50),
  TotQty SMALLINT,
  TotGrossWt DECIMAL(8,3),
  TotStoneWt DECIMAL(8,3),
  TotNettWt DECIMAL(8,3),
  TotSilverWt DECIMAL(8,3),
  TotPureWt DECIMAL(8,3),
  TotPureSilverWt DECIMAL(8,3),
  TotAmount MONEY,
  TaxPer DECIMAL(4,2),
  TaxAmount MONEY,
  RevAmount MONEY,
  NettAmt MONEY, 
  PayMode TINYINT,
  Remarks VARCHAR(100),
  Print_Remarks VARCHAR(100),
  Doc_Status TINYINT,
  CompSno INT,
  UserSno INT,
  Locked BIT,
  Cash_Amount MONEY,
  Bank_Amount MONEY,
  BankLedSno INT,
  Bank_Details VARCHAR(50),
  VouSno INT
)

GO

INSERT INTO Transactions(Trans_No, Trans_Date, VouTypeSno, SeriesSno,CompSno) VALUES ('',0,1,1,1)
INSERT INTO Transactions(Trans_No, Trans_Date, VouTypeSno, SeriesSno,CompSno) VALUES ('',0,1,1,2)
GO


CREATE TABLE Transaction_Details
(
  DetSno INT PRIMARY KEY IDENTITY(1,1),
  TransSno INT,
  BatchSno INT,  
  ItemSno INT,  
  UomSno INT,
  Karat TINYINT,
  PurityPer DECIMAL(5,2),
  Qty SMALLINT,
  GrossWt DECIMAL(8,3),
  StoneWt DECIMAL(8,3),
  Wastage DECIMAL(8,3),
  NettWt DECIMAL(8,3),
  SilverWt DECIMAL(8,3),
  SilverPurity DECIMAL(8,3),
  PureWt DECIMAL(8,3),
  PureSilverWt DECIMAL(8,3),
  Rate MONEY,
  Amount MONEY,
  Remarks VARCHAR(20)
)
GO



INSERT INTO Transaction_Details(TransSno, BatchSno, ItemSno, UomSno, Karat, PurityPer, Qty, GrossWt, StoneWt, Wastage, NettWt, SilverWt, SilverPurity, PureWt, PureSilverWt, Rate, Amount, Remarks)
VALUES (1,0,1,1,24,100,0,0,0,0,0,0,0,0,0,0,0,'LEFT OVER GOLD')

INSERT INTO Transaction_Details(TransSno, BatchSno, ItemSno, UomSno, Karat, PurityPer, Qty, GrossWt, StoneWt, Wastage, NettWt, SilverWt, SilverPurity, PureWt, PureSilverWt, Rate, Amount, Remarks)
VALUES (2,0,4,3,24,100,0,0,0,0,0,0,0,0,0,0,0,'LEFT OVER GOLD')

GO

CREATE TABLE Batch_Bills
(
  BillSno INT PRIMARY KEY IDENTITY(1,1),
  SourceTransSno INT,
  TransSno INT
)
GO

CREATE TABLE Batch_Items
(
  BatchSno      INT PRIMARY KEY IDENTITY(1,1),
  TransSno      INT,
  DetSno        INT,
  Batch_No      VARCHAR(20),
  Stock_Status  BIT
)
GO

INSERT INTO Batch_Items(TransSno, DetSno, Batch_No, Stock_Status) VALUES (1,1,'LEFT OVER GOLD',0)
INSERT INTO Batch_Items(TransSno, DetSno, Batch_No, Stock_Status) VALUES (2,2,'LEFT OVER GOLD',0)
GO
