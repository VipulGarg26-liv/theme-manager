
import dbQuery from '../db/dbQuery.js';
import { errorMessage, status, successMessage } from '../helpers/status.js';

const getThemeQuery = `SELECT * FROM theme WHERE id = $1`;

async function getAllThemes(req, res) {
    console.log("fetching themes");
    try {
        const getQuery = `SELECT * FROM theme`;
        const { rows } = await dbQuery.query(getQuery);
        successMessage.data = rows;
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while fetching themes';
        res.status(status.error).send(errorMessage);
    }
}

async function getThemeInfo(req, res) {
    try {
        const { themeId } = req.params;
        const { rows } = await dbQuery.query(getThemeQuery, [themeId]);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while fetching themes';
        res.status(status.error).send(errorMessage);
    }
}

async function createNewTheme(req, res) {
    try {
        const { name, type, data } = req.body;
        const postQuery = `INSERT INTO theme(name, type, data) VALUES( $1, $2, $3) returning *`;
        const { rows } = await dbQuery.query(postQuery, [name, type, data]);

        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while creating theme';
        res.status(status.error).send(errorMessage);
    }
}

async function updateTheme(req, res) {
    try {
        const { themeId } = req.params;
        console.log("updating theme for id ", sourceId);

        const { rows } = await dbQuery.query(getThemeQuery, [themeId]);
        let savedThemeData = rows[0];

        const newThemeData = { ...savedThemeData, ...req.body };
        const { name, type, data } = newThemeData;

        const updateQuery = `UPDATE theme SET name=$1, type=$2, data=$3 WHERE id=$4 returning *`;
        const { rows: rows2 } = await dbQuery.query(updateQuery, [name, type, data, themeId]);
        successMessage.data = rows2[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while updating theme info';
        res.status(status.error).send(errorMessage);
    }
}


export {
    getAllThemes,
    getThemeInfo,
    createNewTheme,
    updateTheme
}