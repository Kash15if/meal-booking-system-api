CREATE FUNCTION  [dbo].[Daywise_Expenses_CurrMonth]()
RETURNS TABLE 
AS
RETURN 
(
SELECT  [Date]
      ,SUM([Todays_Expense]) AS [Todays_Expense]
  FROM [dbo].[Daily_Expense_Record]
  GROUP BY [Date]
)
