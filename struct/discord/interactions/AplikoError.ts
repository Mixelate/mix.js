export class AplikoError extends Error {
  public constructor(
    public reason: string,
    public possibleSolutions?: string[]
  ) {
    super();
  }

  public override toString(): string {
    return `\nApliko Error\n------------------------\n${this.stack?.replace('Error', 'Stacktrace')}\n------------------------\n${this.reason}\n${this.possibleSolutions
      ?.map((solution) => `  - ${solution}`)
      .join("\n")}\n`;
  }
}
