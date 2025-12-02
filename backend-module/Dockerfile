# Dockerfile para Backend Spring Boot
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar arquivos de configuração Maven
COPY pom.xml .

# Baixar dependências (cache layer)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN mvn clean package -DskipTests

# Imagem final
FROM eclipse-temurin:17-jre-alpine

# Instalar wget para healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copiar JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Health check - verifica se a API está respondendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/v1/beneficios || exit 1

# Executar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]

