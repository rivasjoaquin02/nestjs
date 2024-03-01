import { Injectable } from "@nestjs/common";
import { Role } from "src/auth/role.enum";

interface IsAuthorizedParam {
	currentRole: Role;
	requieredRole: Role;
}

@Injectable()
export class AccessControlService {
	private hierarchieis: Array<Map<string, number>> = [];
	private priority: number = 1;

	constructor() {
		this.buildRoles([Role.Guest, Role.User, Role.Admin]);
	}

	private buildRoles(roles: Role[]) {
		const hierarchy: Map<string, number> = new Map();

		for (const role of roles) {
			hierarchy.set(role, this.priority);
			this.priority++;
		}

		this.hierarchieis.push(hierarchy);
	}

	public isAuthorized({ currentRole, requieredRole }: IsAuthorizedParam) {
		for (const hierarchy of this.hierarchieis) {
			const priority = hierarchy.get(currentRole);
			const requiredPriority = hierarchy.get(requieredRole);
			if (priority && requiredPriority && priority >= requiredPriority)
				return true;
		}
		return false;
	}
}
