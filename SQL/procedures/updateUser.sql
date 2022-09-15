CREATE PROCEDURE [dbo].[updateUser]  @userid int, @password varchar(50), @name varchar(100) , @dept  varchar(100)

AS 


IF EXISTS (SELECT * FROM [dbo].[UserDetails] where  [userid] = @userid)
 BEGIN
	Update [dbo].[UserDetails]
	set [password] = @password , [name] = @name , [dept] = @dept
	 where  [userid] = @userid
 END
 ELSE
 BEGIN
  insert into [dbo].[UserDetails]
  values ( @userid, @password , @name, @dept)
 END


