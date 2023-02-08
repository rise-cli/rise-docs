# Rise Docs

The goal of rise-docs is to make building a documentation site as easy and low friction as possible. A rise-docs project consists of 2 things:

-   a rise.mjs file
-   markdown files

## Installation

```bash
npm i -g rise-docs
```

## Usage

You can generate html files from a docs project using the generate command

```bash
rise-docs generate
```

You can deploy a docs project using the deploy command

```bash
rise-docs deploy
```

## Configuration

A rise.mjs file must have a name and a sidebar defined, and can optionally have a logo defined:

```js
// rise.mjs
export default {
    // required
    name: 'Rise Docs',
    sidebar: {
        PageOne: 'index.md',
        PageTwo: 'other.md'
    },
    // optional
    logo: '<svg>...</svg>'
}
```

The sidebar is a map, the key is the name that will show up on the sidebar menu, and the value is the md file
