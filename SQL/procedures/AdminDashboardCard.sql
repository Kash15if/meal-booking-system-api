CREATE  PROCEDURE [dbo].[AdminDashboardCard]
AS


select COALESCE(All_Expense, 0) All_Expense, 
COALESCE(Lunch_Expense, 0) as Lunch_Expense,
COALESCE(Snacks_Expense, 0) AS Snacks_Expense,
COALESCE(Total_Meal , 0) Total_Meal ,
COALESCE((Lunch_Expense/Total_Meal), 0) as Lunch_Cost , 
COALESCE((Snacks_Expense/Total_Snacks), 0) as ES_Cost , 
COALESCE((All_Expense/Total_Meal), 0) as Meal_Cost , 
COALESCE(Total_Snacks , 0) AS Total_Snacks,
COALESCE(TODAY_LUNCH , 0) AS Today_Lunch,
COALESCE(TOM_LUNCH , 0) AS Tom_Lunch,
COALESCE(YEST_LUNCH , 0) AS Yest_Lunch,
COALESCE(TODAY_ES , 0) AS Today_ES,
COALESCE(LASTMONTH_EXP/LASTMONTH_MELAS , 0) AS Last_Month_LunchCharge,
COALESCE(LASTMONTH_ES_Exp/LASTMONTH_ES_Count , 0) AS Last_Month_ESCharge
--,COALESCE(TOM_ES , 0) AS Tom_ES,
--COALESCE(YEST_ES , 0) AS Yest_ES
from
(
SELECT SUM([Todays_Expense])  as All_Expense , 

(SELECT SUM([Todays_Expense]) FROM [dbo].[Daily_Expense_Record] WHERE Date <= CONVERT(DATE , GETDATE()) AND MONTH(Date) =  MONTH(GETDATE()) AND [Time] = 'Lunch') as Lunch_Expense, 
(SELECT SUM([Todays_Expense]) FROM [dbo].[Daily_Expense_Record] WHERE Date <= CONVERT(DATE , GETDATE()) AND MONTH(Date) =  MONTH(GETDATE()) AND [Time] = 'ES') as Snacks_Expense ,
(Select  SUM([Meal_On] +[Extra_Meal]) FROM  [dbo].[BookedMeal] as Total_Meal WHERE Date <= CONVERT(DATE , GETDATE()) AND MONTH(Date) =  MONTH(GETDATE()) AND Time = 'Lunch') as Total_Meal , 
(Select  SUM([Meal_On]) FROM  [dbo].[BookedMeal] as Total_Meal WHERE Date <= CONVERT(DATE , GETDATE()) AND MONTH(Date) =  MONTH(GETDATE()) AND Time = 'ES') as Total_Snacks  ,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  CONVERT(DATE , GETDATE()) AND [Time] = 'Lunch') AS TODAY_LUNCH,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  DATEADD(DAY ,1,CONVERT(DATE , GETDATE())) AND [Time] = 'Lunch') AS TOM_LUNCH,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  DATEADD(DAY ,-1,CONVERT(DATE , GETDATE())) AND [Time] = 'Lunch') AS YEST_LUNCH,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  CONVERT(DATE , GETDATE()) AND [Time] = 'ES') AS TODAY_ES,
(SELECT SUM([Todays_Expense]) FROM  [dbo].[Daily_Expense_Record]
WHERE MONTH(Date) =  (MONTH(GETDATE()) - 1) AND [Time] = 'Lunch') AS LASTMONTH_EXP,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  CONVERT(DATE , GETDATE()) AND [Time] = 'Lunch') AS LASTMONTH_MELAS,
(SELECT SUM([Todays_Expense]) FROM  [dbo].[Daily_Expense_Record]
WHERE MONTH(Date) =  (MONTH(GETDATE()) - 1) AND [Time] = 'ES') AS LASTMONTH_ES_Exp,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE Date =  CONVERT(DATE , GETDATE()) AND [Time] = 'ES') AS LASTMONTH_ES_Count
--,(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
--WHERE Date =  DATEADD(DAY ,1,CONVERT(DATE , GETDATE())) AND [Time] = 'ES') AS TOM_ES,
--(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
--WHERE Date =  DATEADD(DAY ,-1,CONVERT(DATE , GETDATE())) AND [Time] = 'ES') AS YEST_ES
FROM [dbo].[Daily_Expense_Record] WHERE MONTH(Date) =  MONTH(GETDATE()) AND Date <= CONVERT(DATE , GETDATE())
) as dataTab

