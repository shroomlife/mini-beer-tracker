/**
 * Password-Hashing via Bun's eingebautes `Bun.password`.
 * Default-Algorithmus ist Argon2id.
 *
 * Namespacing: `hashUserPassword` / `verifyUserPassword` — nuxt-auth-utils
 * exportiert globale `hashPassword`/`verifyPassword`-Auto-Imports (scrypt),
 * das wollen wir hier bewusst NICHT nehmen (Argon2id ist stärker).
 *
 * Docs: https://bun.com/docs/api/hashing#bun-password
 */

export function hashUserPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, {
    algorithm: 'argon2id',
    memoryCost: 65536, // 64 MiB
    timeCost: 3,
  })
}

export function verifyUserPassword(plain: string, hash: string): Promise<boolean> {
  return Bun.password.verify(plain, hash)
}
