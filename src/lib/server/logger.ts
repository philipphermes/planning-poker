import {appendFileSync} from "node:fs";

export const logger = (() => {
    function saveLogToFile(message: string) {
        try {
            appendFileSync('data/app.log', `${message}\n`);
        } catch (err) {
            console.error('Error writing to log file:', err);
        }
    }

    function isTest() {
        return process.env.NODE_ENV === 'test'
    }

    function isDevelopment() {
        return process.env.NODE_ENV === 'development'
    }

    return {
        error(message: string) {
            if (!isTest()) {
                message = `[ERROR] ${message}`;
                console.error(message);
                saveLogToFile(message);
            }
        },
        warn(message: string) {
            if (!isTest()) {
                message = `[WARN] ${message}`;
                console.warn(message);
                saveLogToFile(message);
            }
        },
        info(message: string) {
            if (!isTest()) {
                message = `[INFO] ${message}`;
                console.info(message);
                saveLogToFile(message);
            }
        },
        debug(message: string) {
            if (isDevelopment()) {
                console.debug(`[DEBUG] ${message}`);
            }
        }
    };
})();