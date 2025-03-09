// Microsoft SQL Server Schema and Sample Data (schema.sql)
CREATE DATABASE work_orders_db;
GO

USE work_orders_db;
GO

CREATE TABLE WorkOrders (
  Id INT PRIMARY KEY IDENTITY(1,1),
  Description NVARCHAR(255),
  CreatedDate DATETIME
);

CREATE TABLE WorkOrderDetails (
  Id INT PRIMARY KEY IDENTITY(1,1),
  WorkOrderId INT FOREIGN KEY REFERENCES WorkOrders(Id),
  PartName NVARCHAR(255),
  Quantity INT
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

-- Sample Data
INSERT INTO WorkOrders (Description, CreatedDate) VALUES ('Sample Work Order 1', GETDATE());
INSERT INTO WorkOrders (Description, CreatedDate) VALUES ('Sample Work Order 2', GETDATE());

INSERT INTO WorkOrderDetails (WorkOrderId, PartName, Quantity) VALUES (1, 'Part A', 10);
INSERT INTO WorkOrderDetails (WorkOrderId, PartName, Quantity) VALUES (1, 'Part B', 5);
INSERT INTO WorkOrderDetails (WorkOrderId, PartName, Quantity) VALUES (2, 'Part C', 7);

INSERT INTO Receipts (WorkOrderId, PartName, CheckedOutQuantity, CheckedOutDate) VALUES (1, 'Part A', 5, GETDATE());
INSERT INTO Receipts (WorkOrderId, PartName, CheckedOutQuantity, CheckedOutDate) VALUES (2, 'Part C', 3, GETDATE());

INSERT INTO Transactions (WorkOrderId, Action, ActionDate) VALUES (1, 'Created', GETDATE());
INSERT INTO Transactions (WorkOrderId, Action, ActionDate) VALUES (2, 'Created', GETDATE());

