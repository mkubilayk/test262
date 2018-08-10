// This file was procedurally generated from the following sources:
// - src/class-fields/duplicate-private-name-methods.case
// - src/class-fields/private-methods-early-errors/cls-expr.template
/*---
description: TODO (TODO)
esid: TODO
features: [class, class-methods-private]
flags: [generated]
negative:
  phase: parse
  type: SyntaxError
---*/


throw "Test262: This statement should not be evaluated.";

var C = class {
  #foo() {}
}
