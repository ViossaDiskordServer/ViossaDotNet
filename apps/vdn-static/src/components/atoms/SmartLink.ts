import type { SmartDest } from "@/utils/smart-dest";

export interface SmartLinkProps {
	to: SmartDest;
	newTab?: boolean;
	covert?: boolean;
}
