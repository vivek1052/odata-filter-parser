import { ConditionalOperator, LogicalOperator } from "src/operator.enum";
import { DBStrategy } from "./strategy.interface";

export class MongoStrategy implements DBStrategy<Object> {
  mapConditional(operator: string, key: string, value: string): object {
    const query = {};

    switch (operator) {
      case ConditionalOperator.EQ:
        query[key] = value.slice(1, -1);
        return query;
      case ConditionalOperator.GT:
        query[key] = {
          $gt: value.slice(1, -1),
        };
        return query;
      case ConditionalOperator.LT:
        query[key] = {
          $lt: value.slice(1, -1),
        };
        return query;
      case ConditionalOperator.GTE:
        query[key] = {
          $gte: value.slice(1, -1),
        };
        return query;
      case ConditionalOperator.LTE:
        query[key] = {
          $lte: value.slice(1, -1),
        };
        return query;
      default:
        return query;
    }
  }
  mapLogic(operator: string, operand1: object, operand2: object): object {
    switch (operator) {
      case LogicalOperator.OR:
        return {
          $or: [operand1, operand2],
        };
      case LogicalOperator.AND:
        return {
          $and: [operand1, operand2],
        };
      default:
        return {};
    }
  }
}
