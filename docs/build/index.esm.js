import { A as ActiveRouter } from './active-router-a58f7217.js';
import './match-path-760e1797.js';
import './index-513c2c0d.js';
import './location-utils-fea12957.js';

function injectHistory(Component) {
    ActiveRouter.injectProps(Component, ['history', 'location']);
}
