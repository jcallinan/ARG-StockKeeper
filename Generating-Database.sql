
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'work_orders_db')
BEGIN
    CREATE DATABASE work_orders_db;
END;
GO

USE work_orders_db;
GO

-- 2️⃣ Create SQL Server Login (at the server level)
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'workorder_user')
BEGIN
    CREATE LOGIN workorder_user WITH PASSWORD = 'StrongP@ssw0rd!';
END;
GO

-- 3️⃣ Create Database User and Grant Permissions
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'workorder_user')
BEGIN
    CREATE USER workorder_user FOR LOGIN workorder_user;
    ALTER ROLE db_datareader ADD MEMBER workorder_user;
    ALTER ROLE db_datawriter ADD MEMBER workorder_user;
END;
GO

-- 4️⃣ Drop Tables If Exist
IF OBJECT_ID('dbo.Transactions', 'U') IS NOT NULL DROP TABLE dbo.Transactions;
IF OBJECT_ID('dbo.Receipts', 'U') IS NOT NULL DROP TABLE dbo.Receipts;
IF OBJECT_ID('dbo.WorkOrderDetails', 'U') IS NOT NULL DROP TABLE dbo.WorkOrderDetails;
IF OBJECT_ID('dbo.WorkOrders', 'U') IS NOT NULL DROP TABLE dbo.WorkOrders;
GO

-- 5️⃣ Recreate Tables
CREATE TABLE WorkOrders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(255),
    CreatedDate DATETIME
);

CREATE TABLE WorkOrderDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    WorkOrderId INT FOREIGN KEY REFERENCES WorkOrders(Id),
    PartName NVARCHAR(255),
    Quantity INT,
    ShelfBin VARCHAR(255)
);

CREATE TABLE Receipts (
    Id INT PRIMARY KEY IDENTITY(1,1),
    WorkOrderId INT FOREIGN KEY REFERENCES WorkOrders(Id),
    PartName NVARCHAR(255),
    CheckedOutQuantity INT,
    CheckedOutDate DATETIME
);

CREATE TABLE Transactions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    WorkOrderId INT FOREIGN KEY REFERENCES WorkOrders(Id),
    Action NVARCHAR(255),
    ActionDate DATETIME
);
GO

CREATE TABLE Inventory (
	Id int PRIMARY KEY IDENTITY(1,1),
	PartName nvarchar(255) NULL,
	ShelfBin varchar(255) NULL,
	Quantity int NULL,
	UpdatedDate datetime NULL
    );
GO



-- 6️⃣ Insert Sample Data
SET IDENTITY_INSERT [dbo].[WorkOrders] ON 
INSERT [dbo].[WorkOrders] ([Id], [Description], [CreatedDate]) VALUES 
(1, N'Sample Work Order 1', CAST(N'2025-03-13T18:37:50.630' AS DateTime)),
(2, N'Sample Work Order 2', CAST(N'2025-03-13T18:37:50.643' AS DateTime)),
(3, N'Test Work Order', CAST(N'2025-03-13T19:04:54.827' AS DateTime)),
(4, N'Test Work Order', CAST(N'2025-03-13T19:39:30.953' AS DateTime)),
(5, N'Test Work Order', CAST(N'2025-03-13T20:14:31.427' AS DateTime)),
(6, N'Test Work Order', CAST(N'2025-03-20T17:59:43.050' AS DateTime)),
(7, N'Test Work Order', CAST(N'2025-03-20T18:12:57.537' AS DateTime)),
(8, N'Test Work Order', CAST(N'2025-03-20T18:58:28.363' AS DateTime));
SET IDENTITY_INSERT [dbo].[WorkOrders] OFF
GO

INSERT [dbo].[WorkOrderDetails] ([WorkOrderId], [PartName], [Quantity], [ShelfBin]) VALUES 
(1, N'Part A', 10, N'Shelf 1'),
(1, N'Part B', 5, N'Shelf 2'),
(2, N'Part C', 7, N'Shelf 3'),
(3, N'Part A', 10, N'Shelf 4'),
(3, N'Part B', 5, N'Shelf 1'),
(3, N'Part C', 7, N'Shelf 2'),
(4, N'Part A', 10, N'Shelf 4'),
(4, N'Part B', 5, N'Bin 2'),
(4, N'Part C', 7, N'Bin 2'),
(5, N'Part A', 10, N'Shelf 2'),
(5, N'Part B', 5, N'Bin 3'),
(5, N'Part C', 7, N'Bin 1'),
(6, N'Part A', 10, N'Shelf 2'),
(6, N'Part B', 5, N'Bin 2'),
(6, N'Part C', 7, N'Shelf 2'),
(7, N'Part A', 10, N'Bin 5'),
(7, N'Part B', 5, N'Shelf 2'),
(7, N'Part C', 7, N'Bin 9'),
(8, N'Part A', 10, N'Shelf 2'),
(8, N'Part B', 5, N'Bin 7'),
(8, N'Part C', 7, N'Shelf 2');
GO

INSERT INTO Receipts (WorkOrderId, PartName, CheckedOutQuantity, CheckedOutDate) VALUES
(1, 'Part A', 5, GETDATE()),
(2, 'Part C', 3, GETDATE());
GO

INSERT INTO Transactions (WorkOrderId, Action, ActionDate) VALUES
(1, 'Created', GETDATE()),
(2, 'Created', GETDATE());
GO

SET IDENTITY_INSERT [dbo].[Inventory] ON 
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (1, N'Part A', N'Shelf 1, Main Stockroom', 25, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (2, N'Part A', N'Packaging Plant', 50, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (3, N'Part B', N'Shelf 1', 50, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (4, N'Part B', N'Shelf 2', 50, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (5, N'Part C', N'Shelf 3', 50, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (6, N'Part A', N'Shelf 4', 50, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
INSERT [dbo].[Inventory] ([Id], [PartName], [ShelfBin], [Quantity], [UpdatedDate]) VALUES (7, N'Part B', N'Shelf 1', 150, CAST(N'2025-04-03T18:52:38.427' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Inventory] OFF
GO



-- 7️⃣ Grant Permissions to User
GRANT SELECT, INSERT, UPDATE, DELETE ON WorkOrders TO workorder_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON WorkOrderDetails TO workorder_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON Receipts TO workorder_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON Transactions TO workorder_user;
GO
