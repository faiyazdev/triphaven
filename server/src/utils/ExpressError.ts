class ExpressError extends Error {
  status: number;

  constructor(status: number, message: string = "Something went wrong") {
    super(message); // ✅ sets this.message internally
    this.status = status;

    // Fix prototype chain (important when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ExpressError;
