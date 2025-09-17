import express, {Application, Request, Response} from "express";

export default interface HttpServer {
    register: (method: string, url: string, callback: Function) => void;
    listen: (port: number) => void;
}

export class ExpressAdapter implements HttpServer {
    app: Application;

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    register(method: string, url: string, callback: Function) {
        this.app[method as keyof Application](url, async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (e: any) {
                return res.status(422).json({error: e.message});
            }
        });
    }

    listen(port: number) {
        this.app.listen(port);
    }
}