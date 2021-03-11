"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("../api"));
const config_1 = __importDefault(require("../config"));
const celebrate_1 = require("celebrate");
exports.default = ({ app }) => {
    app.get('/status', (_req, res) => {
        res.status(200).end();
    });
    app.head('/status', (_req, res) => {
        res.status(200).end();
    });
    app.enable('trust proxy');
    app.use(cors_1.default());
    app.use(require('method-override')());
    app.use(body_parser_1.default.json());
    app.use(config_1.default.api.prefix, api_1.default());
    app.use((_req, _res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    app.use((err, _req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res
                .status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });
    app.use(celebrate_1.errors());
    app.use((err, _req, res, _next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            errors: {
                message: err.message,
            },
        });
    });
};
