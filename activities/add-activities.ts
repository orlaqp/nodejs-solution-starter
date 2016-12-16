import {
    createAccountActivity,
    getAccountActivity
} from './master';
import { getEnforcerConfig } from '../lib/enforcer';

export function addActivities() {
    let enforcerConfig = getEnforcerConfig();

    enforcerConfig.addActivities([
        createAccountActivity,
        getAccountActivity
    ]);
}