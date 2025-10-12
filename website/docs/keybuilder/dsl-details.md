---
sidebar_position: 1
slug: /keybuilder/dsl-details
title: DSL Details
---

# KeyBuilder DSL Details

This page explains the syntax and features of the KeyBuilder DSL in KiviGo.

## Template Syntax

- Use `{field}` to inject variables into the key string.
- Fields can be provided via `map[string]any`, struct fields, or custom `KeyVars` interface.
- All fields in the template must be provided, or an error is returned.

## Supported Input Types

- **Map**: `map[string]any` for dynamic values
- **Struct**: Any Go struct, fields are extracted automatically
- **Custom Interface**: Implement `KeyVars() map[string]any` for advanced scenarios (see [Advanced Usage](./advanced-usage.md))

## Input Types priority

When building a key, the input type is resolved in the following order:

1. **Custom Interface**: If the input implements `KeyVars`, its `KeyVars()` method is used.
2. **Map**: If the input is a `map[string]interface{}`, its values are used.
3. **Struct**: If the input is a struct (or pointer to struct), exported fields are used.

This ensures maximum flexibility and allows you to override variable extraction logic as needed.

## Examples

### Map Example

```go
builder, err := key.Template("order:{orderID}:user:{userID}")
if err != nil {
    // handle error (invalid template)
}
key, err := builder.Build(ctx, map[string]any{"orderID": 123, "userID": "alice"})
// key == "order:123:user:alice"
```

### Struct Example

```go
type Order struct {
    OrderID int
    UserID  string
}
builder, err := key.Template("order:{OrderID}:user:{UserID}")
if err != nil {
    // handle error (invalid template)
}
order := Order{OrderID: 456, UserID: "bob"}
key, err := builder.Build(ctx, order)
// key == "order:456:user:bob"
```

## Error Handling

If any template field is missing, `Build` returns an error listing missing fields.

See the [Advanced Usage](./advanced-usage.md) page for more complex scenarios.
