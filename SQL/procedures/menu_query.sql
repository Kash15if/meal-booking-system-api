CREATE PROCEDURE [dbo].[menu_query]
AS
SELECT  [Date]
      ,[Time]
      ,[Menu]
  FROM [dbo].[Menu]

    --INSERT INTO [dbo].[Menu] VALUES (@date , @time , @menu)

	--UPDATE [dbo].[Menu] 
--SET [Menu] =  @menu
--WHERE [Date] = @date AND [Time] = @time

--DELETE FROM [dbo].[Menu] WHERE [Date] = @date AND [Time] = @time



