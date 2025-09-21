---
sidebar_position: 5
title: JSON Encoder
---

import EncoderTemplate from '@site/src/components/EncoderTemplate';

<EncoderTemplate
  name="JSON Encoder"
  description="The JSON encoder is the default encoder for KiviGo. It serializes and deserializes Go structs to JSON, providing a human-readable and widely compatible format."
  packageName="encoders/json"
  importPath="github.com/kivigo/encoders/json"
  usageExample={`import (
    "context"
    "log"
    "github.com/kivigo/kivigo"
    "github.com/kivigo/encoders/json"
    "github.com/kivigo/backends/badger"
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func main() {
    kvStore, _ := badger.New(badger.DefaultOptions("./data"))
    defer kvStore.Close()

    client, err := kivigo.New(kvStore, kivigo.Option{
        Encoder: json.New(), // JSON is the default encoder
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()
    user := User{ID: 1, Name: "John", Email: "john@example.com"}

    // Store with JSON encoder
    err = client.Set(ctx, "user:1", user)
    if err != nil {
        log.Fatal(err)
    }

    // Retrieve with JSON encoder
    var retrievedUser User
    err = client.Get(ctx, "user:1", &retrievedUser)
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("Retrieved user: %+v", retrievedUser)
}
`}
  notes={[
    "Always use the same encoder for a given key to avoid decoding errors.",
    "JSON is suitable for most use cases, but consider a binary encoder for maximum performance or compactness.",
    "You can use struct tags (e.g.,`json:\"field\"`) to control serialization."
  ]}
  links={[
    { text: "Go encoding/json documentation", url: "https://pkg.go.dev/encoding/json" },
    { text: "KiviGo Encoder Interface", url: "https://pkg.go.dev/github.com/kivigo/kivigo/pkg/models#Encoder" }
  ]}
/>
