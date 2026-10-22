package in.dailycoder.backend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.net.URI;
import java.time.LocalDate;
import java.time.YearMonth;

@RestController @RequestMapping("/expenses")
class ExpenseController {
    record Create(@NotBlank @Size(max=100) String label, @Positive int amount, @NotNull LocalDate spentOn) {}
    record Update(@NotBlank @Size(max=100) String label, @Positive int amount, @NotNull LocalDate spentOn, @NotNull @PositiveOrZero Long version) {}
    record Total(String month, long paise) {}
    record Delivery(boolean applied) {}
    private final ExpenseService service;
    private final EventDelivery delivery;
    ExpenseController(ExpenseService service, EventDelivery delivery) { this.service = service; this.delivery = delivery; }
    @PostMapping
    ResponseEntity<ExpenseService.View> create(@Valid @RequestBody Create input, Principal identity) {
        var value = service.create(identity.getName(), input.label(), input.amount(), input.spentOn());
        return ResponseEntity.created(URI.create("/expenses/" + value.id())).body(value);
    }
    @GetMapping("/{id}")
    ExpenseService.View get(@PathVariable @Positive long id, Principal identity) { return service.get(id, identity.getName()); }
    @GetMapping
    ExpenseService.Page list(@RequestParam(defaultValue="0") @Min(0) int page, @RequestParam(defaultValue="20") @Min(1) @Max(100) int size, Principal identity) { return service.list(identity.getName(), page, size); }
    @PutMapping("/{id}")
    ExpenseService.View update(@PathVariable @Positive long id, @Valid @RequestBody Update input, Principal identity) { return service.update(id, identity.getName(), input.version(), input.label(), input.amount(), input.spentOn()); }
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable @Positive long id, Principal identity) { service.delete(id, identity.getName()); return ResponseEntity.noContent().build(); }
    @GetMapping("/summary")
    Total summary(@RequestParam String month, Principal identity) { return new Total(month, service.total(identity.getName(), YearMonth.parse(month))); }
    @PostMapping("/{id}/notify")
    Delivery notify(@PathVariable @Positive long id, Principal identity) { return new Delivery(delivery.deliver(service.eventId(id, identity.getName()))); }
}
