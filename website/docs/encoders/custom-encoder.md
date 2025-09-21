---
sidebar_position: 10
title: Custom Encoder
---

# Custom Encoder

KiviGo's encoder system is fully extensible: you can implement your own encoder to support any serialization format or custom logic you need. This allows you to integrate with legacy systems, optimize for performance, or add features like compression, validation, or additional security.

## Why Create a Custom Encoder?

- Support a serialization format not provided by default (e.g., XML, Protobuf, MessagePack)
- Add custom logic before/after encoding (e.g., compression, validation, logging)
- Integrate with existing data pipelines or legacy systems
- Implement advanced security or obfuscation

## Encoder Interface

A custom encoder must implement the following interface:

```go
type Encoder interface {
    Encode(ctx context.Context, value any) ([]byte, error)
    Decode(ctx context.Context, data []byte, value any) error
}
```

- `Encode` serializes a Go value into a byte slice.
- `Decode` deserializes a byte slice into a Go value (pointer).

## Example: Minimal Custom Encoder

Below is a simple example of a custom encoder that uses Go's `encoding/gob`:

```go
package myencoder

import (
    "bytes"
    "context"
    "encoding/gob"
)

type GobEncoder struct{}

func (e *GobEncoder) Encode(ctx context.Context, value any) ([]byte, error) {
    var buf bytes.Buffer
    enc := gob.NewEncoder(&buf)
    if err := enc.Encode(value); err != nil {
        return nil, err
    }
    return buf.Bytes(), nil
}

func (e *GobEncoder) Decode(ctx context.Context, data []byte, value any) error {
    buf := bytes.NewBuffer(data)
    dec := gob.NewDecoder(buf)
    return dec.Decode(value)
}
```

## Using Your Custom Encoder

You can use your encoder with any KiviGo backend:

```go
import (
    "github.com/kivigo/kivigo"
    "github.com/kivigo/backends/badger"
    "yourmodule/myencoder"
)

kvStore, _ := badger.New(badger.DefaultOptions("./data"))
client, err := kivigo.New(kvStore, kivigo.Option{
    Encoder: &myencoder.GobEncoder{},
})
```

## Best Practices

- Always use the same encoder for a given key or dataset.
- Ensure your encoder is deterministic and compatible across versions.
- Handle errors gracefully and validate input/output types.
- Write tests for your encoder to ensure correct serialization and deserialization.

## Contribute Your Encoder

If you create an encoder that could be useful to others (for example, an encoder for a popular format like XML, Protobuf, MessagePack, or any other format that does **not** contain custom logic specific to your own application), we encourage you to contribute it to the KiviGo ecosystem!

**Open a Pull Request** on [GitHub](https://github.com/kivigo/encoders) to submit your encoder for review.  
Your contribution can help other users and make KiviGo even more versatile.

## More Examples

- [JSON Encoder Source](https://github.com/kivigo/encoders/blob/main/json/json.go)
- [YAML Encoder Source](https://github.com/kivigo/encoders/blob/main/yaml/yaml.go)
- [Encrypt Encoder Source](https://github.com/kivigo/encoders/blob/main/encrypt/encrypt.go)

---

By implementing your own encoder, you can fully control how your data is stored and retrieved with KiviGo.
