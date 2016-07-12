// TODO: Ditch this dependency in favor of a function that outputs and accepts
// our desired format directly
var changeset = require('changeset')
var dotProp = require('dot-prop')
var extend = require('xtend')

module.exports = {
  diff: DiffObjects,
  patch: PatchObject
}

function DiffObjects (oldObj, newObj) {
  var patches = changeset(oldObj, newObj)
  return minimizeChangesetPatches(patches)
}

function PatchObject (object, patches) {
  if (!patches) { return object }

  // If we're dealing with an array this means that we only have deletions
  if (patches.length > 0) {
    deleteProps(object, patches)
    return object
  }

  // Otherwise we have a patches object with an xtend-able object and a delete array
  object = extend(object, patches.x)
  deleteProps(object, patches.d || [])
  return object

  // Apply our delete patches
  function deleteProps (obj, deleteKeys) {
    deleteKeys.forEach(function (dotPropKey) {
      dotProp.delete(object, dotPropKey)
    })
  }
}

function minimizeChangesetPatches (patches) {
  // If the objects are deep equal, we return null
  if (patches.length === 0) { return null }

  var minifiedPatches = {
    // The object that the client should extend
    x: null,
    // An array of keys that the client should delete
    d: []
  }
  minifiedPatches = patches.reduce(function (prev, currentPatch) {
    // Create a dot-prop property key string
    var dotPropKey = currentPatch.key.join('.')
    if (currentPatch.type === 'put') {
      // TODO: Consider using dot prop strings instead of extendable objects here
      // Could be slightly smaller. Need to benchmark
      dotProp.set(prev, 'x.' + dotPropKey, currentPatch.value)
      return prev
    }
    // For deletions we populate an array of dot-prop key strings to later delete
    if (currentPatch.type === 'del') {
      prev.d = prev.d.concat(dotPropKey)
      return prev
    }
  }, minifiedPatches)

  // Delete our delete property array if there are no deletions. A minor optimization for size
  if (minifiedPatches.d.length === 0) {
    delete minifiedPatches.d
  } else if (!minifiedPatches.x) {
    // If there are no value changes we old return our deletion array. Save a few bytes
    // by omitting `{x: null, d:}`
    minifiedPatches = minifiedPatches.d
  }

  return minifiedPatches
}
