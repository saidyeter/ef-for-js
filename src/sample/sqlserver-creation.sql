IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[book]') AND type in (N'U'))
DROP TABLE [dbo].[book]
GO
CREATE TABLE [dbo].[book](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[AuthorId] [int] NULL,
	[PublishedAt] [datetime] NULL
)

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[author]') AND type in (N'U'))
DROP TABLE [dbo].[author]
GO
CREATE TABLE [dbo].[author](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Origin] [nvarchar](50) NULL
)


INSERT INTO [dbo].[author] ([Name], [Origin]) VALUES ('Dostoyevsky', 'Russian')
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('Crime and Punishment', '1866-09-10', 1)
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('The Idiot', '1869-09-10', 1)
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('The Brothers Karamazov', '1880-09-10', 1)
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('Demons', '1872-09-10', 1)

INSERT INTO [dbo].[author] ([Name], [Origin]) VALUES ('Charles Dickens', 'British')
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('A Tale of Two Cities', '1859-09-10', 2)
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('Oliver Twist', '1837-09-10', 2)
INSERT INTO [dbo].[book] ([Name], [PublishedAt], [AuthorId]) VALUES ('David Copperfield', '1849-09-10', 2)

