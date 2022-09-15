CREATE FUNCTION  [dbo].[Daywise_Meals_CurrMonth]()
RETURNS TABLE 
AS
RETURN 
(
SELECT [Date]
      ,[Time]
      ,SUM([Meal_On] + [Extra_Meal]) AS Meals
  FROM [dbo].[BookedMeal]
  where MONTH([Date]) = MONTH(GETDATE())
  group by [Date],[Time]
)
