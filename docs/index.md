# Introduction to Rise Docs

The goal of rise-docs is to make building a documentation site as easy and low friction as possible. A rise-docs project consists of 2 things:

-   a rise.js file
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

You can deploy a docs project to AWS Amplify using the deploy command

```bash
rise-docs deploy
```

You can remove a docs project dpeloyed to AWS Amplufy with the remove command

```bash
rise-docs remove
```

## Configuration

A rise.js file must have a name and a sidebar defined, and can optionally have a logo defined:

```js
// rise.js
module.exports = {
    // required
    name: 'Rise Docs',
    sidebar: {
        PageOne: 'index.md',
        PageTwo: 'other.md'
    },
    // optional
    logo: '<svg>...</svg>',
    auth: {
        username: 'my-user-name',
        password: 'my-password-that-is-at-least-8-characters'
    }
}
```

The sidebar is a map, the key is the name that will show up on the sidebar menu, and the value is the md file
