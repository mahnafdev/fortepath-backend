import { createAccessControl, Statements } from "better-auth/plugins";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Statement
export const statement: Statements = {
	...defaultStatements,
	booking: ["create", "read", "update"],
	review: ["create", "read", "delete"],
	category: ["create", "read", "update", "delete"],
	tutorCategory: ["create", "read", "update", "delete"],
};

// Define access controller
export const ac = createAccessControl(statement);

// User Roles

export const student = ac.newRole({
	booking: ["create", "read", "update"],
	category: ["read"],
	review: ["create", "read"],
	tutorCategory: ["read"],
});

export const tutor = ac.newRole({
	booking: ["read", "update"],
	category: ["create", "read", "update"],
	review: ["read"],
	tutorCategory: ["create", "read", "delete"],
});

export const admin = ac.newRole({
	...adminAc.statements,
	booking: ["create", "read", "update"],
	category: ["create", "read", "update", "delete"],
	review: ["create", "read", "delete"],
	tutorCategory: ["create", "read", "update", "delete"],
});
