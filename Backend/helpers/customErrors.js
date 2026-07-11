class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ForbiddenError extends MyError {
  constructor(message) {
    super(`Você não têm permissão para acessar este recurso ${message}`);
  }
}
class NotFoundError extends MyError {
  constructor(property, message = "") {
    super(`${property} não encontrado ${message}`);
  }
}
class UnauthorizedError extends MyError {
  constructor() {
    super("Você precisa estar logado para acessar este recurso");
  }
}

class ValidationError extends MyError {}

class FieldRequiredError extends ValidationError {
  constructor(field) {
    super(`${field} é obrigatório!`);
  }
}

class AlreadyTakenError extends ValidationError {
  constructor(property, message = "") {
    super(`${property} já está sendo usado ${message}`);
  }
}

module.exports = {
  AlreadyTakenError,
  FieldRequiredError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
};
