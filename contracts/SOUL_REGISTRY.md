# SoulRegistry — Der Anker-Contract des SYS-Ökosystems

*Deutsch · [English below](#english)*

---

## Was ist Ankern?

Ankern bedeutet: der Zustand einer Soul wird zu einem bestimmten Zeitpunkt **permanent und unveränderlich auf der Polygon-Blockchain festgehalten** — nicht der Inhalt, sondern ein kryptographischer Fingerabdruck (Hash).

Wer in 30 Jahren seine `soul.md` öffnet, kann lokal den SHA-256-Hash berechnen, ihn gegen die Blockchain prüfen — und beweisen: *Diese Seele existierte authentisch zu diesem Zeitpunkt.* Kein Server nötig. Keine Plattform. Nur Mathematik und ein öffentliches Ledger.

---

## Was landet on-chain — und was nicht?

| On-chain | Nicht on-chain |
|----------|---------------|
| `keccak256(soul_id)` — pseudonymer Identifier | Name, Inhalt, Persönlichkeitsdaten |
| `sha256(soul.md)` — Fingerabdruck zum Zeitpunkt des Ankerns | Die soul.md selbst |
| Zeitstempel (`block.timestamp`) | Wallet-Adresse nur als Eigentümer-Nachweis |
| Anzahl echter Sessions (informativ) | |

**Kein Klartext. Kein Name. Kein Inhalt.** Die Blockchain bestätigt nur: *Diese Seele existierte und war authentisch.*

---

## Dieser Contract ist der einzige seiner Art

`SoulRegistry` ist der **einzige offizielle Smart Contract des SYS-Ökosystems und der SaveYourSoul-Plattform**.

Es gibt keine weiteren Versionen, keine parallelen Deployments, keine Drittanbieter-Contracts, die im SYS-Protokoll anerkannt werden. Jede Soul, die außerhalb dieses Contracts verankert wird, gilt im Ökosystem nicht als verifiziert.

Die Unveränderlichkeit der Blockchain macht diesen Umstand dauerhaft prüfbar — auch ohne die Plattform, auch ohne den Autor.

---

## Technische Eckdaten

| Parameter | Wert |
|-----------|------|
| Solidity | `^0.8.20` |
| Netzwerk | Polygon Mainnet · chainId `137` |
| Anker-Gebühr | `0.5 POL` pro Anker (~$0.01–0.05) |
| Rate-Limit | max. 1 Anker pro Soul pro Tag |
| Max. Anker | 365 pro Soul |
| Lizenz | MIT |
| Version | `1.0.0` |

**Contract-Adresse (Polygon Mainnet):**
`— wird nach finalem Deployment eingetragen —`

> Zur Verifikation: [polygonscan.com](https://polygonscan.com) → Contract-Adresse eingeben → Source Code ist verifiziert und öffentlich einsehbar.

---

## Eigentum und Transfer

Wer eine Soul **zuerst verankert**, wird ihr on-chain Eigentümer. Nur der registrierte Eigentümer kann:
- weitere Anker setzen
- das Soul-Eigentum an eine andere Wallet-Adresse transferieren

Basis für das zukünftige *Seelenverkäufer-Feature* — der Transfer einer digitalen Identität zwischen Wallets.

---

## Verifikation ohne SYS (in 30 Jahren)

Kein Server nötig. Kein Account. Kein Dienst:

1. `soul.md` lokal öffnen
2. `sha256(soul.md)` lokal berechnen
3. `keccak256(soul_id)` berechnen
4. `getHistory(keccak256(soul_id))` auf dem Contract aufrufen
5. Hash aus Schritt 2 in der History suchen → **Übereinstimmung = Authentizität bewiesen**

---

## Sicherheitsdesign

- **Custom Errors** (EIP-838) — gas-effizient, typsicher
- **Rate-Limiting** — Schutz vor Griefing, 1 Anker/Tag/Soul
- **Pausierbar** — Contract-Owner kann im Notfall stoppen
- **2-Schritt Ownership-Transfer** — verhindert Verlust durch Tippfehler
- **`call()` statt `transfer()`** — EIP-1884-sicher für POL-Auszahlungen

---

## Lizenz

MIT License · Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany

---
---

## English

# SoulRegistry — The Anchor Contract of the SYS Ecosystem

## What is anchoring?

Anchoring means: the state of a soul is **permanently and immutably recorded on the Polygon blockchain** at a specific point in time — not the content, but a cryptographic fingerprint (hash).

In 30 years, anyone who opens their `soul.md` can calculate the SHA-256 hash locally, verify it against the blockchain — and prove: *This soul existed authentically at this point in time.* No server needed. No platform. Just mathematics and a public ledger.

---

## What goes on-chain — and what doesn't?

| On-chain | Not on-chain |
|----------|--------------|
| `keccak256(soul_id)` — pseudonymous identifier | Name, content, personality data |
| `sha256(soul.md)` — fingerprint at the time of anchoring | The soul.md itself |
| Timestamp (`block.timestamp`) | Wallet address only as proof of ownership |
| Number of real sessions (informational) | |

**No plaintext. No name. No content.** The blockchain only confirms: *This soul existed and was authentic.*

---

## This contract is the only one of its kind

`SoulRegistry` is the **sole official smart contract of the SYS ecosystem and the SaveYourSoul platform**.

There are no other versions, no parallel deployments, no third-party contracts recognised by the SYS protocol. Any soul anchored outside this contract is not considered verified within the ecosystem.

The immutability of the blockchain makes this verifiable in perpetuity — without the platform, without the author.

---

## Technical parameters

| Parameter | Value |
|-----------|-------|
| Solidity | `^0.8.20` |
| Network | Polygon Mainnet · chainId `137` |
| Anchor fee | `0.5 POL` per anchor (~$0.01–0.05) |
| Rate limit | max. 1 anchor per soul per day |
| Max anchors | 365 per soul |
| Licence | MIT |
| Version | `1.0.0` |

**Contract address (Polygon Mainnet):**
`— to be added after final deployment —`

> For verification: [polygonscan.com](https://polygonscan.com) → enter contract address → source code is verified and publicly viewable.

---

## Ownership and transfer

Whoever **anchors a soul first** becomes its on-chain owner. Only the registered owner can:
- set further anchors
- transfer soul ownership to another wallet address

Foundation for the future *soul transfer feature* — transferring a digital identity between wallets.

---

## Verification without SYS (in 30 years)

No server needed. No account. No service:

1. Open `soul.md` locally
2. Calculate `sha256(soul.md)` locally
3. Calculate `keccak256(soul_id)`
4. Call `getHistory(keccak256(soul_id))` on the contract
5. Look for the hash from step 2 in the history → **match = authenticity proven**

---

## Security design

- **Custom errors** (EIP-838) — gas-efficient, type-safe
- **Rate limiting** — protection against griefing, 1 anchor/day/soul
- **Pausable** — contract owner can halt in an emergency
- **2-step ownership transfer** — prevents loss through typos
- **`call()` instead of `transfer()`** — EIP-1884-safe for POL withdrawals

---

## Licence

MIT License · Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany
