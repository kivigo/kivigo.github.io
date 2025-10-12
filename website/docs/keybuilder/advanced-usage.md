---
sidebar_position: 2
slug: /keybuilder/advanced-usage
title: Advanced Usage
---

# KeyBuilder Advanced Usage

Explore advanced scenarios and customization options for KeyBuilder.

## Custom KeyVars Interface

Implement the `KeyVars() map[string]any` method on your struct to control variable extraction:

```go
type Session struct {
    UserID string
    SessionID string
}
func (s Session) KeyVars() map[string]any {
    return map[string]any{
        "user": s.UserID,
        "session": s.SessionID,
    }
}
builder := key.Template("session:{user}:{session}")
key, err := builder.Build(ctx, Session{UserID: "bob", SessionID: "xyz"})
```

See the [DSL Details](./dsl-details.md) page for syntax and input types.
