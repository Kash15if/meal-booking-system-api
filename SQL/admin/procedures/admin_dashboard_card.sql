
CREATE OR ALTER PROCEDURE [dbo].[AdminDashboardCard]
AS


select All_Expense , Total_Meal , (All_Expense/Total_Meal) as Meal_Cost , Tom_Meal
from
(
SELECT SUM([Todays_Expense])  as All_Expense , (  select  SUM([Meal_On] +[Extra_Meal]) FROM  
[dbo].[BookedMeal] as Total_Meal
  WHERE Date <= CONVERT(DATE , GETDATE())
   AND MONTH(Date) =  MONTH(GETDATE())) as Total_Meal , 
   ( select  COALESCE(SUM([Meal_On] +[Extra_Meal]),0) FROM  
[dbo].[BookedMeal] as Total_Meal
  WHERE Date =    DATEADD(DAY , 1 ,CONVERT(DATE , GETDATE()))) as Tom_Meal
 FROM [dbo].[Daily_Expense_Record]
  WHERE MONTH(Date) =  MONTH(GETDATE())
  ) as dataTab
