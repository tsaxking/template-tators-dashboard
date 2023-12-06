import Filter from 'npm:bad-words';
import { Req, Res, Next, ServerFunction } from "../structure/app.ts";

const filter = new Filter();


export const detect = (...keys: string[]): ServerFunction => {
    return (req: Req, res: Res, next: Next) => {
        for (const key of keys) {
            if (filter.isProfane(req.body[key])) {
                return res.sendStatus('profanity');
            }
        }
        next();
    }
}