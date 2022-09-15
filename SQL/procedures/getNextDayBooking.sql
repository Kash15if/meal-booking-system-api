CREATE PROCEDURE [dbo].[getNextDayBooking] @uid int , @Time varchar(50)
AS

Declare @fromDate date = CONVERT(DATE , GETDATE())

Declare @today date = CONVERT(DATE , DATEADD(DAY , -1 , GETDATE()))


IF  convert(time , getDate()) < '06:00:00.000' AND @Time = 'Lunch'

SELECT dt as Date, COALESCE(UserId , @uid) as UserId,
 @Time as [Time]
,COALESCE([Meal_On] , 0 ) AS [Meal_On]
,COALESCE([Extra_Meal], 0 ) AS [Extra_Meal]
,COALESCE(mn.Menu , 'No Menu Added')  as Menu
FROM [dbo].[getDateBetweenRanges] ( @today ,dateadd(day , 7 , @today)) as ft
left join
BookedMeal as bm
on bm.Date = ft.dt and bm.UserId = @uid and bm.[Time] = @Time
left join
Menu as mn
on bm.Date = mn.Date and  mn.[Time] = 'Lunch'

else if convert(time , getDate()) >= '06:00:00.000' AND @Time = 'Lunch'
SELECT dt as Date, COALESCE(UserId , @uid) as UserId,
 @Time as [Time]
,COALESCE([Meal_On] , 0 ) AS [Meal_On]
,COALESCE([Extra_Meal], 0 ) AS [Extra_Meal]
,COALESCE(mn.Menu , 'No Menu Added')  as Menu
FROM [dbo].[getDateBetweenRanges] ( @fromDate ,dateadd(day , 7 , @fromDate)) as ft
left join
BookedMeal as bm
on bm.Date = ft.dt and bm.UserId = @uid and bm.[Time] = @Time
left join
Menu as mn
on bm.Date = mn.Date and  mn.[Time] = 'Lunch'

else if convert(time , getDate()) < '15:00:00.000' AND @Time = 'ES'
SELECT dt as Date, COALESCE(UserId , @uid) as UserId,
 @Time as [Time]
,COALESCE([Meal_On] , 0 ) AS [Meal_On]
,COALESCE([Extra_Meal], 0 ) AS [Extra_Meal]
,COALESCE(mn.Menu , 'No Menu Added')  as Menu
FROM [dbo].[getDateBetweenRanges] ( @today ,dateadd(day , 7 , @today)) as ft
left join
BookedMeal as bm
on bm.Date = ft.dt and bm.UserId = @uid and bm.[Time] = @Time
left join
Menu as mn
on bm.Date = mn.Date and  mn.[Time] = 'Lunch'

else 
SELECT dt as Date, COALESCE(UserId , @uid) as UserId,
 @Time as [Time]
,COALESCE([Meal_On] , 0 ) AS [Meal_On]
,COALESCE([Extra_Meal], 0 ) AS [Extra_Meal]
,COALESCE(mn.Menu , 'No Menu Added')  as Menu
FROM [dbo].[getDateBetweenRanges] ( @fromDate ,dateadd(day , 7 , @fromDate)) as ft
left join
BookedMeal as bm
on bm.Date = ft.dt and bm.UserId = @uid and bm.[Time] = @Time
left join
Menu as mn
on bm.Date = mn.Date and  mn.[Time] = 'Lunch'

