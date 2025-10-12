---
sidebar_position: 4
---

# Common Operations

Learn about all the operations available in KiviGo for managing your key-value data.

## Setting Values

Store data using the `Set` method. This method saves a value under a given key.

```go
// Simple values
err := client.Set(ctx, "counter", 42)
err := client.Set(ctx, "name", "John Doe")
err := client.Set(ctx, "active", true)

// Complex structs
type Config struct {
    Host string `json:"host"`
    Port int    `json:"port"`
}

config := Config{Host: "localhost", Port: 8080}
err := client.Set(ctx, "app:config", config)

// Slices and maps
err := client.Set(ctx, "items", []string{"a", "b", "c"})
err := client.Set(ctx, "settings", map[string]interface{}{
    "debug": true,
    "level": "info",
})
```

## Getting Values

Retrieve data using the `Get` method. This method loads the value for a given key and decodes it into the provided variable.

```go
// Get into a variable of the correct type
var counter int
err := client.Get(ctx, "counter", &counter)

var name string
err := client.Get(ctx, "name", &name)

var config Config
err := client.Get(ctx, "app:config", &config)

var items []string
err := client.Get(ctx, "items", &items)

var settings map[string]interface{}
err := client.Get(ctx, "settings", &settings)
```

### Handling Missing Keys

Handle missing keys by checking for the `ErrNotFound` error. This allows you to distinguish between a missing key and other errors.

```go
import "github.com/kivigo/kivigo/pkg/errs"

var value string
err := client.Get(ctx, "missing-key", &value)
if err != nil {
    if errors.Is(err, errs.ErrNotFound) {
        fmt.Println("Key does not exist")
        // Handle missing key case
    } else {
        log.Fatal("Unexpected error:", err)
    }
}
```

## Listing Keys

Find keys using patterns with the `List` method. This method returns all keys matching a given prefix.

```go
// List all keys with a prefix
keys, err := client.List(ctx, "user:")
// Returns: ["user:1", "user:2", "user:3", ...]

// List all keys starting with "config:"
configKeys, err := client.List(ctx, "config:")
// Returns: ["config:app", "config:db", "config:cache", ...]

// List all keys (use empty prefix)
allKeys, err := client.List(ctx, "")
```

### Working with Listed Keys

Get all user data by listing keys and retrieving each value. This pattern is useful for batch processing or iterating over a group of related keys.

```go
// Get all user data
userKeys, err := client.List(ctx, "user:")
if err != nil {
    log.Fatal(err)
}

for _, key := range userKeys {
    var user User
    err := client.Get(ctx, key, &user)
    if err != nil {
        log.Printf("Failed to get %s: %v", key, err)
        continue
    }
    fmt.Printf("User %s: %+v\n", key, user)
}
```

## Deleting Values

Remove data using the `Delete` method. This method deletes the value for a given key.

```go
// Delete a single key
err := client.Delete(ctx, "user:1")

// Delete multiple keys
keysToDelete := []string{"temp:1", "temp:2", "temp:3"}
for _, key := range keysToDelete {
    err := client.Delete(ctx, key)
    if err != nil {
        log.Printf("Failed to delete %s: %v", key, err)
    }
}
```

### Bulk Deletion

Delete all temporary keys by listing them and deleting each one. This is useful for cleaning up groups of related keys.

```go
// Delete all temporary keys
tempKeys, err := client.List(ctx, "temp:")
if err != nil {
    log.Fatal(err)
}

for _, key := range tempKeys {
    err := client.Delete(ctx, key)
    if err != nil {
        log.Printf("Failed to delete %s: %v", key, err)
    }
}
```

## Key Existence Checks

Check if keys exist before operating on them:

### Single Key Check

Check if a single key exists in the store using the `HasKey` method. Returns `true` if the key exists, `false` otherwise. Returns an error if the key is empty or if there is a backend issue.

Example usage:

```go
exists, err := client.HasKey(ctx, "user:1")
if err != nil {
    log.Fatal(err)
}

if exists {
    fmt.Println("User 1 exists")
    // Proceed with operations
} else {
    fmt.Println("User 1 does not exist")
    // Handle missing data
}
```

### Multiple Key Check

Check if multiple keys exist in a single operation using the `HasKeys` method. This method returns `true` only if **all** specified keys exist in the store. If at least one key is missing, the result will be `false`. If the list of keys is empty, an error is returned.

Example usage:

