---
sidebar_position: 4
slug: /keybuilder/dynamic-templates
title: Dynamic Templates & Transformations
---

# Dynamic Templates & Transformations

KiviGo KeyBuilder now supports advanced dynamic templates with variable transformations, conditionals, and fallback/defaults.

## Syntax Extensions

- **Transformations**: Apply functions to variables in templates:
  - `{field|upper}` → value uppercased
  - `{field|lower}` → value lowercased
  - `{field|trim}` → value trimmed
  - `{field|slugify}` → spaces replaced by `-`, lowercased
  - `{field|default('x')}` → fallback to `'x'` if value is empty
  - `{flag|if('yes','no')}` → ternary: if value is non-empty/true, use 'yes', else 'no'
  - `{n|intadd(1)}` → add 1 to integer value

- **Chaining**: You can chain multiple transformations: `{field|trim|upper|default('X')}`

- **Custom Functions**: Register your own transformation functions:

```go
builder, _ := key.Template("custom:{val|reverse}")
builder.RegisterFunc("reverse", func(val string, _ ...string) (string, error) {
    // reverse string logic
    return ...
})
```

## Examples

### Fallback/default

```go
builder, _ := key.Template("user:{id|upper}:{field|default('profile')}")
key, _ := builder.Build(ctx, map[string]any{"id": "abc123"})
// key == "user:ABC123:profile"
```

### Conditionals

```go
builder, _ := key.Template("{flag|if('yes','no')}")
key, _ := builder.Build(ctx, map[string]any{"flag": "1"}) // key == "yes"
key, _ = builder.Build(ctx, map[string]any{"flag": ""})   // key == "no"
```

### Arithmetic

```go
builder, _ := key.Template("n+1:{n|intadd(1)}")
key, _ := builder.Build(ctx, map[string]any{"n": 4}) // key == "n+1:5"
```

### Custom transformation

```go
builder, _ := key.Template("custom:{val|reverse}")
builder.RegisterFunc("reverse", func(val string, _ ...string) (string, error) {
    runes := []rune(val)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes), nil
})
key, _ := builder.Build(ctx, map[string]any{"val": "abcde"}) // key == "custom:edcba"
```

## Error Handling

- If a transformation function is unknown, an error is returned.
- If a variable is missing and no fallback/default is provided, an error is returned.

## Reference: Built-in Functions

| Name      | Description                                 |
|-----------|---------------------------------------------|
| upper     | Uppercase                                   |
| lower     | Lowercase                                   |
| trim      | Trim spaces                                 |
| slugify   | Lowercase, replace spaces with '-'          |
| default   | Fallback value if empty                     |
| if        | Ternary: if not empty, use arg1 else arg2   |
| intadd    | Add integer delta                           |

See also: [DSL Details](./dsl-details.md), [Advanced Usage](./advanced-usage.md), [Overview](./overview.md)
