import assert from 'node:assert/strict';

const before = [
  { id: 'request_101', customer: 'Alex Example', status: 'New' },
  { id: 'request_102', customer: 'Alex Example', status: 'New' },
];

const updateStatus = (rows, matches) =>
  rows.map((row) =>
    matches(row) ? { ...row, status: 'In progress' } : { ...row }
  );

// The customer is not a unique request identifier.
const wrong = updateStatus(before, (row) => row.customer === 'Alex Example');
assert.deepEqual(wrong.map((row) => row.status), ['In progress', 'In progress']);

// Select exactly one request using its stable ID.
const right = updateStatus(before, (row) => row.id === 'request_101');
assert.equal(right[0].status, 'In progress');
assert.deepEqual(right[1], before[1]);
assert.deepEqual(right.map((row) => row.id), before.map((row) => row.id));

// A predicate can complete normally while changing nothing.
const missing = updateStatus(before, (row) => row.id === 'missing');
assert.deepEqual(missing, before);

// The fixture itself remains unchanged for the next test.
assert.deepEqual(before.map((row) => row.status), ['New', 'New']);

console.log('Passed: wrong selector, exact-ID selector, no match, unchanged fixture.');