```go
keys := []string{"user:1", "user:2", "user:3"}
allExist, err := client.HasKeys(ctx, keys)
if err != nil {
    log.Fatal(err) // Error if the list is empty or backend issue
}

if allExist {
    fmt.Println("All users exist")
    // You can safely perform batch operations
} else {
    fmt.Println("Some users are missing")
    // To efficiently find missing keys:
    missing := make([]string, 0, len(keys))
    for _, key := range keys {
        exists, err := client.HasKey(ctx, key)
        if err != nil {
            log.Printf("Error checking %s: %v", key, err)
            continue
        }
        if !exists {
            missing = append(missing, key)
        }
    }
    fmt.Printf("Missing keys: %v\n", missing)
}
```

### Custom Key Matching

Match keys using a custom function with the `MatchKeys` method. This method lists all keys with a given prefix and applies your custom logic to determine if a condition is met. Returns `true` if your function returns true, otherwise false. Returns an error if the function is nil or listing keys fails.

Example usage:

```go
// Custom key matching with a prefix
match, err := client.MatchKeys(ctx, "user:", func(keys []string) (bool, error) {
    // Custom logic: check if we have more than 5 users
    return len(keys) > 5, nil
})
if err != nil {
    log.Fatal(err)
}

if match {
    fmt.Println("More than 5 users found")
} else {
    fmt.Println("5 or fewer users found")
}

// Another example: check if specific user types exist
match, err = client.MatchKeys(ctx, "user:", func(keys []string) (bool, error) {
    // Check if we have both admin and regular users
    hasAdmin := false
    hasRegular := false
    for _, key := range keys {
        if strings.Contains(key, "admin") {
            hasAdmin = true
        } else {
            hasRegular = true
        }
    }
    return hasAdmin && hasRegular, nil
})
```

## Working with Raw Data

For advanced use cases, you can work with raw byte data using the `SetRaw` and `GetRaw` methods. These methods allow you to store and retrieve binary data directly.

### Setting Raw Data

```go
// Store raw bytes
rawData := []byte("custom binary data")
err := kvStore.SetRaw(ctx, "binary:data", rawData)
```

### Getting Raw Data

```go
// Retrieve raw bytes
rawData, err := kvStore.GetRaw(ctx, "binary:data")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Raw data: %x\n", rawData)
```

## Batch Operations

Some backends support efficient batch operations using the `BatchSetRaw`, `BatchGetRaw`, and `BatchDelete` methods. These allow you to set, get, or delete multiple keys in a single call.

### Batch Set

```go
// Prepare batch data
batchData := map[string][]byte{
    "batch:1": []byte("value1"),
    "batch:2": []byte("value2"),
    "batch:3": []byte("value3"),
}

// Set all values in one operation
err := kvStore.BatchSetRaw(ctx, batchData)
if err != nil {
    log.Fatal(err)
}
```

### Batch Get

```go
// Get multiple keys efficiently
keys := []string{"batch:1", "batch:2", "batch:3"}
results, err := kvStore.BatchGetRaw(ctx, keys)
if err != nil {
    log.Fatal(err)
}

for key, value := range results {
    fmt.Printf("%s: %s\n", key, string(value))
}
```

### Batch Delete

```go
// Delete multiple keys efficiently
keys := []string{"batch:1", "batch:2", "batch:3"}
err := kvStore.BatchDelete(ctx, keys)
if err != nil {
    log.Fatal(err)
}
```

## Performance Tips

### Key Naming Conventions

Use consistent key naming patterns for better performance and easier management.

```go
// Good: Hierarchical structure
"user:123:profile"
"user:123:settings"
"user:123:sessions"

// Good: Type prefixing
"session:abc123"
"cache:user:456"
"config:app:timeout"

// Avoid: Random or inconsistent naming
"u123"
"userprofile123"
"123_user_data"
```

### Efficient Listing

Use specific prefixes for efficient key listing. Listing all keys and filtering manually is less efficient and should be avoided for large datasets.

```go
// Efficient: Use specific prefixes
userKeys, err := client.List(ctx, "user:")
configKeys, err := client.List(ctx, "config:")

// Less efficient: Get all keys and filter
allKeys, err := client.List(ctx, "")
// Then manually filter the results
```

### Context Usage

Always use appropriate context timeouts to avoid hanging operations and improve reliability.

```go
// Set operation timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

err := client.Set(ctx, "key", "value")
if err != nil {
    if errors.Is(err, context.DeadlineExceeded) {
        fmt.Println("Operation timed out")
    } else {
        log.Fatal(err)
    }
}
```

## Next Steps

Now that you understand all the basic operations:

1. **Explore [Examples](./examples)** - See these operations in practical, real-world scenarios
2. **Learn about [Backends](../backends/overview)** - Understand which operations work best with different backends
3. **Advanced [Batch Operations](../advanced/batch-operations)** - Optimize performance with bulk operations
4. **Custom [Error Handling](../advanced/health-checks)** - Build robust applications with proper error handling
