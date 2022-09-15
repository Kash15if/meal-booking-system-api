CREATE PROCEDURE [dbo].[expenseQuery]
as 
SELECT [Date]
      ,[Todays_Expense]
      ,[Expense_Details]
      ,[Expense_Breakup]
  FROM [dbo].[Daily_Expense_Record]

--INSERT INTO [dbo].[Daily_Expense_Record] VALUES (@date , @expense , @details , @breakup)

--UPDATE [dbo].[Daily_Expense_Record] SET [Todays_Expense] = @expense
--,[Expense_Details] = @details , [Expense_Breakup] = @breakup
--WHERE [Date] = @date

--DELETE FROM [dbo].[Daily_Expense_Record] WHERE [Date] = @date