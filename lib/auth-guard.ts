import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth-options";

type ApiHandler = (
    req: NextRequest,
    context: { params: Record<string, string | string[]> }
) => Promise<NextResponse | Response>;

export function AuthGuard(handler: ApiHandler): ApiHandler {
    return async (req, context) => {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized: Please sign in to access this API" },
                { status: 401 },
            );
        }

        return handler(req, context);
    };
}