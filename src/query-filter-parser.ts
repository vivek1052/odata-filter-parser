import { ConditionalOperator, LogicalOperator } from "./operator.enum";
import { DBStrategy } from "./strategies/strategy.interface";

class Stack<T> {
  private readonly stack: T[] = [];

  push(element: T): void {
    this.stack.push(element);
  }

  pop(): T {
    return this.stack.pop();
  }

  peek(): T {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

export class QueryFilterParser<FilterType> {
  constructor(private readonly strategy: DBStrategy<FilterType>) {}

  protected readonly conditionalOperator: string[] = [
    ConditionalOperator.EQ,
    ConditionalOperator.GT,
    ConditionalOperator.GTE,
    ConditionalOperator.LT,
    ConditionalOperator.LTE,
    ConditionalOperator.NE,
    ConditionalOperator.CONTAINS,
  ];
  protected readonly logicOperator: string[] = [
    LogicalOperator.AND,
    LogicalOperator.OR,
  ];

  protected isConditionalOperator(element: string): boolean {
    return this.conditionalOperator.includes(element);
  }

  protected isLogicOperator(element: string): boolean {
    return this.logicOperator.includes(element);
  }

  protected convertToPostfix(odataQuery: string): string[] {
    const odataQueryArr: string[] = odataQuery.match(
      /('[^']+'|(\())|(\))|\w+/g
    );

    const stack = new Stack<string>();

    const postfix: string[] = [];

    for (const odataQueryElement of odataQueryArr) {
      if (this.isConditionalOperator(odataQueryElement)) {
        while (!stack.isEmpty() && this.isConditionalOperator(stack.peek())) {
          postfix.push(stack.pop());
        }
        stack.push(odataQueryElement);
        continue;
      }

      if (this.isLogicOperator(odataQueryElement)) {
        while (
          !stack.isEmpty() &&
          (this.isConditionalOperator(stack.peek()) ||
            this.isLogicOperator(stack.peek()))
        ) {
          postfix.push(stack.pop());
        }
        stack.push(odataQueryElement);
        continue;
      }

      if (odataQueryElement === "(") {
        stack.push(odataQueryElement);
        continue;
      }

      if (odataQueryElement === ")") {
        while (stack.peek() !== "(") {
          postfix.push(stack.pop());
        }
        stack.pop();
        continue;
      }

      postfix.push(odataQueryElement);
    }

    while (!stack.isEmpty()) {
      postfix.push(stack.pop());
    }

    return postfix;
  }

  protected convertpostfixToQuery(postfix: string[]): FilterType {
    const stack = new Stack<string | FilterType>();

    for (const postfixElement of postfix) {
      if (this.isConditionalOperator(postfixElement)) {
        const value = stack.pop() as string;
        const key = stack.pop() as string;
        stack.push(
          this.strategy.mapConditional(
            postfixElement,
            key,
            isNaN(value as any) ? value : Number(value)
          )
        );
        continue;
      }

      if (this.isLogicOperator(postfixElement)) {
        const operand1 = stack.pop() as FilterType;
        const operand2 = stack.pop() as FilterType;
        stack.push(this.strategy.mapLogic(postfixElement, operand1, operand2));
        continue;
      }

      stack.push(postfixElement);
    }

    return stack.pop() as FilterType;
  }

  public parse(odataQuery: string): FilterType {
    if (!odataQuery) {
      return null;
    }

    const postfix = this.convertToPostfix(odataQuery);

    return this.convertpostfixToQuery(postfix);
  }
}
