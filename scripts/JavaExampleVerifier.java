import jdk.jshell.JShell;
import jdk.jshell.Snippet;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/** Evaluate standalone authored examples in isolated, local JShell sessions. */
class JavaExampleVerifier {
  public static void main(String[] args) throws Exception {
    var console = System.out;
    int checked = 0;
    var input = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));
    for (String row; (row = input.readLine()) != null;) {
      String[] fields = row.split("\t", -1);
      String id = fields[0];
      String remaining = new String(Base64.getDecoder().decode(fields[1]), StandardCharsets.UTF_8);
      String expected = new String(Base64.getDecoder().decode(fields[2]), StandardCharsets.UTF_8);
      var buffer = new ByteArrayOutputStream();
      var captured = new PrintStream(buffer, true, StandardCharsets.UTF_8);
      try (var shell = JShell.builder().executionEngine("local").out(captured).err(captured).build()) {
        System.setOut(captured);
        while (!remaining.isBlank()) {
          var completion = shell.sourceCodeAnalysis().analyzeCompletion(remaining);
          if (completion.source() == null || completion.source().isBlank())
            throw new AssertionError(id + ": incomplete snippet");
          for (var event : shell.eval(completion.source())) {
            if (event.status() == Snippet.Status.REJECTED)
              throw new AssertionError(id + ": rejected " + event.snippet().source() + "\n" + shell.diagnostics(event.snippet()).map(d -> d.getMessage(java.util.Locale.ROOT)).collect(java.util.stream.Collectors.joining("\n")));
            if (event.exception() != null) throw new AssertionError(id, event.exception());
          }
          remaining = completion.remaining();
        }
        for (var snippet : shell.snippets().toList()) {
          if (shell.status(snippet) != Snippet.Status.VALID)
            throw new AssertionError(id + ": unresolved snippet " + snippet.source());
        }
      } finally { System.setOut(console); }
      String actual = buffer.toString(StandardCharsets.UTF_8).replace("\r\n", "\n").strip();
      if (!actual.equals(expected.strip()))
        throw new AssertionError(id + ": expected " + expected + ", got " + actual);
      console.println("PASS " + id);
      checked++;
    }
    console.println("Verified " + checked + " standalone Java examples. Project fragments need their declared dependencies.");
  }
}
