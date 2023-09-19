import { Request, Response, NextFunction } from 'express';
import { parse } from 'csv-parse';
import fs from 'fs';

const uploadCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { file } = req as any; // Assuming you've set up file uploads correctly in your Express app

        const json: any[] = [];

        // We want to wait for the file to be parsed before we send a response
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(`./${file.path}`)
                .pipe(parse({ delimiter: ",", from_line: 1 }))
                .on("data", (row) => {
                    json.push(row);
                })
                .on("end", () => {
                    resolve();
                })
                .on("error", (err) => {
                    reject(err);
                });
        });

        res.status(200).send({ data: json });
    } catch (err) {
        res.status(500).send({ message: "File upload failed", err: err.message });
    } finally {
        // We want to clean up the files after we are done with them
        const files = fs.readdirSync("./temp");
        files.forEach((file) => {
            fs.unlinkSync(`./temp/${file}`);
        });
    }
};

export { uploadCsv };
