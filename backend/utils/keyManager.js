/**
 * KEY MANAGEMENT & SECURITY CONCEPTS EXPLAINED
 * ============================================
 * 
 * 1. FORWARD SECRECY (Implied by current architecture)
 * ----------------------------------------------------
 * Concept: Compromise of long-term keys does not compromise past session keys.
 * Implementation: 
 * - We use ephemeral JWTs for session management. Even if the database is hacked
 *   and password hashes are stolen, the hacker cannot decrypt past traffic
 *   because they don't have the signed JWTs that were used in those sessions.
 * - When we hash the "Secret Key" (2nd factor) immediately upon registration,
 *   we ensure that we never store the raw key.
 * 
 * 2. BACKWARD SECRECY
 * -------------------
 * Concept: Compromise of current keys does not allow derivation of future keys
 *          or previous keys.
 * Implementation:
 * - We use bcrypt (Salted One-Way Hashing).
 * - If the DB is compromised, the attacker finds:
 *      $2a$10$MixedSaltHashString...
 * - They cannot reverse this to find the original "Secret Key" or "Password".
 * - Therefore, they cannot generate valid future logins without cracking the hash.
 * 
 * 3. ONE-WAY HASHING
 * ------------------
 * - We use `bcrypt.hash()` which is a one-way function suitable for passwords.
 * - Input: "MySecret123" -> Output: "HashX"
 * - It is computationally infeasible to go "HashX" -> "MySecret123".
 * 
 * 4. REVERSE HASH VERIFICATION (COMPARISON)
 * -----------------------------------------
 * - To verify a user, we do NOT decrypt the stored hash.
 * - We take the User's Input -> Hash it -> Compare with Stored Hash.
 * - `bcrypt.compare(input, hash)` handles this securely using timing-safe comparison
 *   to prevent Timing Attacks.
 */

const explainSecurity = () => {
    console.log("Security concepts are documented in this file.");
};

module.exports = explainSecurity;
