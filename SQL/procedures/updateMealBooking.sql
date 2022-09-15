CREATE PROCEDURE [dbo].[updateMealBooking] @uid int, @date date, @Time varchar(50), @menu varchar(200), @mealOn int, @extraMeal int

AS 


IF EXISTS (SELECT * FROM [dbo].[BookedMeal] where UserId = @uid and [Date] = 
			@date and [Time]=@Time )
 BEGIN
	Update [dbo].[BookedMeal] 
	set Meal_On = @mealOn , Extra_Meal = @extraMeal
	 where UserId = @uid and [Date] = @date and [Time]=@Time 
 END
 ELSE
 BEGIN
  insert into [dbo].[BookedMeal] 
  values (@uid , @date , @Time , @menu , @mealOn , @extraMeal)
 END


