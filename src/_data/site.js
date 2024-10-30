import { deployUrl, isPreview, productionUrl } from '../../scripts/utils.js';

const url = isPreview ? deployUrl : productionUrl;

export default {
  title: 'Jeremias Menichelli',
  description:
    'Personal site of Jeremias Menichelli — Curious mind, developer and writer',
  author: {
    name: 'Jeremias Menichelli',
    image: `${url}/assets/images/og-me.jpg`
  },
  url,
  logo: `${url}/assets/images/og-me.png`
};
