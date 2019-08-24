---
title: Features
pre: <span class="mdi mdi-star"></span>
---

# Template Features

## Ordered Lists

1. **Step One** do something important.

   ```go
   // code can go here
   ```

2. **Step Two** do something important.
   
    More details can go here.

3. **Step Three** do something important.

## Shortcodes

### Notification

```markdown
{{</* notification info information-outline */>}}
Notification type **info** with [Material Design Icon](https://materialdesignicons.com/icon).
{{</* /notification */>}}
```

{{< notification info information-outline >}}
Notification type **info** with [Material Design Icon](https://materialdesignicons.com/icon).
{{< /notification >}}

```markdown
{{</* notification warning information-outline */>}}
Notification type **warning** without icon.
{{</* /notification */>}}
```

{{< notification warning >}}
Notification type **warning** without icon.
{{< /notification >}}

```markdown
{{</* notification success alert-circle-outline */>}}
Notification type **success** with [Material Design Icon](https://materialdesignicons.com/icon).
{{</* /notification */>}}
```

{{< notification success alert-circle-outline >}}
Notification type **success** with [Material Design Icon](https://materialdesignicons.com/icon).
{{< /notification >}}

```markdown
{{</* notification danger alert-circle-outline */>}}
Notification type **danger** with [Material Design Icon](https://materialdesignicons.com/icon).
{{</* /notification */>}}
```

{{< notification danger alert-circle-outline >}}
Notification type **danger** with [Material Design Icon](https://materialdesignicons.com/icon).
{{< /notification >}}

## Menu Pre

Add any HTML to `pre` in front matter and it will appear in the menu.

```yaml
---
title: A Doc
pre: <span class="mdi mdi-star"></span>
---
```

## Code Clipboard Button

```yaml
---
msg: Hover over this element and click the button
```

**Note:** Hidden on touch devices.
