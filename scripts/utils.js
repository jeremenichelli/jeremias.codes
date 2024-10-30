const { CONTEXT, DEPLOY_PRIME_URL } = process.env;

export const environment = process.env.NODE_ENV || 'production';
export const isProduction = environment === 'production';
export const isPreview = CONTEXT === 'deploy-preview';

export const productionUrl = 'https://jeremias.codes';
/**
 * @type string
 */
export const deployUrl = DEPLOY_PRIME_URL;
