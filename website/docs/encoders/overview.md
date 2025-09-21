---
sidebar_position: 1
title: Encoders Overview
---

# Encoders Overview

KiviGo uses a flexible encoder system to handle the serialization and deserialization of your data. Encoders allow you to choose how your Go structs are transformed into bytes for storage, and how they are reconstructed when you read them back. This makes it easy to adapt KiviGo to a wide variety of use cases, from simple JSON storage to advanced scenarios like encryption or custom binary formats.

## What is an Encoder?

An **encoder** in KiviGo is any implementation of the `Encoder` interface, which defines two main methods:

- `Encode(ctx, value) ([]byte, error)`: Serializes a Go value into bytes.
- `Decode(ctx, data, value) error`: Deserializes bytes back into a Go value.

Encoders are pluggable: you can use the built-in JSON or YAML encoders, or provide your own custom implementation.

## Why Use Encoders?

- **Flexibility:** Choose the format that best fits your needs (JSON, YAML, encrypted, custom, etc.).
- **Interoperability:** Store data in formats compatible with other systems.
- **Security:** Add layers like encryption or compression transparently.
- **Extensibility:** Easily add new encoders without changing your application logic.

## How to Use an Encoder

When creating a KiviGo client, you specify the encoder in the options:

```go
import (
    "github.com/kivigo/kivigo"
    "github.com/kivigo/encoders/json"
    "github.com/kivigo/backends/badger"
)

kvStore, _ := badger.New(badger.DefaultOptions("./data"))
client, err := kivigo.New(kvStore, kivigo.Option{
    Encoder: json.New(), // Use the JSON encoder
})
```

You can swap the encoder for YAML, encryption, or any custom logic by changing a single line.

## Built-in Encoders

- **JSON Encoder:** Human-readable, widely supported, and the default for KiviGo.
- **YAML Encoder:** Useful for configuration and interoperability with YAML-based tools.
- **Encrypt Encoder:** Adds transparent encryption on top of any other encoder.
- **Custom Encoders:** Implement your own logic for special formats or requirements.

See the individual encoder documentation pages for details and usage examples.

## Best Practices

- Always use the same encoder for a given key or dataset.
- Choose an encoder that matches your performance, compatibility, and security needs.
- For sensitive data, use the Encrypt encoder with a strong passphrase.
- For interoperability, prefer JSON or YAML.

---

Explore the documentation for each encoder to learn more about their features and usage!
