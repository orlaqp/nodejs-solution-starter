import seedAccounts from './accounts';
import seedCustomer1 from './customer1';
import seedRoles from './roles';

export default function seed() {
    seedAccounts();
    seedCustomer1();
    // seedRoles();
}