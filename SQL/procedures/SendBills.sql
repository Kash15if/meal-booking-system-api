CREATE PROCEDURE   [dbo].[SendBills]  @uid  int , @month int
as

SELECT * , SnacksAmount+LunchAmount AS Amount , (SnacksAmount+LunchAmount)/2 AS Subsidy,  
(SnacksAmount+LunchAmount)/2 AS ToBePaid
FROM
(
Select * , Snacks*SnacksCost as SnacksAmount , Lunch*LunchCost as LunchAmount 
FROM
(
SELECT 
COALESCE(YOUR_ES, 0) AS Snacks,
COALESCE(YOUR_MEALS, 0) AS Lunch,
COALESCE((LASTMONTH_EX_LUNCH/LASTMONTH_MEALS), 0) AS LunchCost,
COALESCE((LASTMONTH_EX_ES/LASTMONTH_ES), 0) AS SnacksCost
FROM
(
SELECT SUM(Meal_On + Extra_Meal) as YOUR_ES,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE MONTH(Date) = @month AND [Time] = 'Lunch' AND Date < convert(Date , GetDate()) ) AS LASTMONTH_MEALS,
(SELECT SUM(Todays_Expense) FROM [dbo].[Daily_Expense_Record]
WHERE MONTH(Date) = @month  AND [Time] = 'Lunch'  AND Date < convert(Date , GetDate()) ) AS LASTMONTH_EX_LUNCH,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE MONTH(Date) = @month  AND [Time] = 'ES'  AND Date < convert(Date , GetDate()) ) AS LASTMONTH_ES,
(SELECT SUM(Todays_Expense) FROM [dbo].[Daily_Expense_Record]
WHERE MONTH(Date) = @month  AND [Time] = 'ES'  AND Date < convert(Date , GetDate()) ) AS LASTMONTH_EX_ES,
(SELECT SUM(Meal_On + Extra_Meal) FROM [dbo].[BookedMeal]
WHERE MONTH(Date) = @month  AND [Time] = 'Lunch' AND [UserId] = @uid AND Date < convert(Date , GetDate()) ) AS YOUR_MEALS
FROM [dbo].[BookedMeal]
WHERE MONTH(Date) = @month  AND [Time] = 'ES' AND [UserId] = @uid  AND Date < convert(Date , GetDate()) 
) AS innerTab
) AS ProductTab
)AS MailTab
