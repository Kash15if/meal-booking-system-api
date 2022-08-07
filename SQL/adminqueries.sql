--SELECT SUM([Meal_On] + [Extra_Meal])  as AllP,(SELECT SUM([Meal_On] ) as lunchV
--  FROM  [Test_DB].[dbo].[BookedMeal])  as lt , 
--  FROM  [Test_DB].[dbo].[BookedMeal] ()

select * from [BookedMeal]
where Date <= CONVERT(DATE , GETDATE())
AND MONTH(Date) = MONTH(GETDATE())