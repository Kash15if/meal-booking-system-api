CREATE PROCEDURE [dbo].[downloadMonthlyBill] @month int , @uid int
AS

SELECT
[Date]
      ,[Time]
      ,[Menu]
      ,[Meal_On]
      ,[Extra_Meal]
	  ,[Meal_On] + [Extra_Meal] Daily
	  ,SUM([Meal_On] + [Extra_Meal]) OVER () Total_Meal
  FROM [dbo].[BookedMeal]
  WHERE MONTH([Date]) =  @month and [UserId] = @uid