export function isUser(req, res, next) {
    if (req.user.role === "user" || req.user.role === "premium") return next()

    return res.status(401).send({ error: 'Authentication error, please try again' })
}

export function isAdmin(req, res, next) {
    if (req.user.role === "admin") return next()

    return res.status(403).send({ error: 'You are not an admin, permission required' })
}
