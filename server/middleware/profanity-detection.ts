import Filter from 'npm:bad-words';
import { ServerFunction } from '../structure/app/app.ts';


/**
 * Returns a middleware function that checks if the body keys contain profanity
 * @date 1/9/2024 - 1:19:08 PM
 */
export const detect = (...keys: string[]): ServerFunction => {
    const filter = new Filter();
    return (req, res, next) => {
        for (const key of keys) {
            if (filter.isProfane(req.body ? req.body[key] : '')) {
                return res.sendStatus('profanity:detected');
            }
        }
        next();
    };
};
