---
sidebar_position: 6
title: Compress Encoder
---

import EncoderTemplate from '@site/src/components/EncoderTemplate';

<EncoderTemplate
  name="Compress Encoder"
  description="The Compress encoder transparently compresses and decompresses your data using a configurable compressor, on top of any other encoder (such as JSON, YAML, or your custom encoder). This allows you to reduce storage size and bandwidth usage, while keeping the API simple and familiar."
  packageName="encoders/compress"
  importPath="github.com/kivigo/encoders/compress"
  usageExample={`import (
    "context"
    "log"
    "github.com/kivigo/kivigo"
    "github.com/kivigo/encoders/compress"
    "github.com/kivigo/encoders/json"
    "github.com/kivigo/backends/badger"
    "github.com/kivigo/encoders/compress/gzip"
)

type Data struct {
    Message string \`json:"message"\`
}

func main() {
    kvStore, _ := badger.New(badger.DefaultOptions("./data"))
    defer kvStore.Close()

    // Wrap the JSON encoder with gzip compression
    enc := compress.New(json.New(), gzip.New())

    client, err := kivigo.New(kvStore, kivigo.Option{
        Encoder: enc,
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()
    data := Data{Message: "Hello, compressed world!"}

    // Store compressed
    err = client.Set(ctx, "data", data)
    if err != nil {
        log.Fatal(err)
    }

    // Retrieve and decompress
    var retrieved Data
    err = client.Get(ctx, "data", &retrieved)
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("Retrieved data: %+v", retrieved)
}
`}
  notes={[
    "You must provide a non-nil encoder and compressor when creating the Compress encoder.",
    "Compression and decompression are performed using the provided compressor (e.g., gzip, lz4, or your custom implementation).",
    "The Compress encoder is ideal for storing large or repetitive data efficiently in any KiviGo backend.",
    "Choose the compressor that best fits your use case and hardware constraints.",
    "See below for available compressors."
  ]}
  links={[
    { text: "KiviGo Compressor Interface", url: "https://pkg.go.dev/github.com/kivigo/encoders/model#Compressor" },
    { text: "Gzip Compressor", url: "https://pkg.go.dev/github.com/kivigo/encoders/compress/gzip" },
    { text: "LZ4 Compressor", url: "https://pkg.go.dev/github.com/kivigo/encoders/compress/lz4" }
  ]}
/>

## Available Compressors

- **Gzip**: Standard gzip compression, good for general-purpose use.
- **LZ4**: Fast compression and decompression, suitable for high-performance scenarios.
- **Custom**: Implement your own compressor by satisfying the `model.Compressor` interface.

## How it works

When you create a Compress encoder, you specify both an encoder (for serialization) and a compressor (for compression).  
The encoder serializes your data, then the compressor compresses it before storage.  
On retrieval, the compressor decompresses the data, then the encoder deserializes it back to your original type.

**Choose the right combination for your use case:**

- For most applications, `json.New()` with `gzip.New()` is recommended.
- For maximum speed, use `lz4.New()` if your hardware supports it.
- For custom needs, implement your own compressor.
