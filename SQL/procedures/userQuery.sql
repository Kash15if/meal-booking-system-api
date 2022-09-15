CREATE PROCEDURE [dbo].[userQuery]
as 
SELECT [userid]
      ,[password]
      ,[name]
      ,[dept]
  FROM [dbo].[UserDetails]

  
  --INSERT INTO [dbo].[UserDetails] VALUES (@uid , @pass , @name , @dept)
  --DELETE FROM [dbo].[UserDetails]  WHERE [userid] = @uid
  --UPDATE [dbo].[UserDetails] SET [password] = @pass , [name] = @name , [dept] = @dept
	--WHERE [userid] = @uid