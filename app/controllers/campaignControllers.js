
import dbQuery from '../db/dbQuery.js';
import { errorMessage, status, successMessage } from '../helpers/status.js';


async function getAllCampaigns(req, res) {
    console.log("fetching campaigns");
    const { source } = req.params;
    let getQuery = '';

    try {
        if (source) {
            getQuery = `SELECT * FROM campaign INNER JOIN source ON campaign.source_id = source.id WHERE source.name AND campaign.status = true`;
        }
        getQuery = `SELECT * FROM campaign`;
        const { rows } = await dbQuery.query(getQuery);
        successMessage.data = rows;
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while campaigns';
        res.status(status.error).send(errorMessage);
    }
}



async function createCampaign(req, res) {
    try {
        const { theme_id, source_id, name, description, gift_required, gift_url, destination_url } = req.body;

        const createQuery = `INSERT INTO campaign(name, description, gift_required, gift_url, destination_url, theme_id, source_id) VALUES( $1, $2, $3, $4, $5, $6, $7) returning *`

        const { rows } = await dbQuery.query(createQuery, [name, description, gift_required, gift_url, destination_url, theme_id, source_id]);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while creating campaigns';
        res.status(status.error).send(errorMessage);
    }
}

async function updateCampaign(req, res) {

    try {
        const { campaignId } = req.params;

        const getCampaignQuery = `SELECT * FROM campaign WHERE id = $1`;
        const campaignResponse = await dbQuery.query(getCampaignQuery, [campaignId]);

        if (campaignResponse) {
            let savedCampaign = campaignResponse.rows[0];
            let newCampaign = { ...savedCampaign, ...req.body };
            const { theme_id, source_id, name, description, status, gift_required, gift_url, destination_url } = newCampaign;

            const updateQuery = `UPDATE campaign SET name=$1, description=$2, status=$3, gift_required=$4, git_url=$5, destination_url=$6, theme_id=$7, source_id=$8
            WHERE id=$9 returning *`;

            const updateResponse = await dbQuery.query(updateQuery, [name, description, status, gift_required, gift_url, destination_url, theme_id, source_id, campaignId]);
            successMessage.data = updateResponse.rows[0];
            res.status(status.success).send(successMessage);
        } else {
            throw new Error('No campaign exists to update');
        }
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error while updating campaigns';
        res.status(status.error).send(errorMessage);
    }
}


export {
    getAllCampaigns,
    createCampaign,
    updateCampaign
}