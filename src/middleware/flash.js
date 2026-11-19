
/**
 * Flash Message Middleware
 * Stores temporary messages in the session.
 */

const flashMiddleware = (req, res, next) => {
    req.flash = function (type, message) {

        // Initialize flash storage
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // Store a message
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return;
        }

        // Retrieve messages of one type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // Retrieve all messages
        const allMessages = req.session.flash;

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

// Make flash available to EJS templates
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
};

// Combined middleware
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;
