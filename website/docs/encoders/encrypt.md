---
sidebar_position: 7
title: Encrypt Encoder
---

import EncoderTemplate from '@site/src/components/EncoderTemplate';

<EncoderTemplate
  name="Encrypt Encoder"
  description="The Encrypt encoder provides transparent encryption and decryption of your data using a passphrase, on top of any other encoder (such as JSON, YAML, or your custom encoder). It leverages the cryptio library for robust, configurable encryption, allowing you to control security level and Argon2 profile. All values stored in your key-value backend are encrypted at rest, while the API remains simple and familiar."
  packageName="encoders/encrypt"
  importPath="github.com/kivigo/encoders/encrypt"
  usageExample={`import (
    "context"
    "log"
    "github.com/kivigo/kivigo"
    "github.com/kivigo/encoders/encrypt"
    "github.com/kivigo/encoders/json"
    "github.com/kivigo/backends/badger"
    "github.com/azrod/cryptio"
)

type Secret struct {
    Token string \`json:"token"\`
}

func main() {
    kvStore, _ := badger.New(badger.DefaultOptions("./data"))
    defer kvStore.Close()

    passphrase := "my-very-strong-passphrase"

    // Choose your desired security level and Argon2 profile
    level := cryptio.SecurityLevelStandard
    profile := cryptio.Argon2ProfileBalanced

    // Wrap the JSON encoder with encryption
    enc, err := encrypt.New(passphrase, json.New(), level, profile)
    if err != nil {
        log.Fatal(err)
    }

    client, err := kivigo.New(kvStore, kivigo.Option{
        Encoder: enc,
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()
    secret := Secret{Token: "super-secret-token"}

    // Store encrypted
    err = client.Set(ctx, "secret", secret)
    if err != nil {
        log.Fatal(err)
    }

    // Retrieve and decrypt
    var retrieved Secret
    err = client.Get(ctx, "secret", &retrieved)
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("Retrieved secret: %+v", retrieved)
}
`}
  notes={[
    "You must provide a non-empty passphrase when creating the Encrypt encoder. If the passphrase is empty, New will return an error.",
    "You must provide a non-nil encoder (e.g., JSON, YAML, or any custom encoder). If the encoder is nil, New will return an error.",
    "You must specify a cryptio.SecurityLevel and cryptio.Argon2Profile. These control the strength and performance of encryption and key derivation.",
    "Encryption and decryption are performed using the cryptio library, which provides strong, configurable symmetric encryption.",
    "Never lose your passphrase: data cannot be decrypted without it.",
    "For best security, use a strong, random passphrase and appropriate security settings.",
    "The Encrypt encoder is ideal for storing sensitive data (API keys, credentials, secrets) in any KiviGo backend.",
    "See below for available security levels and Argon2 profiles."
  ]}
  links={[
    { text: "cryptio library", url: "https://github.com/azrod/cryptio" },
    { text: "cryptio GoDoc", url: "https://pkg.go.dev/github.com/azrod/cryptio" },
    { text: "KiviGo Encoder Interface", url: "https://pkg.go.dev/github.com/kivigo/kivigo/pkg/models#Encoder" }
  ]}
/>

## Security Levels

A `SecurityLevel` defines the cryptographic strength of key derivation—how slow and memory-intensive the key derivation should be to resist brute-force or hardware attacks.  
Higher levels mean more security, but also more CPU/RAM usage and slower operations.

- **UltraFast**: For testing/devices only, almost no protection against brute-force.
- **Standard**: Strong and fast, recommended for most apps (follows OWASP guidance).
- **Medium**: Enterprise-grade, NIST-compliant for regulated environments.
- **High**: For highly sensitive data, critical production, health/finance.
- **Extreme**: Vaults and ultra-secure secrets, very slow and memory-hungry.

## Argon2 Profiles

The `Argon2Profile` controls the trade-off between CPU and RAM usage in Argon2id key derivation.

- **RAMHeavy**: Uses a lot of RAM for best GPU/ASIC resistance, fast if enough memory.
- **Balanced**: Good compromise between RAM and CPU.
- **Tradeoff**: Lower RAM, higher CPU.
- **CPUFavor**: Minimal RAM, high CPU.
- **CPUHeavy**: Minimum RAM, maximum CPU (useful for RAM-constrained environments).

## How it works

When you create an Encrypt encoder, you specify both a `SecurityLevel` and an `Argon2Profile`.  
The cryptio library combines both to set Argon2id parameters (iterations, memory size, parallelism, salt/key/nonce sizes) to maximize security in line with your needs and hardware limits.

**Choose the right combination for your use case:**

- For most applications, `SecurityLevelStandard` and `Argon2ProfileBalanced` are recommended.
- For maximum security, use `SecurityLevelHigh` or `SecurityLevelExtreme` with `Argon2ProfileRAMHeavy` (if your hardware allows).
- For testing or low-resource environments, use `SecurityLevelUltraFast` and `Argon2ProfileCPUFavor` (not recommended for production).

See the [cryptio documentation](https://github.com/azrod/cryptio) for more details and advanced usage.
