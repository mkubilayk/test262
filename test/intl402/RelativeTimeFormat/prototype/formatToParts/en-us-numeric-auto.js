// Copyright 2018 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-Intl.RelativeTimeFormat.prototype.formatToParts
description: Checks the behavior of Intl.RelativeTimeFormat.prototype.formatToParts() in English.
features: [Intl.RelativeTimeFormat]
locale: [en-US]
---*/

function verifyFormatParts(actual, expected, message) {
  assert.sameValue(actual.length, expected.length, `${message}: length`);

  for (let i = 0; i < actual.length; ++i) {
    assert.sameValue(actual[i].type, expected[i].type, `${message}: parts[${i}].type`);
    assert.sameValue(actual[i].value, expected[i].value, `${message}: parts[${i}].value`);
    assert.sameValue(actual[i].unit, expected[i].unit, `${message}: parts[${i}].unit`);
  }
}

function expected(key, unit, default_) {
  // https://www.unicode.org/cldr/charts/33/summary/en.html#1530
  const exceptions = {
    "year": {
      "-1": "last year",
      "0": "this year",
      "1": "next year",
    },
    "month": {
      "-1": "last month",
      "0": "this month",
      "1": "next month",
    },
    "week": {
      "-1": "last week",
      "0": "this week",
      "1": "next week",
    },
    "day": {
      "-1": "yesterday",
      "0": "today",
      "1": "tomorrow",
    },
    "second": {
      "0": "now",
    },
  };

  const exception = exceptions[unit] || {};
  if (key in exception) {
    return [
      { "type": "literal", "value": exception[key] },
    ]
  }

  return default_;
}

const units = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "quarter",
  "year",
];

const rtf = new Intl.RelativeTimeFormat("en-US", { "numeric": "auto" });

assert.sameValue(typeof rtf.formatToParts, "function", "formatToParts should be supported");

for (const unit of units) {
  // Note https://github.com/tc39/proposal-intl-relative-time/issues/80
  /*
  assert.sameValue(rtf.formatToParts(10, unit), `in 10 ${unit}s`);
  assert.sameValue(rtf.formatToParts(2, unit), `in 2 ${unit}s`);
  assert.sameValue(rtf.formatToParts(1, unit), expected[0]);
  assert.sameValue(rtf.formatToParts(0, unit), expected[1]);
  assert.sameValue(rtf.formatToParts(-0, unit), expected[2]);
  assert.sameValue(rtf.formatToParts(-1, unit), expected[3]);
  assert.sameValue(rtf.formatToParts(-2, unit), `2 ${unit}s ago`);
  assert.sameValue(rtf.formatToParts(-10, unit), `10 ${unit}s ago`);
*/
  verifyFormatParts(rtf.formatToParts(10, unit), [
    { "type": "literal", "value": "in " },
    { "type": "integer", "value": "10", "unit": unit },
    { "type": "literal", "value": ` ${unit}s` },
  ], `formatToParts(10, ${unit})`);

  verifyFormatParts(rtf.formatToParts(2, unit), [
    { "type": "literal", "value": "in " },
    { "type": "integer", "value": "2", "unit": unit },
    { "type": "literal", "value": ` ${unit}s` },
  ], `formatToParts(2, ${unit})`);

  verifyFormatParts(rtf.formatToParts(1, unit), expected("1", unit, [
    { "type": "literal", "value": "in " },
    { "type": "integer", "value": "1", "unit": unit },
    { "type": "literal", "value": ` ${unit}` },
  ]), `formatToParts(1, ${unit})`);

  verifyFormatParts(rtf.formatToParts(0, unit), expected("0", unit, [
    { "type": "literal", "value": "in " },
    { "type": "integer", "value": "0", "unit": unit },
    { "type": "literal", "value": ` ${unit}s` },
  ]), `formatToParts(0, ${unit})`);

  verifyFormatParts(rtf.formatToParts(-0, unit), expected("0", unit, [
    { "type": "integer", "value": "0", "unit": unit },
    { "type": "literal", "value": ` ${unit}s ago` },
  ]), `formatToParts(-0, ${unit})`);

  verifyFormatParts(rtf.formatToParts(-1, unit), expected("-1", unit, [
    { "type": "integer", "value": "1", "unit": unit },
    { "type": "literal", "value": ` ${unit} ago` },
  ]), `formatToParts(-1, ${unit})`);

  verifyFormatParts(rtf.formatToParts(-2, unit), [
    { "type": "integer", "value": "2", "unit": unit },
    { "type": "literal", "value": ` ${unit}s ago` },
  ], `formatToParts(-2, ${unit})`);

  verifyFormatParts(rtf.formatToParts(-10, unit), [
    { "type": "integer", "value": "10", "unit": unit },
    { "type": "literal", "value": ` ${unit}s ago` },
  ], `formatToParts(-10, ${unit})`);
}
