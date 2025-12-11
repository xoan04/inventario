# Multi-stage build for Go backend

FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Instalar también wget para que el HEALTHCHECK funcione
RUN apk --no-cache add ca-certificates wget

RUN adduser -D -s /bin/sh appuser

WORKDIR /app

COPY --from=builder /app/main .

# Copiar archivo de entorno (si existe .env.dev, lo copia; si no, copia .env)
COPY .env.dev* .env* ./

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["./main"]

