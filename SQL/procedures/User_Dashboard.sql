CREATE Procedure  [dbo].[User_Dashboard] @uid int
as


--summary or for cards
select All_Expense , Total_Meal , (All_Expense/Total_Meal) as Meal_Cost , MyMeals
from
(
SELECT SUM([Todays_Expense])  as All_Expense , 
(select  SUM([Meal_On] +[Extra_Meal]) FROM  [dbo].[BookedMeal] as Total_Meal WHERE Date <= CONVERT(DATE , GETDATE()) AND MONTH(Date) =  MONTH(GETDATE())) as Total_Meal , 
(select  COALESCE(SUM([Meal_On] +[Extra_Meal]),0)  FROM [dbo].[BookedMeal] as 
Total_Meal WHERE UserId = @uid and  MONTH(Date) =    MONTH( GETDATE()) and Date <= convert(date , getdate())) as MyMeals
FROM [dbo].[Daily_Expense_Record] WHERE MONTH(Date) =  MONTH(GETDATE()) and Date <= convert(date , getdate())
) as dataTab

--daily my meals for barchart

select dt as Date ,funTab1.Time, COALESCE(Meals , 0) Meals from (
select dt  , Time  from [dbo].[getDateBetweenRanges] (DATEADD(DD,-(DAY(GETDATE())), GETDATE()) 
, DATEADD(DD,-(DAY(GETDATE())), DATEADD(MM, 1, GETDATE()))) as dateFun
cross apply
(Select 'Lunch' as Time union select 'ES' as Time) as crap
) as funTab1
left join 
(select Date , Time, SUM([Meal_On] +[Extra_Meal]) as Meals FROM  [dbo].[BookedMeal]where Date <= convert(date , getdate()) 
and 
UserId = @uid group by Date , Time
) as tabData
on funTab1.dt = tabData.Date and funTab1.Time = tabData.Time 
order by dt , funTab1.Time desc


--mY Last 3 month meals
SELECT * FROM [dbo].[AllMeals_Last3Month]() WHERE [UserId] = @uid AND (Meal_On <> 0 OR Extra_Meal <> 0)
AND MONTH(Date) = MONTH(getDate())
;

