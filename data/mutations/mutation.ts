import { IValidationResult } from './validation-result';

/**
 * Describes a mutation for an specific type
 */
export interface IMutation<T> {

    /** 
     * Activity name
     * */
    name: string;

    /** 
     * An optional description for your activity
     * @optional
     */
    description?: string;

    /** 
     * Activity related to this mutation
     */
    activity: string;

    /**
     * Method called only when authorization is succesful to validate 
     * if the input data for the activity is valid
     */
    validate(): Promise<IValidationResult>

     /**
     * Executes the logic for this activity
     */
    run(): Promise<T>;

    /**
     * Specifies if an attempt to execute this mutation should be logged
     */
    log: boolean;

    /**
     * Specifies if the changes on this mutation should be audit and saved
     * to the database so the changes can audited at a later time
     */
    audit: boolean;
}