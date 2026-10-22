package in.dailycoder.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

/** Local teaching identities. Real deployment needs an identity-provider integration and TLS. */
@Configuration
class SecurityConfiguration {
    @Bean PasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }
    @Bean UserDetailsService users(PasswordEncoder encoder, @Value("${demo.alice-password}") String alice, @Value("${demo.bob-password}") String bob) {
        if (alice.isBlank() || bob.isBlank() || alice.equals(bob)) throw new IllegalArgumentException("Choose different nonblank demo passwords");
        return new InMemoryUserDetailsManager(User.withUsername("alice").password(encoder.encode(alice)).roles("USER").build(), User.withUsername("bob").password(encoder.encode(bob)).roles("USER").build());
    }
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(access -> access.requestMatchers("/csrf", "/actuator/health", "/actuator/health/**", "/error").permitAll().anyRequest().authenticated())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
            .httpBasic(Customizer.withDefaults()).build();
    }
}

@RestController
class CsrfController {
    record Token(String token, String headerName) {}
    @GetMapping("/csrf") Token token(CsrfToken token) { return new Token(token.getToken(), token.getHeaderName()); }
}
