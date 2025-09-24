# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper and pom.xml first (dependency caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Pre-download dependencies (caches them in Docker layers)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application (skip tests)
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/market-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/market-0.0.1-SNAPSHOT.jar"]
