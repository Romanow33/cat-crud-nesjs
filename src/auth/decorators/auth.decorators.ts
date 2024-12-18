import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { RolesDecorator } from "./roles.decorator";
import { Role } from "../../common/enums/role.enum";

export function AuthDecorator(role: Role) {

    return applyDecorators(
        RolesDecorator(role),
        UseGuards(AuthGuard, RolesGuard)
    )
}