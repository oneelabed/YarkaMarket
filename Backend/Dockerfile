# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src ./src

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the application (skip tests for faster builds)
 RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/market-0.0.1-SNAPSHOT.jar .

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java","-jar","/app/market-0.0.1-SNAPSHOT.jar"]
