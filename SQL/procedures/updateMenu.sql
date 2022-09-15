CREATE PROCEDURE [dbo].[updateMenu]  @date date, @Time varchar(50), @menu varchar(200)

AS 


IF EXISTS (SELECT * FROM [dbo].[Menu] where  [Date] = @date and [Time]=@Time )
 BEGIN
	Update [dbo].[Menu]
	set Menu = @menu 
	 where  [Date] = @date and [Time]=@Time 
 END
 ELSE
 BEGIN
  insert into [dbo].[Menu]
  values ( @date , @Time , @menu )
 END


