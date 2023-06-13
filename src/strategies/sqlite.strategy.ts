import { DBStrategy } from "./strategy.interface";
import { ConditionalOperator, LogicalOperator } from "../operator.enum";

export class SqliteStratergy implements DBStrategy<string> {
  mapConditional(
    operator: string,
    key: string,
    value: string | number
  ): string {
    // value = typeof value === "string" ? value.replace(/'/g, ``) : value;
    // const _value = typeof value === "string" ? `'${value}'` : value;
    switch (operator) {
      case ConditionalOperator.EQ:
        return `${key} = ${value}`;
      case ConditionalOperator.GT:
        return `${key} > ${value}`;
      case ConditionalOperator.LT:
        return `${key} < ${value}`;
      case ConditionalOperator.GTE:
        return `${key} >= ${value}`;
      case ConditionalOperator.LTE:
        return `${key} <= ${value}`;
      default:
        return "";
    }
  }
  mapLogic(operator: string, operand1: string, operand2: string): string {
    switch (operator) {
      case LogicalOperator.OR:
        return `( ${operand1} OR ${operand2} )`;
      case LogicalOperator.AND:
        return `( ${operand1} AND ${operand2} )`;
      default:
        return "";
    }
  }
}
