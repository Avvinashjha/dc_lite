package in.dailycoder.core;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import tools.jackson.databind.ObjectMapper;

/** Adapter for a deliberately small contract: GET ?from=INR&to=USD -> {"rate":0.012}. */
public final class HttpExchangeRates implements ExpenseService.ExchangeRates, AutoCloseable {
    private final URI endpoint;
    private final HttpClient client;
    private final ObjectMapper mapper = new ObjectMapper();
    public HttpExchangeRates(URI endpoint) {
        if (!ListOfSchemes.allowed(endpoint.getScheme()) || endpoint.getHost() == null || endpoint.getRawQuery() != null || endpoint.getFragment() != null)
            throw new IllegalArgumentException("Use an HTTP(S) endpoint without query or fragment");
        this.endpoint = endpoint;
        client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
    }
    public BigDecimal rate(String from, String to) throws IOException, InterruptedException {
        URI uri = URI.create(endpoint + "?from=" + URLEncoder.encode(from, StandardCharsets.UTF_8) + "&to=" + URLEncoder.encode(to, StandardCharsets.UTF_8));
        var request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(3)).header("Accept", "application/json").GET().build();
        var response = client.send(request, HttpResponse.BodyHandlers.limiting(HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8), 64_000));
        if (response.statusCode() != 200) throw new IOException("Rate service returned HTTP " + response.statusCode());
        try {
            var rate = mapper.readTree(response.body()).get("rate");
            if (rate == null || !rate.isNumber() || rate.decimalValue().signum() <= 0) throw new IOException("Missing or invalid positive rate");
            return rate.decimalValue();
        } catch (tools.jackson.core.JacksonException error) {
            throw new IOException("Invalid rate JSON", error);
        }
    }
    public void close() { client.close(); }
    private static class ListOfSchemes { static boolean allowed(String scheme) { return "http".equals(scheme) || "https".equals(scheme); } }
}
