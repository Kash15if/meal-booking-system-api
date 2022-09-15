CREATE PROCEDURE [dbo].[getDaywiseMeal]
as 
SELECT [Date]
      ,[Time]
      ,SUM([Meal_On] + [Extra_Meal]) AS Meals
  FROM [dbo].[BookedMeal]
  where MONTH([Date]) = MONTH(GETDATE())
  group by [Date],[Time]
  order by [Date],[Time]
