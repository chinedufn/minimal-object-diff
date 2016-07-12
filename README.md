minimal-object-diff [![npm version](https://badge.fury.io/js/minimal-object-diff.svg)](http://badge.fury.io/js/minimal-object-diff) [![Build Status](https://travis-ci.org/chinedufn/minimal-object-diff.svg?branch=master)](https://travis-ci.org/chinedufn/minimal-object-diff)
===============

> Create and apply a tiny representation of diffs between two objects. Useful for sending diffs over a network

## Motivation

The goal if `minimal-object-diff` is to generate a small representation of the diff between two objects in order to later send it over a network.

The use case in mind when writing was a game server. For a networked game you'll typically push down JSON to clients in order to update them on the world around them.

This library was created to power a simple utility for sending down the minimum amount of data necessary to keep a client up to date with its knowledge of world state.

## To Install

```
$ npm install --save minimal-object-diff
```

## Usage

```js
var objDiff = require('minimal-object-diff')

var oldClientKnowledge = { numBeavers: 50, foo: { bar: 'buzz' } }
var newClientKnowledge = { nothing: ':(' }

var patches = objDiff.diff(oldClientKnowledge, newClientKnowledge)

SendPatchesToAClientSomehow(patches)

// Later on the client
objDiff.patch(myOldClientKnowledge, JSON.parse(patches))
```

## API

### `objDiff.diff(oldObj, newObj)` -> `patches`

#### oldObj

*Required Parameter*

Type: `Object`

The old object that your patches later get applied to

#### newObj

*Required Parameter*

Type: `Object`

The new object that your patches will lead to

##### patches

*Returned*

Type: `Object || Array || null`

The patches that when applied transform `oldObj` -> `newObj`

### `objDiff.patch(oldObj, patches)` -> `newObj`

##### oldObj

*Required Parameter*

Type: `Object`

The old object that your patches get applied to

##### patches

*Required Parameter*

Type: `Object || Array || null`

The patches that when applied transform `oldObj` -> `newObj`

##### newObj

*Returned*

The new object that your patches will lead to

## TODO:

- [ ] Remove dependency on `changeset`
- [ ] Add benchmarks for JSON.stringify(patches).length
- [ ] Use dot prop strings instead of object keys for puts? Might save a few bytes per key

## License

MIT
