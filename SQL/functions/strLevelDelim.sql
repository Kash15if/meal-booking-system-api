CREATE function [dbo].[strLevelDelim](@str varchar(MAX),@delimiter char(1),@count int)
Returns varchar(MAX)
Begin
Set @str=CONCAT(@str,@delimiter)
Declare @result varchar(MAX);
Declare @i int;
Set @i=1;
	While @i<=@count 
		Begin
			Set @result = Substring(@str,0,CHARINDEX(@delimiter,@str))
			Set @str=SUBSTRING(@str,CHARINDEX(@delimiter,@str)+1,LEN(@str))
			Set @i=@i+1
		End
	return @result
End
