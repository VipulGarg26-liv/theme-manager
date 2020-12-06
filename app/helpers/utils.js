import { errorMessage, status } from "./status.js";

export const handleError = (error, res) => {
    console.log(error.message);
    errorMessage.error = error.message;
    res.status(status.error).send(errorMessage);
}