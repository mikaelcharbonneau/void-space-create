CREATE TABLE IF NOT EXISTS AuditReports (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserEmail NVARCHAR(255) NOT NULL,
    Timestamp DATETIME NOT NULL,
    ReportData NVARCHAR(MAX) NOT NULL
);

CREATE INDEX IX_AuditReports_Timestamp ON AuditReports(Timestamp);
CREATE INDEX IX_AuditReports_UserEmail ON AuditReports(UserEmail); 