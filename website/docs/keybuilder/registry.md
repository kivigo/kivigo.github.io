---
sidebar_position: 3
slug: /keybuilder/registry
title: Registry
---
The KeyBuilder registry lets you store and reuse named key templates across your application.

## Why use a registry?

- Centralizes template management
- Avoids duplication and typos
- Enables dynamic configuration
- Supports global/shared templates

## Basic Usage

```go
import "github.com/kivigo/kivigo/pkg/key"

// Create a registry
reg := key.NewRegistry()
tmpl, err := key.Template("user:{userID}:data:{dataID}")
if err != nil {
    // handle invalid template error
}
err = reg.Register("userKey", tmpl)
if err != nil {
    // handle duplicate name error
}

// Retrieve and use a template
builder, ok := reg.Get("userKey")
if ok {
    key, _ := builder.Build(ctx, map[string]interface{}{ "userID": 42, "dataID": "abc" })
    // key == "user:42:data:abc"
}
```

## Global Registry

For shared templates, use the package-level global registry:

```go
tmpl, err := key.Template("order:{orderID}")
if err != nil {
    // handle invalid template error
}
err = key.GlobalRegistry().Register("orderKey", tmpl)
if err != nil {
    // handle duplicate name error
}
builder, ok := key.GlobalRegistry().Get("orderKey")
```

## Registry-level Transformation Functions

You can register custom transformation functions globally for all templates in a registry using `RegisterFunc`. This makes the function available to all templates (existing and future) in the registry:

```go
reg := key.NewRegistry()
reg.RegisterFunc("reverse", func(val string, _ ...string) (string, error) {
    runes := []rune(val)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes), nil
})

tmpl, _ := key.Template("foo:{bar|reverse}")
reg.Register("foo", tmpl)
key, _ := reg.Get("foo")
result, _ := key.Build(nil, map[string]interface{}{ "bar": "abcde" })
// result == "foo:edcba"

// Functions registered after a template is added are also injected into all templates:
reg.RegisterFunc("upperx", func(val string, _ ...string) (string, error) {
    return strings.ToUpper(val) + "X", nil
})
// Now all templates in reg can use |upperx
```

This is useful pour centraliser des fonctions custom pour tous vos templates, ou pour fournir des helpers métiers à l’échelle d’un module.

## API Reference

Retrieve a API reference for the `Registry` in [pkg.go.dev/github.com/kivigo/kivigo/pkg/key#Registry](https://pkg.go.dev/github.com/kivigo/kivigo/pkg/key#Registry)

## Best Practices

- Use constants for template names to avoid typos
- Document your templates for maintainability
- Prefer the global registry for cross-package usage
- Always check the error returned by `Register` to avoid duplicate names
- Use `RegisterFunc` on the registry to DRY your custom transformations

See also: [DSL Details](./dsl-details.md), [Overview](./overview.md), [Dynamic Templates](./dynamic-templates.md)
