import { ConditionalOperator, LogicalOperator } from "../operator.enum";
import { DBStrategy } from "./strategy.interface";

export class MongoStrategy implements DBStrategy<Object> {
  mapConditional(
    operator: string,
    key: string,
    value: string | number
  ): object {
    const query = {};
    key = key.replace(/'/g, ``);
    value = typeof value === "string" ? value.replace(/'/g, ``) : value;
    switch (operator) {
      case ConditionalOperator.EQ:
        query[key] = value;
        return query;
      case ConditionalOperator.GT:
        query[key] = {
          $gt: value,
        };
        return query;
      case ConditionalOperator.LT:
        query[key] = {
          $lt: value,
        };
        return query;
      case ConditionalOperator.GTE:
        query[key] = {
          $gte: value,
        };
        return query;
      case ConditionalOperator.LTE:
        query[key] = {
          $lte: value,
        };
        return query;
      case ConditionalOperator.NE:
        query[key] = {
          $ne: value,
        };
      case ConditionalOperator.CONTAINS:
        query[key] = {
          $regex: value,
        };
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
