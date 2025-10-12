---
sidebar_position: 0
slug: /keybuilder/overview
title: Overview
---

# KeyBuilder Overview

KiviGo's KeyBuilder system is a flexible DSL for building keys in key-value stores. It allows you to:

- Compose keys using templates
- Use Go maps, structs, or custom interfaces for variable injection
- Validate that all required template fields are provided
- Extend with your own logic for advanced scenarios

## Importing the Package

To use KeyBuilder in your Go project, import the package:

```go
import "github.com/kivigo/kivigo/pkg/key"
```

You can then use the `key.Template` function and other KeyBuilder features as shown below.

## Basic Example

```go
builder, err := key.Template("user:{userID}:data:{dataID}")
if err != nil {
    // handle error (invalid template)
}
key, err := builder.Build(ctx, map[string]any{"userID": 42, "dataID": "abc"})
// key == "user:42:data:abc"
```

## Template Validation

When you create a template with `key.Template(...)`, the following validation rules apply:

- The entire template (outside braces) must only use allowed characters:
  - Letters (a-z, A-Z)
  - Digits (0-9)
  - Delimiters: `/`, `|`, `-`, `_`, `:`
  - Braces: `{}`

- Field names inside `{}` must only contain letters, digits, a-z, A-Z, 0-9.

### Examples Templates

**Valid Templates:**

- `user:{userID}:data:{dataID}`
- `order/{orderID}|item-{itemID}`
- `session_{sessionID}-user_{userID}`

**Invalid Templates:**

- `user:{user ID}:data:{dataID}` (space in field name)
- `user:{userID}/data:{dataID}?` (invalid character `?`)

See the next pages for DSL details and advanced usage.
