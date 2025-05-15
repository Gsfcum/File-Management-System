-- Create database
CREATE DATABASE DocuSphere;
GO

USE DocuSphere;
GO

-- Create Users table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME,
    IsActive BIT DEFAULT 1
);

-- Create Folders table
CREATE TABLE Folders (
    FolderId INT IDENTITY(1,1) PRIMARY KEY,
    ParentFolderId INT NULL,
    Name NVARCHAR(100) NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ModifiedAt DATETIME,
    FOREIGN KEY (ParentFolderId) REFERENCES Folders(FolderId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Create Documents table
CREATE TABLE Documents (
    DocumentId INT IDENTITY(1,1) PRIMARY KEY,
    FolderId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(50) NOT NULL,
    FileSize BIGINT NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ModifiedAt DATETIME,
    Notes NVARCHAR(MAX),
    FOREIGN KEY (FolderId) REFERENCES Folders(FolderId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Create DocumentVersions table
CREATE TABLE DocumentVersions (
    VersionId INT IDENTITY(1,1) PRIMARY KEY,
    DocumentId INT NOT NULL,
    VersionNumber INT NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Notes NVARCHAR(MAX),
    FOREIGN KEY (DocumentId) REFERENCES Documents(DocumentId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Create DocumentAccess table
CREATE TABLE DocumentAccess (
    AccessId INT IDENTITY(1,1) PRIMARY KEY,
    DocumentId INT NOT NULL,
    UserId INT NOT NULL,
    AccessType NVARCHAR(20) NOT NULL, -- 'Read', 'Write', 'Admin'
    GrantedBy INT NOT NULL,
    GrantedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DocumentId) REFERENCES Documents(DocumentId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (GrantedBy) REFERENCES Users(UserId)
);

-- Create DocumentNotes table
CREATE TABLE DocumentNotes (
    NoteId INT IDENTITY(1,1) PRIMARY KEY,
    DocumentId INT NOT NULL,
    UserId INT NOT NULL,
    NoteText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ModifiedAt DATETIME,
    FOREIGN KEY (DocumentId) REFERENCES Documents(DocumentId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
); 