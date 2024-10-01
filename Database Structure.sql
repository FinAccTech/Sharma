/*USE MASTER
DROP DATABASE SHARMA
CREATE DATABASE Sharma
*/

USE Sharma
GO



CREATE FUNCTION IntToDate(@IntDate INT)
RETURNS DATE
AS
BEGIN	
	RETURN  CAST (SUBSTRING(CAST(@IntDate AS VARCHAR),1,4)  + '-' + SUBSTRING(CAST(@IntDate AS VARCHAR),5,2) + '-' +  SUBSTRING(CAST(@IntDate AS VARCHAR),7,2) AS DATE)
END
GO

CREATE FUNCTION DateToInt(@DateInt DATE)
RETURNS INT
AS
BEGIN	
	RETURN  CAST(
            CAST(YEAR(@DateInt) AS VARCHAR) +
            CASE WHEN LEN(CAST(MONTH(@DateInt) AS VARCHAR)) = 1 THEN '0' + CAST(MONTH(@DateInt) AS VARCHAR) ELSE CAST(MONTH(@DateInt) AS VARCHAR) END  +
            CASE WHEN LEN(CAST(DAY(@DateInt) AS VARCHAR)) = 1 THEN '0' + CAST(DAY(@DateInt) AS VARCHAR) ELSE CAST(DAY(@DateInt) AS VARCHAR) END
          AS INT)
END
GO

CREATE FUNCTION [dbo].[PreFillString](@Input INT,@Digit INT)
  RETURNS VARCHAR(20)
WITH ENCRYPTION
AS
  BEGIN
    DECLARE @Result VARCHAR(20)
    If Len(@Input)< @Digit
      SET @Result =  Right('000000000' + Cast( @Input AS VARCHAR ), @Digit )
    ELSE
      SET @Result = @Input
    RETURN @Result
  END
GO

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

