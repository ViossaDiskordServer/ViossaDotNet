# Viossa I18n Message Spec

## Types & Literals
There are two types of messages, `string` & `markdown`. Each type is specified by a prefix:
- `string` literal (no prefix): `"Hello world!"`
- `markdown` literal (`md` prefix): `md "Hello world!"`

Message literals are made up of lines. Each line is surrounded by quotes.

## String Literals
String literals take exactly one line. They have no special formatting or behavior, exactly what is in the string will be what is displayed:
- `"Hello world!"` => Hello world!
- `"123 *456* **789**"` => 123 \*456\* \*\*789\*\*

## Markdown Literals
Markdown literals can take any number of lines. Lines are separated by newline characters.
```
example-markdownMessage = md
    "Line 1"
    "Line 2"
    "Line 3"
```

They can also consist of a single line:
```
example-markdownMessage = md "Line 1"
```

A special sigil exists for denoting that no lines exist:
```
example-markdownMessage = md --
```

### Line Types
- Paragraph: `Example`
- Header: `# Example` (subheaders are not supported)
- Unordered List Item: `- Example`

### Line Features
- Italic: `*Example*` => *Example*
- Bold: `**Example**` => **Example**
- Bold + Italic: `***Example***` => ***Example***
- Links: `[Example](external.new:https://example.com/)` => [Example](https://example.com/)
- Slots: `<example>`

Characters used for line feature syntax can be escaped to remove their effect and place the raw character in the string: `\*Example\*` => \*Example\*

### Links
Links are made up of 4 components:
```
[Example](external.new:https://example.com/)
 ^^^^^^^  ^^^^^^^^ ^^^ ^^^^^^^^^^^^^^^^^^^^
 name     type     tab destination
```

`name` is the text displayed to the user on the webpage. It is optional; If blank, it will display the destination directly to the user.

`type` can be either `internal` or `external`, and changes what is deemed a valid `destination`.

If `tab` is `new`, the link will open the `destination` in a new tab. If `tab` is `replace`, it will open in the current tab.

`destination` is where the link will take the user when clicked. Its value depends on the value of `type` as follows:
- If `type` is `external`: `destination` is any link starting with `http://` or `https://`
  - `http://example.com/`
  - `https://google.com/`
  - `https://viossa.net/`
- If `type` is `internal`: `destination` consists of a `route` and `id`, in any of the following patterns:
  - `route`-only: brings the user to another route on the website
    - `/`
    - `/resources`
    - `/kotoba`
    - `/discord/rules`
  - `id`-only: jumps the user to a specific element ID on the current route
    - `#top`
    - `#header`
    - `#rule-1`
  - `route` with `id`: brings the user to another route and jumps to an element ID on that page
    - `/discord/rules#rule-1`
    - `/#top`
