CREATE FUNCTION [dbo].[getDateBetweenRanges] (@startDate date , @endDate date)
RETURNS TABLE
AS
RETURN

with dateRange as
(
  select dt = dateadd(dd, 1, @startDate)
  where dateadd(dd, 1, @startDate) <= @endDate
  union all
  select dateadd(dd, 1, dt)
  from dateRange
  where dateadd(dd, 1, dt) <= @endDate
)
select *
from dateRange

