CREATE  PROCEDURE  [dbo].[Admin_Dashboard]
as

SELECT * FROM [dbo].[Get_AdminDashboard_Cards] ();


SELECT * FROM [dbo].[Daywise_Meals_CurrMonth] () ORDER BY [Date];

SELECT * FROM [dbo].[Daywise_Expenses_CurrMonth] () ORDER BY [Date];

SELECT * FROM [dbo].[Tommorrow_Meals] () WHERE  Meal_On <> 0 OR Extra_Meal <> 0 ORDER BY [UserId] , [Meal_On] desc;

