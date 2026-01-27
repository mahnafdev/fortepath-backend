import { createAccessControl, Statements } from "better-auth/plugins";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Statement
export const statement: Statements = {
	...defaultStatements,
	booking: ["create", "read", "update", "delete"],
	review: ["create", "read", "update", "delete"],
	category: ["create", "read", "update", "delete"],
};

// Define access controller
export const ac = createAccessControl(statement);

// User Roles

export const student = ac.newRole({
	booking: ["create", "read", "update"],
	category: ["read"],
	review: ["create", "read"],
});

export const tutor = ac.newRole({
	booking: ["read", "update"],
	category: ["create", "read", "update", "delete"],
	review: ["read"],
});

export const admin = ac.newRole({
	...adminAc.statements,
	booking: ["create", "read", "update", "delete"],
	review: ["create", "read", "update", "delete"],
	category: ["create", "read", "update", "delete"],
});