ALTER PROCEDURE Sp_User
	@UserSno INT,
  @UserName VARCHAR(10),
  @Password VARCHAR(20),
  @User_Type VARCHAR(50),
  @Active_Status BIT,
  @Comp1Right BIT,
  @Comp2Right BIT,
	@RetSno	INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION

    IF @UserSno = 1
      BEGIN
        Raiserror ('Admin User cannot be altered', 16, 1) 
        GOTO CloseNow
      END

		IF EXISTS(SELECT UserSno FROM Users WHERE UserSno=@UserSno)
			BEGIN
				UPDATE Users SET  UserName=@UserName, Password=@Password, User_Type=@User_Type,Active_Status=@Active_Status
				WHERE UserSno=@UserSno
				IF @@ERROR <> 0 GOTO CloseNow

        DELETE FROM Comp_Rights WHERE UserSno = @UserSno
        IF @@ERROR <> 0 GOTO CloseNow
			END
		ELSE
			BEGIN          
        IF EXISTS(SELECT UserSno FROM Users WHERE UserName=@UserName)
          BEGIN
              Raiserror ('User exists with this Name', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Users(UserName, Password, User_Type,Active_Status)
        VALUES           (@UserName, @Password, @User_Type,@Active_Status)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @UserSno = @@IDENTITY
			END

      INSERT INTO Comp_Rights (UserSno, CompSno,Comp_Right) VALUES (@UserSno,1,@Comp1Right)
      INSERT INTO Comp_Rights (UserSno, CompSno,Comp_Right) VALUES (@UserSno,2,@Comp2Right)

	SET @RetSno = @UserSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getUsers(@UserSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT    Usr.*,
            Comp1Right = Cr1.Comp_Right,
            Comp2Right = Cr2.Comp_Right
            
  FROM      Users  Usr
            LEFT OUTER JOIN Comp_Rights Cr1 On Cr1.UserSno = Usr.UserSno AND Cr1.CompSno = 1
            LEFT OUTER JOIN Comp_Rights Cr2 On Cr2.UserSno = Usr.UserSno AND Cr2.CompSno = 2
  WHERE     (Usr.UserSno=@UserSno OR @UserSno=0) 

GO

CREATE PROCEDURE Sp_User_Delete
	@UserSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION

    IF @UserSno = 1
      BEGIN
      Raiserror ('You cannot delete a Admin User', 16, 1) 
					GOTO CloseNow
      END

			IF EXISTS (SELECT UserSno FROM Transactions WHERE UserSno=@UserSno)
				BEGIN
					Raiserror ('Transactions exists with this User', 16, 1) 
					GOTO CloseNow
				END 

			DELETE FROM Users WHERE UserSno=@UserSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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

CREATE PROCEDURE Sp_Voucher_Series
	@SeriesSno          INT,
  @VouTypeSno         INT,
  @Series_Name        VARCHAR(20),  
  @Num_Method         TINYINT, -- 0- MANUAL,  1- SEMI,  2- AUTO
  @Allow_Duplicate    BIT,
  @Start_No           INT,
  @Current_No         INT,
  @Prefix             CHAR(4),
  @Suffix             CHAR(3),
  @Width              TINYINT,
  @Prefill            VARCHAR(1),
  @Print_Voucher      BIT,
  @Print_On_Save      BIT,
  @Show_Preview       BIT,
  @Print_Style        VARCHAR(100),
  @IsDefault          BIT,
  @Active_Status      BIT,
  @Create_Date        INT,  
  @CompSno            INT,  
	@RetSno	            INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
		IF EXISTS(SELECT SeriesSno FROM Voucher_Series WHERE SeriesSno=@SeriesSno)
			BEGIN
				UPDATE Voucher_Series SET VouTypeSno=@VouTypeSno, Series_Name=@Series_Name, Num_Method=@Num_Method, Allow_Duplicate=@Allow_Duplicate, Start_No=@Start_No, Current_No=@Current_No,
                                  Prefix=@Prefix, Suffix=@Suffix, Width=@Width, Prefill=@Prefill, Print_Voucher=@Print_Voucher, Print_On_Save=@Print_On_Save, Show_Preview=@Show_Preview, Print_Style=@Print_Style,
                                  IsDefault=@IsDefault, Active_Status=@Active_Status, Create_Date=@Create_Date, CompSno=@CompSno 
				WHERE SeriesSno=@SeriesSno
				IF @@ERROR <> 0 GOTO CloseNow												
			END
		ELSE
			BEGIN
        IF EXISTS(SELECT SeriesSno FROM Voucher_Series WHERE  Series_Name=@Series_Name AND CompSno=@CompSno)
          BEGIN
              Raiserror ('Voucher Series exists with this Name.', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Voucher_Series(VouTypeSno, Series_Name, Num_Method, Allow_Duplicate, Start_No, Current_No, Prefix, Suffix, Width, Prefill, Print_Voucher, Print_On_Save, Show_Preview, Print_Style,IsDefault,
                                  Active_Status, Create_Date, CompSno)
        VALUES (@VouTypeSno, @Series_Name, @Num_Method, @Allow_Duplicate, @Start_No, @Current_No, @Prefix, @Suffix, @Width, @Prefill, @Print_Voucher, @Print_On_Save, @Show_Preview, @Print_Style,@IsDefault,
                                  @Active_Status, @Create_Date, @CompSno)
				IF @@ERROR <> 0 GOTO CloseNow								
				SET @SeriesSno = @@IDENTITY								
			END	

	SET @RetSno = @SeriesSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO

CREATE FUNCTION Udf_getVoucherSeries(@SeriesSno INT, @VouTypeSno INT, @CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT	Ser.*, Ser.Series_Name as Name, Ser.Series_Name as Details
	FROM	  Voucher_Series Ser
	WHERE	  (Ser.SeriesSno=@SeriesSno OR @SeriesSno = 0) AND (VouTypeSno=@VouTypeSno OR @VouTypeSno=0) AND (CompSno=@CompSno)

GO


CREATE PROCEDURE Sp_Voucher_Series_Delete
	@SeriesSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION

  DECLARE @IsDefault BIT = 0
      SELECT @IsDefault = IsDefault FROM Voucher_Series WHERE SeriesSno=@SeriesSno

      IF @IsDefault = 1
        BEGIN
          Raiserror ('Standard Voucher Series cannot be deleted..', 16, 1) 
					GOTO CloseNow
        END

			IF EXISTS (SELECT TransSno FROM Transactions WHERE SeriesSno=@SeriesSno)
				BEGIN
					Raiserror ('Transactions exists with this Series', 16, 1) 
					GOTO CloseNow
				END 

			DELETE FROM Voucher_Series WHERE SeriesSno=@SeriesSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END
GO


CREATE FUNCTION [dbo].[GenerateVoucherNo](@SeriesSno INT)
        RETURNS VARCHAR(20)
        WITH ENCRYPTION AS 
        BEGIN
         DECLARE @NewValue   VARCHAR(20)
         DECLARE @Prefix     VARCHAR(4)
         DECLARE @Suffix     VARCHAR(4)
         DECLARE @Width      TINYINT
         DECLARE @Prefill    VARCHAR
         DECLARE @Start_No   Numeric
         DECLARE @Current_No Numeric
         
         SELECT  @Prefix=Prefix,@Suffix=Suffix,@Width=Width,@Prefill=Prefill,@Start_No=Start_No,@Current_No=Current_No
         FROM    Voucher_Series
         WHERE   SeriesSno=@SeriesSno

         If @Current_No = 0 
            BEGIN
                SET @Current_No=@Start_No
            END
          ELSE
            BEGIN
                SET @Current_No=@Current_No+1
            END

             SET @NewValue = @Current_No
             SET @NewValue = RTrim(@Prefix) + Rtrim(@Newvalue) + RTrim(@Suffix)
              IF @Width <> 0
                 BEGIN
                     SET @NewValue = RTrim(@Prefix) + Right('000000000000000000' + Cast(@Current_No AS VARCHAR),@Width)
                     SET @NewValue=  Rtrim(@Newvalue) + RTrim(@Suffix)
                 END
              RETURN  @NewValue
        END
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


CREATE PROCEDURE Sp_Transaction_Setup
	@SetupSno             INT,  
  @PartyCode_AutoGen    BIT,
  @PartyCode_Prefix     CHAR(4),
  @PartyCode_CurrentNo  INT,

  @UomCode_AutoGen      BIT,
  @UomCode_Prefix       CHAR(4),
  @UomCode_CurrentNo    INT,

  @ItemCode_AutoGen      BIT,
  @ItemCode_Prefix       CHAR(4),
  @ItemCode_CurrentNo    INT
    
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
		
			BEGIN
				UPDATE Transaction_Setup SET  PartyCode_AutoGen = @PartyCode_AutoGen,PartyCode_Prefix = @PartyCode_Prefix, PartyCode_CurrentNo = @PartyCode_CurrentNo,
                                      UomCode_AutoGen = @UomCode_AutoGen, UomCode_Prefix = @UomCode_Prefix, UomCode_CurrentNo = @UomCode_CurrentNo,
                                      ItemCode_AutoGen = @ItemCode_AutoGen, ItemCode_Prefix = @ItemCode_Prefix, ItemCode_CurrentNo = @ItemCode_CurrentNo

				WHERE  SetupSno=@SetupSno
				IF @@ERROR <> 0 GOTO CloseNow												
			END

	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getTransaction_Setup(@SetupSno INT, @CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT	*
	FROM	  Transaction_Setup
	WHERE	  (SetupSno=@SetupSno OR @SetupSno=0) AND (CompSno=@CompSno OR @CompSno=0)

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

CREATE PROCEDURE Sp_Ledger_Groups
	@GrpSno    INT,
  @Grp_Name  VARCHAR(50),
  @Remarks   VARCHAR(50),  
  @CompSno   INT,
  @UserSno   INT,
	@RetSno	INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
  DECLARE @IsStd BIT = 0
		IF EXISTS(SELECT GrpSno FROM Ledger_Groups WHERE GrpSno=@GrpSno)

			BEGIN
        SELECT @IsStd=IsStd FROM Ledger_Groups WHERE GrpSno=@GrpSno
        IF @IsStd = 1
          BEGIN
          Raiserror ('Standard Ledger Groups cannot be altered', 16, 1) 
              GOTO CloseNow
          END

				UPDATE  Ledger_Groups SET  Grp_Name=@Grp_Name, Remarks=@Remarks, CompSno=@CompSno,UserSno=@UserSno
				WHERE   GrpSno=@GrpSno
				IF @@ERROR <> 0 GOTO CloseNow												
			END
		ELSE
			BEGIN
                
        IF EXISTS(SELECT GrpSno FROM Ledger_Groups WHERE Grp_Name=@Grp_Name AND GrpSno=@GrpSno)
          BEGIN
              Raiserror ('Ledger Group exists with this Name', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Ledger_Groups(Grp_Name, Remarks, CompSno, UserSno, IsStd)
        VALUES              (@Grp_Name, @Remarks, @CompSno, @UserSno,0)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @GrpSno = @@IDENTITY
			END	

	SET @RetSno = @GrpSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getLedger_Groups(@GrpSno INT,@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT    ( SELECT	Grp.*, Grp.Grp_Name as 'Name', Grp.Grp_Name as 'Details'
	            FROM	  Ledger_Groups Grp
	            WHERE	  (Grp.GrpSno=@GrpSno OR @GrpSno = 0) AND (Grp.CompSno=@CompSno)
              FOR JSON PATH ) AS Json_Result

GO


CREATE PROCEDURE Sp_Ledger_Group_Delete
	@GrpSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
      DECLARE @IsStd BIT
      SELECT @IsStd=IsStd FROM Ledger_Groups WHERE GrpSno=@GrpSno
        IF @IsStd = 1
          BEGIN
          Raiserror ('Standard Ledger Groups cannot be Deleted', 16, 1) 
              GOTO CloseNow
          END

			IF EXISTS (SELECT GrpSno FROM Ledgers WHERE GrpSno=@GrpSno)
				BEGIN
					Raiserror ('Ledgers exists with this Ledger Group', 16, 1) 
					GOTO CloseNow
				END  

			DELETE FROM Ledger_Groups WHERE GrpSno=@GrpSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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



CREATE PROCEDURE Sp_Ledgers
	@LedSno    INT,
  @Led_Name      VARCHAR(50),
  @GrpSno        INT,  
  @Open_Balance  MONEY,
  @Remarks       VARCHAR(50),
  @CompSno       INT,
  @UserSno       INT,
	@RetSno	        INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
  DECLARE @IsStd BIT = 0
  DECLARE @SeriesSno INT = 0                
  SELECT @SeriesSno = SeriesSno FROM Voucher_Series WHERE Series_Name='Opening Cash' AND CompSno=@CompSno
  DECLARE @VouSno INT = 0

		IF EXISTS(SELECT LedSno FROM Ledgers WHERE LedSno=@LedSno)

			BEGIN
        SELECT @IsStd=IsStd FROM Ledgers WHERE LedSno=@LedSno
        IF @IsStd <> 1
          BEGIN
            UPDATE  Ledgers SET  Led_Name=@Led_Name, GrpSno=@GrpSno, Open_Balance=@Open_Balance, Remarks=@Remarks, CompSno=@CompSno, UserSno=@UserSno
				    WHERE   LedSno=@LedSno
				    IF @@ERROR <> 0 GOTO CloseNow
          END
          				

        SELECT @VouSno=VouSno FROM Vouchers WHERE VouTypeSno=12 AND SeriesSno=@SeriesSno AND LedSno=@LedSno
        DELETE FROM Voucher_Details WHERE VouSno=@VouSno
        IF @@ERROR <> 0 GOTO CloseNow							
        DELETE FROM Vouchers WHERE VouSno=@VouSno
        IF @@ERROR <> 0 GOTO CloseNow							
			END
		ELSE
			BEGIN
                
        IF EXISTS(SELECT LedSno FROM Ledgers WHERE Led_Name=@Led_Name AND LedSno=@LedSno)
          BEGIN
              Raiserror ('Ledger exists with this Name', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Ledgers (Led_Name, GrpSno, Open_Balance, Remarks, CompSno, UserSno,IsStd)
        VALUES              (@Led_Name, @GrpSno, @Open_Balance, @Remarks, @CompSno, @UserSno,0)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @LedSno = @@IDENTITY

			END

      IF (@Open_Balance  <> 0)
          BEGIN
              DECLARE @VouDetailXML       XML        
                SET @VouDetailXML =
                '<ROOT>
                  <Voucher>                    
                    <Voucher_Details LedSno="'+ CAST(@LedSno AS varchar) + '" Debit="'+ CAST(@Open_Balance AS varchar) + '" Credit="0" Remarks=""> </Voucher_Details>
                  </Voucher>
                </ROOT>
                '
              DECLARE @Vou_No VARCHAR(20) = 'O' + CAST(@LedSno AS VARCHAR)
              EXEC  @VouSno = Sp_Voucher 0, @Vou_No, 12, @SeriesSno,0,'',@LedSno,@Open_Balance,0,0,'',@CompSno,@UserSno,@VouDetailXML,0,''
          END

	SET @RetSno = @LedSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getLedgers(@LedSno INT, @GrpSno INT, @CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT    ( SELECT	Led.*, Led.Led_Name as 'Name', Led.Led_Name as 'Details', Grp.Grp_Name, Grp.Grp_Name as 'Grp.Name', Grp.Grp_Name as 'Grp.Details'
	            FROM	  Ledgers Led
                      LEFT OUTER JOIN Ledger_Groups Grp ON Grp.GrpSno=Led.GrpSno
	            WHERE	  (Led.LedSno=@LedSno OR @LedSno = 0) AND (Led.GrpSno=Grp.GrpSno OR @GrpSno=0) AND (Led.CompSno=@CompSno)
              FOR JSON PATH ) AS Json_Result

GO


CREATE PROCEDURE Sp_Ledger_Delete
	@LedSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
      DECLARE @IsStd BIT
      SELECT @IsStd=IsStd FROM Ledgers WHERE LedSno=@LedSno
        IF @IsStd = 1
          BEGIN
          Raiserror ('Standard Ledger Groups cannot be Deleted', 16, 1) 
              GOTO CloseNow
          END

      IF EXISTS (SELECT VouSno FROM Vouchers WHERE LedSno=@LedSno)
			BEGIN
				Raiserror ('Vouchers exists with this Ledger', 16, 1) 
				GOTO CloseNow
			END

			IF EXISTS (SELECT LedSno FROM Voucher_Details WHERE LedSno=@LedSno)
				BEGIN
					Raiserror ('Vouchers exists with this Ledger', 16, 1) 
					GOTO CloseNow
				END  

			DELETE FROM Ledgers WHERE LedSno=@LedSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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

ALTER PROCEDURE Sp_Voucher
	@VouSno             INT,
  @Vou_No             VARCHAR(20),
  @VouTypeSno         INT,
  @SeriesSno          INT,
  @VouDate            INT,  
  @Remarks            VARCHAR(50),
  @mLedSno             INT,
  @Cash_Amount        MONEY,
  @Bank_Amount        MONEY,
  @BankLedSno         INT,
  @BankDetails        VARCHAR(50),
  @CompSno            INT,
  @UserSno            INT,
  @VouDetailXML       XML,
	@RetSno	            INT OUTPUT,
  @Ret_Vou_No         VARCHAR(20) OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
   IF (@VouTypeSno=0) OR (@SeriesSno=0) OR (@UserSno=0) OR (@CompSno=0)
      BEGIN
          Raiserror ('Server responded with some mandatory values missing like VouType, Series, User, Party or Company', 16, 1) 
          GOTO CloseNow
      END

		IF EXISTS(SELECT VouSno FROM Vouchers WHERE VouSno=@VouSno)
			BEGIN
				UPDATE  Vouchers SET  Vou_No=@Vou_No, VouTypeSno=@VouTypeSno, SeriesSno=@SeriesSno, VouDate=@VouDate, Remarks=@Remarks, LedSno=@mLedSno, Cash_Amount=@Cash_Amount, Bank_Amount=@Bank_Amount, BankLedSno=@BankLedSno, BankDetails=@BankDetails,CompSno=@CompSno, UserSno=@UserSno
				WHERE   VouSno=@VouSno
				IF @@ERROR <> 0 GOTO CloseNow

        DELETE FROM Voucher_Details WHERE VouSno=@VouSno
        IF @@ERROR <> 0 GOTO CloseNow
			END
		ELSE
			BEGIN
      
        DECLARE @Num_Method TINYINT
        SELECT @Num_Method=Num_Method FROM Voucher_Series WHERE SeriesSno=@SeriesSno

        IF (@Num_Method=2)
        BEGIN
            SET @Vou_No= [dbo].GenerateVoucherNo(@SeriesSno)               
        END

        IF EXISTS(SELECT VouSno FROM Vouchers WHERE Vou_No=@Vou_No AND CompSno=@CompSno)
          BEGIN
              Raiserror ('Voucher exists with this Number', 16, 1) 
              GOTO CloseNow
          END
          

				INSERT INTO Vouchers  (Vou_No, VouTypeSno, SeriesSno, Voudate, Remarks, LedSno, Cash_Amount, Bank_Amount, BankLedSno, BankDetails, CompSno, UserSno )
        VALUES                (@Vou_No, @VouTypeSno, @SeriesSno, @Voudate, @Remarks, @mLedSno, @Cash_Amount, @Bank_Amount, @BankLedSno, @BankDetails, @CompSno, @UserSno)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @VouSno = @@IDENTITY
        
        
        IF @VouTypeSno = 13 OR @VouTypeSno = 14 OR @VouTypeSno = 15 OR @VouTypeSno = 16
          BEGIN
            IF (@Num_Method <> 0)
            BEGIN
              UPDATE Voucher_Series SET Current_No = Current_No + 1 WHERE SeriesSno=@SeriesSno
              IF @@ERROR <> 0 GOTO CloseNow
            END
        END
        
			END	

	    IF @VouDetailXML IS NOT NULL
              BEGIN
                  DECLARE @Sno          INT
                  DECLARE @idoc1        INT
                  DECLARE @doc1         XML
                  DECLARE @LedSno       INT
                  DECLARE @Debit        MONEY
                  DECLARE @Credit       MONEY
                  DECLARE @DRemarks      VARCHAR(20)
                                              
                  /*Declaring Temporary Table for Details Table*/
                  DECLARE @DetTable Table
                  (
                      Sno INT IDENTITY(1,1),LedSno INT, Debit MONEY, Credit MONEY, DRemarks VARCHAR(20)
                  )
                  Set @doc1=@VouDetailXML
                  Exec sp_xml_preparedocument @idoc1 Output, @doc1
             
                  /*Inserting into Temporary Table from Passed XML File*/
                  INSERT INTO @DetTable
                  (
                      LedSno, Debit, Credit, DRemarks
                  )
             
                  SELECT  * FROM  OpenXml 
                  (
                      @idoc1, '/ROOT/Voucher/Voucher_Details',2
                  )
                  WITH 
                  (
                      LedSno INT '@LedSno', Debit MONEY '@Debit', Credit MONEY '@Credit', DRemarks VARCHAR(20) '@Remarks'
                  )
                  SELECT  TOP 1 @Sno=Sno,@LedSno=LedSno, @Debit=Debit, @Credit=Credit, @DRemarks=DRemarks
                  FROM    @DetTable
                  
                  /*Taking from Temporary Details Table and inserting into details table here*/
                  WHILE @@ROWCOUNT <> 0 
                      BEGIN
                          INSERT INTO [dbo].Voucher_Details(VouSno, LedSno, Debit, Credit, Remarks) 
                          VALUES (@VouSno,@LedSno, @Debit, @Credit, @DRemarks)
                          IF @@Error <> 0 GOTO CloseNow
             
                          DELETE FROM @DetTable WHERE Sno = @Sno
                          SELECT  TOP 1 @Sno=Sno,@LedSno=LedSno, @Debit=Debit, @Credit=Credit, @DRemarks=DRemarks
                          FROM          @DetTable
                      END
                  Exec Sp_Xml_Removedocument @idoc1
            END

	    SET @RetSno = @VouSno
      SET @Ret_Vou_No = @Vou_No
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO



CREATE FUNCTION Udf_getVouchers(@VouSno INT, @VouTypeSno INT, @SeriesSno INT, @CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	  SELECT  ( SELECT  Vou.*, Ser.SeriesSno as 'Series.SeriesSno', Ser.Series_Name as 'Series.Series_Name',  Ser.Series_Name as 'Series.Name', Ser.Series_Name as 'Series.Details',    
                             Led.LedSno as 'Ledger.LedSno', Led.Led_Name as 'Ledger.Led_Name', Led.GrpSno as 'Ledger.GrpSno', Led.Led_Name as 'Ledger.Name', Led.Led_Name as 'Ledger.Details' ,
                             Bnk.LedSno as 'Bank.LedSno', Bnk.Led_Name as 'Bank.Led_Name', Bnk.GrpSno as 'Bank.GrpSno', Bnk.Led_Name as 'Bank.Name', Bnk.Led_Name as 'Bank.Details'
                      
              FROM    Vouchers Vou
                      INNER JOIN Voucher_Types VTyp ON Vtyp.VouTypeSno = Vou.VouTypeSno
                      INNER JOIN Voucher_Series Ser ON Ser.SeriesSno = Vou.SeriesSno
                      INNER JOIN Ledgers Led ON Led.LedSno = Vou.LedSno
                      LEFT OUTER JOIN Ledgers Bnk ON Bnk.LedSno = Vou.BankLedSno
              WHERE   (Vou.CompSno=@CompSno) AND (Vou.VouSno=@VouSno OR @VouSno = 0) AND (Vou.VouTypeSno=@VouTypeSno OR @VouTypeSno=0) AND (Vou.SeriesSno=@SeriesSno OR @SeriesSno=0)
    FOR JSON PATH ) AS Json_Result

GO




CREATE PROCEDURE Sp_Voucher_Delete
	@VouSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION

			DELETE FROM Voucher_Details WHERE VouSno=@VouSno
      IF @@ERROR <> 0 GOTO CloseNow

			DELETE FROM Vouchers WHERE VouSno=@VouSno
			IF @@ERROR <> 0 GOTO CloseNow

	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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



CREATE PROCEDURE Sp_Party
	@PartySno INT,
  @Party_Code VARCHAR(20),
  @Party_Name VARCHAR(50),
  @Party_Cat TINYINT,
  @Party_Type TINYINT,
  @Address VARCHAR(200),
  @Mobile VARCHAR(20),
  @City VARCHAR(50),
  @State VARCHAR(50),
  @Pincode VARCHAR(20),
  @Sex TINYINT,
  @Dob INT,
  @Reference VARCHAR(50),
  @Create_Date INT,
  @Email VARCHAR(50),
  @Remarks VARCHAR(100),
  @Active_Status TINYINT,
  @Reg_Number VARCHAR(20),
  @Gst_Number VARCHAR(50),
  @Director_Name VARCHAR(30),
  @Issue_Date INT,
  @Expiry_Date INT,
  @CompSno INT,
  @UserSno INT,
	@ImageDetailXML    XML,
	@RetSno	            INT OUTPUT,
  @Ret_Party_Code   VARCHAR(20) OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION

    DECLARE @LedSno INT

    IF EXISTS(SELECT PartySno FROM Party WHERE PartySno=@PartySno)
			BEGIN
        SELECT @LedSno = LedSno FROM Party WHERE PartySno=@PartySno        
				UPDATE Party SET  Party_Code=@Party_Code, Party_Name=@Party_Name, Party_Cat=@Party_Cat, Party_Type=@Party_Type, Address=@Address, Mobile=@Mobile,City=@City,State=@State,Pincode=@Pincode,Sex=@Sex,Dob=@Dob,
                          Reference=@Reference,Create_Date=@Create_Date, Email=@Email,Remarks=@Remarks, Active_Status=@Active_Status, Reg_Number=@Reg_Number, Gst_Number=@Gst_Number,Director_Name=@Director_Name,
                          Issue_Date=ISNULL(@Issue_Date,0), Expiry_Date=ISNULL(@Expiry_Date,0), CompSno=@CompSno, UserSno=@UserSno
				WHERE PartySno=@PartySno
				IF @@ERROR <> 0 GOTO CloseNow

        UPDATE Ledgers SET Led_Name=@Party_Name WHERE LedSno=@LedSno
        IF @@ERROR <> 0 GOTO CloseNow
			END
		ELSE
			BEGIN
      
          DECLARE @PartyCode_AutoGen BIT
          SELECT @PartyCode_AutoGen=PartyCode_AutoGen FROM Transaction_Setup  WHERE CompSno=@CompSno
          IF @PartyCode_AutoGen=1
          BEGIN
              SELECT @Party_Code=TRIM(PartyCode_Prefix)+CAST((PartyCode_CurrentNo+1) AS VARCHAR) FROM Transaction_Setup WHERE CompSno=@CompSno
          End

        IF EXISTS(SELECT PartySno FROM Party WHERE Party_Code=@Party_Code AND CompSno=@CompSno)
          BEGIN
              Raiserror ('Party exists with this Code', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Party (Party_Code, Party_Name, Party_Cat, Party_Type, Address, Mobile, City, State, Pincode, Sex, Dob, Reference, Create_Date, Email, Remarks,Active_Status, Reg_Number,Gst_Number, Director_Name, Issue_Date, Expiry_Date, CompSno, UserSno )
        VALUES            (@Party_Code, @Party_Name, @Party_Cat, @Party_Type, @Address, @Mobile, @City, @State, @Pincode, @Sex, @Dob, @Reference, @Create_Date,@Email, @Remarks, @Active_Status, @Reg_Number, @Gst_Number, @Director_Name, ISNULL(@Issue_Date,0), ISNULL(@Expiry_Date,0), @CompSno, @UserSno)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @PartySno = @@IDENTITY

        UPDATE Transaction_Setup SET PartyCode_CurrentNo = PartyCode_CurrentNo + 1  WHERE CompSno=@CompSno
        IF @@ERROR <> 0 GOTO CloseNow

  
      
      DECLARE @GrpSno INT = (SELECT GrpSno FROM Ledger_Groups WHERE Grp_Name='Customers' AND CompSno=@CompSno)

      EXEC  @LedSno = Sp_Ledgers 0,@Party_Name, @GrpSno, 0,'',@CompSno,@UserSno,0

      UPDATE Party SET LedSno=@LedSno WHERE PartySno=@PartySno
      IF @@ERROR <> 0 GOTO CloseNow

			END	

	    IF @ImageDetailXML IS NOT NULL
              BEGIN                     
                  DECLARE @Sno         INT
                  DECLARE @idoc1       INT
                  DECLARE @doc1        XML
                  DECLARE @Image_Name  VARCHAR(50)
                  DECLARE @Image_Url   VARCHAR(100)
                                              
                  /*Declaring Temporary Table for Details Table*/
                  DECLARE @ImgTable Table
                  (
                      Sno INT IDENTITY(1,1),Image_Name VARCHAR(50), Image_Url VARCHAR(200)
                  )
                  Set @doc1=@ImageDetailXML
                  Exec sp_xml_preparedocument @idoc1 Output, @doc1
             
                  /*Inserting into Temporary Table from Passed XML File*/
                  INSERT INTO @ImgTable
                  (
                      Image_Name, Image_Url
                  )
             
                  SELECT  * FROM  OpenXml 
                  (
                      @idoc1, '/ROOT/Images/Image_Details',2
                  )
                  WITH 
                  (
                      Image_Name VARCHAR(50) '@Image_Name', Image_Url VARCHAR(100) '@Image_Url'
                  )
                  SELECT  TOP 1 @Sno=Sno,@Image_Name=Image_Name, @Image_Url=Image_Url
                  FROM @ImgTable
                  
                  /*Taking from Temporary Details Table and inserting into details table here*/
                  WHILE @@ROWCOUNT <> 0 
                      BEGIN
                          INSERT INTO [dbo].Image_Details(TransSno,Image_Grp,Image_Name, Image_Url,CompSno) 
                          VALUES (@PartySno,1, @Image_Name, 'Images/'+ CAST(@CompSno AS VARCHAR) + '/Parties/' + @Party_Code+'/'+ @Image_Name,@CompSno)
                          IF @@Error <> 0 GOTO CloseNow
             
                          DELETE FROM @ImgTable WHERE Sno = @Sno
                          SELECT  TOP 1 @Sno=Sno,@Image_Name=Image_Name, @Image_Url=Image_Url
                          FROM   @ImgTable
                      END
                  Exec Sp_Xml_Removedocument @idoc1
            END

	    SET @RetSno = @PartySno
      SET @Ret_Party_Code = @Party_Code
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO




CREATE FUNCTION Udf_getParties(@PartySno INT, @Party_Cat TINYINT,@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	  SELECT  Pty.*, Pty.Party_Name as 'Name', Pty.Mobile as 'Details',
            ProfileImage= CASE WHEN EXISTS(SELECT DetSno FROM Image_Details WHERE TransSno=Pty.PartySno AND Image_Grp=1 AND CompSno=@CompSno) THEN 'http://184.168.125.210/Sharma/data/'+(SELECT TOP 1 Image_Url FROM Image_Details WHERE TransSno=Pty.PartySno AND Image_Grp=1 AND CompSno=@CompSno) ELSE '' END
    FROM    Party Pty            
    WHERE   (CompSno=@CompSno) AND (PartySno=@PartySno OR @PartySno = 0) AND (Party_Cat=@Party_Cat OR @Party_Cat=0)

GO


CREATE PROCEDURE Sp_Party_Delete
	@PartySno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION		
			IF EXISTS (SELECT TransSno FROM Transactions WHERE PartySno=@PartySno)
				BEGIN
					Raiserror ('Transactions exists with this Ledger', 16, 1) 
					GOTO CloseNow
				END
      DECLARE @LedSno INT
      SELECT @LedSno = LedSno FROM Party WHERE PartySno=@PartySno

      IF EXISTS (SELECT VouSno FROM Vouchers WHERE LedSno=@LedSno)
				BEGIN
					Raiserror ('Vouchers exists with this Ledger', 16, 1) 
					GOTO CloseNow
				END

      IF EXISTS (SELECT DetSno FROM Voucher_Details WHERE LedSno=@LedSno)
				BEGIN
					Raiserror ('Vouchers exists with this Ledger', 16, 1) 
					GOTO CloseNow
				END

      DELETE FROM Ledgers WHERE LedSno=@LedSno
      IF @@ERROR <> 0 GOTO CloseNow

			DELETE FROM Party WHERE PartySno=@PartySno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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


CREATE PROCEDURE Sp_Uom
	@UomSno INT,
  @Uom_Code VARCHAR(10),
  @Uom_Name VARCHAR(20),  
  @Remarks VARCHAR(50),
  @Active_Status     BIT,
  @BaseUomSno INT,
  @Base_Qty FLOAT,
  @CompSno INT,
	@RetSno	INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
		IF EXISTS(SELECT UomSno FROM Uoms WHERE UomSno=@UomSno)
			BEGIN
        IF @UomSno < 5
          BEGIN
            Raiserror ('Standard and Fixed Uoms cannot be altered', 16, 1) 
					  GOTO CloseNow
          END

				UPDATE Uoms SET  Uom_Code = @Uom_Code, Uom_Name = @Uom_Name, Remarks = @Remarks, Active_Status = @Active_Status, BaseUomSno=@BaseUomSno, Base_Qty=@Base_Qty, CompSno=@CompSno
				WHERE UomSno=@UomSno
				IF @@ERROR <> 0 GOTO CloseNow												
			END
		ELSE
			BEGIN
      
          DECLARE @UomCode_AutoGen BIT
          SELECT @UomCode_AutoGen=UomCode_AutoGen FROM Transaction_Setup WHERE CompSno=@CompSno
          IF @UomCode_AutoGen=1
          BEGIN
              SELECT @Uom_Code=TRIM(UomCode_Prefix)+CAST((UomCode_CurrentNo+1) AS VARCHAR) FROM Transaction_Setup WHERE CompSno=@CompSno
          End

        IF EXISTS(SELECT UomSno FROM Uoms WHERE Uom_Code=@Uom_Code AND CompSno=@CompSno )
          BEGIN
              Raiserror ('Uom exists with this Code', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Uoms(Uom_Code, Uom_Name, Remarks, Active_Status, BaseUomSno, Base_Qty, CompSno)
        VALUES              (@Uom_Code, @Uom_Name,  @Remarks, @Active_Status,@BaseUomSno, @Base_Qty, @CompSno)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @UomSno = @@IDENTITY

        UPDATE Transaction_Setup SET UomCode_CurrentNo = UomCode_CurrentNo + 1 WHERE CompSno=@CompSno
        IF @@ERROR <> 0 GOTO CloseNow	
			END	

	SET @RetSno = @UomSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getUoms(@UomSno INT,@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
	SELECT    ( SELECT	Um.*, Um.Uom_Name as 'Name', Um.Uom_Name as 'Details', Bu.UomSno as 'BaseUom.UomSno', Bu.Uom_Name as 'BaseUom.Uom_Name',  Bu.Uom_Name as 'BaseUom.Name'
	            FROM	  Uoms Um
                      LEFT OUTER JOIN   Uoms Bu ON Bu.UomSno=Um.BaseUomSno
	            WHERE	  (Um.UomSno=@UomSno OR @UomSno = 0) AND (Um.CompSno=@CompSno)
              FOR JSON PATH ) AS Json_Result

GO


CREATE PROCEDURE Sp_Uoms_Delete
	@UomSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
      IF @UomSno < 5
        BEGIN
          Raiserror ('Standard and Fixed Uoms cannot be deleted', 16, 1) 
					GOTO CloseNow
        END
			IF EXISTS (SELECT UomSno FROM Transaction_Details WHERE UomSno=@UomSno)
				BEGIN
					Raiserror ('Transactions exists with this Uom', 16, 1) 
					GOTO CloseNow
				END 

			DELETE FROM Uoms WHERE UomSno=@UomSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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

CREATE PROCEDURE Sp_Item
	@ItemSno INT,
  @Item_Code VARCHAR(10),
  @Item_Name VARCHAR(20),
  @Remarks VARCHAR(50),  
  @CompSno INT,  
  @Qty INT,
  @UomSno INT,
  @Karat TINYINT,
  @PurityPer DECIMAL(8,3),
  @Gross_Wt DECIMAL(8,3),
  @Stone_Wt DECIMAL(8,3),
  @Nett_Wt DECIMAL(8,3),
  @Amount MONEY,
	@RetSno	INT OUTPUT

WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
		IF EXISTS(SELECT ItemSno FROM Items WHERE ItemSno=@ItemSno)
			BEGIN

        IF @ItemSno <9
          BEGIN
            Raiserror ('Standard and Fixed Items cannot be altered', 16, 1) 
					  GOTO CloseNow
          END
				UPDATE Items SET  Item_Code=@Item_Code, Item_Name=@Item_Name, Remarks=@Remarks, CompSno=@CompSno
				WHERE ItemSno=@ItemSno
				IF @@ERROR <> 0 GOTO CloseNow

        DECLARE @OpenSno INT = (SELECT OpenSno FROM Items WHERE ItemSno=@ItemSno)
        DELETE FROM Transactions WHERE TransSno=@OpenSno
        IF @@ERROR <> 0 GOTO CloseNow

        DELETE FROM Transaction_Details WHERE TransSno=@OpenSno
        IF @@ERROR <> 0 GOTO CloseNow
			END
		ELSE
			BEGIN      
          DECLARE @ItemCode_AutoGen BIT
          SELECT @ItemCode_AutoGen=ItemCode_AutoGen FROM Transaction_Setup WHERE CompSno=@CompSno
          IF @ItemCode_AutoGen=1
          BEGIN
              SELECT @Item_Code=TRIM(ItemCode_Prefix)+CAST((ItemCode_CurrentNo+1) AS VARCHAR) FROM Transaction_Setup WHERE CompSno=@CompSno
          End

        IF EXISTS(SELECT ItemSno FROM Items WHERE Item_Code=@Item_Code AND CompSno=@CompSno )
          BEGIN
              Raiserror ('Item exists with this Code', 16, 1) 
              GOTO CloseNow
          END

				INSERT INTO Items(Item_Code, Item_Name, Remarks, CompSno)
        VALUES           (@Item_Code, @Item_Name, @Remarks, @CompSno)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @ItemSno = @@IDENTITY

        UPDATE Transaction_Setup SET ItemCode_CurrentNo = ItemCode_CurrentNo + 1 WHERE CompSno=@CompSno
        IF @@ERROR <> 0 GOTO CloseNow	
			END	

      IF (@Nett_Wt <> 0)
        BEGIN
        DECLARE @TransSno INT
          INSERT INTO Transactions(Trans_Date, VouTypeSno, SeriesSno, CompSno, TotQty, TotGrossWt, TotStoneWt, TotNettWt, TotAmount,UserSno )
          VALUES ( [dbo].DateToInt(GETDATE()), 1, 1, @CompSno, @Qty, @Gross_Wt, @Stone_Wt, @Nett_Wt, @Amount,1)
          IF @@ERROR <> 0 GOTO CloseNow								
          SET @TransSno = @@IDENTITY

          UPDATE Items SET OpenSno=@TransSno WHERE ItemSno=@ItemSno
          IF @@ERROR <> 0 GOTO CloseNow								
          
          INSERT INTO Transaction_Details(TransSno, ItemSno, UomSno, Karat, PurityPer, Qty, GrossWt, StoneWt, NettWt, Amount, Remarks)
          VALUES (@TransSno,@ItemSno, @UomSno, @Karat, @PurityPer, @Qty, @Gross_Wt, @Stone_Wt, @Nett_Wt, @Amount, '')
          IF @@ERROR <> 0 GOTO CloseNow			
        END

	SET @RetSno = @ItemSno
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE PROCEDURE Sp_Item_Delete
	@ItemSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
      IF @ItemSno <9
        BEGIN
          Raiserror ('Standard and Fixed Items cannot be deleted', 16, 1) 
					GOTO CloseNow
        END
			IF EXISTS (SELECT ItemSno FROM Transaction_Details WHERE ItemSno=@ItemSno)
				BEGIN
					Raiserror ('Transactions exists with this Item', 16, 1) 
					GOTO CloseNow
				END 

			DELETE FROM Items WHERE ItemSno=@ItemSno
			IF @@ERROR <> 0 GOTO CloseNow
	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

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


ALTER PROCEDURE Sp_Transaction
	@TransSno           INT,  
  @Trans_Date         INT,
  @VouTypeSno         INT,
  @SeriesSno          INT,  
  @Trans_No           VARCHAR(20),
  @Due_Date           INT,
  @PartySno           INT,
  @RefSno             INT,
  @Batch_Bills        VARCHAR(50),
  @TotQty             SMALLINT,
  @TotGrossWt         DECIMAL(8,3),
  @TotStoneWt         DECIMAL(8,3),
  @TotNettWt          DECIMAL(8,3),
  @TotSilverWt        DECIMAL(8,3),
  @TotPureWt          DECIMAL(8,3),
  @TotPureSilverWt    DECIMAL(8,3),
  @TotAmount          MONEY,
  @TaxPer             DECIMAL(4,2),
  @TaxAmount          MONEY,
  @RevAmount          MONEY,
  @NettAmt            MONEY,
  @PayMode            TINYINT,
  @Remarks            VARCHAR(100),
  @Print_Remarks            VARCHAR(100),
  @Doc_Status         TINYINT,
  @CompSno            INT,
  @UserSno            INT,
  @Cash_Amount        MONEY,
  @Bank_Amount        MONEY,
  @BankLedSno         INT,
  @Bank_Details       VARCHAR(50),
	@ItemDetailXML      XML,
  @ImageDetailXML     XML,
  @BatchDetailXML     XML,  
	@RetSno	            INT OUTPUT,
  @Ret_Trans_No       VARCHAR(20) OUTPUT

  
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION
    DECLARE @VouSno INT = 0

    IF (@VouTypeSno=0) OR (@SeriesSno=0) OR (@PartySno=0) OR (@UserSno=0) OR (@CompSno=0)
      BEGIN
          Raiserror ('Server responded with some mandatory values missing like VouType, Series, User, Party or Company', 16, 1) 
          GOTO CloseNow
      END
      
		IF EXISTS(SELECT TransSno FROM Transactions WHERE TransSno=@TransSno)
			BEGIN
        DECLARE @Locked BIT = (SELECT Locked FROM Transactions WHERE TransSno=@TransSno)
        IF @Locked = 1
          BEGIN
              Raiserror ('Transaction is Locked. You cannot change anything in this transaction', 16, 1) 
              GOTO CloseNow
          END

				UPDATE Transactions SET Trans_Date=@Trans_Date, VouTypeSno=@VouTypeSno, SeriesSno=@SeriesSno, Trans_No=@Trans_No, Due_Date=@Due_Date, PartySno=@PartySno, RefSno=@RefSno, Batch_Bills=@Batch_Bills, TotQty=@TotQty, TotGrossWt=@TotGrossWt,
                                TotStoneWt=@TotStoneWt, TotNettWt=@TotNettWt,TotSilverWt=@TotSilverWt,TotPureWt=@TotPureWt, TotPureSilverWt=@TotPureSilverWt, TotAmount=@TotAmount, TaxPer=@TaxPer, TaxAmount=@TaxAmount, RevAmount=@RevAmount, NettAmt=@NettAmt, PayMode=@PayMode, Remarks=@Remarks, Print_Remarks=@Print_Remarks, CompSno=@CompSno, Doc_Status=@Doc_Status, UserSno=@UserSno,
                                Cash_Amount=@Cash_Amount, Bank_Amount=@Bank_Amount, BankLedSno=@BankLedSno, Bank_Details=@Bank_Details                                
				WHERE TransSno=@TransSno
				IF @@ERROR <> 0 GOTO CloseNow

        DELETE FROM Transaction_Details WHERE TransSno = @TransSno
        IF @@ERROR <> 0 GOTO CloseNow
        DELETE FROM Image_Details WHERE TransSno = @TransSno AND Image_Grp=2
        IF @@ERROR <> 0 GOTO CloseNow
        DELETE FROM Batch_Items WHERE TransSno = @TransSno 
        IF @@ERROR <> 0 GOTO CloseNow
        
        SELECT @VouSno=VouSno FROM Transactions WHERE TransSno=@TransSno

        DELETE FROM Vouchers WHERE VouSno=@VouSno
        IF @@ERROR <> 0 GOTO CloseNow

        DELETE FROM Voucher_Details WHERE VouSno=@VouSno
        IF @@ERROR <> 0 GOTO CloseNow

			END
		ELSE
			BEGIN

        DECLARE @Num_Method TINYINT
        SELECT @Num_Method=Num_Method FROM Voucher_Series WHERE SeriesSno=@SeriesSno

        IF (@Num_Method=2)
        BEGIN
            SET @Trans_No= [dbo].GenerateVoucherNo(@SeriesSno)               
        END

        IF EXISTS(SELECT TransSno FROM Transactions WHERE Trans_No=@Trans_No AND CompSno=@CompSno)
          BEGIN
              Raiserror ('Transaction exists with this Number', 16, 1) 
              GOTO CloseNow
          END
          

        INSERT INTO Transactions  (Trans_Date, VouTypeSno, SeriesSno, Trans_No, Due_Date, PartySno, RefSno, Batch_Bills, TotQty, TotGrossWt, TotStoneWt, TotNettWt,TotSilverWt, TotPureWt, TotPureSilverWt, TotAmount, TaxPer, TaxAmount, RevAmount, NettAmt, PayMode, Remarks, Print_Remarks, CompSno, Doc_Status, UserSno, Locked, Cash_Amount, Bank_Amount, BankLedSno, Bank_Details )
        VALUES                    (@Trans_Date, @VouTypeSno, @SeriesSno, @Trans_No, @Due_Date, @PartySno, @RefSno, @Batch_Bills, @TotQty, @TotGrossWt, @TotStoneWt, @TotNettWt,@TotSilverWt, @TotPureWt, @TotPureSilverWt, @TotAmount, @TaxPer, @TaxAmount, @RevAmount, @NettAmt, @PayMode, @Remarks, @Print_Remarks, @CompSno, @Doc_Status,@UserSno,0,@Cash_Amount, @Bank_Amount, @BankLedSno, @Bank_Details)

				IF @@ERROR <> 0 GOTO CloseNow								
				SET @TransSno = @@IDENTITY

        IF (@Num_Method <> 0)
        BEGIN
          UPDATE Voucher_Series SET Current_No = Current_No + 1 WHERE SeriesSno=@SeriesSno
          IF @@ERROR <> 0 GOTO CloseNow
        END

        DECLARE @VouDetailXML       XML
        
          DECLARE @mLedSno INT
          SELECT @mLedSno=LedSno FROM Party WHERE PartySno=@PartySno

          DECLARE @CashLedSno INT
          SELECT @CashLedSno=LedSno FROM Ledgers WHERE Led_Name='Cash A/c' AND CompSno=@CompSno

          
          IF (@VouTypeSno = 2 OR @VouTypeSno = 3)
            BEGIN
              SET @VouDetailXML =
              '<ROOT>
                <Voucher>
                  <Voucher_Details LedSno="'+ CAST(@mLedSno AS varchar) + '" Debit="0" Credit="'+ CAST(@NettAmt AS varchar) + '" Remarks="" > </Voucher_Details>
                  <Voucher_Details LedSno="'+ CAST(@CashLedSno AS varchar) + '" Debit="'+ CAST(@Cash_Amount AS varchar) + '" Credit="0" Remarks=""> </Voucher_Details>
                  <Voucher_Details LedSno="'+ CAST(@BankLedSno AS varchar) + '" Debit="'+ CAST(@Bank_Amount AS varchar) + '" Credit="0" Remarks=""> </Voucher_Details>
                </Voucher>
              </ROOT>
              '
            END

            IF (@VouTypeSno = 10)
            BEGIN
              SET @VouDetailXML =
              '<ROOT>
                <Voucher>
                  <Voucher_Details LedSno="'+ CAST(@mLedSno AS varchar) + '" Debit="'+ CAST(@NettAmt AS varchar) + '" Credit="0" Remarks=""> </Voucher_Details>
                  <Voucher_Details LedSno="'+ CAST(@CashLedSno AS varchar) + '" Debit="0" Credit="'+ CAST(@Cash_Amount AS varchar) + '" Remarks=""> </Voucher_Details>
                  <Voucher_Details LedSno="'+ CAST(@BankLedSno AS varchar) + '" Debit="0" Credit="'+ CAST(@Bank_Amount AS varchar) + '" Remarks=""> </Voucher_Details>
                </Voucher>
              </ROOT>
              '
            END

          EXEC  @VouSno = Sp_Voucher 0,@Trans_No, @VouTypeSno , @SeriesSno,@Trans_Date,'',@mLedSno,@Cash_Amount,@Bank_Amount,@BankLedSno,@Bank_Details,@CompSno,@UserSno,@VouDetailXML,0,''
        
        
          UPDATE Transactions SET VouSno=@VouSno WHERE TransSno=@TransSno
          IF @@ERROR <> 0 GOTO CloseNow								
			END	

	    IF @ItemDetailXML IS NOT NULL
             BEGIN
                 --For Inserting into Subtable
                 DECLARE @idoc        INT
                 DECLARE @doc         XML
                 DECLARE @Sno         INT
                 DECLARE @BatchSno    INT
                 DECLARE @ItemSno     INT
                 DECLARE @UomSno      INT
                 DECLARE @Karat       TINYINT
                 DECLARE @PurityPer   DECIMAL(5,2)
                 DECLARE @Qty         SMALLINT
                 DECLARE @GrossWt     DECIMAL(8,3)
                 DECLARE @StoneWt     DECIMAL(8,3)
                 DECLARE @Wastage     DECIMAL(8,3)                 
                 DECLARE @NettWt      DECIMAL(8,3)
                 DECLARE @SilverWt      DECIMAL(8,3)
                 DECLARE @SilverPurity  DECIMAL(8,3)
                 DECLARE @PureWt        DECIMAL(8,3)
                 DECLARE @PureSilverWt  DECIMAL(8,3)
                 DECLARE @Rate          MONEY
                 DECLARE @Amount        MONEY                 
                 DECLARE @IteRemarks    VARCHAR(20)
                              
                 /*Declaring Temporary Table for Details Table*/
                 DECLARE @DetTable Table
                 (
                     Sno INT IDENTITY(1,1),BatchSno INT, ItemSno INT,UomSno INT, Karat TINYINT, PurityPer DECIMAL(5,2), Qty SMALLINT,GrossWt DECIMAL(8,3),StoneWt DECIMAL(8,3), Wastage DECIMAL(8,3), NettWt DECIMAL(8,3), SilverWt DECIMAL(8,3), SilverPurity DECIMAL(8,3), PureWt DECIMAL(8,3), PureSilverWt DECIMAL(8,3), Rate MONEY, Amount MONEY,IteRemarks VARCHAR(20)
                 )
                 Set @doc=@ItemDetailXML
                 Exec sp_xml_preparedocument @idoc Output, @doc
             
                 /*Inserting into Temporary Table from Passed XML File*/
                 INSERT INTO @DetTable
                 (
                     BatchSno, ItemSno, UomSno, Karat, PurityPer, Qty, GrossWt, StoneWt,Wastage, NettWt, SilverWt, SilverPurity, PureWt, PureSilverWt, Rate, Amount, IteRemarks
                 )
             
                 SELECT  * FROM  OpenXml 
                 (
                     @idoc, '/ROOT/Transaction/Transaction_Details',2
                 )
                 WITH 
                 (
                     BatchSno INT '@BatchSno', ItemSno INT '@ItemSno', UomSno INT '@UomSno', Karat TINYINT '@Karat', PurityPer DECIMAL(5,2) '@PurityPer', Qty TINYINT '@Qty',GrossWt DECIMAL(8,3) '@GrossWt',StoneWt DECIMAL(8,3) '@StoneWt', Wastage DECIMAL(8,3) '@Wastage', NettWt DECIMAL(8,3) '@NettWt', SilverWt DECIMAL(8,3) '@SilverWt', SilverPurity DECIMAL(8,3) '@SilverPurity', PureWt DECIMAL(8,3) '@PureWt', PureSilverWt DECIMAL(8,3) '@PureSilverWt', Rate MONEY '@Rate', Amount MONEY '@Amount',IteRemarks VARCHAR(20) '@IteRemarks'
                 )
                 SELECT  TOP 1 @Sno=Sno,@BatchSno=BatchSno, @ItemSno=ItemSno,@UomSno=UomSno,@Karat=Karat, @PurityPer = PurityPer, @Qty=Qty,@GrossWt=GrossWt,@StoneWt=StoneWt, @Wastage=Wastage, @NettWt=NettWt, @SilverWt=SilverWt,@SilverPurity=SilverPurity, @PureWt=PureWt, @PureSilverWt=PureSilverWt, @Rate=Rate, @Amount=Amount,@IteRemarks=IteRemarks
                 FROM @DetTable

                 DECLARE @Stock_Type TINYINT
                 DECLARE @DetSno INT
                 
                 DECLARE @TmpBatchSno INT = 0
                 SELECT @Stock_Type=Stock_Type FROM Voucher_Types WHERE VouTypeSno=@VouTypeSno
                 
                 
                 WHILE @@ROWCOUNT <> 0 
                     BEGIN
                     
             /*        IF (@ItemSno = 7) OR (@ItemSno = 8) -- IF LEFT OVER GOLD
									    BEGIN
                        IF @Stock_Type = 1
                          BEGIN
										        UPDATE Transaction_Details SET Qty=Qty+@Qty, GrossWt=GrossWt+@GrossWt, StoneWt=StoneWt+@StoneWt, Wastage=Wastage+@Wastage, NettWt=NettWt+@NettWt, SilverWt=SilverWt+@SilverWt, PureWt=PureWt+@PureWt,
                                                          Amount=Amount+@Amount
                            WHERE DetSno = @CompSno 
										        IF @@Error <> 0 GOTO CloseNow
                          END
                        ELSE IF @Stock_Type =2
                          BEGIN
                            UPDATE Transaction_Details SET Qty=Qty-@Qty, GrossWt=GrossWt-@GrossWt, StoneWt=StoneWt-@StoneWt, Wastage=Wastage-@Wastage, NettWt=NettWt-@NettWt, SilverWt=SilverWt-@SilverWt, PureWt=PureWt-@PureWt,
                                                          Amount=Amount-@Amount
                            WHERE DetSno = @CompSno 
										        IF @@Error <> 0 GOTO CloseNow
                          END
                        
									    END
                    ELSE
                    
                      BEGIN */
                     
                         INSERT INTO Transaction_Details(TransSno,BatchSno,ItemSno,UomSno,Karat,PurityPer,Qty,GrossWt,StoneWt,Wastage,NettWt,SilverWt,SilverPurity,PureWt, PureSilverWt, Rate,Amount,Remarks) 
                         VALUES (@TransSno,@BatchSno,@ItemSno,@UomSno,@Karat,@PurityPer,@Qty,@GrossWt,@StoneWt,@Wastage,@NettWt,@SilverWt,@SilverPurity,@PureWt, @PureSilverWt, @Rate,@Amount,@IteRemarks)
                         IF @@Error <> 0 GOTO CloseNow
                         SET @DetSno = @@IDENTITY

                         IF (@Stock_Type = 1) AND (@ItemSno <> 7) AND (@ItemSno <> 8) 

                          BEGIN
							              DECLARE @SmpItem BIT = 0
							              IF (@ItemSno=3 OR @ItemSno=6)
								              BEGIN
									              SET @SmpItem = 1
								              END
							        
							                DECLARE @TmpQty SMALLINT = 0
							                WHILE @TmpQty < @Qty
								                BEGIN
								                  INSERT INTO Batch_Items(TransSno, DetSno, Batch_No, Stock_Status) VALUES
								                  (@TransSno, @DetSno, '', 0)
								                  IF @@Error <> 0 GOTO CloseNow
								                  SET @TmpBatchSno = @@IDENTITY
                              
								                  UPDATE Batch_Items SET Batch_No=@Trans_No +'/'+ (CASE WHEN @SmpItem=1 THEN 'SMP' ELSE '' END) +  CAST(@TmpBatchSno AS VARCHAR) WHERE BatchSno=@TmpBatchSno
								                  IF @@Error <> 0 GOTO CloseNow
                              
								                  SET @TmpQty = @TmpQty + 1                 
								                END
							            END
						          /*END */

                        DELETE FROM @DetTable WHERE Sno = @Sno

                        SELECT  TOP 1 @Sno=Sno,@BatchSno=BatchSno, @ItemSno=ItemSno,@UomSno=UomSno,@Karat=Karat,@PurityPer=PurityPer,@Qty=Qty,@GrossWt=GrossWt,@StoneWt=StoneWt,@Wastage=Wastage,@NettWt=NettWt,@SilverWt=SilverWt,@SilverPurity=SilverPurity,@PureWt=PureWt, @PureSilverWt=PureSilverWt, @Rate=Rate,@Amount=Amount,@IteRemarks=IteRemarks
                 FROM @DetTable
                     END
                 Exec Sp_Xml_Removedocument @idoc
             END

      IF @ImageDetailXML IS NOT NULL
          BEGIN                     

              DECLARE @idoc1       INT
              DECLARE @doc1        XML
              DECLARE @Image_Name  VARCHAR(50)
              DECLARE @Image_Url   VARCHAR(100)
                                              
              /*Declaring Temporary Table for Details Table*/
              DECLARE @ImgTable Table
              (
                  Sno INT IDENTITY(1,1),Image_Name VARCHAR(50), Image_Url VARCHAR(200)
              )
              Set @doc1=@ImageDetailXML
              Exec sp_xml_preparedocument @idoc1 Output, @doc1
             
              /*Inserting into Temporary Table from Passed XML File*/
              INSERT INTO @ImgTable
              (
                  Image_Name, Image_Url
              )
             
              SELECT  * FROM  OpenXml 
              (
                  @idoc1, '/ROOT/Images/Image_Details',2
              )
              WITH 
              (
                  Image_Name VARCHAR(50) '@Image_Name', Image_Url VARCHAR(100) '@Image_Url'
              )
              SELECT  TOP 1 @Sno=Sno,@Image_Name=Image_Name, @Image_Url=Image_Url
              FROM @ImgTable
                  
              /*Taking from Temporary Details Table and inserting into details table here*/
              
              WHILE @@ROWCOUNT <> 0 
                  BEGIN
                      INSERT INTO [dbo].Image_Details(TransSno,Image_Grp, Image_Name, Image_Url,CompSno)                      
                      VALUES (@TransSno,2, @Image_Name, 'Images/'+ CAST(@CompSno AS VARCHAR) + '/Transactions/'+@Trans_No+'/'+ @Image_Name,@CompSno)
                      IF @@Error <> 0 GOTO CloseNow
             
                      DELETE FROM @ImgTable WHERE Sno = @Sno
                      SELECT  TOP 1 @Sno=Sno,@Image_Name=Image_Name, @Image_Url=Image_Url
                      FROM   @ImgTable
                  END
              Exec Sp_Xml_Removedocument @idoc1
        END

      IF @BatchDetailXML IS NOT NULL
        BEGIN                     

            DECLARE @idoc2        INT
            DECLARE @doc2         XML
            DECLARE @bTransSno    INT
                                              
            /*Declaring Temporary Table for Details Table*/
            DECLARE @BatchTable Table
            (
                Sno INT IDENTITY(1,1),bTransSno INT
            )
            Set @doc2=@BatchDetailXML
            Exec sp_xml_preparedocument @idoc2 Output, @doc2
             
            /*Inserting into Temporary Table from Passed XML File*/
            INSERT INTO @BatchTable
            (
                bTransSno
            )
             
            SELECT  * FROM  OpenXml 
            (
                @idoc2, '/ROOT/Batch/Batch_Details',2
            )
            WITH 
            (
                bTransSno INT '@TransSno'
            )
            SELECT  TOP 1 @Sno=Sno,@bTransSno=bTransSno
            FROM @BatchTable
                  
            /*Taking from Temporary Details Table and inserting into details table here*/
              
            WHILE @@ROWCOUNT <> 0 
                BEGIN                
                    INSERT INTO [dbo].Batch_Bills(SourceTransSno,TransSno)                      
                    VALUES (@TransSno,@bTransSno)
                    IF @@Error <> 0 GOTO CloseNow
             
                    DELETE FROM @BatchTable WHERE Sno = @Sno
                    SELECT  TOP 1 @Sno=Sno,@bTransSno=bTransSno
                    FROM @BatchTable
                END
            Exec Sp_Xml_Removedocument @idoc2
      END
	


	    SET @RetSno = @TransSno
      SET @Ret_Trans_No = @Trans_No
	COMMIT TRANSACTION
	RETURN @RetSno
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END

GO


CREATE FUNCTION Udf_getTransactions(@TransSno INT,@VouTypeSno INT, @SeriesSno INT, @CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

	SELECT  --Trans.*,
          Trans.TransSno, Trans.Trans_Date, Trans.VouTypeSno, Trans.SeriesSno, Trans.Trans_No, Trans.Due_Date, Trans.PartySno, Trans.RefSno, Trans.Batch_Bills, Trans.TotQty,
          CAST(Trans.TotGrossWt AS DECIMAL(8,3)) TotGrossWt, CAST(Trans.TotStoneWt AS DECIMAL(8,3)) TotStoneWt , CAST(Trans.TotNettWt AS DECIMAL(8,3)) TotNettWt, CAST(Trans.TotSilverWt AS DECIMAL(8,3)) TotSilverWt, 
          CAST(Trans.TotAmount AS DECIMAL(10,2)) TotAmount , CAST(Trans.TaxPer AS DECIMAL(10,2)) TaxPer, CAST(Trans.TaxAmount AS DECIMAL(10,2)) TaxAmount, CAST(Trans.RevAmount AS DECIMAL(10,2)) RevAmount,
          CAST(Trans.NettAmt AS DECIMAL(10,2)) NettAmt,
          Trans.PayMode, Trans.Remarks, Trans.Print_Remarks, Trans.Doc_Status, Trans.CompSno, Trans.UserSno, Trans.Locked, CAST(Trans.Cash_Amount AS DECIMAL(10,2)) Cash_Amount , CAST(Trans.Bank_Amount AS DECIMAL(10,2)) Bank_Amount, Trans.BankLedSno, Trans.Bank_Details, Trans.VouSno,
          Pty.Party_Name, ISNULL(Ref.Trans_No,'') as 'Ref_No',

          (SELECT Ser.*, Ser.Series_Name as 'Name', Ser.Series_Name as 'Details' FROM Voucher_Series Ser WHERE SeriesSno = Trans.SeriesSno FOR JSON PATH) Series_Json,

          (SELECT   Pty.*, Pty.Party_Name as 'Name', Pty.Party_Code as 'Details',
                    ProfileImage= CASE WHEN EXISTS(SELECT DetSno FROM Image_Details WHERE TransSno=Pty.PartySno AND Image_Grp=1 AND CompSno=@CompSno) THEN 'http://184.168.125.210/Sharma/data/'+(SELECT TOP 1 Image_Url FROM Image_Details WHERE TransSno=Pty.PartySno AND Image_Grp=1 AND CompSno=@CompSno) ELSE '' END
           FROM     Party Pty WHERE PartySno = Trans.PartySno FOR JSON PATH) Party_Json,

          (SELECT   Det.*,
                    It.ItemSno as 'Item.ItemSno', It.Item_Name as 'Item.Item_Name', It.Item_Name as 'Item.Name', 'Code:' + It.Item_Code as 'Item.Details',
                    Um.UomSno as 'Uom.UomSno', Um.Uom_Name as 'Uom.Uom_Name', Um.Uom_Name as 'Uom.Name', 'Code:' + Um.Uom_Code as 'Uom.Details', Um.Base_Qty as 'Uom.Base_Qty',
                    Bat.Batch_No,

                    Batch_Caption = CASE WHEN Det.BatchSno=0
                                    THEN
                                        CASE WHEN (SELECT COUNT(BatchSno) FROM Batch_Items WHERE DetSno=Det.DetSno) = 1 THEN
                                          (SELECT  Trans.Trans_No + '/'+ CAST (BatchSno AS VARCHAR) FROM Batch_Items WHERE DetSno=Det.DetSno)
                                        ELSE
                                            (SELECT  Trans.Trans_No + '/'+ CAST (MIN(BatchSno) AS VARCHAR) FROM Batch_Items WHERE DetSno=Det.DetSno)
                                            +
                                            ' to '
                                            +
                                            (SELECT  Trans.Trans_No + '/'+ CAST (MAX(BatchSno) AS VARCHAR) FROM Batch_Items WHERE DetSno=Det.DetSno)
                                        END
                                      ELSE
                                        Bat.Batch_No
                                      END


           FROM     Transaction_Details Det                    
                    INNER JOIN Items It On It.ItemSno=Det.ItemSno
                    INNER JOIN Uoms Um ON Um.UomSno=Det.UomSno
                    LEFT OUTER JOIN Batch_Items Bat ON Bat.BatchSno = Det.BatchSno

           WHERE    Det.TransSno = Trans.TransSno FOR JSON PATH) Items_Json,

          ISNULL((SELECT Img.Image_Name,'' as Image_File, Image_Url='http://184.168.125.210/Sharma/data/' + Img.Image_Url, '1' as SrcType, 0 as DelStatus FROM Image_Details Img WHERE TransSno = Trans.TransSno AND Image_Grp=2 FOR JSON PATH),'') Images_Json,

          ISNULL((SELECT Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate(Trans_Date) AS VARCHAR) as 'Details', * FROM Transactions WHERE TransSno = Trans.RefSno FOR JSON PATH),'') Ref_Json,


          ISNULL((SELECT Led.*, Led.Led_Name as 'Name', 'Grp:'+ Grp.Grp_Name as 'Details' FROM Ledgers Led INNER JOIN Ledger_Groups Grp ON Grp.GrpSno=Led.GrpSno WHERE LedSno = Trans.BankLedSno FOR JSON PATH),'') Bank_Json,          
          TransStatus = (CASE Ser.VouTypeSno
                              WHEN 2 THEN 
                                  CASE WHEN EXISTS(SELECT TransSno FROM Batch_Bills WHERE TransSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 3 THEN
                                  CASE WHEN EXISTS(SELECT TransSno FROM Batch_Bills WHERE TransSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 4 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 5 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Batch_Bills WHERE TransSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 6 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 7 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Batch_Bills WHERE TransSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 8 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 17 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 19 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END
                              WHEN 20 THEN
                                  CASE WHEN EXISTS (SELECT TransSno FROM Transactions WHERE RefSno=Trans.TransSno ) THEN 1 ELSE 0 END                              
                        END)
                        
	FROM	  Transactions Trans
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno
          LEFT OUTER JOIN Transactions Ref ON Ref.TransSno = Trans.RefSno

	WHERE	  (Trans.TransSno=@TransSno OR @TransSno=0) AND (Ser.VouTypeSno=@VouTypeSno OR @VouTypeSno=0) AND (Ser.SeriesSno=@SeriesSno OR @SeriesSno=0) AND (Trans.CompSno=@CompSno)

GO


CREATE PROCEDURE Sp_Transaction_Delete
	@TransSno INT
WITH ENCRYPTION AS
BEGIN
	SET NOCOUNT ON 
	BEGIN TRANSACTION					

    IF EXISTS(SELECT TransSno FROM Transactions WHERE RefSno=@TransSno)
          BEGIN
              Raiserror ('This Transaction is Referred by other Transaction. Cant Delete', 16, 1) 
              GOTO CloseNow
          END

    IF EXISTS (SELECT BatchSno FROM Batch_Items WHERE TransSno=@TransSno AND BatchSno IN (SELECT BatchSno FROM Transaction_Details))
        BEGIN
            Raiserror ('Batch Items of this Transaction is used by other Transaction. Cant Delete', 16, 1) 
            GOTO CloseNow
        END
    
    
    
      DECLARE @VouSno INT
      SELECT @VouSno = VouSno FROM Transactions WHERE TransSno=@TransSno

      DELETE FROM Vouchers WHERE VouSno=@VouSno
      IF @@ERROR <> 0 GOTO CloseNow
      DELETE FROM Voucher_Details WHERE VouSno=@VouSno
      IF @@ERROR <> 0 GOTO CloseNow

			DELETE FROM Transactions WHERE TransSno=@TransSno
			IF @@ERROR <> 0 GOTO CloseNow

      DELETE FROM Transaction_Details WHERE TransSno=@TransSno
			IF @@ERROR <> 0 GOTO CloseNow

      DELETE FROM Batch_Items WHERE TransSno=@TransSno 
			IF @@ERROR <> 0 GOTO CloseNow

      DELETE FROM Batch_Bills WHERE SourceTransSno=@TransSno 
			IF @@ERROR <> 0 GOTO CloseNow

      DELETE FROM Image_Details WHERE TransSno=@TransSno AND Image_Grp = 2
			IF @@ERROR <> 0 GOTO CloseNow
      

	COMMIT TRANSACTION
	RETURN 1
CloseNow:
	ROLLBACK TRANSACTION
	RETURN 0
END
GO


CREATE FUNCTION Udf_getItems(@ItemSno INT,@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
SELECT	(SELECT     It.*,It.Item_Name as 'Name', 'Code:'+ It.Item_Code as 'Details',
                    ISNULL(Trans.TotQty,0) as Qty, ISNULL(Trans.TotGrossWt,0) as Gross_Wt, ISNULL(Trans.TotStoneWt,0) as Stone_Wt, ISNULL(Trans.TotNettWt,0) as Nett_Wt, ISNULL(Trans.NettAmt,0) as Amount,
                    Um.UomSno as 'Uom.UomSno', Um.Uom_Name as 'Uom.Item_Name', Um.Uom_Name as 'Uom.Name', 'Code:' + Um.Uom_Code as 'Uom.Details'
                    

        FROM      Items It
                  LEFT OUTER JOIN Transactions Trans ON Trans.TransSno= It.OpenSno
                  LEFT OUTER JOIN Transaction_Details Det ON Det.TransSno = It.OpenSno
                  LEFT OUTER JOIN Uoms Um ON Um.UomSno = Det.UomSno
                  
        WHERE     (It.ItemSno=@ItemSno OR @ItemSno=0) AND (It.CompSno=@CompSno) FOR JSON PATH ) as Json_Result

GO





CREATE FUNCTION Udf_getPendingSmeltings(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.Trans_Date, Pty.Party_Name, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, 'false' as Selected
  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno IN (2,3)
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT TransSno FROM Batch_Bills ))

  GO


 CREATE FUNCTION Udf_getPendingRefinings(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.Trans_Date, Pty.Party_Name, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, 'false' as Selected
  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno IN (5)
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT TransSno FROM Batch_Bills ))

  GO

CREATE FUNCTION Udf_getPendingCastings(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.Trans_Date, Pty.Party_Name, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, 'false' as Selected
  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno IN (7)
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT TransSno FROM Batch_Bills ))

  GO

CREATE FUNCTION Udf_getPendingSmeltingIssues(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt,Trans.TotSilverWt, Trans.TotAmount, CAST(Trans.NettAmt AS decimal(10,2)) AS NettAmt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 4
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno=5 AND CompSno=@CompSno ))

  GO

  
CREATE FUNCTION Udf_getPendingRefiningIssues(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.TotPureWt, Trans.TotPureSilverWt, Trans.TotAmount,
          CAST(Trans.NettAmt AS decimal(10,2)) AS NettAmt, Trans.Due_Date,
          ISNULL(SUM(Det.PurityPer),0) as TotPurity,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 6
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
          INNER JOIN Transaction_Details Det ON Det.TransSno = Trans.TransSno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno=7 AND CompSno=@CompSno  ))

  GROUP BY Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.TotPureWt, Trans.TotPureSilverWt, Trans.TotAmount, Trans.NettAmt, Trans.Due_Date,Pty.PartySno, Pty.Party_Name

  GO
  
CREATE FUNCTION Udf_getPendingCastingIssues(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.TotPureWt, Trans.TotPureSilverWt, Trans.TotAmount, CAST(Trans.NettAmt AS decimal(10,2)) AS NettAmt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 8
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno=9 AND CompSno=@CompSno  ))

  GO

CREATE FUNCTION Udf_getPendingDeliveryDocs(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 11
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno=10 AND CompSno=@CompSno ))

  GO

CREATE FUNCTION Udf_getPendingJobworkInwards(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 17
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno=18 AND CompSno=@CompSno ))

  GO

  

CREATE FUNCTION Udf_getPendingPurchaseOrders(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 19
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno IN(2,3) AND CompSno=@CompSno ))

  GO

CREATE FUNCTION Udf_getPendingSalesOrders(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

  SELECT  Trans.TransSno, Trans.Trans_No, Trans.VouTypeSno, Trans.Trans_Date, Trans.TotQty, Trans.TotGrossWt, Trans.TotNettWt, Trans.TotSilverWt, Trans.Due_Date,
          Pty.PartySno as 'Party.ItemSno', Pty.Party_Name as 'Party.Party_Name',
          Trans.Trans_No as 'Name', 'Date: ' + CAST([dbo].IntToDate (Trans.Trans_Date) AS VARCHAR) as 'Details'

  FROM    Transactions Trans
          INNER JOIN Voucher_Series Ser ON Ser.SeriesSno=Trans.SeriesSno AND Ser.VouTypeSno = 20
          INNER JOIN Party Pty ON Pty.PartySno=Trans.PartySno
  WHERE   Trans.CompSno=@CompSno AND  (Trans.TransSno NOT IN (SELECT RefSno FROM Transactions WHERE VouTypeSno IN (10,11) AND CompSno=@CompSno ))

  GO

CREATE VIEW VW_STOCK_REGISTER
WITH ENCRYPTION AS

    SELECT			Det.TransSno, VTyp.VouType_Name, Trans.Trans_No, Trans.Trans_Date, Trans.CompSno, Det.ItemSno, It.Item_Code, It.Item_Name, It.GrpSno,
                Det.UomSno,Um.Uom_Code, Um.Uom_Name, Um.Base_Qty,
                Det.Karat, Det.PurityPer,
              /*Det.ItemSno as 'Item.ItemSno', It.Item_Name as 'Item.Item_Name', It.Item_Name as 'Item.Name', 'Code: '+ It.Item_Code as 'Item.Details',
                Det.UomSno as 'Uom.UomSno', Um.Uom_Name as 'Uom.Uom_Name', Um.Uom_Name as 'Uom.Name', 'Code: ' + Um.Uom_Code as 'Uom.Details',
                Det.KaratSno as 'Karat.KaratSno', Karat.Karat_Name as 'Karat.Karat_Name', Karat.Karat_Name as 'Karat.Name', 'Code: ' + Karat.Karat_Code as 'Karat.Details', */
				        Stock_In_Qty		  = CASE WHEN VTyp.Stock_Type=1 THEN Det.Qty ELSE 0 END,
				        Stock_In_GrossWt	= CASE WHEN VTyp.Stock_Type=1 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)* Det.GrossWt)ELSE 0 END,
				        Stock_In_StoneWt	= CASE WHEN VTyp.Stock_Type=1 THEN Det.StoneWt ELSE 0 END,
				        Stock_In_NettWt		= CASE WHEN VTyp.Stock_Type=1 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt) ELSE 0 END,
                Stock_In_PureWt		= CASE WHEN VTyp.Stock_Type=1 THEN (((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt)*Det.PurityPer/100) ELSE 0 END,

                Stock_Out_Qty		  = CASE WHEN Trans.VouTypeSno=10 THEN (CASE WHEN Trans.RefSno = 0 THEN Det.Qty ELSE 0 END ) ELSE (CASE WHEN VTyp.Stock_Type=2 THEN Det.Qty ELSE 0 END) END,
				        Stock_Out_GrossWt	= CASE WHEN Trans.VouTypeSno=10 THEN (CASE WHEN Trans.RefSno = 0 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.GrossWt) ELSE 0 END ) ELSE (CASE WHEN VTyp.Stock_Type=2 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.GrossWt) ELSE 0 END) END,
				        Stock_Out_StoneWt	= CASE WHEN Trans.VouTypeSno=10 THEN (CASE WHEN Trans.RefSno = 0 THEN Det.StoneWt ELSE 0 END ) ELSE (CASE WHEN VTyp.Stock_Type=2 THEN Det.StoneWt ELSE 0 END) END,
				        Stock_Out_NettWt	= CASE WHEN Trans.VouTypeSno=10 THEN (CASE WHEN Trans.RefSno = 0 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt) ELSE 0 END ) ELSE (CASE WHEN VTyp.Stock_Type=2 THEN ((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt) ELSE 0 END) END,
                Stock_Out_PureWt	= CASE WHEN Trans.VouTypeSno=10 THEN (CASE WHEN Trans.RefSno = 0 THEN (((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt)*Det.PurityPer/100) ELSE 0 END ) ELSE (CASE WHEN VTyp.Stock_Type=2 THEN (((CASE WHEN Um.Base_Qty =0 THEN 1 ELSE Um.Base_Qty END)*Det.NettWt)*Det.PurityPer/100) ELSE 0 END) END

    FROM			  Transaction_Details Det
				        INNER JOIN Transactions Trans ON Trans.TransSno = Det.TransSno
				        INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
				        INNER JOIN Items It ON It.ItemSno = Det.ItemSno
				        INNER JOIN Uoms Um ON Um.UomSno = Det.UomSno				        
    

GO


CREATE VIEW VW_BATCH_STOCK
WITH ENCRYPTION AS

SELECT		 0 as Selected, 0 BatchSno, 'Left Over Batch' Batch_No,1 CompSno,'' Trans_No,0 Trans_Date,1 VouTypeSno,'' VouType_Name,
			      7 ItemSno,'Left Over Gold' Item_Name,'I4' Item_Code,1 UomSno,'U1' Uom_Code,'Grams' Uom_Name,0 Base_Qty,
			      0 Karat,0 PurityPer,'' Description,

			      SUM(InDet.GrossWt) as GrossWt, 
				  SUM(InDet.StoneWt) as StoneWt, 
				  SUM(InDet.NettWt) as NettWt, 
				  SUM(InDet.Wastage) as Wastage, 
				  --0 as Wastage, 
				  SUM(InDet.PureWt) as PureWt, 
				  0 PureSilverWt, 0 as Rate, 0 as Amount,

			      SUM(OutDet.GrossWt) as OutGrossWt, 
				  SUM(OutDet.StoneWt) as OutStoneWt, 
				  SUM(OutDet.NettWt) as OutNettWt, 
				  SUM(OutDet.Wastage) as OutWastage, 
				  --0 as OutWastage, 
				  SUM(OutDet.PureWt) as OutPureWt, 0 OutPureSilverWt, 

			      ISNULL(SUM(InDet.GrossWt),0) - ISNULL(SUM(OutDet.GrossWt),0) BalGrossWt,
				    ISNULL(SUM(InDet.StoneWt),0) - ISNULL(SUM(OutDet.StoneWt),0) BalStoneWt,
            ISNULL(SUM(InDet.NettWt),0)  - ISNULL(SUM(OutDet.NettWt ),0) BalNettWt, 
			      ISNULL(SUM(InDet.Wastage),0) - ISNULL(SUM(OutDet.Wastage),0) BalWastage,
            ISNULL(SUM(InDet.PureWt),0) - ISNULL(SUM(OutDet.PureWt ),0) BalPureWt,
            ISNULL(SUM(InDet.PureSilverWt),0) - ISNULL(SUM(OutDet.PureSilverWt),0) BalPureSilverWt

FROM		    Transactions Trans
			      INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
			      LEFT OUTER JOIN Transaction_Details InDet ON InDet.TransSno = Trans.TransSno AND VTyp.Stock_Type = 1 AND InDet.ItemSno = 7
				  LEFT OUTER JOIN Uoms InDetUom ON InDetUom.UomSno = InDet.UomSno
			      LEFT OUTER JOIN Transaction_Details OutDet ON OutDet.TransSno = Trans.TransSno AND VTyp.Stock_Type = 2 AND OutDet.ItemSno = 7
				  LEFT OUTER JOIN Uoms OutDetUom ON OutDetUom.UomSno = OutDet.UomSno

WHERE		    Trans.CompSno = 1

UNION ALL

SELECT		 0 as Selected, 0 BatchSno, 'Left Over Batch' Batch_No,2 CompSno,'' Trans_No,0 Trans_Date,1 VouTypeSno,'' VouType_Name,
			      8 ItemSno,'Left Over Gold' Item_Name,'I4' Item_Code,3 UomSno,'U1' Uom_Code,'Grams' Uom_Name,0 Base_Qty,
			      0 Karat,0 PurityPer,'' Description,

			      SUM(InDet.GrossWt) as GrossWt, SUM(InDet.StoneWt) as StoneWt, SUM(InDet.NettWt) as NettWt, 0 as Wastage, SUM(InDet.PureWt) as PureWt, 0 PureSilverWt, 0 as Rate, 0 as Amount,
			      SUM(OutDet.GrossWt) as OutGrossWt, SUM(OutDet.StoneWt) as OutStoneWt, SUM(OutDet.NettWt) as OutNettWt, 0 as OutWastage, SUM(OutDet.PureWt) as OutPureWt, 0 OutPureSilverWt, 

			      ISNULL(SUM(InDet.GrossWt),0) - ISNULL(SUM(OutDet.GrossWt),0) BalGrossWt,
            ISNULL(SUM(InDet.StoneWt),0) - ISNULL(SUM(OutDet.StoneWt),0) BalStoneWt,
            ISNULL(SUM(InDet.NettWt),0)  - ISNULL(SUM(OutDet.NettWt),0) BalNettWt, 
			      ISNULL(SUM(InDet.Wastage),0) - ISNULL(SUM(OutDet.Wastage),0) BalWastage,
            ISNULL(SUM(InDet.PureWt),0) - ISNULL(SUM(OutDet.PureWt),0) BalPureWt,
            ISNULL(SUM(InDet.PureSilverWt),0) - ISNULL(SUM(OutDet.PureSilverWt),0) BalPureSilverWt

FROM		    Transactions Trans
			      INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
			      LEFT OUTER JOIN Transaction_Details InDet ON InDet.TransSno = Trans.TransSno AND VTyp.Stock_Type = 1 AND InDet.ItemSno = 8
			      LEFT OUTER JOIN Transaction_Details OutDet ON OutDet.TransSno = Trans.TransSno AND VTyp.Stock_Type = 2 AND OutDet.ItemSno = 8

WHERE		    Trans.CompSno = 2

UNION ALL

SELECT		0 as Selected, Bat.BatchSno, Bat.Batch_No, Trans.CompSno, Trans.Trans_No, Trans.Trans_Date, Trans.VouTypeSno, VTyp.VouType_Name,
            InDet.ItemSno, It.Item_Name, It.Item_Code, InDet.UomSno, Um.Uom_Code, Um.Uom_Name, Um.Base_Qty,
            InDet.Karat, InDet.PurityPer, InDet.Remarks as 'Description',

			      CASE InDet.GrossWt WHEN 0 THEN 0 ELSE CAST(InDet.GrossWt / InDet.Qty as DECIMAL(8,3)) END as GrossWt,			
			      CASE InDet.StoneWt WHEN 0 THEN 0 ELSE CAST(InDet.StoneWt /InDet.Qty as DECIMAL(8,3)) END as StoneWt, 
			      CASE InDet.NettWt WHEN 0 THEN 0 ELSE CAST(InDet.NettWt /InDet.Qty as DECIMAL(8,3)) END as NettWt,
                  CASE InDet.Wastage WHEN 0 THEN 0 ELSE CAST(InDet.Wastage /InDet.Qty as DECIMAL(8,3)) END as Wastage,   
			      CASE InDet.PureWt WHEN 0 THEN 0 ELSE CAST(InDet.PureWt /InDet.Qty  as DECIMAL(8,3)) END as PureWt, 
			      CASE InDet.PureSilverWt WHEN 0 THEN 0 ELSE CAST(InDet.PureSilverWt/InDet.Qty  as DECIMAL(8,3)) END as PureSilverWt,                
                  InDet.Rate Rate, 
			      CASE InDet.Amount WHEN 0 THEN 0 ELSE InDet.Amount/InDet.Qty END as Amount,

			      ISNULL(SUM(OutDet.GrossWt ),0) OutGrossWt,
				    ISNULL(SUM(OutDet.StoneWt ),0) OutStoneWt,
				    ISNULL(SUM(OutDet.NettWt ),0) OutNettWt,
				    ISNULL(SUM(OutDet.Wastage ),0) OutWastage,
				    ISNULL(SUM(OutDet.PureWt ),0) OutPureWt,
				    ISNULL(SUM(OutDet.PureSilverWt),0) OutPureSilverWt,


			      CASE InDet.GrossWt WHEN 0 THEN 0 ELSE (InDet.GrossWt /InDet.Qty) END  - ISNULL(SUM(OutDet.GrossWt ),0) BalGrossWt,
            CASE InDet.StoneWt WHEN 0 THEN 0 ELSE (InDet.StoneWt /InDet.Qty) END  - ISNULL(SUM(OutDet.StoneWt ),0) BalStoneWt,
            CASE InDet.NettWt WHEN 0 THEN 0 ELSE (InDet.NettWt /InDet.Qty) END  - ISNULL(SUM(OutDet.NettWt ),0) BalNettWt, 
			      CASE InDet.Wastage WHEN 0 THEN 0 ELSE (InDet.Wastage /InDet.Qty) END  - ISNULL(SUM(OutDet.Wastage),0) BalWastage,

            CASE InDet.PureWt WHEN 0 THEN 0 ELSE (InDet.PureWt /InDet.Qty) END  - ISNULL(SUM(OutDet.PureWt ),0) BalPureWt,
            CASE InDet.PureSilverWt WHEN 0 THEN 0 ELSE (InDet.PureSilverWt/InDet.Qty) END - ISNULL(SUM(OutDet.PureSilverWt),0) BalPureSilverWt
				
FROM		    Batch_Items Bat
			      INNER JOIN Transaction_Details InDet ON InDet.DetSno = Bat.DetSno
			      INNER JOIN Transactions Trans ON Trans.TransSno = Bat.TransSno
			      INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
			      INNER JOIN Items It On It.ItemSno = InDet.ItemSno
            INNER JOIN Uoms Um ON Um.UomSno = InDet.UomSno
			      LEFT OUTER JOIN Transaction_Details OutDet ON OutDet.BatchSno = Bat.BatchSno

--WHERE		(Trans.CompSno = @CompSno)

GROUP BY	Bat.BatchSno, Bat.Batch_No, Trans.CompSno, Trans.VouTypeSno, Trans.Trans_No, Trans.Trans_Date, VTyp.VouType_Name,
            InDet.ItemSno, It.Item_Name, It.Item_Code, InDet.UomSno, Um.Uom_Code, Um.Uom_Name, Um.Base_Qty,
            InDet.Karat, InDet.PurityPer, InDet.Remarks, InDet.Qty, InDet.GrossWt , InDet.StoneWt, InDet.NettWt, InDet.Wastage, InDet.PureWt, InDet.PureSilverWt, InDet.Rate, InDet.Amount
GO

CREATE FUNCTION Udf_getStockReport(@CompSno INT,@GrpSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

    SELECT		ItemSno,Item_Name,Uom_Name,Karat,PurityPer, 
			        SUM(Stock_In_Qty)-SUM(Stock_Out_Qty) as StockQty,
			        CAST(SUM(Stock_In_GrossWt)-SUM(Stock_Out_GrossWt) AS DECIMAL(10,3)) as StockGrossWt,
			        CAST(SUM(Stock_In_NettWt)-SUM(Stock_Out_NettWt) AS DECIMAL(10,3)) as StockNettWt,
              CAST(SUM(Stock_In_PureWt)-SUM(Stock_Out_PureWt) AS DECIMAL(10,3)) as StockPureWt

    FROM		  VW_STOCK_REGISTER
    WHERE     CompSno=@CompSno AND GrpSno=@GrpSno
    GROUP BY	ItemSno,Item_Name,Uom_Name,Karat, PurityPer

 GO


 
 select * from items
 select * from Udf_getStockReport(1,1)
 select * from VW_STOCK_REGISTER
/*CREATE FUNCTION Udf_getBatchStock(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

    SELECT    0 as Selected, Bat.BatchSno, Bat.Batch_No, Trans.Trans_No, Trans.Trans_Date, VTyp.VouType_Name,
              Det.ItemSno, It.Item_Name, It.Item_Code, Det.UomSno, Um.Uom_Code, Um.Uom_Name, Um.Base_Qty,
              Det.Karat, Det.PurityPer, Det.Remarks as 'Description', Det.PureWt, Det.PureSilverWt,

              CAST(Det.GrossWt /Det.Qty as DECIMAL(8,3)) as GrossWt, CAST(Det.StoneWt/Det.Qty as DECIMAL(8,3)) as StoneWt , CAST(Det.NettWt/Det.Qty as DECIMAL(8,3)) as NettWt,
              CAST(Det.Wastage/Det.Qty as DECIMAL(8,3)) as Wastage,   

              --Det.Rate/ Det.Qty as Rate, Det.Amount/Det.Qty as Amount
              Det.Rate Rate, Det.Amount/Det.Qty as Amount

    FROM      Batch_Items Bat
              INNER JOIN Transactions Trans ON Trans.TransSno = Bat.TransSno
              INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
              INNER JOIN Transaction_Details Det On Det.DetSno = Bat.DetSno
              INNER JOIN Items It On It.ItemSno = Det.ItemSno
              INNER JOIN Uoms Um ON Um.UomSno = Det.UomSno
              
    WHERE     (Trans.CompSno = @CompSno) AND Bat.BatchSno NOT IN (SELECT BatchSno FROM Transaction_Details Td INNER JOIN Transactions Tr ON Tr.TransSno=Td.TransSno AND Tr.CompSno=@CompSno)
  */  
  
  
  
CREATE FUNCTION Udf_getBatchStock(@CompSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

SELECT		0 as Selected, BatchSno, Batch_No, CompSno, Trans_No, Trans_Date, VouTypeSno, VouType_Name,
            ItemSno, Item_Name, Item_Code, UomSno, Uom_Code, Uom_Name, Base_Qty,
            Karat, PurityPer, Description, GrossWt, StoneWt , NettWt, Wastage, PureWt, PureSilverWt, Rate Rate, Amount,
			      OutGrossWt, OutStoneWt, OutNettWt, OutWastage,  OutPureWt, OutPureSilverWt, BalGrossWt, BalStoneWt, BalNettWt,  BalWastage, BalPureWt, BalPureSilverWt
				
FROM		  VW_BATCH_STOCK


WHERE		  (CompSno = @CompSno)  AND BalNettWt > 0

GO



CREATE FUNCTION Udf_getCashRegister(@CompSno INT,@CashLedSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
    
    SELECT		Vou.VouSno, Vou.Vou_No, Vou.VouDate, Vou.SeriesSno, Ser.Series_Name, Vou.LedSno, mLed.Led_Name, 
			        Det.Debit, Det.Credit

    FROM		  Voucher_Details Det
			        INNER JOIN Vouchers Vou ON Vou.VouSno=Det.VouSno
			        INNER JOIN Ledgers mLed ON mLed.LedSno = Vou.LedSno
			        INNER JOIN Voucher_Series Ser ON Ser.SeriesSno = Vou.SeriesSno

    WHERE		  Det.LedSno = @CashLedSno AND Vou.CompSno = @CompSno
    
 GO


CREATE FUNCTION Udf_getBalance(@CompSno INT,@CashLedSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN
SELECT		    SUM(Det.Debit)- SUM(Det.Credit) as OpeningBalance

    FROM		  Voucher_Details Det
			        INNER JOIN Vouchers Vou ON Vou.VouSno=Det.VouSno
			        INNER JOIN Ledgers mLed ON mLed.LedSno = Vou.LedSno
			        INNER JOIN Voucher_Series Ser ON Ser.SeriesSno = Vou.SeriesSno

    WHERE		  Det.LedSno = @CashLedSno AND Vou.CompSno = @CompSno

GO
 --SELECT * FROM Udf_getCashRegister(1,1)

CREATE FUNCTION Udf_getBatchHistory(@BatchSno INT)
RETURNS TABLE
WITH ENCRYPTION AS
RETURN

SELECT		Trans.TransSno, VTyp.VouType_Name, Trans.Trans_No, Trans.Trans_Date, Pty.Party_Name

FROM		  Batch_Items Bat
			    INNER JOIN Transaction_Details Det ON Det.DetSno = Bat.DetSno
			    INNER JOIN Transactions Trans ON Trans.TransSno = Det.TransSno
			    INNER JOIN Party Pty ON Pty.PartySno = Trans.PartySno
          INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno

WHERE		  Bat.BatchSno = @BatchSno

UNION ALL	

SELECT		Trans.TransSno, VTyp.VouType_Name, Trans.Trans_No, Trans.Trans_Date, Pty.Party_Name 
FROM		  Transaction_Details Det
			    INNER JOIN Batch_Items Bat ON Bat.BatchSno = Det.BatchSno
			    INNER JOIN Transactions Trans ON Trans.TransSno = Det.TransSno
			    INNER JOIN Party Pty ON Pty.PartySno = Trans.PartySno
          INNER JOIN Voucher_Types VTyp ON VTyp.VouTypeSno = Trans.VouTypeSno
WHERE		  Det.BatchSno=@BatchSno

GO
