---
sidebar_position: 6
title: YAML Encoder
---

import EncoderTemplate from '@site/src/components/EncoderTemplate';

<EncoderTemplate
  name="YAML Encoder"
  description="The YAML encoder allows you to serialize and deserialize Go structs to YAML, providing a human-readable format that is especially useful for configuration and interoperability with other YAML-based systems."
  packageName="encoders/yaml"
  importPath="github.com/kivigo/encoders/yaml"
  usageExample={`import (
    "context"
    "log"
    "github.com/kivigo/kivigo"
    "github.com/kivigo/encoders/yaml"
    "github.com/kivigo/backends/badger"
)

type Config struct {
    Port int    \`yaml:"port"\`
    Host string \`yaml:"host"\`
}

func main() {
    kvStore, _ := badger.New(badger.DefaultOptions("./data"))
    defer kvStore.Close()

    client, err := kivigo.New(kvStore, kivigo.Option{
        Encoder: yaml.New(),
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()
    config := Config{Port: 8080, Host: "localhost"}

    // Store with YAML encoder
    err = client.Set(ctx, "config", config)
    if err != nil {
        log.Fatal(err)
    }

    // Retrieve with YAML encoder
    var retrievedConfig Config
    err = client.Get(ctx, "config", &retrievedConfig)
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("Retrieved config: %+v", retrievedConfig)
}
`}
  notes={[
    "YAML is ideal for configuration data and is widely used in DevOps and cloud-native environments.",
    "Always use the same encoder for a given key to avoid decoding errors.",
    "YAML supports comments and complex structures, but may be slower than JSON for very large datasets.",
    "You can use struct tags (e.g.,`yaml:\"field\"`) to control serialization."
  ]}
  links={[
    { text: "go-yaml documentation", url: "https://pkg.go.dev/github.com/goccy/go-yaml" },
    { text: "KiviGo Encoder Interface", url: "https://pkg.go.dev/github.com/kivigo/kivigo/pkg/models#Encoder" }
  ]}
/>
