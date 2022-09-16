
CREATE TABLE [dbo].[BookedMeal](
	[UserId] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[Time] [varchar](50) NOT NULL,
	[Menu] [varchar](100) NULL,
	[Meal_On] [int] NULL,
	[Extra_Meal] [int] NULL,
 CONSTRAINT [PK_BookedMeal] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[Date] ASC,
	[Time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[BookedMeal] ADD  CONSTRAINT [DF_BookedMeal_Meal_On]  DEFAULT ((0)) FOR [Meal_On]
GO

ALTER TABLE [dbo].[BookedMeal] ADD  CONSTRAINT [DF_BookedMeal_Extra_Meal]  DEFAULT ((0)) FOR [Extra_Meal]
GO


