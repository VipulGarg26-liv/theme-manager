
import dbQuery from '../db/dbQuery.js';
import { errorMessage, status, successMessage } from '../helpers/status.js';
import { handleError } from '../helpers/utils.js';

const getThemeQuery = `SELECT * FROM theme WHERE id = $1`;

async function getAllThemes(req, res) {
    console.log("fetching themes");
    try {
        const getQuery = `SELECT * FROM theme`;
        const { rows } = await dbQuery.query(getQuery);
        successMessage.data = rows;
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function getThemeInfo(req, res) {
    try {
        const { themeId } = req.params;
        const { rows } = await dbQuery.query(getThemeQuery, [themeId]);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function createNewTheme(req, res) {
    try {
        console.log('Creating Theme');
        const { name, description, data = '', logo_url, background_url, gift_url } = req.body;
        const postQuery = `INSERT INTO theme(name, description, data, logo_url, background_url, gift_url) VALUES( $1, $2, $3, $4, $5, $6) returning *`;
        const { rows } = await dbQuery.query(postQuery, [name, description, data, logo_url, background_url, gift_url]);

        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function updateTheme(req, res) {
    try {
        const { themeId } = req.params;
        console.log("updating theme for id ", themeId);

        const { rows } = await dbQuery.query(getThemeQuery, [themeId]);
        let savedThemeData = rows[0];

        const newThemeData = { ...savedThemeData, ...req.body };
        const { name, description, data, logo_url, background_url, gift_url } = newThemeData;

        const updateQuery = `UPDATE theme SET name=$1, description=$2, data=$3, logo_url=$4, background_url=$5, gift_url=$6  WHERE id=$7 returning *`;
        const { rows: rows2 } = await dbQuery.query(updateQuery, [name, description, data, logo_url, background_url, gift_url, themeId]);
        successMessage.data = rows2[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}


export {
    getAllThemes,
    getThemeInfo,
    createNewTheme,
    updateTheme
}