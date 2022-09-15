
CREATE OR ALTER PROCEDURE [dbo].[getNextDayBooking] @uid int , @Time varchar(50)
AS

Declare @fromDate date = CONVERT(DATE , GETDATE())


SELECT dt as Date, COALESCE(UserId , @uid) as UserId,
 @Time as [Time]
,COALESCE([Meal_On] , 0 ) AS [Meal_On]
,COALESCE([Extra_Meal], 0 ) AS [Extra_Meal]
,COALESCE(mn.Menu , 'No Menu Added')
FROM [dbo].[getDateBetweenRanges] ( @fromDate ,dateadd(day , 7 , @fromDate)) as ft
left join
BookedMeal as bm
on bm.Date = ft.dt and bm.UserId = @uid and bm.[Time] = @Time
left join
Menu as mn
on bm.Date = mn.Date and  mn.[Time] = 'Lunch'



