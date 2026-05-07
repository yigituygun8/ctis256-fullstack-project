/**
 * Checks if a password is a bcrypt hash
 * @param {*} password 
 * @returns true if the password is a bcrypt hash, false otherwise
 * This function is used to determine whether the password stored in the database is hashed or not. 
 * If the password starts with "$2", it is considered a bcrypt hash. 
 */
export function isBcryptHash(password) {
    return typeof password === "string" && password.startsWith("$2");
}
// We wrote this function because some of the users (seed data) in the database have unhashed passwords while newly added ones do.