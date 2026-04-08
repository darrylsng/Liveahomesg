const axios = require('axios');

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * Fetch full lead field data from Facebook Graph API.
 * Requires a Page Access Token with ads_management or leads_retrieval permission.
 */
async function getLeadDetails(leadgenId) {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FB_PAGE_ACCESS_TOKEN is not set');
  }

  const response = await axios.get(`${GRAPH_API_BASE}/${leadgenId}`, {
    params: {
      fields: 'field_data,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id',
      access_token: token,
    },
    timeout: 10000,
  });

  return response.data;
}

/**
 * Subscribe a page to leadgen webhook events.
 * Call this once during setup (or from an admin endpoint).
 */
async function subscribePage(pageId) {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FB_PAGE_ACCESS_TOKEN is not set');
  }

  const response = await axios.post(
    `${GRAPH_API_BASE}/${pageId}/subscribed_apps`,
    null,
    {
      params: {
        subscribed_fields: 'leadgen',
        access_token: token,
      },
    }
  );

  return response.data;
}

module.exports = { getLeadDetails, subscribePage };
