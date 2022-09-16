CREATE TABLE [dbo].[UserDetails](
	[userid] [int] NOT NULL,
	[password] [varchar](50) NULL,
	[name] [varchar](100) NULL,
	[dept] [varchar](50) NULL,
 CONSTRAINT [PK_UserDetails] PRIMARY KEY CLUSTERED 
(
	[userid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]



