import { NextFunction, Request, Response  } from 'express';

const { v4: uuidv4 } = require('uuid');


// In production, we would use an actual database.
// This object will act as temporary storage for our user object.
const EPHEMERAL_DB: Record<string, { id: string, name: string; email: string }> = {};

const getUser = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (EPHEMERAL_DB[id]) {
        // A 200 response is sent when things have gone successfully.
        res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
    } else {
        // A 400 request means a request has been made that cannot be carried out.
        // Basically, this is an error on the user's part, and their query needs to be modified.
        res.status(400).send({ error: 'No user found' });
    }
};

const updateUser = (req: Request, res: Response, next: NextFunction): void => {
    const { id, name, email } = req.body;

    if (EPHEMERAL_DB[id]) {
        EPHEMERAL_DB[id] = {
            ...EPHEMERAL_DB[id],
            ...(name || email
                ? {
                      name: name || EPHEMERAL_DB[id].name,
                      email: email || EPHEMERAL_DB[id].email,
                  }
                : {}),
        };
        res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
    } else {
        res.status(400).send({ error: 'No user found' });
    }
};

const removeUser = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (EPHEMERAL_DB[id]) {
        delete EPHEMERAL_DB[id];
        res.status(200).send({ message: `User with id: ${id} removed` });
    } else {
        res.status(400).send({ error: 'No user found' });
    }
};

const createUser = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email } = req.body;
    const id = uuidv4();

    EPHEMERAL_DB[id] = { name, email, id };

    res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
};

export { getUser, updateUser, removeUser, createUser };
