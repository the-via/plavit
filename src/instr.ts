export enum PrimitiveType {
  N = 'number',
  B = 'boolean',
  S = 'string',
}

export enum Type {
  I = 'instr',
  N = 'number',
  B = 'boolean',
  S = 'string',
  T = 'tuple',
  L = 'list',
  Error = 'error',
}

export enum CompoundType {
  T = 'tuple',
  L = 'list',
}

function isExpr<S extends Operator>(expr: unknown): expr is [S, ...Type[]] {
  return Array.isArray(expr) && isOperator(expr[0]) && !isDefinition(expr[0]);
}

function isDefinition(expr: any): boolean {
  if (Array.isArray(expr) && !isOperator(expr[0])) {
    switch (expr[0]) {
      case '@t': {
        return true;
      }
      case '@l': {
        // list must have homogenous types for its elements
        return expr.slice(1).every((e) => validate(e, getType(expr[1])));
      }
      default: {
        return false;
      }
    }
  }
  return false;
}

function isOperator(op: string | Operator): op is Operator {
  return operators.hasOwnProperty(op);
}

export function getType(expr: unknown): any {
  if (Array.isArray(expr)) {
    return isOperator(expr[0])
      ? [Type.I, ...expr.slice(1).map(getType)]
      : isDefinition(expr)
      ? expr[0] === '@t'
        ? [Type.T, ...expr.slice(1).map(getType)]
        : [Type.L, getType(expr[1])]
      : Type.Error;
  } else if (typeof expr === 'string' && isOperator(expr)) {
    return Type.I;
  }
  if ([Type.N, Type.B, Type.S].includes(typeof expr as any)) {
    return typeof expr;
  }
  return Type.Error;
}

const operators = {
  // Numerical Operators
  ':+': [Type.N, Type.N, Type.N],
  ':-': [Type.N, Type.N, Type.N],
  ':*': [Type.N, Type.N, Type.N],
  ':/': [Type.N, Type.N, Type.N],
  ':<': [Type.N, Type.N, Type.B],
  ':>': [Type.N, Type.N, Type.B],
  ':<=': [Type.N, Type.N, Type.B],
  ':>=': [Type.N, Type.N, Type.B],
  ':=n': [Type.N, Type.N, Type.B],
  ':=s': [Type.S, Type.S, Type.B],
  // Boolean Operators
  ':||': [Type.B, Type.B, Type.B],
  ':&&': [Type.B, Type.B, Type.B],
  // Lookup Operators
  ':.': [Type.N, Type.N],
  // cast to string
  ':s': [Type.N, Type.S],
  // Conditional Operators
  ':?n': [Type.B, Type.N, Type.N, Type.N],
  ':?s': [Type.B, Type.S, Type.S, Type.S],
  ':?b': [Type.B, Type.B, Type.B, Type.B],
  ':?i': [Type.B, Type.I, Type.I, Type.I],
};
type Operator = keyof typeof operators;
type OperatorExprArgs<S extends Operator> = typeof operators[S];

export function validate(expr: unknown, type?: Type): boolean {
  // Validate operator, arguments and return type
  if (Array.isArray(expr)) {
    try {
      const [op, ...cdr] = expr;
      console.log(`Checking if (${op}) exists:`, operators.hasOwnProperty(op));
      if (operators.hasOwnProperty(op as Operator) && cdr.length === operators[op as Operator].length - 1) {
        const retType = operators[op as Operator].slice(-1)[0];
        return (!type || retType === type) && cdr.every((item, idx) => validate(item, operators[op as Operator][idx]));
      }
      console.error('unhandled operator referenced:', op);
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const typeComparison =
    type === undefined ? [Type.I, Type.N, Type.B, Type.S].includes(typeof expr as Type) : typeof expr === type;
  if (!typeComparison) {
    console.error(expr, 'is not of type:', type);
  }
  return typeComparison;
}
