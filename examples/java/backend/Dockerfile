FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --chown=10001:10001 target/backend-1.0.0.jar /app/app.jar
RUN mkdir /app/data && chown 10001:10001 /app/data
USER 10001:10001
ENV SERVER_ADDRESS=0.0.0.0
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
