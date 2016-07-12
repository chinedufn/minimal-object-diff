var test = require('tape')
var objDiff = require('../')

test('Test diffs and patches', function (t) {
  var testFixtures = getFixtures()
  // Two tests per fixture. A diff test and a patch test
  t.plan(2 * testFixtures.length)

  testFixtures.forEach(function (fixture) {
    var patches = objDiff.diff(fixture.old, fixture.new, fixture.description + ' - diff')
    t.deepEqual(patches, fixture.expectedPatch, fixture.description)
    t.deepEqual(objDiff.patch(fixture.old, patches), fixture.new, fixture.description + ' - patch')
  })
})

function getFixtures () {
  // Return an array of test cases that we'll loop through in our test
  // Use require statements for larger JSON objects
  return [
    {
      description: 'Test unchanged object',
      old: { hello: 'world' },
      new: { hello: 'world' },
      expectedPatch: null
    },
    {
      description: 'Test deleted key',
      old: { hello: 'world', foo: 'bar' },
      new: { hello: 'world' },
      expectedPatch: ['foo']
    },
    {
      description: 'Test changed value',
      old: { hello: 'world' },
      new: { hello: 'foo' },
      expectedPatch: { x: { hello: 'foo' } }
    },
    {
      description: 'Test nested object changed value',
      old: { hello: { foo: { bar: 'baz' } } },
      new: { hello: { foo: { bar: 'buzz' } } },
      expectedPatch: { x: { hello: { foo: { bar: 'buzz' } } } }
    }
  ]
}
