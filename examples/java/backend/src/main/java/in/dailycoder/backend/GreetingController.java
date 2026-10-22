package in.dailycoder.backend;

import org.springframework.web.bind.annotation.*;

/** The small REST-introduction example, alongside the complete expense API. */
@RestController
class GreetingController {
    record Greeting(String message) {}
    @GetMapping("/greeting")
    Greeting greeting(@RequestParam(defaultValue="Java") String name) { return new Greeting("Hello " + name); }
}
