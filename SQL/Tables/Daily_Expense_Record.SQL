
CREATE TABLE [dbo].[Daily_Expense_Record](
	[Date] [date] NOT NULL,
	[Time] [varchar](50) NOT NULL,
	[Todays_Expense] [int] NULL,
	[Expense_Details] [varchar](500) NULL,
	[Expense_Breakup] [varchar](200) NULL,
 CONSTRAINT [PK_Daily_Expense_Record] PRIMARY KEY CLUSTERED 
(
	[Date] ASC,
	[Time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


