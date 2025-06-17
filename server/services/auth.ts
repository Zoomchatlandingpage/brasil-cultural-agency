import type { Request } from "express";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export async function createSession(req: AuthenticatedRequest, userId: number): Promise<void> {
  // Simple session implementation - in production, use proper session store
  req.session = req.session || {};
  (req.session as any).userId = userId;
}

export async function destroySession(req: AuthenticatedRequest): Promise<void> {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: any, next: any) {
  if (!req.session || !(req.session as any).userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  req.userId = (req.session as any).userId;
  next();
}
