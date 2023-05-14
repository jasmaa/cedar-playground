# Cedar Playground

A playground for experimenting with [Cedar](https://docs.cedarpolicy.com/)
policies.


## Development

Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) and build
WASM:

```
cd cedar-playground-wasm
wasm-pack build --target web
```

Build web app:

```
cd cedar-playground
yarn install
yarn build
```

Serve web app:

```
npx serve dist
```