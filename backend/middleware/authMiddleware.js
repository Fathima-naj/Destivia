
import { getAuth } from "@clerk/express";
const clerkAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.auth = auth;
  next();
};

export default clerkAuth
