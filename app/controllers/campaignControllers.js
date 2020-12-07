
import dbQuery from '../db/dbQuery.js';
import { errorMessage, status, successMessage } from '../helpers/status.js';
import { handleError } from '../helpers/utils.js';


async function getAllCampaigns(req, res) {
    console.log("fetching campaigns");
    const { source_url, status: campaignStatus } = req.query;
    let getQuery = `SELECT camp.id AS campaign_id, camp.name AS campaign_name,
    camp.status AS campaign_status, camp.gift_required AS campaign_gift_required,
    camp.description AS campaign_description, camp.gift_url AS campaign_gift_url,
    camp.destination_url AS campaign_destination_url,
    sr.id AS source_id, sr.name AS source_name, sr.title AS source_title, 
    sr.source_url AS source_url, sr.description AS source_description,
    th.id AS theme_id, th.name AS theme_name, th.description AS theme_description,
    th.background_url AS theme_background_url, th.logo_url AS theme_logo_url,
    th.gift_url AS theme_gift_url
    FROM campaign camp 
    INNER JOIN source sr ON camp.source_id = sr.id 
    INNER JOIN theme th ON camp.theme_id = th.id`,
        queryArgs = [];

    try {
        if (source_url) {
            getQuery += ` WHERE sr.source_url=$1`;

            queryArgs.push(source_url);
        }

        if (source_url && campaignStatus) {
            getQuery += ` AND camp.status = $2`;
            queryArgs.push(campaignStatus);
        }

        if (!source_url && campaignStatus) {
            getQuery += ` WHERE camp.status = $1`;
            queryArgs.push(campaignStatus);
        }

        const { rows } = await dbQuery.query(getQuery, queryArgs);

        console.log(rows);
        let responseData = rows.map((campaignRow) => {
            let campaignData = {}, sourceData = {}, themeData = {};
            Object.entries(campaignRow).forEach(([key, value]) => {
                let keyToSave = key.substr(key.indexOf('_') + 1);
                if (key.includes('campaign')) {
                    campaignData[keyToSave] = value;
                } else if (key.includes('source')) {
                    sourceData[keyToSave] = value;
                } else if (key.includes('theme')) {
                    themeData[keyToSave] = value;
                }
            });
            campaignData.source = sourceData;
            campaignData.theme = themeData;
            return campaignData;

        })
        successMessage.data = responseData;
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}



async function createCampaign(req, res) {
    try {
        console.log(req.body);
        const { theme_id, source_id, name, status: campaignStatus, description, gift_required, gift_url, destination_url } = req.body;

        const createQuery = `INSERT INTO campaign(name, description, gift_required, gift_url, destination_url, theme_id, source_id, status)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning * `

        const { rows } = await dbQuery.query(createQuery, [name, description, gift_required, gift_url, destination_url, theme_id, source_id, campaignStatus]);
        successMessage.data = rows[0];
        res.status(status.success).send(successMessage);
    } catch (error) {
        handleError(error, res);
    }
}

async function updateCampaign(req, res) {
    console.log("Updating Campaign");
    try {
        const { campaignId } = req.params;

        const getCampaignQuery = `SELECT * FROM campaign WHERE id = $1`;
        const campaignResponse = await dbQuery.query(getCampaignQuery, [campaignId]);

        if (campaignResponse) {
            let savedCampaign = campaignResponse.rows[0];

            if (savedCampaign.status == 'active' && Object.keys(req.body).length > 1) {
                console.log("Cannot update campaign as it active")
                throw new Error("Cannot change active campaign");
            }

            if (req.body.status.toLowerCase() == 'active') {
                let updateMatchingCampaignsQuery = `UPDATE campaign SET status='inactive' WHERE source_id=$1 AND id != $2`;
                let response = await dbQuery.query(updateMatchingCampaignsQuery, [savedCampaign.source_id, campaignId]);
                console.log('All active campaigns for matching source made inative');
            }
            console.log("Campaign can be updated");
            let newCampaign = { ...savedCampaign, ...req.body };
            const { theme_id, source_id, name, description, status: campaignStatus, gift_required, gift_url, destination_url } = newCampaign;

            const updateQuery = `UPDATE campaign SET name = $1, description = $2, status = $3, gift_required = $4, gift_url = $5, destination_url = $6, theme_id = $7, source_id = $8
            WHERE id = $9 returning * `;

            const updateResponse = await dbQuery.query(updateQuery, [name, description, campaignStatus, gift_required, gift_url, destination_url, theme_id, source_id, campaignId]);
            successMessage.data = updateResponse.rows[0];
            res.status(status.success).send(successMessage);
        } else {
            console.log("No matching campaign exits");
            throw new Error('No campaign exists to update');
        }
    } catch (error) {
        handleError(error, res);
    }
}


export {
    getAllCampaigns,
    createCampaign,
    updateCampaign
}