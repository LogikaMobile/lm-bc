# Etapa 1: Construcción (Builder)
FROM gradle:8-jdk21 AS builder
WORKDIR /app

# Copiar archivos de configuración de gradle
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
# Copiar el código fuente
COPY src src/

# Construir la aplicación usando installDist
# Esto creará los binarios y dependencias en build/install/lmbc-backend
RUN gradle installDist --no-daemon

# Etapa 2: Ejecución (Runtime)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar la aplicación compilada desde la etapa anterior
COPY --from=builder /app/build/install/lmbc-backend /app

# Optimización de RAM para Droplets pequeños (e.g. 1GB RAM)
# Limitamos la Heap a 256MB y reservamos 128MB, permitiendo espacio para OS y Postgres
ENV JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -XX:+UseStringDeduplication"

EXPOSE 8090

# Punto de entrada de la aplicación
ENTRYPOINT ["sh", "-c", "/app/bin/lmbc-backend"]
