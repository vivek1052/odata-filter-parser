export interface DBStrategy<FilterType> {
  mapConditional(operator: string, key: string, value: string): FilterType;
  mapLogic(
    operator: string,
    operand1: FilterType,
    operand2: FilterType
  ): FilterType;
}
