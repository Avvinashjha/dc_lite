package in.dailycoder.backend;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.MDC;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.UUID;

@Component
class RequestLogging extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String id = UUID.randomUUID().toString();
        response.setHeader("X-Request-Id", id); MDC.put("requestId", id);
        long start = System.nanoTime();
        try { chain.doFilter(request, response); }
        finally {
            LoggerFactory.getLogger(RequestLogging.class).info("request_completed method={} status={} elapsed_ms={}", request.getMethod(), response.getStatus(), (System.nanoTime()-start)/1_000_000);
            MDC.remove("requestId");
        }
    }
}
