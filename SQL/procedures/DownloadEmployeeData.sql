CREATE PROCEDURE [dbo].[DownloadEmployeeData] @userId int , @month int
AS

Select * ,  SUM(SnacksCost + LunchCost) OVER(ORDER BY Date) as Total 
from(
select Date , Lunch , Snacks ,(SnacksCost*Snacks)  SnacksCost ,
(LunchCost*Lunch) LunchCost
from
(
select [Date] , Lunch ,COALESCE(ES , 0) AS Snacks ,
	  COALESCE((SELECT LunchCost FROM  [dbo].[UserSummaryData](@userId , @month )),0) AS LunchCost,
	  COALESCE((SELECT SnacksCost FROM  [dbo].[UserSummaryData](@userId , @month )),0) AS SnacksCost
FROM
(
SELECT  [UserId]
      ,[Date]
      ,[Time]
      ,(COALESCE([Meal_On], 0) + COALESCE([Extra_Meal], 0)) AS Meals
  FROM [dbo].[BookedMeal]
  where [UserId] = @userId and MONTH([Date]) = @month
  ) as innerTab
  PIVOT  
(  
  SUM(Meals)  
  FOR [Time] IN ([Lunch] , [ES])  
) AS PivotTable
where Lunch <> 0 OR ES <> 0
) calcTab
) as totalTab;      