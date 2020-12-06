
import dbQuery from '../db/dbQuery.js';
import { errorMessage, status, successMessage } from '../helpers/status.js';
import { handleError } from '../helpers/utils.js';

const getSourceQuery = `SELECT * FROM source WHERE id = $1`;

async function getAllSources(req, res) {
    console.log("fetching sources");
    try {
        const getQuery = `SELECT * FROM source`;
        const { rows } = await dbQuery.query(getQuery);
        successMessage.data = rows;
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function getSourceInfo(req, res) {
    const { sourceId } = req.params;
    console.log("fetching source for id - ", sourceId);
    try {
        const { rows } = await dbQuery.query(getSourceQuery, [sourceId]);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function createSource(req, res) {
    try {
        const { name, title, description, source_url } = req.body;
        const postQuery = `INSERT INTO source(name, title, description, source_url) VALUES( $1, $2, $3, $4) returning *`;
        const { rows } = await dbQuery.query(postQuery, [name, title, description, source_url]);
        console.log(rows);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function updateSource(req, res) {
    try {
        const { sourceId } = req.params;
        console.log("updating source for id ", sourceId);

        const { rows } = await dbQuery.query(getSourceQuery, [sourceId]);
        let savedSourceData = rows[0];

        const newSourceData = { ...savedSourceData, ...req.body };
        const { name, title, description, source_url } = newSourceData;

        const updateQuery = `UPDATE source SET name=$1, title=$2,description=$3, source_url=$4 WHERE id=$5 returning *`;
        const { rows: rows2 } = await dbQuery.query(updateQuery, [name, title, description, source_url, sourceId]);
        successMessage.data = rows2[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}


export {
    getAllSources,
    getSourceInfo,
    createSource,
    updateSource
}