
CREATE OR ALTER PROCEDURE  [dbo].[DailyMeals_Vs_Expense]
AS

SELECT bmtab.Date , Meals , Expense , IIF(Meals = 0 , 0 ,(Expense/Meals)) Charge
from
  (select Date ,  SUM([Meal_On] +[Extra_Meal]) as Meals FROM   [BookedMeal]  
  WHERE Date <= CONVERT(DATE , GETDATE())
   AND MONTH(Date) =  MONTH(GETDATE())
    group by Date) as bmtab
   left join
   (Select Date,  SUM(Todays_Expense) as Expense from Daily_Expense_Record group by Date) as derTab
   on derTab.Date = bmtab.Date



