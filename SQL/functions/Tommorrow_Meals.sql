CREATE FUNCTION  [dbo].[Tommorrow_Meals]()
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
  where [Date]  =  CONVERT(DATE , DATEADD(DAY , 1 , GETDATE()))
)
