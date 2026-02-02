import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * ============================================================================
 * ENUMS
 * ============================================================================
 */

export const entityTypeEnum = mysqlEnum("entity_type", [
  "HEADQUARTERS",
  "SUBSIDIARY",
  "DEPARTMENT",
  "DIVISION",
]);

export const processCategoryEnum = mysqlEnum("process_category", [
  "CORE",
  "SUPPORT",
  "MANAGEMENT",
]);

export const meetingFrequencyEnum = mysqlEnum("meeting_frequency", [
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "ANNUALLY",
]);

export const decisionStatusEnum = mysqlEnum("decision_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "IMPLEMENTED",
]);

export const riskStatusEnum = mysqlEnum("risk_status", [
  "IDENTIFIED",
  "ASSESSED",
  "MITIGATED",
  "ACCEPTED",
  "CLOSED",
]);

export const likelihoodEnum = mysqlEnum("likelihood", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
]);

export const riskImpactTypeEnum = mysqlEnum("risk_impact_type", [
  "FINANCIAL",
  "OPERATIONAL",
  "REPUTATIONAL",
  "LEGAL",
  "SAFETY",
]);

export const severityEnum = mysqlEnum("severity", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const riskLevelEnum = mysqlEnum("risk_level", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const mitigationStrategyEnum = mysqlEnum("mitigation_strategy", [
  "REDUCTION",
  "TRANSFER",
  "ACCEPTANCE",
  "AVOIDANCE",
]);

export const effectivenessRatingEnum = mysqlEnum("effectiveness_rating", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const controlTypeEnum = mysqlEnum("control_type", [
  "PREVENTIVE",
  "DETECTIVE",
  "CORRECTIVE",
  "DISSUASIVE",
]);

export const controlCategoryEnum = mysqlEnum("control_category", [
  "TECHNICAL",
  "ORGANIZATIONAL",
  "PHYSICAL",
]);

export const controlStatusEnum = mysqlEnum("control_status", [
  "PLANNED",
  "IMPLEMENTED",
  "OPERATING",
  "RETIRED",
]);

export const controlFrequencyEnum = mysqlEnum("control_frequency", [
  "CONTINUOUS",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "ANNUALLY",
]);

export const controlEffectivenessEnum = mysqlEnum("control_effectiveness", [
  "EFFECTIVE",
  "PARTIALLY_EFFECTIVE",
  "INEFFECTIVE",
]);

export const complianceStatusEnum = mysqlEnum("compliance_status", [
  "COMPLIANT",
  "NON_COMPLIANT",
  "PARTIALLY_COMPLIANT",
  "NOT_APPLICABLE",
]);

export const frameworkTypeEnum = mysqlEnum("framework_type", [
  "NORM",
  "REFERENTIAL",
  "REGULATION",
  "METHODOLOGY",
]);

export const applicabilityEnum = mysqlEnum("applicability", [
  "MANDATORY",
  "RECOMMENDED",
  "OPTIONAL",
]);

export const mappingStrengthEnum = mysqlEnum("mapping_strength", [
  "FULL",
  "PARTIAL",
  "INDIRECT",
  "NONE",
]);

export const evidenceTypeEnum = mysqlEnum("evidence_type", [
  "DOCUMENT",
  "SCREENSHOT",
  "REPORT",
  "CERTIFICATE",
  "TEST_RESULT",
  "AUDIT_REPORT",
]);

export const policyStatusEnum = mysqlEnum("policy_status", [
  "DRAFT",
  "APPROVED",
  "EFFECTIVE",
  "ARCHIVED",
]);

export const auditTypeEnum = mysqlEnum("audit_type", [
  "INTERNAL",
  "EXTERNAL",
  "COMPLIANCE",
  "TECHNICAL",
]);

export const auditStatusEnum = mysqlEnum("audit_status", [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
]);

export const findingSeverityEnum = mysqlEnum("finding_severity", [
  "CRITICAL",
  "MAJOR",
  "MINOR",
  "INFO",
]);

export const findingTypeEnum = mysqlEnum("finding_type", [
  "OBSERVATION",
  "NON_CONFORMITY",
  "OPPORTUNITY_FOR_IMPROVEMENT",
]);

export const findingStatusEnum = mysqlEnum("finding_status", [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

export const auditFrequencyEnum = mysqlEnum("audit_frequency", [
  "MONTHLY",
  "QUARTERLY",
  "ANNUALLY",
  "BI_ANNUALLY",
]);

export const actionPlanStatusEnum = mysqlEnum("action_plan_status", [
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "CLOSED",
]);

export const actionPriorityEnum = mysqlEnum("action_priority", [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const actionStatusEnum = mysqlEnum("action_status", [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
  "DEFERRED",
]);

export const ebiosStatusEnum = mysqlEnum("ebios_status", [
  "INITIATED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
]);

/**
 * ============================================================================
 * CORE TABLES
 * ============================================================================
 */

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("password_hash"),
  loginMethod: varchar("login_method", { length: 64 }),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * ============================================================================
 * MODULE ORGANISATIONS
 * ============================================================================
 */

export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  industry: varchar("industry", { length: 255 }),
  country: varchar("country", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export const entities = mysqlTable("entities", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: entityTypeEnum.notNull(),
  parentEntityId: int("parent_entity_id"),
  riskOwner: int("risk_owner"),
  complianceOwner: int("compliance_owner"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Entity = typeof entities.$inferSelect;
export type InsertEntity = typeof entities.$inferInsert;

export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  entityId: int("entity_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  manager: int("manager"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

export const processes = mysqlTable("processes", {
  id: int("id").autoincrement().primaryKey(),
  entityId: int("entity_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  owner: int("owner").notNull(),
  category: processCategoryEnum.notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Process = typeof processes.$inferSelect;
export type InsertProcess = typeof processes.$inferInsert;

/**
 * ============================================================================
 * MODULE GOUVERNANCE
 * ============================================================================
 */

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  permissions: json("permissions").$type<string[]>().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

export const userRoles = mysqlTable("user_roles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  roleId: int("role_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  assignedBy: int("assigned_by").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

export const committees = mysqlTable("committees", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  chair: int("chair").notNull(),
  meetingFrequency: meetingFrequencyEnum.notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Committee = typeof committees.$inferSelect;
export type InsertCommittee = typeof committees.$inferInsert;

export const committeeMembers = mysqlTable("committee_members", {
  id: int("id").autoincrement().primaryKey(),
  committeeId: int("committee_id").notNull(),
  userId: int("user_id").notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

export type CommitteeMember = typeof committeeMembers.$inferSelect;
export type InsertCommitteeMember = typeof committeeMembers.$inferInsert;

export const decisions = mysqlTable("decisions", {
  id: int("id").autoincrement().primaryKey(),
  committeeId: int("committee_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  decidedAt: timestamp("decided_at").notNull(),
  decidedBy: int("decided_by").notNull(),
  status: decisionStatusEnum.notNull(),
  relatedRiskIds: json("related_risk_ids").$type<number[]>(),
  relatedControlIds: json("related_control_ids").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Decision = typeof decisions.$inferSelect;
export type InsertDecision = typeof decisions.$inferInsert;

/**
 * ============================================================================
 * MODULE RISQUES
 * ============================================================================
 */

export const risks = mysqlTable("risks", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  entityId: int("entity_id").notNull(),
  processId: int("process_id"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  owner: int("owner").notNull(),
  status: riskStatusEnum.notNull(),
  lastAssessmentDate: timestamp("last_assessment_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Risk = typeof risks.$inferSelect;
export type InsertRisk = typeof risks.$inferInsert;

export const riskScenarios = mysqlTable("risk_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  riskId: int("risk_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  likelihood: likelihoodEnum.notNull(),
  potentialImpact: text("potential_impact").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RiskScenario = typeof riskScenarios.$inferSelect;
export type InsertRiskScenario = typeof riskScenarios.$inferInsert;

export const riskImpacts = mysqlTable("risk_impacts", {
  id: int("id").autoincrement().primaryKey(),
  riskId: int("risk_id").notNull(),
  type: riskImpactTypeEnum.notNull(),
  description: text("description").notNull(),
  estimatedValue: decimal("estimated_value", { precision: 15, scale: 2 }),
  severity: severityEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RiskImpact = typeof riskImpacts.$inferSelect;
export type InsertRiskImpact = typeof riskImpacts.$inferInsert;

export const riskAssessments = mysqlTable("risk_assessments", {
  id: int("id").autoincrement().primaryKey(),
  riskId: int("risk_id").notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  assessedBy: int("assessed_by").notNull(),
  probability: int("probability").notNull(),
  impact: int("impact").notNull(),
  riskLevel: riskLevelEnum.notNull(),
  residualRiskLevel: riskLevelEnum.notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = typeof riskAssessments.$inferInsert;

export const riskMitigations = mysqlTable("risk_mitigations", {
  id: int("id").autoincrement().primaryKey(),
  riskId: int("risk_id").notNull(),
  controlId: int("control_id").notNull(),
  mitigationStrategy: mitigationStrategyEnum.notNull(),
  effectivenessRating: effectivenessRatingEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RiskMitigation = typeof riskMitigations.$inferSelect;
export type InsertRiskMitigation = typeof riskMitigations.$inferInsert;

/**
 * ============================================================================
 * MODULE CONTRÔLES
 * ============================================================================
 */

export const controls = mysqlTable("controls", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  entityId: int("entity_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  owner: int("owner").notNull(),
  objective: text("objective").notNull(),
  type: controlTypeEnum.notNull(),
  category: controlCategoryEnum.notNull(),
  implementationDate: timestamp("implementation_date"),
  status: controlStatusEnum.notNull(),
  frequency: controlFrequencyEnum.notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Control = typeof controls.$inferSelect;
export type InsertControl = typeof controls.$inferInsert;

export const controlAssessments = mysqlTable("control_assessments", {
  id: int("id").autoincrement().primaryKey(),
  controlId: int("control_id").notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  assessedBy: int("assessed_by").notNull(),
  effectiveness: controlEffectivenessEnum.notNull(),
  complianceStatus: complianceStatusEnum.notNull(),
  notes: text("notes"),
  nextAssessmentDate: timestamp("next_assessment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ControlAssessment = typeof controlAssessments.$inferSelect;
export type InsertControlAssessment = typeof controlAssessments.$inferInsert;

export const controlEvidences = mysqlTable("control_evidences", {
  id: int("id").autoincrement().primaryKey(),
  controlId: int("control_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  fileUrl: varchar("file_url", { length: 1000 }),
  uploadedBy: int("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ControlEvidence = typeof controlEvidences.$inferSelect;
export type InsertControlEvidence = typeof controlEvidences.$inferInsert;

/**
 * ============================================================================
 * MODULE CONFORMITÉ
 * ============================================================================
 */

export const complianceFrameworks = mysqlTable("compliance_frameworks", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id"),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: frameworkTypeEnum.notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  url: varchar("url", { length: 1000 }),
  applicability: applicabilityEnum.notNull(),
  isStandard: boolean("is_standard").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type InsertComplianceFramework = typeof complianceFrameworks.$inferInsert;

export const complianceRequirements = mysqlTable("compliance_requirements", {
  id: int("id").autoincrement().primaryKey(),
  frameworkId: int("framework_id").notNull(),
  externalId: varchar("external_id", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  subcategory: varchar("subcategory", { length: 255 }),
  applicableEntities: json("applicable_entities").$type<number[]>(),
  severity: severityEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceRequirement = typeof complianceRequirements.$inferSelect;
export type InsertComplianceRequirement = typeof complianceRequirements.$inferInsert;

export const frameworkMappings = mysqlTable("framework_mappings", {
  id: int("id").autoincrement().primaryKey(),
  sourceFrameworkId: int("source_framework_id").notNull(),
  targetFrameworkId: int("target_framework_id").notNull(),
  sourceRequirementId: int("source_requirement_id").notNull(),
  targetRequirementId: int("target_requirement_id").notNull(),
  mappingStrength: mappingStrengthEnum.notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FrameworkMapping = typeof frameworkMappings.$inferSelect;
export type InsertFrameworkMapping = typeof frameworkMappings.$inferInsert;

export const controlComplianceMappings = mysqlTable("control_compliance_mappings", {
  id: int("id").autoincrement().primaryKey(),
  controlId: int("control_id").notNull(),
  requirementId: int("requirement_id").notNull(),
  mappingStrength: mappingStrengthEnum.notNull(),
  evidence: text("evidence"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ControlComplianceMapping = typeof controlComplianceMappings.$inferSelect;
export type InsertControlComplianceMapping = typeof controlComplianceMappings.$inferInsert;

export const complianceEvidences = mysqlTable("compliance_evidences", {
  id: int("id").autoincrement().primaryKey(),
  requirementId: int("requirement_id").notNull(),
  controlId: int("control_id"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  type: evidenceTypeEnum.notNull(),
  fileUrl: varchar("file_url", { length: 1000 }),
  uploadedBy: int("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  expiryDate: timestamp("expiry_date"),
  validatedBy: int("validated_by"),
  validatedAt: timestamp("validated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceEvidence = typeof complianceEvidences.$inferSelect;
export type InsertComplianceEvidence = typeof complianceEvidences.$inferInsert;

export const compliancePolicies = mysqlTable("compliance_policies", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  owner: int("owner").notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  approvedBy: int("approved_by"),
  approvedAt: timestamp("approved_at"),
  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  status: policyStatusEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CompliancePolicy = typeof compliancePolicies.$inferSelect;
export type InsertCompliancePolicy = typeof compliancePolicies.$inferInsert;

export const policyRequirements = mysqlTable("policy_requirements", {
  id: int("id").autoincrement().primaryKey(),
  policyId: int("policy_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  mandatory: boolean("mandatory").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PolicyRequirement = typeof policyRequirements.$inferSelect;
export type InsertPolicyRequirement = typeof policyRequirements.$inferInsert;

export const complianceAssessments = mysqlTable("compliance_assessments", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  frameworkId: int("framework_id").notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  assessedBy: int("assessed_by").notNull(),
  totalRequirements: int("total_requirements").notNull(),
  satisfiedRequirements: int("satisfied_requirements").notNull(),
  partiallyRequirements: int("partially_requirements").notNull(),
  unsatisfiedRequirements: int("unsatisfied_requirements").notNull(),
  compliancePercentage: decimal("compliance_percentage", { precision: 5, scale: 2 }).notNull(),
  gapAnalysis: json("gap_analysis").$type<Record<string, unknown>>(),
  notes: text("notes"),
  nextAssessmentDate: timestamp("next_assessment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceAssessment = typeof complianceAssessments.$inferSelect;
export type InsertComplianceAssessment = typeof complianceAssessments.$inferInsert;

/**
 * ============================================================================
 * MODULE AUDITS
 * ============================================================================
 */

export const audits = mysqlTable("audits", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  entityId: int("entity_id").notNull(),
  type: auditTypeEnum.notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  auditLeader: int("audit_leader").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: auditStatusEnum.notNull(),
  reportUrl: varchar("report_url", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

export const auditScopes = mysqlTable("audit_scopes", {
  id: int("id").autoincrement().primaryKey(),
  auditId: int("audit_id").notNull(),
  entityIds: json("entity_ids").$type<number[]>(),
  processIds: json("process_ids").$type<number[]>(),
  controlIds: json("control_ids").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AuditScope = typeof auditScopes.$inferSelect;
export type InsertAuditScope = typeof auditScopes.$inferInsert;

export const auditFindings = mysqlTable("audit_findings", {
  id: int("id").autoincrement().primaryKey(),
  auditId: int("audit_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  severity: findingSeverityEnum.notNull(),
  findingType: findingTypeEnum.notNull(),
  relatedControlId: int("related_control_id"),
  relatedRiskId: int("related_risk_id"),
  recommendation: text("recommendation").notNull(),
  status: findingStatusEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AuditFinding = typeof auditFindings.$inferSelect;
export type InsertAuditFinding = typeof auditFindings.$inferInsert;

export const auditSchedules = mysqlTable("audit_schedules", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  auditType: auditTypeEnum.notNull(),
  frequency: auditFrequencyEnum.notNull(),
  nextScheduledDate: timestamp("next_scheduled_date").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AuditSchedule = typeof auditSchedules.$inferSelect;
export type InsertAuditSchedule = typeof auditSchedules.$inferInsert;

/**
 * ============================================================================
 * MODULE ACTIONS
 * ============================================================================
 */

export const actionPlans = mysqlTable("action_plans", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  owner: int("owner").notNull(),
  relatedAuditId: int("related_audit_id"),
  relatedComplianceFrameworkId: int("related_compliance_framework_id"),
  startDate: timestamp("start_date").notNull(),
  targetCompletionDate: timestamp("target_completion_date").notNull(),
  status: actionPlanStatusEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ActionPlan = typeof actionPlans.$inferSelect;
export type InsertActionPlan = typeof actionPlans.$inferInsert;

export const actions = mysqlTable("actions", {
  id: int("id").autoincrement().primaryKey(),
  actionPlanId: int("action_plan_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  owner: int("owner").notNull(),
  priority: actionPriorityEnum.notNull(),
  status: actionStatusEnum.notNull(),
  dueDate: timestamp("due_date").notNull(),
  completionDate: timestamp("completion_date"),
  relatedFindingId: int("related_finding_id"),
  relatedRiskId: int("related_risk_id"),
  relatedControlId: int("related_control_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Action = typeof actions.$inferSelect;
export type InsertAction = typeof actions.$inferInsert;

export const actionComments = mysqlTable("action_comments", {
  id: int("id").autoincrement().primaryKey(),
  actionId: int("action_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ActionComment = typeof actionComments.$inferSelect;
export type InsertActionComment = typeof actionComments.$inferInsert;

export const actionEvidences = mysqlTable("action_evidences", {
  id: int("id").autoincrement().primaryKey(),
  actionId: int("action_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  fileUrl: varchar("file_url", { length: 1000 }),
  uploadedBy: int("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ActionEvidence = typeof actionEvidences.$inferSelect;
export type InsertActionEvidence = typeof actionEvidences.$inferInsert;

/**
 * ============================================================================
 * MODULE EBIOS RM
 * ============================================================================
 */

export const ebiosStudies = mysqlTable("ebios_studies", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull(),
  entityId: int("entity_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: ebiosStatusEnum.notNull(),
  scope: text("scope").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type EbiosStudy = typeof ebiosStudies.$inferSelect;
export type InsertEbiosStudy = typeof ebiosStudies.$inferInsert;

export const ebiosScenarios = mysqlTable("ebios_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("study_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  threatActors: json("threat_actors").$type<string[]>().notNull(),
  threatVectors: json("threat_vectors").$type<string[]>().notNull(),
  potentialImpacts: json("potential_impacts").$type<string[]>().notNull(),
  likelihood: likelihoodEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type EbiosScenario = typeof ebiosScenarios.$inferSelect;
export type InsertEbiosScenario = typeof ebiosScenarios.$inferInsert;

export const ebiosScenarioRisks = mysqlTable("ebios_scenario_risks", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: int("scenario_id").notNull(),
  riskId: int("risk_id").notNull(),
  mappingNotes: text("mapping_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type EbiosScenarioRisk = typeof ebiosScenarioRisks.$inferSelect;
export type InsertEbiosScenarioRisk = typeof ebiosScenarioRisks.$inferInsert;
