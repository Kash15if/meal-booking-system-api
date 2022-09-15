CREATE PROCEDURE [dbo].[updateExpense]  @date date,@time varchar(50) , @expense int,@details varchar(100) , @breakup  varchar(200)

AS 


IF EXISTS (SELECT * FROM [dbo].[Daily_Expense_Record] where  [Date] = @date and [Time] = @time)
 BEGIN
	Update [dbo].[Daily_Expense_Record]
	set [Todays_Expense] = @expense , [Expense_Details] = @details , [Expense_Breakup] = @breakup
	 where  [Date] = @date and [Time] = @time
 END
 ELSE
 BEGIN
  insert into [dbo].[Daily_Expense_Record]
  values ( @date ,@time, @expense ,@details , @breakup)
 END


