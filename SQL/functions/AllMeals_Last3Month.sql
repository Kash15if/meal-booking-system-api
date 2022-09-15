CREATE FUNCTION  [dbo].[AllMeals_Last3Month]()
RETURNS TABLE 
AS
RETURN 
(
SELECT [UserId]
      ,[Date]
      ,[Time]
      ,[Menu]
      ,[Meal_On]
      ,[Extra_Meal]
  FROM [dbo].[BookedMeal]
  where [Date]  BETWEEN DATEADD(DAY , -90 , GETDATE()) AND CONVERT(DATE , GETDATE())
  AND (Meal_On <> 0 or Extra_Meal <> 0)
)
