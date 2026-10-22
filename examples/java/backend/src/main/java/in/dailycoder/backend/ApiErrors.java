package in.dailycoder.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.dao.OptimisticLockingFailureException;
import java.time.format.DateTimeParseException;

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(ExpenseService.Missing.class)
    ProblemDetail missing() { return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Expense not found"); }
    @ExceptionHandler({ExpenseService.Conflict.class, OptimisticLockingFailureException.class})
    ProblemDetail conflict() { return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "The expense changed. Reload before updating."); }
    @ExceptionHandler({MethodArgumentNotValidException.class, HandlerMethodValidationException.class, DateTimeParseException.class})
    ProblemDetail invalid() { return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Check required fields, amounts, dates, and page bounds."); }
}
